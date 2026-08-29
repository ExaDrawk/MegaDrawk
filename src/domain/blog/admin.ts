import { createBlogPost, type BlogPost, type BlogPostInput } from "@/domain/blog/post";

export interface BlogPostDraftInput {
  readonly title: string;
  readonly body: string;
  readonly tags: string;
  readonly date: string;
  readonly updatedAt: string;
}

export interface BlogPostDraftResult {
  readonly post: BlogPost;
  readonly code: string;
  readonly normalizedInput: BlogPostInput;
}

export interface StoredBlogPostDraft {
  readonly draft: BlogPostDraftInput;
  readonly savedAt: string;
}

function parseTags(rawTags: string): readonly string[] {
  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return [...new Set(tags)];
}

function normalizeOptionalDate(rawDate: string): string | undefined {
  const trimmed = rawDate.trim();
  return trimmed || undefined;
}

function escapeMultilineString(value: string): string {
  return JSON.stringify(value);
}

export function buildBlogPostDraft(input: BlogPostDraftInput): BlogPostDraftResult {
  const normalizedInput: BlogPostInput = {
    title: input.title.trim(),
    body: input.body.trim(),
    tags: parseTags(input.tags),
    date: normalizeOptionalDate(input.date),
    updatedAt: normalizeOptionalDate(input.updatedAt),
  };

  if (
    normalizedInput.updatedAt &&
    normalizedInput.date &&
    normalizedInput.updatedAt < normalizedInput.date
  ) {
    throw new Error("Updated date must be on or after the publish date.");
  }

  const post = createBlogPost(normalizedInput);

  const properties = [
    `  title: ${escapeMultilineString(post.title)},`,
    `  body: ${escapeMultilineString(post.body)},`,
    post.tags.length > 0
      ? `  tags: [${post.tags.map((tag) => escapeMultilineString(tag)).join(", ")}],`
      : null,
    normalizedInput.date ? `  date: ${escapeMultilineString(post.date)},` : null,
    normalizedInput.updatedAt && normalizedInput.updatedAt !== post.date
      ? `  updatedAt: ${escapeMultilineString(post.updatedAt)},`
      : null,
  ].filter(Boolean);

  return {
    post,
    normalizedInput,
    code: `createBlogPost({\n${properties.join("\n")}\n})`,
  };
}

export function getInitialBlogPostDraftInput(): BlogPostDraftInput {
  return {
    title: "",
    body: "",
    tags: "",
    date: new Date().toISOString().slice(0, 10),
    updatedAt: "",
  };
}

export function isBlogPostDraftInput(candidate: unknown): candidate is BlogPostDraftInput {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const value = candidate as Record<string, unknown>;

  return (
    typeof value.title === "string" &&
    typeof value.body === "string" &&
    typeof value.tags === "string" &&
    typeof value.date === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function isStoredBlogPostDraft(candidate: unknown): candidate is StoredBlogPostDraft {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const value = candidate as Record<string, unknown>;

  return isBlogPostDraftInput(value.draft) && typeof value.savedAt === "string";
}
