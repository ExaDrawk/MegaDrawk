/// <reference types="@cloudflare/workers-types" />
import {
  COMMENT_LIMITS,
  COMMENT_RATE_LIMITS,
  EDIT_WINDOW_MINUTES,
  isReservedName,
  validateCommentInput,
} from "../../domain/comment/types";
import { SITE } from "../../config/site";

/**
 * 公開コメントAPIのロジック（Cloudflare D1保存）。
 * functions/api/comments/[postId].tsはこのモジュールへの薄いルーター。
 * スパム対策: Turnstile検証、IPハッシュ（SHA-256＋ソルト、生IPは保存しない）、
 * レート制限（60秒間隔・10分3件・1日10件・同一記事1日3件）、同一本文再送抑止、入力上限。
 * 投稿後10分以内なら本人（同一IPハッシュ）が本文を編集できる。
 */

export interface CommentsEnv {
  readonly COMMENTS_DB?: D1Database;
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly IP_HASH_SALT?: string;
  readonly ADMIN_DELETE_TOKEN?: string;
}

/** 同一IP・同一内容の再投稿を抑止する期間（時間） */
const DUPLICATE_WINDOW_HOURS = 24;
const MAX_LIST_LIMIT = 100;
const MAX_BODY_BYTES = 16 * 1024;
/** レート制限・編集判定のために取得する同一IPハッシュの履歴件数 */
const HISTORY_LIMIT = 50;
/** 管理者コメントへの返信でレート制限を免除する件数（それ以降は原則の制限が適用される） */
const ADMIN_REPLY_EXEMPT_LIMIT = 3;

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function successResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(salt + ":" + ip),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyTurnstile(
  token: string,
  secretKey: string,
): Promise<boolean> {
  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: unknown };
  return result.success === true;
}

export interface IpHistoryRow {
  readonly post_id: string;
  readonly message: string;
  readonly created_at: string;
}

/**
 * レート制限の判定。履歴（新しい順）と投稿内容から拒否理由を返す（通過ならnull）。
 * 「1日」は日本時間の暦日で数える。
 */
export function findRejectionReason(
  history: readonly IpHistoryRow[],
  postId: string,
  message: string,
  serverNow: string,
): string | null {
  const nowMs = Date.parse(serverNow);
  const last = history[0];
  if (
    last &&
    nowMs - Date.parse(last.created_at) <
      COMMENT_RATE_LIMITS.intervalSeconds * 1000
  ) {
    return `投稿の間隔は${COMMENT_RATE_LIMITS.intervalSeconds}秒以上あけてください。`;
  }
  const in10Minutes = history.filter(
    (row) => nowMs - Date.parse(row.created_at) < 10 * 60 * 1000,
  );
  if (in10Minutes.length >= COMMENT_RATE_LIMITS.per10Minutes) {
    return `短時間の投稿上限（10分間に${COMMENT_RATE_LIMITS.per10Minutes}件）に達しました。少し待ってからお試しください。`;
  }
  // 日本時間の当日0時（UTC ms）を求める
  const jstOffsetMs = 9 * 60 * 60 * 1000;
  const jstDayStartMs =
    Math.floor((nowMs + jstOffsetMs) / 86_400_000) * 86_400_000 - jstOffsetMs;
  const today = history.filter(
    (row) => Date.parse(row.created_at) >= jstDayStartMs,
  );
  if (today.length >= COMMENT_RATE_LIMITS.perDay) {
    return `1日の投稿上限（${COMMENT_RATE_LIMITS.perDay}件）に達しました。明日以降にお試しください。`;
  }
  const todayForPost = today.filter((row) => row.post_id === postId);
  if (todayForPost.length >= COMMENT_RATE_LIMITS.perPostPerDay) {
    return `同じ記事への投稿上限（1日に${COMMENT_RATE_LIMITS.perPostPerDay}件）に達しました。`;
  }
  const duplicated = history.find(
    (row) =>
      row.message.trim() === message.trim() &&
      nowMs - Date.parse(row.created_at) <
        DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000,
  );
  if (duplicated) {
    return "同じ内容のコメントは短時間のうちに再送できません。";
  }
  return null;
}

/** 返信先コメント1件分（ルート解決と管理者判定に必要な列） */
export interface ReplyTargetComment {
  readonly id: number;
  readonly parent_id: number | null;
  readonly post_id: string;
  readonly is_admin: number;
}

