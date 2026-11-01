/// <reference types="@cloudflare/workers-types" />
import {
  getPostStats,
  type PostStatsEnv,
} from "../../src/infra/postStats/server";

export const onRequestGet: PagesFunction<PostStatsEnv> = (context) =>
  getPostStats(
    context.env.COMMENTS_DB,
    new URL(context.request.url).searchParams.get("ids"),
  );
