import { useMemo } from "react";
import { markdownToPreview } from "@/lib/markdownPreview";

/**
 * Markdownのライブプレビュー。frontmatterからタイトルを取り除き、
 * 本文をサイトの記事スタイル（prose-content）で描画する。
 */
export function MarkdownPreview({
  markdown,
  titleOverride,
}: {
  markdown: string;
  /** frontmatterより優先して表示するタイトル（草案エディター等で使用） */
  titleOverride?: string;
}) {
  const preview = useMemo(() => markdownToPreview(markdown), [markdown]);
  const title = titleOverride ?? preview.title;
  return (
    <div aria-label="プレビュー">
      <h2 className="page-title text-2xl sm:text-3xl">{title}</h2>
      {preview.draft && (
        <p className="mt-2 text-xs font-semibold" data-color="color-primary">
          （下書き）
        </p>
      )}
      <div
        className="prose-content mt-4"
        // 管理者自身の執筆内容であり、sanitizeHtmlで実行可能要素を除去済み。
        // さらにサイトのCSP（script-src-attr 'none'等）が二重防御として機能する。
        dangerouslySetInnerHTML={{ __html: preview.html }}
      />
    </div>
  );
}
