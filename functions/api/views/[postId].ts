/// <reference types="@cloudflare/workers-types" />
import type { CommentsEnv } from "../../../src/infra/comments/server";

const POST_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,199}$/;
let tableReady: Promise<unknown> | null = null;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function ensureTable(db: D1Database): Promise<unknown> {
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

function validPostId(value: unknown): value is string {
  return typeof value === "string" && POST_ID_PATTERN.test(value);
}

export const onRequestGet: PagesFunction<CommentsEnv> = async (context) => {
  const db = context.env.COMMENTS_DB;
  if (!db) return json({ error: "閲覧数は現在利用できません。" }, 500);
  if (!validPostId(context.params.postId))
    return json({ error: "不正なリクエストです。" }, 400);
  try {
    await ensureTable(db);
    const row = await db
      .prepare("SELECT views FROM post_views WHERE post_id = ?1")
      .bind(context.params.postId)
      .first<{ views: number }>();
    return json({ views: row?.views ?? 0 });
  } catch {
    return json({ error: "閲覧数を取得できませんでした。" }, 500);
  }
};

export const onRequestPost: PagesFunction<CommentsEnv> = async (context) => {
  const db = context.env.COMMENTS_DB;
  if (!db) return json({ error: "閲覧数は現在利用できません。" }, 500);
  if (!validPostId(context.params.postId))
    return json({ error: "不正なリクエストです。" }, 400);
  try {
    await ensureTable(db);
    await db
      .prepare(
        "INSERT INTO post_views (post_id, views) VALUES (?1, 1) ON CONFLICT(post_id) DO UPDATE SET views = views + 1",
      )
      .bind(context.params.postId)
      .run();
    const row = await db
      .prepare("SELECT views FROM post_views WHERE post_id = ?1")
      .bind(context.params.postId)
      .first<{ views: number }>();
    return json({ views: row?.views ?? 1 });
  } catch {
    return json({ error: "閲覧数を更新できませんでした。" }, 500);
  }
};
