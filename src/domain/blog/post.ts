const EXCERPT_LENGTH = 120;

export interface BlogPost {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly excerpt: string;
  readonly date: string;
  readonly updatedAt: string;
  readonly tags: readonly string[];
}

export interface BlogPostInput {
  readonly title: string;
  readonly body: string;
  readonly tags?: readonly string[];
  readonly date?: string;
  readonly updatedAt?: string;
}

export function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createBlogPost(input: BlogPostInput): BlogPost {
  const normalizedTitle = input.title.trim();
  const normalizedBody = input.body.trim();

  if (!normalizedTitle) {
    throw new Error("Blog post title is required.");
  }

  if (!normalizedBody) {
    throw new Error("Blog post body is required.");
  }

  const publishedAt = input.date ?? new Date().toISOString().slice(0, 10);

  return {
    id: createSlug(normalizedTitle) || `post-${Date.now()}`,
    title: normalizedTitle,
    body: normalizedBody,
    excerpt: normalizedBody.slice(0, EXCERPT_LENGTH),
    date: publishedAt,
    updatedAt: input.updatedAt ?? publishedAt,
    tags: input.tags ?? [],
  };
}