export interface ResolvedReplyTarget {
  /** 返信のぶら下げ先（ルートコメントのid）。非返信ならnull */
  readonly rootId: number | null;
  /** 返信先が管理人コメント（is_admin=1）か。免除判定に使う */
  readonly parentIsAdmin: boolean;
}

/** 返信先の解決。返信の返信はルートへ正規化し、表示を1階層に保つ。 */
export async function resolveReplyTarget(
  db: D1Database,
  postId: string,
  rawParentId: unknown,
): Promise<ResolvedReplyTarget | "invalid"> {
  if (rawParentId === undefined || rawParentId === null || rawParentId === "") {
    return { rootId: null, parentIsAdmin: false };
  }
  if (
    typeof rawParentId !== "number" ||
    !Number.isInteger(rawParentId) ||
    rawParentId < 1
  ) {
    return "invalid";
  }
  const parent = await db
    .prepare(
      "SELECT id, parent_id, post_id, is_admin FROM comments WHERE id = ?1",
    )
    .bind(rawParentId)
    .first<ReplyTargetComment>();
  if (!parent || parent.post_id !== postId) {
    return "invalid";
  }
  return {
    rootId: parent.parent_id ?? parent.id,
    parentIsAdmin: parent.is_admin === 1,
  };
}

export async function listComments(
  db: D1Database | undefined,
  rawPostId: unknown,
  rawLimit: string | null,
  remoteAddress: string | null,
  ipSalt: string | undefined,
): Promise<Response> {
  if (!db) {
    return errorResponse("コメント機能は現在利用できません。", 500);
  }
  if (
    typeof rawPostId !== "string" ||
    rawPostId.length === 0 ||
    rawPostId.length > 200
  ) {
    return errorResponse("不正なリクエストです。", 400);
  }
  const limit = Math.min(
    MAX_LIST_LIMIT,
    Math.max(1, Number.parseInt(rawLimit ?? "50", 10) || 50),
  );
  const viewerIpHash =
    remoteAddress && ipSalt ? await hashIp(remoteAddress, ipSalt) : null;
  const rows = await db
    .prepare(
      "SELECT id, name, message, created_at, parent_id, ip_hash, edited_at, is_admin FROM comments WHERE post_id = ?1 ORDER BY created_at ASC LIMIT ?2",
    )
    .bind(rawPostId, limit)
    .all<{
      id: number;
      name: string;
      message: string;
      created_at: string;
      parent_id: number | null;
      ip_hash: string;
      edited_at: string | null;
      is_admin: number;
    }>();
  const nowMs = Date.now();
  return successResponse({
    comments: (rows.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      createdAt: row.created_at,
      parentId: row.parent_id,
      isAdmin: row.is_admin === 1,
      editedAt: row.edited_at,
      editable:
        viewerIpHash !== null &&
        row.ip_hash === viewerIpHash &&
        nowMs - Date.parse(row.created_at) <= EDIT_WINDOW_MINUTES * 60 * 1000,
    })),
  });
}

export interface CreateCommentInput {
  readonly rawBody: string;
  readonly postId: unknown;
  readonly remoteAddress: string | null;
}

