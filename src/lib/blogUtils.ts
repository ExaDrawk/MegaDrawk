import type { BlogPost } from "@/domain/blog/post";

/** 日本語本文の読了速度（文字/分）。コードブロックは熟読時間を考慮して半分の重みにする。 */
const READING_CHARS_PER_MINUTE = 550;
const CODE_CHARS_PER_MINUTE = 1100;
const MINIMUM_MINUTES = 1;

/**
 * Markdown本文から読了時間（分）を算出する。
 * コードブロックとフロントマター風の行を除いた文字数をベースにする。
 */
export function calculateReadingMinutes(markdown: string): number {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, " ");
  const codeMatches = markdown.match(/```[\s\S]*?```/g) ?? [];
  const codeLength = codeMatches.join("").length;
  const proseLength = withoutCode.replace(/\s+/g, "").length;
  const minutes =
    proseLength / READING_CHARS_PER_MINUTE + codeLength / CODE_CHARS_PER_MINUTE;
  return Math.max(MINIMUM_MINUTES, Math.round(minutes));
}

/**
 * 同じタグを持つ記事から関連記事を選ぶ（自分を除く・日付が新しい順）。
 * タグが共通しない記事は含めない。
 */
export function pickRelatedPosts(
  current: BlogPost,
  candidates: readonly BlogPost[],
  limit: number,
): readonly BlogPost[] {
  return candidates
    .filter(
      (post) =>
        post.id !== current.id &&
        post.tags.some((tag) => current.tags.includes(tag)),
    )
    .slice(0, limit);
}

/** タグごとの記事数を数える（新しい日付の記事から先に数える前提の並びは問わない）。 */
export function countTags(
  posts: readonly BlogPost[],
): ReadonlyArray<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 日付順（新しい順）に並んだ記事リストでの前後関係を返す。
 * newer はより新しい記事、older はより古い記事。
 */
export function pickAdjacentPosts(
  currentId: string,
  sortedPosts: readonly BlogPost[],
): { newer: BlogPost | null; older: BlogPost | null } {
  const index = sortedPosts.findIndex((post) => post.id === currentId);
  if (index < 0) return { newer: null, older: null };
  return {
    newer: sortedPosts[index - 1] ?? null,
    older: sortedPosts[index + 1] ?? null,
  };
}
