import { createSlug } from "@/domain/blog/post";

export interface BlogPostDraftInput {
  readonly title: string;
  /** 記事の要約。一覧・SNSカード・RSSに使うため必須。 */
  readonly description: string;
  /** Markdown本文 */
  readonly body: string;
  readonly tags: string;
  readonly date: string;
  readonly updatedAt: string;
  readonly draft: boolean;
}

export interface BlogPostDraftResult {
  /** src/content/blog/ に保存するファイル名 */
  readonly filename: string;
  /** 生成されたMarkdown（フロントマター＋本文） */
  readonly markdown: string;
  readonly slug: string;
  readonly tagList: readonly string[];
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

/** YAMLのダブルクォート形式はJSON文字列リテラルと互換するためJSON.stringifyで安全にエスケープする。 */
function yamlQuoted(value: string): string {
  return JSON.stringify(value);
}

export function buildBlogPostDraft(
  input: BlogPostDraftInput,
): BlogPostDraftResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const body = input.body.trim();
  const tagList = parseTags(input.tags);
  const date = input.date.trim() || undefined;
  const updatedAt = normalizeOptionalDate(input.updatedAt);

  if (!title) throw new Error("Title is required.");
  if (!description) throw new Error("Description is required.");
  if (!body) throw new Error("Body is required.");
  if (updatedAt && date && updatedAt < date) {
    throw new Error("Updated date must be on or after the publish date.");
  }

  const slug = createSlug(title) || `post-${date ?? "draft"}`;
  const frontmatterLines = [
    "---",
    `title: ${yamlQuoted(title)}`,
    `description: ${yamlQuoted(description)}`,
    ...(date ? [`date: ${yamlQuoted(date)}`] : []),
    ...(updatedAt && updatedAt !== date
      ? [`updatedAt: ${yamlQuoted(updatedAt)}`]
      : []),
    ...(tagList.length > 0
      ? [`tags: [${tagList.map((tag) => yamlQuoted(tag)).join(", ")}]`]
      : []),
    ...(input.draft ? ["draft: true"] : []),
    "---",
  ];

  return {
    filename: `${slug}.md`,
    slug,
    tagList,
    markdown: `${frontmatterLines.join("\n")}\n\n${body}\n`,
  };
}

export function getInitialBlogPostDraftInput(): BlogPostDraftInput {
  return {
    title: "",
    description: "",
    body: "",
    tags: "",
    date: new Date().toISOString().slice(0, 10),
    updatedAt: "",
    draft: false,
  };
}

export function isBlogPostDraftInput(
  candidate: unknown,
): candidate is BlogPostDraftInput {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const value = candidate as Record<string, unknown>;

  return (
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.body === "string" &&
    typeof value.tags === "string" &&
    typeof value.date === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.draft === "boolean"
  );
}

export function isStoredBlogPostDraft(
  candidate: unknown,
): candidate is StoredBlogPostDraft {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const value = candidate as Record<string, unknown>;

  return (
    isBlogPostDraftInput(value.draft) &&
    typeof value.savedAt === "string" &&
    Number.isFinite(Date.parse(value.savedAt))
  );
}
