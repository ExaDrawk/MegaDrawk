import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHash } from "node:crypto";
import {
  createComment,
  deleteComment,
  editComment,
  findRejectionReason,
  listComments,
  type CommentsEnv,
  type IpHistoryRow,
} from "../src/infra/comments/server";

const VALID_BODY = JSON.stringify({
  name: "読者",
  message: "応援しています！",
  turnstileToken: "token",
});

const baseEnv: CommentsEnv = {
  COMMENTS_DB: undefined,
  TURNSTILE_SECRET_KEY: "secret",
  IP_HASH_SALT: "salt",
  ADMIN_DELETE_TOKEN: "admin-token",
};

function hashOf(ip: string): string {
  return createHash("sha256").update(`salt:${ip}`).digest("hex");
}

interface MockDbOptions {
  history?: readonly IpHistoryRow[];
  parent?: {
    id: number;
    parent_id: number | null;
    post_id: string;
    is_admin?: number;
  } | null;
  comment?: {
    id: number;
    post_id: string;
    ip_hash: string;
    created_at: string;
  } | null;
  replyCount?: number;
}

type MockDb = CommentsEnv["COMMENTS_DB"] & {
  statements: { sql: string; bound: unknown[] }[];
};

function makeDb(options: MockDbOptions = {}): MockDb {
  const statements: { sql: string; bound: unknown[] }[] = [];
  return {
    statements,
    prepare(sql: string) {
      const statement = {
        bound: [] as unknown[],
        bind: (...args: unknown[]) => {
          statement.bound = args;
          statements.push({ sql, bound: args });
          return statement;
        },
        first: async () => {
          if (sql.includes("SELECT id, parent_id, post_id")) {
            return options.parent ?? null;
          }
          if (sql.includes("COUNT(*)")) {
            return { count: options.replyCount ?? 0 };
          }
          if (sql.includes("SELECT id, post_id, ip_hash, created_at")) {
            return options.comment ?? null;
          }
          return null;
        },
        all: async () => {
          if (sql.includes("SELECT post_id, message, created_at")) {
            return { results: options.history ?? [] };
          }
          if (sql.startsWith("SELECT id, name")) {
            return {
              results: [
                {
                  id: 1,
                  name: "既読者",
                  message: "以前のコメント",
                  created_at: "2026-10-25T09:00:00Z",
                  parent_id: null,
                  ip_hash: "other-hash",
                  edited_at: null,
                },
              ],
            };
          }
          return { results: [] };
        },
        run: async () => ({ success: true }),
      };
      return statement;
    },
  } as unknown as MockDb;
}

function envWith(db: MockDb): CommentsEnv {
  return { ...baseEnv, COMMENTS_DB: db };
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify({ success: true }), { status: 200 }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  globalThis.fetch = originalFetch;
});

describe("listComments", () => {
  it("lists comments without exposing ip hashes", async () => {
    const response = await listComments(
      makeDb(),
      "post-1",
      null,
      null,
      undefined,
    );
    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      comments: { name: string; editable: boolean }[];
    };
    expect(payload.comments).toHaveLength(1);
    expect(JSON.stringify(payload)).not.toContain("ip_hash");
    expect(payload.comments[0]?.editable).toBe(false);
  });

  it("marks own recent comments as editable", async () => {
    const ownHash = hashOf("203.0.113.10");
    const db = makeDb();
    // 既読者行のip_hashを実閲覧者のものへ差し替える
    const response = await listComments(
      {
        prepare(_sql: string) {
          return {
            bind: () => ({
              all: async () => ({
                results: [
                  {
                    id: 1,
                    name: "自分",
                    message: "自分のコメント",
                    created_at: new Date().toISOString(),
                    parent_id: null,
                    ip_hash: ownHash,
                    edited_at: null,
                  },
                ],
              }),
              first: async () => null,
              run: async () => ({ success: true }),
            }),
          };
        },
      } as unknown as MockDb,
      "post-1",
      null,
      "203.0.113.10",
      "salt",
    );
    void db;
    const payload = (await response.json()) as {
      comments: { editable: boolean }[];
    };
    expect(payload.comments[0]?.editable).toBe(true);
  });

  it("returns 500 when the database is not bound", async () => {
    const response = await listComments(
      undefined,
      "post-1",
      null,
      null,
      undefined,
    );
    expect(response.status).toBe(500);
  });

  it("rejects an empty or oversized post id", async () => {
    expect(
      (await listComments(makeDb(), "", null, null, undefined)).status,
    ).toBe(400);
    expect(
      (await listComments(makeDb(), "x".repeat(201), null, null, undefined))
        .status,
    ).toBe(400);
  });
});

