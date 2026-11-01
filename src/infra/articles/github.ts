import { ARTICLE_DIR, GITHUB_API, REPO, githubHeaders } from "./githubClient";
import { commitArticle } from "./images";
/// <reference types="@cloudflare/workers-types" />
import {
  isValidArticleFilename,
  readArticleDraft,
  readArticleMeta,
  setArticleDraft,
} from "../../domain/blog/markdown";
export { isValidArticleFilename } from "../../domain/blog/markdown";

/**
 * ブログ記事（src/content/blog/*.md）をGitHubリポジトリへ読み書きするモジュール。
 * PagesのGit連携がmainへのコミットを検知して自動再ビルドするため、
 * 保存から反映まで1〜2分かかる。
 */

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function successResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export interface GithubArticleMeta {
  readonly name: string;
  readonly sha: string;
}

export async function listArticles(
  token: string | undefined,
): Promise<Response> {
  // 本番のみクラッシュするため、原因特定まで全例外を応答に含める
  try {
    return await listArticlesInner(token);
  } catch (error) {
    return errorResponse(
      `listArticles crashed: ${String(error)} | ${
        error instanceof Error ? (error.stack ?? "").slice(0, 250) : ""
      }`,
      502,
    );
  }
}

async function listArticlesInner(token: string | undefined): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  let response: Response;
  try {
    response = await fetch(
      `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}`,
      { headers: githubHeaders(token) },
    );
  } catch (error) {
    return errorResponse(
      `記事一覧の取得で通信エラーが発生しました。(${String(error).slice(0, 80)})`,
      502,
    );
  }
  if (!response.ok) {
    return errorResponse(
      `記事一覧の取得に失敗しました。(github ${response.status})`,
      502,
    );
  }
  const files = (await response.json()) as {
    name: string;
    sha: string;
  }[];
  const names = files.filter((file) => isValidArticleFilename(file.name));
  if (names.length > 200)
    return errorResponse("記事数が多すぎるため一覧を取得できません。", 413);
  // 一覧にタイトル・日付・公開状態を出すため、各記事のfrontmatterを読む。
  // 1件でも壊れた設定があっても一覧全体を落とさず、invalidとして隔離する。
  const articles = await Promise.all(
    names.map(async (file) => {
      const base = { name: file.name, sha: file.sha };
      try {
        const fileResponse = await fetch(
          `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}/${file.name}`,
          { headers: githubHeaders(token) },
        );
        if (!fileResponse.ok) throw new Error(`github ${fileResponse.status}`);
        const value = (await fileResponse.json()) as { content: string };
        const content = Buffer.from(value.content, "base64").toString("utf8");
        return { ...base, ...readArticleMeta(content), invalid: false };
      } catch {
        return {
          ...base,
          title: file.name,
          description: "",
          date: "",
          updatedAt: null,
          tags: [],
          draft: true,
          invalid: true,
        };
      }
    }),
  );
  articles.sort(
    (a, b) =>
      (b.date || "").localeCompare(a.date || "") ||
      a.name.localeCompare(b.name),
  );
  return successResponse({ articles });
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
  let response: Response;
  try {
    response = await fetch(
      `${GITHUB_API}/repos/${REPO}/contents/${ARTICLE_DIR}/${rawName}`,
      { headers: githubHeaders(token) },
    );
  } catch (error) {
    return errorResponse(
      `記事の取得で通信エラーが発生しました。(${String(error).slice(0, 80)})`,
      502,
    );
  }
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
  readonly additions?: unknown;
  readonly deletions?: unknown;
}

export async function saveArticle(
  token: string | undefined,
  input: SaveArticleInput,
): Promise<Response> {
  if (!token) {
    return errorResponse("記事管理は現在利用できません。", 500);
  }
  if (
    !input ||
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
  try {
    readArticleDraft(input.content);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "記事の設定を確認してください。",
      400,
    );
  }
  return commitArticle(token, input);
}

export interface ArticleVisibilityUpdate {
  readonly name: string;
  readonly sha: string;
  readonly draft: boolean;
}

