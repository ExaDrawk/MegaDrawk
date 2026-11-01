import { isMap, isScalar, parseDocument } from "yaml";

export function isValidArticleFilename(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]*\.md$/.test(name);
}

function frontmatter(markdown: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw new Error("記事の先頭に設定（frontmatter）が必要です。");
  const document = parseDocument(match[1]!);
  if (document.errors.length || !isMap(document.contents)) {
    throw new Error(
      "記事の設定を読み取れません。YAMLの書式を確認してください。",
    );
  }
  const draft = document.get("draft");
  if (draft !== undefined && typeof draft !== "boolean") {
    throw new Error("draftにはtrueまたはfalseを指定してください。");
  }
  return {
    document,
    draft: draft === true,
    yaml: match[1]!,
    start: markdown.indexOf("\n") + 1,
  };
}

export function readArticleDraft(markdown: string): boolean {
  return frontmatter(markdown).draft;
}

export interface ArticleMetadata {
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly updatedAt: string | null;
  readonly tags: readonly string[];
  readonly draft: boolean;
}

/** 管理画面の一覧用にfrontmatterを読み取る。不正な記事は呼び出し側で隔離する。 */
export function readArticleMeta(markdown: string): ArticleMetadata {
  const { document, draft } = frontmatter(markdown);
  const data = document.toJS() as Record<string, unknown> | null;
  if (!data || typeof data !== "object")
    throw new Error("記事の設定を読み取れません。");
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const date = typeof data.date === "string" ? data.date : "";
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : null;
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  if (!title) throw new Error("記事のタイトルがありません。");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("記事の日付が正しくありません。");
  return { title, description, date, updatedAt, tags, draft };
}

/** YAMLとして更新し、本文・他の設定・コメントを保持する。 */
export function setArticleDraft(markdown: string, draft: boolean): string {
  const { document, yaml, start } = frontmatter(markdown);
  const node = document.get("draft", true);
  if (isScalar(node) && node.range) {
    return (
      markdown.slice(0, start + node.range[0]) +
      String(draft) +
      markdown.slice(start + node.range[1])
    );
  }
  const newline = markdown.includes("\r\n") ? "\r\n" : "\n";
  return (
    markdown.slice(0, start + yaml.length) +
    `${newline}draft: ${draft}` +
    markdown.slice(start + yaml.length)
  );
}
