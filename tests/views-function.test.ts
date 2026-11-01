import { describe, expect, it } from "vitest";
import { onRequestGet, onRequestPost } from "../functions/api/views/[postId]";

function makeDb(): D1Database & { rows: Map<string, number> } {
  const rows = new Map<string, number>();
  return {
    rows,
    prepare(sql: string) {
      const statement = {
        bound: undefined as unknown,
        bind(value: unknown) {
          statement.bound = value;
          return statement;
        },
        async run() {
          if (sql.startsWith("INSERT INTO post_views")) {
            const key = String(statement.bound);
            rows.set(key, (rows.get(key) ?? 0) + 1);
          }
          return { success: true };
        },
        async first() {
          if (sql.startsWith("SELECT views")) {
            return { views: rows.get(String(statement.bound)) ?? 0 };
          }
          return null;
        },
      };
      return statement;
    },
  } as unknown as D1Database & { rows: Map<string, number> };
}

function context(db: D1Database | undefined, postId: string) {
  return {
    env: { COMMENTS_DB: db },
    params: { postId },
  } as unknown as Parameters<typeof onRequestGet>[0];
}

describe("post views API", () => {
  it("increments and returns the view count", async () => {
    const db = makeDb();
    const ctx = context(db, "post-1");

    const first = await onRequestPost(ctx);
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ views: 1 });

    const second = await onRequestPost(ctx);
    expect(await second.json()).toEqual({ views: 2 });

    const read = await onRequestGet(ctx);
    expect(await read.json()).toEqual({ views: 2 });
  });

  it("rejects invalid ids and a missing database", async () => {
    expect((await onRequestGet(context(makeDb(), "BAD ID"))).status).toBe(400);
    expect((await onRequestGet(context(undefined, "post-1"))).status).toBe(500);
  });
});
