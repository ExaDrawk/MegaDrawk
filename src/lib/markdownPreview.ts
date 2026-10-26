import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export interface MarkdownPreviewData {
  /** frontmatterのtitle。無ければ「無題」 */
  title: string;
  /** レンダリング済み（サニタイズ済み）の本文HTML */
  html: string;
  /** frontmatterにdraft: trueがあるか */
  draft: boolean;
}

/**
 * 記事のMarkdownをプレビュー用HTMLへ変換する（管理画面のプレビュー専用）。
 * - frontmatter（title / draft）を分離して表示に使う
 * - script要素・インラインイベント属性・javascript: URIを除去する
 *   （管理画面は厳格CSP＋パスワードゲート内だが、二重防御として残す）
 */
export function markdownToPreview(markdown: string): MarkdownPreviewData {
  const { frontmatter, body } = splitFrontmatter(markdown);
  const title = extractString(frontmatter, "title") ?? "無題";
  const draft = extractString(frontmatter, "draft") === "true";
  const rawHtml = marked.parse(body, { async: false }) as string;
  return { title, html: sanitizeHtml(rawHtml), draft };
}

function splitFrontmatter(markdown: string): {
  frontmatter: string;
  body: string;
} {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: "", body: markdown };
  }
  return { frontmatter: match[1] ?? "", body: markdown.slice(match[0].length) };
}

function extractString(frontmatter: string, key: string): string | null {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) return null;
  return (match[1] ?? "").trim().replace(/^["']|["']$/g, "");
}

/** プレビューHTMLから実行可能な要素を除去する（管理プレビュー専用の簡易サニタイザ）。 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}
