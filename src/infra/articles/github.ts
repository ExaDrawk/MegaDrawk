/// <reference types="@cloudflare/workers-types" />

/**
 * ブログ記事（src/content/blog/*.md）をGitHubリポジトリへ読み書きするモジュール。
 * PagesのGit連携がmainへのコミットを検知して自動再ビルドするため、
 * 保存から反映まで1〜2分かかる。
 */

const REPO = "ExaDrawk/MegaDrawk";
const ARTICLE_DIR = "src/content/blog";
const GITHUB_API = "https://api.github.com";

/** ファイル名はスラッグ＋.mdのみ（パス操作の余地を残さない） */
export function isValidArticleFilename(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]*\.md$/.test(name);
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function successResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export interface GithubArticleMeta {
  readonly name: string;
  readonly sha: string;
}

export async function listArticles(
  token: string | undefined,
): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}`,
    { headers: githubHeaders(token) },
  );
  if (!response.ok) {
    return errorResponse("記事一覧の取得に失敗しました。", 502);
  }
  const files = (await response.json()) as {
    name: string;
    sha: string;
  }[];
  return successResponse({
    articles: files
      .filter((file) => isValidArticleFilename(file.name))
      .map((file) => ({ name: file.name, sha: file.sha })),
  });
}

export async function getArticle(
  token: string | undefined,
  rawName: string | null,
): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  if (!rawName || !isValidArticleFilename(rawName)) {
    return errorResponse("ファイル名が不正です。", 400);
  }
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}/${rawName}`,
    { headers: githubHeaders(token) },
  );
  if (!response.ok) {
    return errorResponse("記事の取得に失敗しました。", 404);
  }
  const file = (await response.json()) as { sha: string; content: string };
  return successResponse({
    name: rawName,
    sha: file.sha,
    content: Buffer.from(file.content, "base64").toString("utf8"),
  });
}

export interface SaveArticleInput {
  readonly name: unknown;
  readonly content: unknown;
  readonly sha: unknown;
}

export async function saveArticle(
  token: string | undefined,
  input: SaveArticleInput,
): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  if (
    typeof input.name !== "string" ||
    !isValidArticleFilename(input.name) ||
    typeof input.content !== "string" ||
    input.content.trim().length === 0
  ) {
    return errorResponse(
      "ファイル名と本文を確認してください（ファイル名は英数小文字とハイフン＋.md）。",
      400,
    );
  }
  if (input.sha !== null && typeof input.sha !== "string") {
    return errorResponse("更新元の記事が特定できません。", 400);
  }
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}/${input.name}`,
    {
      method: "PUT",
      headers: githubHeaders(token),
      body: JSON.stringify({
        message: `Update article ${input.name} via admin`,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        branch: "main",
        ...(typeof input.sha === "string" ? { sha: input.sha } : {}),
      }),
    },
  );
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    if (
      response.status === 409 ||
      detail?.message?.includes("does not match")
    ) {
      return errorResponse(
        "記事が他の更新と競合しています。一覧を読み込み直してください。",
        409,
      );
    }
    return errorResponse("記事の保存に失敗しました。", 502);
  }
  return successResponse({ ok: true });
}

export async function deleteArticle(
  token: string | undefined,
  rawName: string | null,
  sha: string | null,
): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  if (!rawName || !isValidArticleFilename(rawName) || !sha) {
    return errorResponse("ファイル名とshaを指定してください。", 400);
  }
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}/${rawName}`,
    {
      method: "DELETE",
      headers: githubHeaders(token),
      body: JSON.stringify({
        message: `Delete article ${rawName} via admin`,
        sha,
        branch: "main",
      }),
    },
  );
  if (!response.ok) {
    return errorResponse("記事の削除に失敗しました。", 502);
  }
  return successResponse({ ok: true });
}