export async function createComment(
  env: CommentsEnv,
  input: CreateCommentInput,
): Promise<Response> {
  const { COMMENTS_DB, TURNSTILE_SECRET_KEY, IP_HASH_SALT } = env;
  if (!COMMENTS_DB || !TURNSTILE_SECRET_KEY || !IP_HASH_SALT) {
    return errorResponse("コメント機能は現在利用できません。", 500);
  }
  if (input.rawBody.length > MAX_BODY_BYTES) {
    return errorResponse("送信データが大きすぎます。", 413);
  }
  let body: {
    name?: unknown;
    message?: unknown;
    turnstileToken?: unknown;
    parentId?: unknown;
  };
  try {
    body = JSON.parse(input.rawBody);
  } catch {
    return errorResponse("送信内容を読み取れませんでした。", 400);
  }
  if (
    typeof body.name !== "string" ||
    typeof body.message !== "string" ||
    typeof body.turnstileToken !== "string" ||
    !body.turnstileToken
  ) {
    return errorResponse("入力内容とスパム防止の確認を完了してください。", 400);
  }

  const postId = typeof input.postId === "string" ? input.postId : "";
  const replyTarget = await resolveReplyTarget(
    COMMENTS_DB,
    postId,
    body.parentId,
  );
  if (replyTarget === "invalid") {
    return errorResponse("返信先のコメントが見つかりません。", 400);
  }

  const name = body.name.trim();
  const message = body.message.trim();
  const validationError = validateCommentInput(name, message);
  if (validationError) {
    return errorResponse(
      `お名前と本文を確認してください（名前は${COMMENT_LIMITS.maxNameLength}文字以内、本文は${COMMENT_LIMITS.maxMessageLength}文字以内）。`,
      400,
    );
  }
  // 管理人名は管理画面からの投稿のみ許可（なりすまし防止）
  if (isReservedName(name)) {
    return errorResponse(
      "その名前は使用できません。別の名前をお使いください。",
      403,
    );
  }

  const humanVerified = await verifyTurnstile(
    body.turnstileToken,
    TURNSTILE_SECRET_KEY,
  ).catch(() => false);
  if (!humanVerified) {
    return errorResponse(
      "スパム防止の確認に失敗しました。ページを再読み込みしてください。",
      400,
    );
  }

  const remoteAddress = input.remoteAddress ?? "unknown";
  const ipHash = await hashIp(remoteAddress, IP_HASH_SALT);
  const serverNow = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  // 管理人コメントへの返信は、そのコメントへの返信が3件までの間レート制限を免除する
  let limitsExempt = false;
  if (replyTarget.rootId !== null && replyTarget.parentIsAdmin) {
    {
      const countRow = await COMMENTS_DB.prepare(
        "SELECT COUNT(*) AS count FROM comments WHERE parent_id = ?1",
      )
        .bind(replyTarget.rootId)
        .first<{ count: number }>();
      limitsExempt = (countRow?.count ?? 0) < ADMIN_REPLY_EXEMPT_LIMIT;
    }
  }

  if (!limitsExempt) {
    const historyRows = await COMMENTS_DB.prepare(
      "SELECT post_id, message, created_at FROM comments WHERE ip_hash = ?1 ORDER BY created_at DESC LIMIT ?2",
    )
      .bind(ipHash, HISTORY_LIMIT)
      .all<{ post_id: string; message: string; created_at: string }>();
    const rejection = findRejectionReason(
      historyRows.results ?? [],
      postId,
      message,
      serverNow,
    );
    if (rejection) {
      return errorResponse(rejection, 429);
    }
  }

  await COMMENTS_DB.prepare(
    "INSERT INTO comments (post_id, name, message, created_at, ip_hash, parent_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
  )
    .bind(postId, name, message, serverNow, ipHash, replyTarget.rootId)
    .run();

  return successResponse({ ok: true });
}

export interface EditCommentInput {
  readonly rawBody: string;
  readonly postId: unknown;
  readonly remoteAddress: string | null;
}

/** 投稿後10分以内の本人（同一IPハッシュ）による本文編集。 */
export async function editComment(
  env: CommentsEnv,
  input: EditCommentInput,
): Promise<Response> {
  const { COMMENTS_DB, IP_HASH_SALT } = env;
  if (!COMMENTS_DB || !IP_HASH_SALT) {
    return errorResponse("コメント機能は現在利用できません。", 500);
  }
  if (input.rawBody.length > MAX_BODY_BYTES) {
    return errorResponse("送信データが大きすぎます。", 413);
  }
  let body: { id?: unknown; message?: unknown };
  try {
    body = JSON.parse(input.rawBody);
  } catch {
    return errorResponse("送信内容を読み取れませんでした。", 400);
  }
  if (
    typeof body.id !== "number" ||
    !Number.isInteger(body.id) ||
    body.id < 1 ||
    typeof body.message !== "string"
  ) {
    return errorResponse("送信内容の形式が正しくありません。", 400);
  }
  const message = body.message.trim();
  const validationError = validateCommentInput("名前", message);
  if (validationError) {
    return errorResponse(
      `本文を確認してください（${COMMENT_LIMITS.maxMessageLength}文字以内）。`,
      400,
    );
  }

  const postId = typeof input.postId === "string" ? input.postId : "";
  const remoteAddress = input.remoteAddress ?? "unknown";
  const ipHash = await hashIp(remoteAddress, IP_HASH_SALT);
  const comment = await COMMENTS_DB.prepare(
    "SELECT id, post_id, ip_hash, created_at FROM comments WHERE id = ?1",
  )
    .bind(body.id)
    .first<{
      id: number;
      post_id: string;
      ip_hash: string;
      created_at: string;
    }>();
  if (!comment || comment.post_id !== postId) {
    return errorResponse("編集するコメントが見つかりません。", 404);
  }
  if (comment.ip_hash !== ipHash) {
    return errorResponse("自分のコメントのみ編集できます。", 403);
  }
  if (
    Date.now() - Date.parse(comment.created_at) >
    EDIT_WINDOW_MINUTES * 60 * 1000
  ) {
    return errorResponse(
      `編集できるのは投稿後${EDIT_WINDOW_MINUTES}分以内です。`,
      403,
    );
  }

  await COMMENTS_DB.prepare(
    "UPDATE comments SET message = ?1, edited_at = ?2 WHERE id = ?3",
  )
    .bind(message, new Date().toISOString().replace(/\.\d{3}Z$/, "Z"), body.id)
    .run();

  return successResponse({ ok: true });
}

