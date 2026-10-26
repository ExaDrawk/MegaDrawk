import { articleImages } from "../../../src/infra/articles/images";
/// <reference types="@cloudflare/workers-types" />
import {
  deleteArticle,
  getArticle,
  listArticles,
  saveArticle,
  type SaveArticleInput,
} from "../../../src/infra/articles/github";
import {
  checkAdminAccess,
  type CommentsEnv,
} from "../../../src/infra/comments/server";

// 管理画面用記事API（GitHubコミット経由）。セッションCookieで認可する。

interface ArticlesEnv extends CommentsEnv {
  readonly GITHUB_TOKEN?: string;
}

export const onRequestGet: PagesFunction<ArticlesEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  const params = new URL(context.request.url).searchParams;
  const file = params.get("file");
  if (params.has("images"))
    return articleImages(context.env.GITHUB_TOKEN, file, params.get("image"));
  if (file) {
    return getArticle(context.env.GITHUB_TOKEN, file);
  }
  return listArticles(context.env.GITHUB_TOKEN);
};

export const onRequestPut: PagesFunction<ArticlesEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  const origin = context.request.headers.get("Origin");
  if (origin && origin !== new URL(context.request.url).origin)
    return new Response(null, { status: 403 });
  if (Number(context.request.headers.get("Content-Length")) > 22 * 1024 * 1024)
    return new Response(null, { status: 413 });
  let body: SaveArticleInput;
  try {
    const text = await context.request.text();
    if (new TextEncoder().encode(text).length > 22 * 1024 * 1024)
      return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(
      JSON.stringify({ error: "送信内容を読み取れませんでした。" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
  return saveArticle(context.env.GITHUB_TOKEN, body);
};

export const onRequestDelete: PagesFunction<ArticlesEnv> = async (context) => {
  const denied = await checkAdminAccess(context.env, context.request);
  if (denied) return denied;
  const origin = context.request.headers.get("Origin");
  if (origin && origin !== new URL(context.request.url).origin)
    return new Response(null, { status: 403 });
  const params = new URL(context.request.url).searchParams;
  return deleteArticle(
    context.env.GITHUB_TOKEN,
    params.get("file"),
    params.get("sha"),
  );
};
