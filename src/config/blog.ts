/** ブログ記事データ型 */
export interface BlogPost {
  readonly id: string;
  readonly title: string;
  readonly body?: string;
  readonly excerpt: string;
  readonly date: string;
  readonly tags: readonly string[];
}

interface BlogPostInput {
  readonly title: string;
  readonly body: string;
  readonly tags?: readonly string[];
  readonly date?: string;
}

function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * 最小入力で記事を作るためのヘルパー。
 * title/body があれば公開できる。
 */
export function createBlogPost(input: BlogPostInput): BlogPost {
  const normalizedTitle = input.title.trim();
  const normalizedBody = input.body.trim();

  if (!normalizedTitle) {
    throw new Error("Blog post title is required.");
  }

  if (!normalizedBody) {
    throw new Error("Blog post body is required.");
  }

  return {
    id: createSlug(normalizedTitle) || `post-${Date.now()}`,
    title: normalizedTitle,
    body: normalizedBody,
    excerpt: normalizedBody.slice(0, 120),
    date: input.date ?? new Date().toISOString().slice(0, 10),
    tags: input.tags ?? [],
  };
}

/**
 * ブログ記事一覧
 * いったん全記事をリセット。以下のテンプレを複製して追加してください。
 *
 * createBlogPost({
 *   title: "記事タイトル",
 *   body: "本文。まずは短文でOK。",
 *   tags: ["メモ"],
 * })
 */
export const BLOG_POSTS: readonly BlogPost[] = [] as const;
