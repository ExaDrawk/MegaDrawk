import { describe, expect, it } from "vitest";
import { getPostStats } from "../src/infra/postStats/server";

function makeDb(
  views: Record<string, number>,
  comments: Record<string, number>,
): D1Database {
  return {
    prepare(sql: string) {
      const statement = {
        bound: [] as unknown[],
        bind(...args: unknown[]) {
          statement.bound = args;
          return statement;
        },
        async run() {
          return { success: true };
        },
        async all() {
          if (sql.startsWith("SELECT post_id, views")) {
            return {
              results: Object.entries(views)
                .filter(([id]) => statement.bound.includes(id))
                .map(([post_id, value]) => ({ post_id, views: value })),
            };
          }
          if (sql.includes("GROUP BY post_id")) {
            return {
              results: Object.entries(comments)
                .filter(([id]) => statement.bound.includes(id))
                .map(([post_id, count]) => ({ post_id, count })),
            };
          }
          return { results: [] };
        },
      };
      return statement;
    },
  } as unknown as D1Database;
}

describe("getPostStats", () => {
  it("returns per-post views and comment counts with zero defaults", async () => {
    const response = await getPostStats(
      makeDb({ "post-1": 12 }, { "post-1": 4, "post-2": 1 }),
      "post-1, post-2, post-3",
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      stats: {
        "post-1": { views: 12, comments: 4 },
        "post-2": { views: 0, comments: 1 },
        "post-3": { views: 0, comments: 0 },
      },
    });
  });

  it("rejects a missing database, empty lists, invalid ids and too many ids", async () => {
    const db = makeDb({}, {});
    expect((await getPostStats(undefined, "post-1")).status).toBe(500);
    expect((await getPostStats(db, null)).status).toBe(400);
    expect((await getPostStats(db, "bad id")).status).toBe(400);
    expect(
      (
        await getPostStats(
          db,
          Array.from({ length: 51 }, (_, index) => `post-${index}`).join(","),
        )
      ).status,
    ).toBe(400);
  });
});
