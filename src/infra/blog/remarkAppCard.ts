import { SKIP, visit } from "unist-util-visit";
import type { Parent } from "unist";
import { buildAppCardHtml, APP_TOKEN_PATTERN } from "../../lib/appCard";

/**
 * 記事中の `[app:パッケージID]` のみの行を、アプリ紹介カードへ置換する
 * remarkプラグイン（astro.config の markdown.remarkPlugins に登録して使用）。
 * アプリが見つからないIDは本文のまま残す（誤記に寛容）。
 */
export function remarkAppCard() {
  return (tree: unknown) => {
    visit(
      tree as Parameters<typeof visit>[0],
      "paragraph",
      (node, index, parent) => {
        const parentTyped = parent as Parent | undefined;
        if (!parentTyped || typeof index !== "number") return;
        const children = (
          node as { children?: { type: string; value?: string }[] }
        ).children;
        if (!children || children.length === 0) return;
        const text = children
          .map((child) => (child.type === "text" ? (child.value ?? "") : ""))
          .join("");
        const match = APP_TOKEN_PATTERN.exec(text.trim());
        if (!match) return;
        const html = buildAppCardHtml(match[1] ?? "");
        if (!html) return;
        parentTyped.children.splice(index, 1, {
          type: "html",
          value: html,
        } as never);
        return [SKIP, index];
      },
    );
  };
}
