import { describe, expect, it } from "vitest";
import { markdownToPreview, sanitizeHtml } from "../src/lib/markdownPreview";

describe("markdownToPreview", () => {
  it("splits frontmatter and renders the body", () => {
    const preview = markdownToPreview(
      '---\ntitle: "テスト記事"\ndescription: "要約"\ndate: "2026-10-26"\n---\n\n## 見出し\n\n本文です。',
    );
    expect(preview.title).toBe("テスト記事");
    expect(preview.html).toContain("<h2>見出し</h2>");
    expect(preview.html).toContain("本文です。");
    expect(preview.html).not.toContain("title:");
    expect(preview.draft).toBe(false);
  });

  it("detects the draft flag", () => {
    const preview = markdownToPreview(
      '---\ntitle: "下書き"\ndescription: "要約"\ndraft: true\n---\n\n本文',
    );
    expect(preview.draft).toBe(true);
  });

  it("falls back to 無題 when the title is missing", () => {
    const preview = markdownToPreview("frontmatter無しの本文");
    expect(preview.title).toBe("無題");
    expect(preview.html).toContain("frontmatter無しの本文");
  });
});

describe("sanitizeHtml", () => {
  it("strips script elements", () => {
    expect(sanitizeHtml("<p>ok</p><script>alert(1)</script>")).not.toContain(
      "script",
    );
    expect(sanitizeHtml("<p>ok</p><script>alert(1)</script>")).toContain("ok");
  });

  it("strips inline event handler attributes", () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain(
      "onerror",
    );
  });

  it("strips javascript: URIs", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain(
      "javascript:",
    );
  });
});
