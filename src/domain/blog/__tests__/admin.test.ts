import { describe, expect, it } from "vitest";
import {
  buildBlogPostDraft,
  getInitialBlogPostDraftInput,
} from "@/domain/blog/admin";
import { createSlug } from "@/domain/blog/post";

describe("buildBlogPostDraft", () => {
  const baseInput = {
    title: "展示レポート",
    description: "展示の振り返りの要約。",
    body: "## 会場\n\n展示の振り返りです。",
    tags: "展示, レポート, 展示",
    date: "2026-03-15",
    updatedAt: "",
    draft: false,
  };

  it("generates a markdown file with frontmatter and normalized tags", () => {
    const result = buildBlogPostDraft({
      ...baseInput,
      updatedAt: "2026-03-16",
    });

    expect(result.filename).toBe("post-2026-03-15.md");
    expect(result.slug).toBe("post-2026-03-15");
    expect(result.tagList).toEqual(["展示", "レポート"]);
    expect(result.markdown.startsWith("---\n")).toBe(true);
    expect(result.markdown).toContain('title: "展示レポート"');
    expect(result.markdown).toContain('description: "展示の振り返りの要約。"');
    expect(result.markdown).toContain('updatedAt: "2026-03-16"');
    expect(result.markdown).toContain('tags: ["展示", "レポート"]');
    expect(result.markdown).not.toContain("draft: true");
    expect(result.markdown.endsWith("展示の振り返りです。\n")).toBe(true);
  });

  it("includes the draft flag only when requested", () => {
    const result = buildBlogPostDraft({ ...baseInput, draft: true });
    expect(result.markdown).toContain("draft: true");
  });

  it("falls back to a date-based slug when the title has no ascii words", () => {
    const result = buildBlogPostDraft(baseInput);
    expect(result.slug).toBe("post-2026-03-15");
    expect(result.filename).toBe("post-2026-03-15.md");
  });

  it("throws when required fields are missing", () => {
    expect(() => buildBlogPostDraft({ ...baseInput, title: "  " })).toThrow(
      "Title is required.",
    );
    expect(() => buildBlogPostDraft({ ...baseInput, description: "" })).toThrow(
      "Description is required.",
    );
    expect(() => buildBlogPostDraft({ ...baseInput, body: "" })).toThrow(
      "Body is required.",
    );
  });

  it("throws when updated date is earlier than publish date", () => {
    expect(() =>
      buildBlogPostDraft({ ...baseInput, updatedAt: "2026-03-14" }),
    ).toThrow("Updated date must be on or after the publish date.");
  });
});

describe("getInitialBlogPostDraftInput", () => {
  it("returns the expected editable defaults", () => {
    expect(getInitialBlogPostDraftInput()).toEqual({
      title: "",
      description: "",
      body: "",
      tags: "",
      date: expect.any(String),
      updatedAt: "",
      draft: false,
    });
  });
});

describe("createSlug", () => {
  it("normalizes ascii titles into url slugs", () => {
    expect(createSlug("  Hello?! World_ 2026  ")).toBe("hello-world-2026");
  });

  it("returns empty for titles without ascii words (callers fall back)", () => {
    expect(createSlug("日本語のタイトル")).toBe("");
  });
});
