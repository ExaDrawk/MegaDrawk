/// <reference types="@cloudflare/workers-types" />

const POST_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,199}$/;
const MAX_STATS_IDS = 50;
let tableReady: Promise<unknown> | null = null;

export interface PostStatsEnv {
  readonly COMMENTS_DB?: D1Database;
}

export interface PostStat {
  readonly views: number;
  readonly comments: number;
}

export function isValidPostId(value: unknown): value is string {
  return typeof value === "string" && POST_ID_PATTERN.test(value);
}

export function ensurePostViewsTable(db: D1Database): Promise<unknown> {
  tableReady ??= db
    .prepare(
      "CREATE TABLE IF NOT EXISTS post_views (post_id TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0)",
    )
    .run()
    .catch((error) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function readPostView(
  db: D1Database,
  postId: string,
): Promise<number> {
  const row = await db
    .prepare("SELECT views FROM post_views WHERE post_id = ?1")
    .bind(postId)
    .first<{ views: number }>();
  return row?.views ?? 0;
}

export async function incrementPostView(
  db: D1Database,
  postId: string,
): Promise<number> {
  await db
    .prepare(
      "INSERT INTO post_views (post_id, views) VALUES (?1, 1) ON CONFLICT(post_id) DO UPDATE SET views = views + 1",
    )
    .bind(postId)
    .run();
  return readPostView(db, postId);
}

/** 記事一覧用。複数記事の閲覧数・コメント数を1リクエストで返す。 */
export async function getPostStats(
  db: D1Database | undefined,
  rawIds: string | null,
): Promise<Response> {
  if (!db)
    return jsonResponse({ error: "投稿統計は現在利用できません。" }, 500);
  if (typeof rawIds !== "string") {
    return jsonResponse({ error: "不正なリクエストです。" }, 400);
  }
  const ids = [...new Set(rawIds.split(",").map((id) => id.trim()))].filter(
    Boolean,
  );
  if (ids.length === 0 || ids.length > MAX_STATS_IDS) {
    return jsonResponse({ error: "不正なリクエストです。" }, 400);
  }
  if (!ids.every(isValidPostId)) {
    return jsonResponse({ error: "不正なリクエストです。" }, 400);
  }
  try {
    await ensurePostViewsTable(db);
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(", ");
    const [viewsRows, commentRows] = await Promise.all([
      db
        .prepare(
          `SELECT post_id, views FROM post_views WHERE post_id IN (${placeholders})`,
        )
        .bind(...ids)
        .all<{ post_id: string; views: number }>(),
      db
        .prepare(
          `SELECT post_id, COUNT(*) AS count FROM comments WHERE post_id IN (${placeholders}) GROUP BY post_id`,
        )
        .bind(...ids)
        .all<{ post_id: string; count: number }>(),
    ]);
    const views = new Map(
      (viewsRows.results ?? []).map((row) => [row.post_id, row.views]),
    );
    const comments = new Map(
      (commentRows.results ?? []).map((row) => [row.post_id, row.count]),
    );
    const stats: Record<string, PostStat> = {};
    for (const id of ids) {
      stats[id] = {
        views: views.get(id) ?? 0,
        comments: comments.get(id) ?? 0,
      };
    }
    return jsonResponse({ stats });
  } catch {
    return jsonResponse({ error: "投稿統計を取得できませんでした。" }, 500);
  }
}
