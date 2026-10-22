import type { BlogPost } from "@/domain/blog/post";

export { createBlogPost } from "@/domain/blog/post";

/**
 * ブログ記事一覧
 * いったん全記事をリセット。以下のテンプレを複製して追加してください。
 *
 * createBlogPost({
 *   title: "記事タイトル",
 *   body: "本文。まずは短文でOK。",
 *   tags: ["メモ"],
 *   date: "2026-03-15",
 * })
 */
export const BLOG_POSTS: readonly BlogPost[] = [] as const;

export function getPublishedBlogPosts(): readonly BlogPost[] {
  return [...BLOG_POSTS].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
}

export function getLatestBlogUpdateDate(): string | null {
  const latestPost = getPublishedBlogPosts()[0];
  return latestPost ? latestPost.updatedAt : null;
}
