/// <reference types="@cloudflare/workers-types" />
import {
  COMMENT_LIMITS,
  validateCommentInput,
} from "../../domain/comment/types";

/**
 * 公開コメントAPIのロジック（Cloudflare D1保存）。
 * functions/api/comments/[postId].tsはこのモジュールへの薄いルーター。
 * スパム対策: Turnstile検証、IPハッシュ（SHA-256＋ソルト、生IPは保存しない）、
 * 連投クールダウンと同一本文再送抑止、入力上限。
 */

export interface CommentsEnv {
  readonly COMMENTS_DB?: D1Database;
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly IP_HASH_SALT?: string;
  readonly ADMIN_DELETE_TOKEN?: string;
}

/** 同一IPからの再投稿を抑止するクールダウン（分） */
const REPOST_COOLDOWN_MINUTES = 10;
/** 同一IP・同一内容の再投稿を抑止する期間（時間） */
const DUPLICATE_WINDOW_HOURS = 24;
const MAX_LIST_LIMIT = 100;
const MAX_BODY_BYTES = 8192;

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

/** 連投・重複の抑止判定。serverNowはD1時刻とのずれを避けるためISO文字列で受ける。 */
export async function findRejectionReason(
  db: D1Database,
  ipHash: string,
  message: string,
  serverNow: string,
): Promise<string | null> {
  const recent = await db
    .prepare(
      "SELECT message, created_at FROM comments WHERE ip_hash = ?1 ORDER BY created_at DESC LIMIT 1",
    )
    .bind(ipHash)
    .first<{ message: string; created_at: string }>();
  if (recent) {
    const elapsedMinutes =
      (Date.parse(serverNow) - Date.parse(recent.created_at)) / 60000;
    if (elapsedMinutes < REPOST_COOLDOWN_MINUTES) {
      return `連続投稿はできません。${REPOST_COOLDOWN_MINUTES}分ほど待ってから再度お試しください。`;
    }
    if (
      elapsedMinutes < DUPLICATE_WINDOW_HOURS * 60 &&
      recent.message.trim() === message.trim()
    ) {
      return "同じ内容のコメントは短時間のうちに再送できません。";
    }
  }
  return null;
}

export async function listComments(
  db: D1Database | undefined,
  rawPostId: unknown,
  rawLimit: string | null,
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
  const rows = await db
    .prepare(
      "SELECT id, name, message, created_at FROM comments WHERE post_id = ?1 ORDER BY created_at ASC LIMIT ?2",
    )
    .bind(rawPostId, limit)
    .all<{ id: number; name: string; message: string; created_at: string }>();
  return successResponse({
    comments: (rows.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      createdAt: row.created_at,
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
  let body: { name?: unknown; message?: unknown; turnstileToken?: unknown };
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

  const name = body.name.trim();
  const message = body.message.trim();
  const validationError = validateCommentInput(name, message);
  if (validationError) {
    return errorResponse(
      `お名前と本文を確認してください（名前は${COMMENT_LIMITS.maxNameLength}文字以内、本文は${COMMENT_LIMITS.maxMessageLength}文字以内）。`,
      400,
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
  const postId = typeof input.postId === "string" ? input.postId : "";
  const rejection = await findRejectionReason(
    COMMENTS_DB,
    ipHash,
    message,
    serverNow,
  );
  if (rejection) {
    return errorResponse(rejection, 429);
  }

  await COMMENTS_DB.prepare(
    "INSERT INTO comments (post_id, name, message, created_at, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5)",
  )
    .bind(postId, name, message, serverNow, ipHash)
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
  await COMMENTS_DB.prepare("DELETE FROM comments WHERE id = ?1")
    .bind(Number(rawId))
    .run();
  return successResponse({ ok: true });
}
