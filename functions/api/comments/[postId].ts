/// <reference types="@cloudflare/workers-types" />
import {
  createComment,
  deleteComment,
  listComments,
  type CommentsEnv,
} from "../../../src/infra/comments/server";

// 公開コメントAPIのルーター。ロジックはsrc/infra/comments/server.ts（テスト対象）。

export const onRequestGet: PagesFunction<CommentsEnv> = async (context) => {
  const limit = new URL(context.request.url).searchParams.get("limit");
  return listComments(context.env.COMMENTS_DB, context.params.postId, limit);
};

export const onRequestPost: PagesFunction<CommentsEnv> = async (context) => {
  const rawBody = await context.request.text();
  return createComment(context.env, {
    rawBody,
    postId: context.params.postId,
    remoteAddress: context.request.headers.get("CF-Connecting-IP"),
  });
};

export const onRequestDelete: PagesFunction<CommentsEnv> = async (context) => {
  const id = new URL(context.request.url).searchParams.get("id");
  return deleteComment(
    context.env,
    id,
    context.request.headers.get("X-Admin-Token"),
  );
};
