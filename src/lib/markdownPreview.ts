import { parseFragment, serialize, type DefaultTreeAdapterMap } from "parse5";
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
export function markdownToPreview(
  markdown: string,
  imageUrls?: Record<string, string>,
): MarkdownPreviewData {
  const { frontmatter, body } = splitFrontmatter(markdown);
  const title = extractString(frontmatter, "title") ?? "無題";
  const draft = extractString(frontmatter, "draft") === "true";
  const rawHtml = marked.parse(body, { async: false }) as string;
  return { title, html: sanitizeHtml(rawHtml, imageUrls), draft };
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
export function sanitizeHtml(
  html: string,
  imageUrls?: Record<string, string>,
): string {
  const fragment = parseFragment(html);
  const allowed = new Set([
    "p",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "em",
    "del",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "pre",
    "code",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "input",
  ]);
  function visit(parent: DefaultTreeAdapterMap["parentNode"]) {
    parent.childNodes = parent.childNodes.filter((node) => {
      if (!("tagName" in node)) return node.nodeName === "#text";
      if (!allowed.has(node.tagName)) return false;
      node.attrs = node.attrs.filter((attr) => {
        if (
          ![
            "href",
            "src",
            "alt",
            "title",
            "class",
            "start",
            "colspan",
            "rowspan",
            "type",
            "checked",
            "disabled",
          ].includes(attr.name)
        )
          return false;
        if (attr.name === "href" || attr.name === "src") {
          const value = attr.value.trim().replace(/[\u0000-\u0020\u007f]/g, "");
          if (
            value.startsWith("//") ||
            !/^(https?:|mailto:|\/|#|[^:]+$)/i.test(value)
          )
            return false;
        }
        return true;
      });
      if (node.tagName === "input")
        node.attrs = [
          { name: "type", value: "checkbox" },
          { name: "disabled", value: "" },
          ...node.attrs.filter((a) => a.name === "checked"),
        ];
      if (node.tagName === "img") {
        const src = node.attrs.find((a) => a.name === "src");
        if (src && imageUrls?.[src.value]) src.value = imageUrls[src.value]!;
      }
      visit(node);
      return true;
    });
  }
  visit(fragment);
  return serialize(fragment);
}
