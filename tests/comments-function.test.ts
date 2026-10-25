import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createComment,
  deleteComment,
  findRejectionReason,
  listComments,
  type CommentsEnv,
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

type MockDb = CommentsEnv["COMMENTS_DB"] & {
  statements: { sql: string; bound: unknown[] }[];
};

function makeDb(
  recent: { message: string; created_at: string } | null = null,
): MockDb {
  const statements: { sql: string; bound: unknown[] }[] = [];
  return {
    statements,
    prepare(sql: string) {
      const statement = {
        bind: (...args: unknown[]) => {
          statements.push({ sql, bound: args });
          return statement;
        },
        first: async () => recent,
        all: async () => ({
          results: [
            {
              id: 1,
              name: "既読者",
              message: "以前のコメント",
              created_at: "2026-10-25T09:00:00Z",
            },
          ],
        }),
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
    const response = await listComments(makeDb(), "post-1", null);
    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      comments: { name: string }[];
    };
    expect(payload.comments).toHaveLength(1);
    expect(JSON.stringify(payload)).not.toContain("ip_hash");
  });

  it("returns 500 when the database is not bound", async () => {
    const response = await listComments(undefined, "post-1", null);
    expect(response.status).toBe(500);
  });

  it("rejects an empty or oversized post id", async () => {
    expect((await listComments(makeDb(), "", null)).status).toBe(400);
    expect((await listComments(makeDb(), "x".repeat(201), null)).status).toBe(
      400,
    );
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

  it("rejects reposts within the cooldown window", async () => {
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({ message: "応援しています！", created_at: now });
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
    const db = makeDb({ message: "応援しています！", created_at: oneHourAgo });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(429);
  });

  it("accepts a different message after the cooldown", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z");
    const db = makeDb({ message: "前回は別の内容", created_at: oneHourAgo });
    const response = await createComment(envWith(db), {
      rawBody: VALID_BODY,
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(200);
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
        message: "あ".repeat(9000),
        turnstileToken: "token",
      }),
      postId: "post-1",
      remoteAddress: "203.0.113.10",
    });
    expect(response.status).toBe(413);
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
  const db = makeDb();
  const now = "2026-10-25T12:00:00Z";

  it("returns null when there is no recent comment", async () => {
    expect(await findRejectionReason(db, "hash", "本文", now)).toBeNull();
  });
});