export async function deleteComment(
  env: CommentsEnv,
  rawId: string | null,
  adminToken: string | null,
): Promise<Response> {
  const { COMMENTS_DB, ADMIN_DELETE_TOKEN } = env;
  if (!COMMENTS_DB || !ADMIN_DELETE_TOKEN) {
    return errorResponse("コメント機能は現在利用できません。", 500);
  }
  if (adminToken !== ADMIN_DELETE_TOKEN) {
    return errorResponse("認証に失敗しました。", 401);
  }
  if (!rawId || !/^\d+$/.test(rawId)) {
    return errorResponse("削除するコメントのIDを指定してください。", 400);
  }
  // 返信（1階層のみ許可）も一緒に削除してぶら下がりを残さない
  await COMMENTS_DB.prepare(
    "DELETE FROM comments WHERE id = ?1 OR parent_id = ?1",
  )
    .bind(Number(rawId))
    .run();
  return successResponse({ ok: true });
}

// ===== 管理画面用（X-Admin-Token認証） =====

/** 管理トークンを検証する。一致しない場合は401応答を返す。 */
export function checkAdminToken(
  env: CommentsEnv,
  token: string | null,
): Response | null {
  if (!env.ADMIN_DELETE_TOKEN) {
    return errorResponse("管理機能は現在利用できません。", 500);
  }
  if (!token || token !== env.ADMIN_DELETE_TOKEN) {
    return errorResponse("認証に失敗しました。", 401);
  }
  return null;
}

/** 全コメントを新しい順で返す（管理一覧用）。 */
export async function adminListComments(
  db: D1Database | undefined,
): Promise<Response> {
  if (!db) {
    return errorResponse("管理機能は現在利用できません。", 500);
  }
  const rows = await db
    .prepare(
      "SELECT id, post_id, name, message, created_at, parent_id, edited_at, is_admin FROM comments ORDER BY created_at DESC LIMIT 200",
    )
    .all<{
      id: number;
      post_id: string;
      name: string;
      message: string;
      created_at: string;
      parent_id: number | null;
      edited_at: string | null;
      is_admin: number;
    }>();
  return successResponse({
    comments: (rows.results ?? []).map((row) => ({
      id: row.id,
      postId: row.post_id,
      name: row.name,
      message: row.message,
      createdAt: row.created_at,
      parentId: row.parent_id,
      editedAt: row.edited_at,
      isAdmin: row.is_admin === 1,
    })),
  });
}

export interface AdminCreateCommentInput {
  readonly postId: string;
  readonly message: string;
  readonly parentId?: number | null;
}

/** 管理人コメント（is_admin=1）を作成する。Turnstile・レート制限は適用しない。 */
export async function adminCreateComment(
  db: D1Database | undefined,
  input: AdminCreateCommentInput,
): Promise<Response> {
  if (!db) {
    return errorResponse("管理機能は現在利用できません。", 500);
  }
  if (!input.postId || input.postId.length > 200) {
    return errorResponse("記事のスラッグが不正です。", 400);
  }
  const message = input.message.trim();
  const validationError = validateCommentInput("名前", message);
  if (validationError) {
    return errorResponse(
      `本文を確認してください（${COMMENT_LIMITS.maxMessageLength}文字以内）。`,
      400,
    );
  }
  const replyTarget = await resolveReplyTarget(
    db,
    input.postId,
    input.parentId ?? null,
  );
  if (replyTarget === "invalid") {
    return errorResponse("返信先のコメントが見つかりません。", 400);
  }
  await db
    .prepare(
      "INSERT INTO comments (post_id, name, message, created_at, ip_hash, parent_id, is_admin) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1)",
    )
    .bind(
      input.postId,
      SITE.ownerName,
      message,
      new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      "admin",
      replyTarget.rootId,
    )
    .run();
  return successResponse({ ok: true });
}
