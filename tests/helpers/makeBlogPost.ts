import type { BlogPost } from "../../src/domain/blog/post";

/** ブログ記事のテスト用ファクトリ。 */
export function makeBlogPost(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: "post",
    title: "記事",
    description: "要約",
    date: "2026-01-01",
    updatedAt: "2026-01-01",
    tags: [],
    draft: false,
    body: "",
    readingMinutes: 1,
    ...overrides,
  };
}
