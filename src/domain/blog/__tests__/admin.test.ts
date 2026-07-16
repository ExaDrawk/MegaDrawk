import { describe, expect, it } from "vitest";
import {
  buildBlogPostDraft,
  getInitialBlogPostDraftInput,
} from "@/domain/blog/admin";

describe("buildBlogPostDraft", () => {
  it("normalizes input and generates createBlogPost code", () => {
    const result = buildBlogPostDraft({
      title: "  Spring Update  ",
      body: "First paragraph.\n\nSecond paragraph.",
      tags: "制作メモ, ジオラマ, 制作メモ",
      date: "2026-03-15",
      updatedAt: "2026-03-16",
    });

    expect(result.post.id).toBe("spring-update");
    expect(result.post.tags).toEqual(["制作メモ", "ジオラマ"]);
    expect(result.code).toContain('title: "Spring Update"');
    expect(result.code).toContain('updatedAt: "2026-03-16"');
  });

  it("throws when updated date is earlier than publish date", () => {
    expect(() =>
      buildBlogPostDraft({
        title: "Title",
        body: "Body",
        tags: "",
        date: "2026-03-15",
        updatedAt: "2026-03-14",
      }),
    ).toThrowError("Updated date must be on or after the publish date.");
  });
});

describe("getInitialBlogPostDraftInput", () => {
  it("returns the expected editable defaults", () => {
    expect(getInitialBlogPostDraftInput()).toEqual({
      title: "",
      body: "",
      tags: "",
      date: expect.any(String),
      updatedAt: "",
    });
  });
});