class BulkFailure extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function bulkApi<T>(
  token: string,
  route: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${GITHUB_API}/repos/${REPO}${route}`, {
      ...init,
      headers: { ...githubHeaders(token), ...(init?.headers ?? {}) },
    });
  } catch {
    throw new BulkFailure("GitHubとの通信に失敗しました。", 502);
  }
  if (!response.ok) {
    const conflict = response.status === 409 || response.status === 422;
    throw new BulkFailure(
      conflict
        ? "他の更新と競合しました。最新の一覧を取得してから再試行してください。"
        : `GitHubとの通信に失敗しました。(github ${response.status})`,
      conflict ? 409 : 502,
    );
  }
  return response.json() as Promise<T>;
}

interface GitTreeEntry {
  path: string;
  sha: string;
  type: string;
}

/**
 * 複数記事の公開状態を1コミットで変更する。
 * 呼び出し元が保持するshaと現在のblobが一致しない場合は409で中止し、
 * 別の画面で保存された更新を上書きしない。
 */
export async function setArticlesDraft(
  token: string | undefined,
  rawUpdates: unknown,
): Promise<Response> {
  if (!token) return errorResponse("記事管理は現在利用できません。", 500);
  if (
    !Array.isArray(rawUpdates) ||
    rawUpdates.length === 0 ||
    rawUpdates.length > 100
  )
    return errorResponse("変更する記事を1〜100件で指定してください。", 400);
  const updates: ArticleVisibilityUpdate[] = [];
  const seen = new Set<string>();
  for (const value of rawUpdates) {
    if (!value || typeof value !== "object")
      return errorResponse("変更内容が不正です。", 400);
    const item = value as Record<string, unknown>;
    if (
      typeof item.name !== "string" ||
      !isValidArticleFilename(item.name) ||
      typeof item.sha !== "string" ||
      !/^[0-9a-f]{40,64}$/i.test(item.sha) ||
      typeof item.draft !== "boolean"
    )
      return errorResponse("変更内容が不正です。", 400);
    if (seen.has(item.name))
      return errorResponse("同じ記事が重複しています。", 400);
    seen.add(item.name);
    updates.push({ name: item.name, sha: item.sha, draft: item.draft });
  }
  try {
    const ref = await bulkApi<{ object: { sha: string } }>(
      token,
      "/git/ref/heads/main",
    );
    const head = ref.object.sha;
    const commit = await bulkApi<{ tree: { sha: string } }>(
      token,
      `/git/commits/${head}`,
    );
    const tree = await bulkApi<{
      tree: GitTreeEntry[];
      truncated: boolean;
    }>(token, `/git/trees/${commit.tree.sha}?recursive=1`);
    if (tree.truncated)
      throw new BulkFailure(
        "リポジトリが大きすぎるため安全に処理できません。",
        502,
      );
    const entries = new Map(
      tree.tree
        .filter((entry) => entry.type === "blob")
        .map((entry) => [entry.path, entry]),
    );
    const changes: {
      path: string;
      mode: string;
      type: string;
      sha: string;
    }[] = [];
    const result: { name: string; sha: string; draft: boolean }[] = [];
    for (const update of updates) {
      const path = `${ARTICLE_DIR}/${update.name}`;
      const entry = entries.get(path);
      if (!entry)
        throw new BulkFailure(`${update.name}が見つかりません。`, 404);
      if (entry.sha !== update.sha)
        throw new BulkFailure(
          `${update.name}は他の更新と競合しました。最新の一覧を取得してください。`,
          409,
        );
      const blob = await bulkApi<{ content: string }>(
        token,
        `/git/blobs/${entry.sha}`,
      );
      const content = Buffer.from(
        blob.content.replace(/\s/g, ""),
        "base64",
      ).toString("utf8");
      let next: string;
      try {
        next = setArticleDraft(content, update.draft);
      } catch (error) {
        throw new BulkFailure(
          error instanceof Error
            ? `${update.name}: ${error.message}`
            : `${update.name}の設定を確認してください。`,
          400,
        );
      }
      if (next === content) {
        result.push({
          name: update.name,
          sha: entry.sha,
          draft: update.draft,
        });
        continue;
      }
      const created = await bulkApi<{ sha: string }>(token, "/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: next, encoding: "utf-8" }),
      });
      changes.push({
        path,
        mode: "100644",
        type: "blob",
        sha: created.sha,
      });
      result.push({
        name: update.name,
        sha: created.sha,
        draft: update.draft,
      });
    }
    if (!changes.length)
      return successResponse({ ok: true, commit: head, articles: result });
    const newTree = await bulkApi<{ sha: string }>(token, "/git/trees", {
      method: "POST",
      body: JSON.stringify({
        base_tree: commit.tree.sha,
        tree: changes,
      }),
    });
    const newCommit = await bulkApi<{ sha: string }>(token, "/git/commits", {
      method: "POST",
      body: JSON.stringify({
        message: `Update article visibility via admin (${updates.length})`,
        tree: newTree.sha,
        parents: [head],
      }),
    });
    await bulkApi<{ object: { sha: string } }>(token, "/git/refs/heads/main", {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    });
    return successResponse({
      ok: true,
      commit: newCommit.sha,
      articles: result,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "公開状態の変更に失敗しました。",
      error instanceof BulkFailure ? error.status : 502,
    );
  }
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
  let response: Response;
  try {
    response = await fetch(
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
  } catch (error) {
    return errorResponse(
      `記事の削除で通信エラーが発生しました。(${String(error).slice(0, 80)})`,
      502,
    );
  }
  if (!response.ok) {
    return errorResponse(
      `記事の削除に失敗しました。(github ${response.status})`,
      502,
    );
  }
  return successResponse({ ok: true });
}
