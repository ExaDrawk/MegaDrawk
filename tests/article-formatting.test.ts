import { readFileSync } from "node:fs";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { describe, expect, it } from "vitest";
import { markdownToPreview } from "../src/lib/markdownPreview";

describe("skin article Japanese emphasis", () => {
  it("renders settings labels as bold in both preview and production", async () => {
    const source = readFileSync(
      "src/content/blog/2026-10-26-tjapocket-skin-import.md",
      "utf8",
    );
    const processor = await createMarkdownProcessor();
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
    for (const html of [
      markdownToPreview(source).html,
      (await processor.render(body)).code,
    ]) {
      expect(html).toContain("<strong>「外観」→「スキン」</strong>");
      expect(html).toContain("<strong>「外観」→「フォント」</strong>");
      expect(html).not.toContain("**");
    }
  });
});
