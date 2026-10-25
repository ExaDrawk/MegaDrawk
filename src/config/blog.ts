import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import {
  calculateReadingMinutes,
  countTags,
  pickAdjacentPosts,
  pickRelatedPosts,
} from "@/lib/blogUtils";
import type { BlogPost } from "@/domain/blog/post";

/**
 * Content Collections（src/content/blog/*.md）とドメインモデルの仲介層。
 * astro:contentはAstroの実行環境でのみ解決されるため、このモジュールは
 * .astroページとエンドポイントからのみimportする（Reactコンポーネントにはpropsで渡す）。
 */

export type BlogEntry = CollectionEntry<"blog">;

/** コレクションのエントリをドメインモデルへ写像する。 */
export function toBlogPost(entry: BlogEntry): BlogPost {
  const body = entry.body ?? "";
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    updatedAt: entry.data.updatedAt ?? entry.data.date,
    tags: entry.data.tags,
    draft: entry.data.draft,
    body,
    readingMinutes: calculateReadingMinutes(body),
  };
}

function compareByDateDesc(left: BlogPost, right: BlogPost): number {
  return right.date.localeCompare(left.date) || left.id.localeCompare(right.id);
}

async function loadEntries(): Promise<readonly BlogEntry[]> {
  // 下書きは開発サーバーでのみ表示する（本番・RSS・サイトマップには出ない）
  return getCollection("blog", (entry) =>
    import.meta.env.DEV ? true : !entry.data.draft,
  );
}

/** 公開対象のエントリ（本番では下書きを除く）。 */
export async function getPublishedBlogEntries(): Promise<readonly BlogEntry[]> {
  return loadEntries();
}

/** 公開中の記事を新しい日付順で返す。 */
export async function getPublishedBlogPosts(): Promise<readonly BlogPost[]> {
  const entries = await loadEntries();
  return entries.map(toBlogPost).sort(compareByDateDesc);
}

/** 前後の記事（newer=より新しい、older=より古い）。 */
export async function getAdjacentPosts(id: string): Promise<{
  newer: BlogPost | null;
  older: BlogPost | null;
}> {
  return pickAdjacentPosts(id, await getPublishedBlogPosts());
}

/** 同じタグを持つ関連記事（自分を除く）。 */
export async function getRelatedPosts(
  current: BlogPost,
  limit = 3,
): Promise<readonly BlogPost[]> {
  return pickRelatedPosts(current, await getPublishedBlogPosts(), limit);
}

/** タグと記事数の一覧（記事数の多い順）。 */
export async function getBlogTagCounts(): Promise<
  ReadonlyArray<{ tag: string; count: number }>
> {
  return countTags(await getPublishedBlogPosts());
}

/** 記事の最終更新日（記事のupdatedAtの最大値）。 */
export async function getLatestBlogUpdateDate(): Promise<string | null> {
  const posts = await getPublishedBlogPosts();
  return posts[0]?.updatedAt ?? null;
}