describe("createComment", () => {
  it("stores a valid comment after turnstile verification", async () => {
    const db = makeDb();
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
    const insert = db.statements.find((statement) =>
      statement.sql.startsWith("INSERT"),
    );
    expect(insert).toBeDefined();
    expect(insert?.bound[1]).toBe("読者");
    // 生IPは保存せず、ハッシュ化されている
    expect(JSON.stringify(insert?.bound[4])).not.toBe("203.0.113.10");
  });

  it("rejects consecutive posts within 60 seconds", async () => {
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [{ post_id: "post-1", message: "前の投稿", created_at: now }],
    });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });

  it("allows a different message after 60 seconds", async () => {
    const twoMinutesAgo = new Date(Date.now() - 120 * 1000)
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [
        { post_id: "post-1", message: "前の投稿", created_at: twoMinutesAgo },
      ],
    });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
  });

  it("rejects the 4th post within 10 minutes", async () => {
    const now = Date.now();
    const history = [2, 5, 8].map((minutesAgo) => ({
      post_id: "post-1",
      message: `過去の投稿${minutesAgo}`,
      created_at: new Date(now - minutesAgo * 60 * 1000)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z"),
    }));
    const db = makeDb({ history });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });

  it("rejects the same message within the duplicate window", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [
        {
          post_id: "post-2",
          message: "応援しています！",
          created_at: oneHourAgo,
        },
      ],
    });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });

  it("rejects over-limit input with 400", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: JSON.stringify({
        name: "あ".repeat(31),
        message: "本文",
        turnstileToken: "token",
      }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });

  it("rejects a missing turnstile token with 400", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: JSON.stringify({ name: "読者", message: "本文" }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });

  it("rejects when turnstile verification fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false }), { status: 200 }),
      ),
    );
    const response = await createComment(envWith(makeDb()), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });

  it("returns 500 when required secrets are missing", async () => {
    const response = await createComment(
      { ...envWith(makeDb()), TURNSTILE_SECRET_KEY: undefined },
      {
        rawBody: VALID_BODY,
        postId: "post-1",
        remoteAddress: "203.0.113.10",
      },
    );
    expect(response.status).toBe(500);
  });

  it("returns 413 for an oversized body", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: JSON.stringify({
        name: "読者",
        message: "あ".repeat(20000),
        turnstileToken: "token",
      }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(413);
  });
});

