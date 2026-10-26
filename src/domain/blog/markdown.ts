import { isMap, parseDocument } from "yaml";

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
    body: markdown.slice(match[0].length),
  };
}

export function readArticleDraft(markdown: string): boolean {
  return frontmatter(markdown).draft;
}

/** YAMLとして更新し、本文・他の設定・コメントを保持する。 */
export function setArticleDraft(markdown: string, draft: boolean): string {
  const { document, body } = frontmatter(markdown);
  document.set("draft", draft);
  return `---\n${document.toString()}---\n${body}`;
}
