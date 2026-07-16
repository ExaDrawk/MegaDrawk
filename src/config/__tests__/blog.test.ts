import { describe, it, expect } from "vitest";
import {
  createBlogPost,
  getLatestBlogUpdateDate,
  getPublishedBlogPosts,
} from "../blog";

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
    expect(post.updatedAt).toBe(post.date);
    expect(post.tags).toEqual([]);
  });

  it("should sanitize the title for the slug", () => {
    const post = createBlogPost({
      title: "  Hello?! World_ 2026  ",
      body: "body",
    });
    expect(post.id).toBe("hello-world-2026");
  });

  it("should keep non-latin tags while creating a post", () => {
    const post = createBlogPost({
      title: "Tagged",
      body: "body",
      tags: ["制作メモ", "展示"],
    });

    expect(post.tags).toEqual(["制作メモ", "展示"]);
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

describe("blog helpers", () => {
  it("returns published blog posts as an array", () => {
    expect(Array.isArray(getPublishedBlogPosts())).toBe(true);
  });

  it("returns null as the latest update when no posts exist", () => {
    expect(getLatestBlogUpdateDate()).toBeNull();
  });
});
