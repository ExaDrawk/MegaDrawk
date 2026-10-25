/// <reference types="@cloudflare/workers-types" />
import {
  adminCreateComment,
  adminListComments,
  checkAdminAccess,
  type CommentsEnv,
} from "../../../src/infra/comments/server";

// 管理画面用コメントAPI。パスワードから発行したHttpOnlyセッションCookieで認可する。

export const onRequestGet: PagesFunction<CommentsEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  return adminListComments(context.env.COMMENTS_DB);
};

export const onRequestPost: PagesFunction<CommentsEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  let body: { postId?: unknown; message?: unknown; parentId?: unknown };
  try {
    body = JSON.parse(await context.request.text());
  } catch {
    return new Response(
      JSON.stringify({ error: "送信内容を読み取れませんでした。" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
  if (
    typeof body.postId !== "string" ||
    typeof body.message !== "string" ||
    (body.parentId !== undefined &&
      body.parentId !== null &&
      typeof body.parentId !== "number")
  ) {
    return new Response(
      JSON.stringify({ error: "送信内容の形式が正しくありません。" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
  return adminCreateComment(context.env.COMMENTS_DB, {
    postId: body.postId,
    message: body.message,
    parentId: body.parentId ?? null,
  });
};
