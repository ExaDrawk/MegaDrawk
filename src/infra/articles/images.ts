import { ARTICLE_DIR, GITHUB_API, REPO, githubHeaders } from "./githubClient";
import type { SaveArticleInput } from "./github";
import { isValidArticleFilename } from "../../domain/blog/markdown";
import {
  assetUrl,
  validImageName,
  validateImage,
  IMAGE_LIMITS,
  type ImageAddition,
} from "../../domain/blog/images";

class GithubFailure extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
async function api(
  token: string,
  route: string,
  method = "GET",
  body?: unknown,
) {
  let response: Response;
  try {
    response = await fetch(`${GITHUB_API}/repos/${REPO}/${route}`, {
      method,
      headers: githubHeaders(token),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new GithubFailure(
      "GitHubとの通信に失敗しました。再試行してください。",
      502,
    );
  }
  if (!response.ok)
    throw new GithubFailure(
      [409, 422].includes(response.status)
        ? "他の更新と競合しました。変更を保持して最新版を確認してください。"
        : "GitHubとの通信に失敗しました。再試行してください。",
      [409, 422].includes(response.status) ? 409 : 502,
    );
  return response.json();
}
interface TreeEntry {
  path: string;
  sha: string;
  type: string;
}
async function treeAt(token: string) {
  const ref = (await api(token, "git/ref/heads/main")) as {
    object: { sha: string };
  };
  const commit = (await api(token, `git/commits/${ref.object.sha}`)) as {
    tree: { sha: string };
  };
  const tree = (await api(
    token,
    `git/trees/${commit.tree.sha}?recursive=1`,
  )) as { tree: TreeEntry[]; truncated: boolean };
  if (tree.truncated)
    throw new GithubFailure("一覧が大きすぎるため安全に処理できません。", 502);
  return { head: ref.object.sha, treeSha: commit.tree.sha, entries: tree.tree };
}
async function blob(token: string, sha: string) {
  const value = (await api(token, `git/blobs/${sha}`)) as { content: string };
  return Buffer.from(value.content.replace(/\s/g, ""), "base64");
}
export async function commitArticle(
  token: string,
  input: SaveArticleInput,
): Promise<Response> {
  try {
    const name = input.name as string,
      content = input.content as string;
    const additions = (input.additions ?? []) as ImageAddition[];
    const deletions = (input.deletions ?? []) as string[];
    if (
      !Array.isArray(additions) ||
      !Array.isArray(deletions) ||
      additions.length > 50 ||
      deletions.length > 50
    )
      throw new Error("画像の変更内容を確認してください。");
    let total = 0;
    const seen = new Set<string>();
    for (const addition of additions) {
      if (
        !addition ||
        typeof addition.name !== "string" ||
        typeof addition.base64 !== "string" ||
        !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
          addition.base64,
        )
      )
        throw new Error("画像データが不正です。");
      const bytes = Buffer.from(addition.base64, "base64");
      validateImage(addition.name, bytes);
      total += bytes.length;
      if (seen.has(addition.name)) throw new Error("画像名が重複しています。");
      seen.add(addition.name);
    }
    if (total > IMAGE_LIMITS.total)
      throw new Error("画像の合計は15MiB以内にしてください。");
    for (const deletion of deletions)
      if (
        typeof deletion !== "string" ||
        !validImageName(deletion) ||
        seen.has(deletion)
      )
        throw new Error("削除対象が不正です。");
    const snapshot = await treeAt(token);
    const path = `${ARTICLE_DIR}/${name}`;
    const existing = snapshot.entries.find((entry) => entry.path === path);
    if ((existing?.sha ?? null) !== input.sha)
      throw new GithubFailure(
        "他の更新と競合しました。変更を保持して最新版を確認してください。",
        409,
      );
    const dir = `src/content/blog-assets/${name.slice(0, -3)}`;
    for (const addition of additions)
      if (snapshot.entries.some((e) => e.path === `${dir}/${addition.name}`))
        throw new GithubFailure(
          "同名画像が既に保存されています。別の名前で追加してください。",
          409,
        );
    if (deletions.length) {
      for (const deletion of deletions)
        if (
          !snapshot.entries.some(
            (e) => e.path === `${dir}/${deletion}` && e.type === "blob",
          )
        )
          throw new GithubFailure(
            "削除対象が変更されました。一覧を更新してください。",
            409,
          );
      const texts = [content];
      for (const entry of snapshot.entries.filter(
        (e) =>
          e.path.startsWith(`${ARTICLE_DIR}/`) &&
          e.path.endsWith(".md") &&
          e.path !== path,
      ))
        texts.push((await blob(token, entry.sha)).toString("utf8"));
      // Conservative reference check also covers HTML and relative references.
      for (const deletion of deletions)
        if (
          texts.some(
            (text) =>
              text.includes(deletion) || text.includes(encodeURI(deletion)),
          )
        )
          throw new Error(
            `${deletion}は記事から参照されています。参照を外してから削除してください。`,
          );
    }
    const article = (await api(token, "git/blobs", "POST", {
      content,
      encoding: "utf-8",
    })) as { sha: string };
    const changes: {
      path: string;
      mode: string;
      type: string;
      sha: string | null;
    }[] = [{ path, mode: "100644", type: "blob", sha: article.sha }];
    for (const addition of additions) {
      const value = (await api(token, "git/blobs", "POST", {
        content: addition.base64,
        encoding: "base64",
      })) as { sha: string };
      changes.push({
        path: `${dir}/${addition.name}`,
        mode: "100644",
        type: "blob",
        sha: value.sha,
      });
    }
    for (const deletion of deletions)
      changes.push({
        path: `${dir}/${deletion}`,
        mode: "100644",
        type: "blob",
        sha: null,
      });
    const tree = (await api(token, "git/trees", "POST", {
      base_tree: snapshot.treeSha,
      tree: changes,
    })) as { sha: string };
    const commit = (await api(token, "git/commits", "POST", {
      message: `Update article ${name} via admin`,
      tree: tree.sha,
      parents: [snapshot.head],
    })) as { sha: string };
    await api(token, "git/refs/heads/main", "PATCH", {
      sha: commit.sha,
      force: false,
    });
    return json({ ok: true, sha: article.sha, commit: commit.sha });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "保存に失敗しました。",
      },
      error instanceof GithubFailure ? error.status : 400,
    );
  }
}
export async function articleImages(
  token: string | undefined,
  name: string | null,
  image: string | null,
): Promise<Response> {
  if (!token) return json({ error: "記事管理は現在利用できません。" }, 500);
  if (
    !name ||
    !isValidArticleFilename(name) ||
    (image &&
      (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(png|jpe?g|webp|gif|svg)$/i.test(image) ||
        image.includes("..")))
  )
    return json({ error: "画像の指定が不正です。" }, 400);
  try {
    const snapshot = await treeAt(token),
      prefix = `src/content/blog-assets/${name.slice(0, -3)}/`;
    const images = snapshot.entries.filter(
      (e) =>
        e.type === "blob" &&
        e.path.startsWith(prefix) &&
        !e.path.slice(prefix.length).includes("/") &&
        /\.(png|jpe?g|webp|gif|svg)$/i.test(e.path),
    );
    if (!image)
      return json({
        images: images.map((e) => ({
          name: e.path.slice(prefix.length),
          sha: e.sha,
          url: assetUrl(name, e.path.slice(prefix.length)),
        })),
      });
    const entry = images.find((e) => e.path === prefix + image);
    if (!entry) return json({ error: "画像が見つかりません。" }, 404);
    const extension = image.split(".").at(-1)!.toLowerCase();
    return new Response(await blob(token, entry.sha), {
      headers: {
        "Content-Type":
          extension === "svg"
            ? "image/svg+xml"
            : `image/${extension.replace("jpg", "jpeg")}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return json(
      { error: "画像を読み込めませんでした。再試行してください。" },
      502,
    );
  }
}
