import { describe, it, expect } from "vitest";
import { createBlogPost } from "../blog";

describe("createBlogPost", () => {
  it("should create a blog post with minimum input", () => {
    const post = createBlogPost({
      title: "Test Title",
      body: "This is a test body.",
    });

    expect(post.title).toBe("Test Title");
    expect(post.body).toBe("This is a test body.");
    expect(post.id).toBe("test-title");
    expect(post.excerpt).toBe("This is a test body.");
    expect(post.date).toBeTypeOf("string");
    expect(post.tags).toEqual([]);
  });

  it("should sanitize the title for the slug", () => {
    const post = createBlogPost({
      title: "  Hello?! World_ 2026  ",
      body: "body",
    });
    expect(post.id).toBe("hello-world-2026");
  });

  it("should throw an error if title is empty", () => {
    expect(() =>
      createBlogPost({ title: "   ", body: "body" })
    ).toThrowError("Blog post title is required.");
  });

  it("should throw an error if body is empty", () => {
    expect(() =>
      createBlogPost({ title: "title", body: "   " })
    ).toThrowError("Blog post body is required.");
  });
});