describe("createComment (replies)", () => {
  const replyBody = (parentId: unknown) =>
    JSON.stringify({
      name: "返信者",
      message: "返信です",
      turnstileToken: "token",
      parentId,
    });

  it("stores a reply bound to the top-level parent", async () => {
    const db = makeDb({
      parent: { id: 5, parent_id: null, post_id: "post-1" },
    });
    const response = await createComment(envWith(db), {
      rawBody: replyBody(5),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
    const insert = db.statements.find((statement) =>
      statement.sql.startsWith("INSERT"),
    );
    expect(insert?.bound[5]).toBe(5);
  });

  it("normalizes a reply to a reply onto the root comment", async () => {
    const db = makeDb({
      parent: { id: 6, parent_id: 5, post_id: "post-1" },
    });
    const response = await createComment(envWith(db), {
      rawBody: replyBody(6),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
    const insert = db.statements.find((statement) =>
      statement.sql.startsWith("INSERT"),
    );
    expect(insert?.bound[5]).toBe(5);
  });

  it("rejects a reply to a missing comment", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: replyBody(999),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });

  it("rejects a reply to a comment on another post", async () => {
    const response = await createComment(
      envWith(
        makeDb({ parent: { id: 5, parent_id: null, post_id: "post-2" } }),
      ),
      {
        rawBody: replyBody(5),
        postId: "post-1",
        remoteAddress: "203.0.113.10",
      },
    );
    expect(response.status).toBe(400);
  });

  it("rejects a non-integer parentId", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: replyBody("5"),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });
});

describe("editComment", () => {
  const ownHash = hashOf("203.0.113.10");

  it("updates the message within the edit window", async () => {
    const db = makeDb({
      comment: {
        id: 5,
        post_id: "post-1",
        ip_hash: ownHash,
        created_at: new Date(Date.now() - 60 * 1000)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z"),
      },
    });
    const response = await editComment(envWith(db), {
      rawBody: JSON.stringify({ id: 5, message: "編集後の本文" }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
    const update = db.statements.find((statement) =>
      statement.sql.startsWith("UPDATE"),
    );
    expect(update?.bound[0]).toBe("編集後の本文");
    expect(update?.bound[2]).toBe(5);
  });

  it("rejects edits by a different ip with 403", async () => {
    const db = makeDb({
      comment: {
        id: 5,
        post_id: "post-1",
        ip_hash: hashOf("198.51.100.7"),
        created_at: new Date().toISOString(),
      },
    });
    const response = await editComment(envWith(db), {
      rawBody: JSON.stringify({ id: 5, message: "編集" }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(403);
  });

  it("rejects edits after the 10-minute window with 403", async () => {
    const db = makeDb({
      comment: {
        id: 5,
        post_id: "post-1",
        ip_hash: ownHash,
        created_at: new Date(Date.now() - 11 * 60 * 1000)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z"),
      },
    });
    const response = await editComment(envWith(db), {
      rawBody: JSON.stringify({ id: 5, message: "編集" }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(403);
  });

  it("rejects edits to a comment on another post with 404", async () => {
    const db = makeDb({
      comment: {
        id: 5,
        post_id: "post-2",
        ip_hash: ownHash,
        created_at: new Date().toISOString(),
      },
    });
    const response = await editComment(envWith(db), {
      rawBody: JSON.stringify({ id: 5, message: "編集" }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(404);
  });

  it("rejects an over-limit message with 400", async () => {
    const response = await editComment(envWith(makeDb()), {
      rawBody: JSON.stringify({
        id: 5,
        message: "あ".repeat(2001),
      }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(400);
  });
});

describe("deleteComment", () => {
  it("requires the admin token", async () => {
    const response = await deleteComment(envWith(makeDb()), "7", "wrong");
    expect(response.status).toBe(401);
  });

  it("deletes with the admin token and a numeric id", async () => {
    const db = makeDb();
    const response = await deleteComment(envWith(db), "7", "admin-token");
    expect(response.status).toBe(200);
    expect(db.statements[0]?.sql).toContain("DELETE");
  });

  it("rejects a non-numeric id", async () => {
    const response = await deleteComment(
      envWith(makeDb()),
      "abc",
      "admin-token",
    );
    expect(response.status).toBe(400);
  });
});

describe("findRejectionReason", () => {
  const serverNow = "2026-10-25T12:00:00Z";
  const at = (utc: string) => ({
    post_id: "post-1",
    message: "本文",
    created_at: utc,
  });

  it("returns null with no history", () => {
    expect(findRejectionReason([], "post-1", "本文", serverNow)).toBeNull();
  });

  it("rejects posts within 60 seconds of the last one", () => {
    const history = [at("2026-10-25T11:59:30Z")];
    expect(findRejectionReason(history, "post-1", "本文", serverNow)).toMatch(
      /60秒/,
    );
  });

  it("rejects the 4th post within 10 minutes", () => {
    const history = [
      at("2026-10-25T11:58:00Z"),
      at("2026-10-25T11:55:00Z"),
      at("2026-10-25T11:52:00Z"),
    ];
    expect(findRejectionReason(history, "post-1", "本文", serverNow)).toMatch(
      /10分間に3件/,
    );
  });

  it("rejects the 11th post of the JST day", () => {
    // 12:00Z＝21:00 JSTの当日0時は 2026-10-24T15:00:00Z。11:05〜11:50の10件はすべて当日
    const history = Array.from({ length: 10 }, (_, index) =>
      at(`2026-10-25T11:${String(5 + index * 5).padStart(2, "0")}:00Z`),
    );
    expect(findRejectionReason(history, "post-1", "本文", serverNow)).toMatch(
      /1日の投稿上限/,
    );
  });

  it("rejects the 4th post to the same article of the JST day", () => {
    const history = [
      at("2026-10-25T11:40:00Z"),
      at("2026-10-25T11:20:00Z"),
      at("2026-10-25T11:00:00Z"),
      { ...at("2026-10-25T10:40:00Z"), post_id: "post-2" },
    ];
    expect(findRejectionReason(history, "post-1", "本文", serverNow)).toMatch(
      /同じ記事への投稿上限/,
    );
  });

  it("rejects the same message within 24 hours", () => {
    const history = [at("2026-10-25T11:00:00Z")];
    expect(findRejectionReason(history, "post-1", "本文", serverNow)).toMatch(
      /同じ内容/,
    );
  });

  it("allows a new message after 60 seconds within all limits", () => {
    const history = [{ ...at("2026-10-25T11:57:00Z"), message: "別の内容" }];
    expect(
      findRejectionReason(history, "post-1", "本文", serverNow),
    ).toBeNull();
  });
});

describe("createComment (admin reply exemption)", () => {
  const replyBody = (parentId: number, message: string) =>
    JSON.stringify({
      name: "読者",
      message,
      turnstileToken: "token",
      parentId,
    });

  it("exempts rate limits for replies to an admin comment", async () => {
    // 直近10秒前に投稿済みでも、管理者コメントへの返信（既存0件）なら制限を免除
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [{ post_id: "post-1", message: "直近の投稿", created_at: now }],
      parent: {
        id: 5,
        parent_id: null,
        post_id: "post-1",
        is_admin: 1,
      },
      replyCount: 0,
    });
    const response = await createComment(envWith(db), {
      rawBody: replyBody(5, "管理者への返信です"),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
  });

  it("applies rate limits from the 4th reply to an admin comment", async () => {
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [{ post_id: "post-1", message: "直近の投稿", created_at: now }],
      parent: {
        id: 5,
        parent_id: null,
        post_id: "post-1",
        is_admin: 1,
      },
      replyCount: 3,
    });
    const response = await createComment(envWith(db), {
      rawBody: replyBody(5, "4本目の返信"),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });

  it("does not exempt replies to a non-admin comment", async () => {
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({
      history: [{ post_id: "post-1", message: "直近の投稿", created_at: now }],
      parent: {
        id: 5,
        parent_id: null,
        post_id: "post-1",
        is_admin: 0,
      },
      replyCount: 0,
    });
    const response = await createComment(envWith(db), {
      rawBody: replyBody(5, "一般コメントへの返信"),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });
});

describe("createComment (reserved name)", () => {
  it("rejects posting with the reserved owner name from the public form", async () => {
    const response = await createComment(envWith(makeDb()), {
      rawBody: JSON.stringify({
        name: "Drawk",
        message: "なりすましコメント",
        turnstileToken: "token",
      }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(403);
  });
});

describe("admin session", () => {
  const makeSessionEnv = () => ({
    ...baseEnv,
    COMMENTS_DB: makeDb(),
  });
  const importSession = async () =>
    await import("../src/infra/comments/server").then((m) => ({
      createAdminSessionResponse: m.createAdminSessionResponse,
      checkAdminAccess: m.checkAdminAccess,
      adminSessionValue: m.adminSessionValue,
    }));

  it("issues an http-only session cookie for the correct password", async () => {
    const { createAdminSessionResponse } = await importSession();
    const response = await createAdminSessionResponse(
      makeSessionEnv(),
      "admin-token",
    );
    expect(response.status).toBe(200);
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain("admin_session=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("rejects a wrong password with 401 and no cookie", async () => {
    const { createAdminSessionResponse } = await importSession();
    const response = await createAdminSessionResponse(
      makeSessionEnv(),
      "wrong",
    );
    expect(response.status).toBe(401);
    expect(response.headers.get("Set-Cookie")).toBeNull();
  });

  it("authorizes requests via the session cookie without exposing the token", async () => {
    const { createAdminSessionResponse, checkAdminAccess } =
      await importSession();
    const env = makeSessionEnv();
    const login = await createAdminSessionResponse(env, "admin-token");
    const setCookie = login.headers.get("Set-Cookie") ?? "";
    const cookie = setCookie.split(";")[0] ?? "";
    const request = new Request("https://megadrawk.com/api/admin/comments", {
      headers: { Cookie: cookie },
    });
    expect(await checkAdminAccess(env, request)).toBeNull();
    // Cookieの値はパスワードそのものではない
    expect(cookie.includes("admin-token")).toBe(false);
  });

  it("still rejects a bad session value", async () => {
    const { checkAdminAccess } = await importSession();
    const request = new Request("https://megadrawk.com/api/admin/comments", {
      headers: {
        Cookie: `admin_session=${"0".repeat(64)}`,
      },
    });
    const denied = await checkAdminAccess(makeSessionEnv(), request);
    expect(denied?.status).toBe(401);
  });
});
