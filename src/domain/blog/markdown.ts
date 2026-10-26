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
