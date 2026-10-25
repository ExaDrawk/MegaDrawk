/// <reference types="@cloudflare/workers-types" />
import {
  createComment,
  deleteComment,
  editComment,
  listComments,
  checkAdminAccess,
  type CommentsEnv,
} from "../../../src/infra/comments/server";

// 公開コメントAPIのルーター。ロジックはsrc/infra/comments/server.ts（テスト対象）。

export const onRequestGet: PagesFunction<CommentsEnv> = async (context) => {
  const limit = new URL(context.request.url).searchParams.get("limit");
  return listComments(
    context.env.COMMENTS_DB,
    context.params.postId,
    limit,
    context.request.headers.get("CF-Connecting-IP"),
    context.env.IP_HASH_SALT,
  );
};

export const onRequestPost: PagesFunction<CommentsEnv> = async (context) => {
  const rawBody = await context.request.text();
  return createComment(context.env, {
    rawBody,
    postId: context.params.postId,
    remoteAddress: context.request.headers.get("CF-Connecting-IP"),
  });
};

export const onRequestPut: PagesFunction<CommentsEnv> = async (context) => {
  const rawBody = await context.request.text();
  return editComment(context.env, {
    rawBody,
    postId: context.params.postId,
    remoteAddress: context.request.headers.get("CF-Connecting-IP"),
  });
};

export const onRequestDelete: PagesFunction<CommentsEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  const id = new URL(context.request.url).searchParams.get("id");
  return deleteComment(context.env, id, context.env.ADMIN_DELETE_TOKEN ?? null);
};
