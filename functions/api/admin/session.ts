/// <reference types="@cloudflare/workers-types" />
import {
  createAdminLogoutResponse,
  createAdminSessionResponse,
  type CommentsEnv,
} from "../../../src/infra/comments/server";

// 管理画面のセッションAPI。
// POST: パスワード検証→HttpOnlyセッションCookie発行。DELETE: ログアウト。

export const onRequestPost: PagesFunction<CommentsEnv> = async (context) => {
  let body: { password?: unknown };
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
  return createAdminSessionResponse(context.env, body.password);
};

export const onRequestDelete: PagesFunction<CommentsEnv> = async () => {
  return createAdminLogoutResponse();
};
