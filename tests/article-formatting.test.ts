import { readFileSync } from "node:fs";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { describe, expect, it } from "vitest";
import { markdownToPreview } from "../src/lib/markdownPreview";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";

describe("skin article Japanese emphasis", () => {
  it("renders settings labels as bold in both preview and production", async () => {
    const source = readFileSync(
      "src/content/blog/2026-10-26-tjapocket-skin-import.md",
      "utf8",
    );
    const processor = await createMarkdownProcessor({
      remarkPlugins: [remarkCjkFriendly],
    });
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
    for (const html of [
      markdownToPreview(source).html,
      (await processor.render(body)).code,
    ]) {
      expect(html).toContain("<strong>「外観」→「スキン」</strong>");
      expect(html).not.toContain("**");
    }
  });
});

describe("Japanese emphasis without surrounding spaces", () => {
  const cases = [
    [
      "設定へ戻り、**「外観」→「スキン」**を開いて",
      "<strong>「外観」→「スキン」</strong>",
    ],
    [
      "**「外観」→「フォント」**で選ぶ",
      "<strong>「外観」→「フォント」</strong>",
    ],
    ["これは**太字です。**続けて書けます。", "<strong>太字です。</strong>"],
    ["前**（括弧付き）**後", "<strong>（括弧付き）</strong>"],
    ["前**太字と*斜体*。**後", "<strong>太字と<em>斜体</em>。</strong>"],
    [
      "前**[リンク](https://example.com)**後",
      '<strong><a href="https://example.com">リンク</a></strong>',
    ],
  ];
  it.each(cases)("renders %s consistently", async (source, expected) => {
    const processor = await createMarkdownProcessor({
      remarkPlugins: [remarkCjkFriendly],
    });
    for (const html of [
      markdownToPreview(source!).html,
      (await processor.render(source!)).code,
    ]) {
      expect(html).toContain(expected);
      expect(html).not.toContain("**");
    }
  });
  it("preserves code, escapes and ordinary English emphasis", async () => {
    const source =
      "`**「外観」**を`\n\n```text\n**「外観」**を\n```\n\n\\*\\*「外観」\\*\\*を\n\n**English** text";
    const processor = await createMarkdownProcessor({
      remarkPlugins: [remarkCjkFriendly],
      syntaxHighlight: false,
    });
    for (const html of [
      markdownToPreview(source).html,
      (await processor.render(source)).code,
    ]) {
      expect(html).toContain("<code>**「外観」**を</code>");
      expect(html).toContain("**「外観」**を\n</code>");
      expect(html).toContain("<p>**「外観」**を</p>");
      expect(html).toContain("<strong>English</strong> text");
    }
  });
});
