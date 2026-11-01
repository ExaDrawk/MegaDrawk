/// <reference types="@cloudflare/workers-types" />
import {
  ensurePostViewsTable,
  incrementPostView,
  isValidPostId,
  jsonResponse,
  readPostView,
  type PostStatsEnv,
} from "../../../src/infra/postStats/server";

export const onRequestGet: PagesFunction<PostStatsEnv> = async (context) => {
  const db = context.env.COMMENTS_DB;
  if (!db) return jsonResponse({ error: "閲覧数は現在利用できません。" }, 500);
  if (!isValidPostId(context.params.postId))
    return jsonResponse({ error: "不正なリクエストです。" }, 400);
  try {
    await ensurePostViewsTable(db);
    return jsonResponse({
      views: await readPostView(db, context.params.postId),
    });
  } catch {
    return jsonResponse({ error: "閲覧数を取得できませんでした。" }, 500);
  }
};

export const onRequestPost: PagesFunction<PostStatsEnv> = async (context) => {
  const db = context.env.COMMENTS_DB;
  if (!db) return jsonResponse({ error: "閲覧数は現在利用できません。" }, 500);
  if (!isValidPostId(context.params.postId))
    return jsonResponse({ error: "不正なリクエストです。" }, 400);
  try {
    await ensurePostViewsTable(db);
    return jsonResponse({
      views: await incrementPostView(db, context.params.postId),
    });
  } catch {
    return jsonResponse({ error: "閲覧数を更新できませんでした。" }, 500);
  }
};
