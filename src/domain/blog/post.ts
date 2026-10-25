/** ブログ記事のドメインモデル。Content Collectionsのエントリをこの形へ写像する。 */
export interface BlogPost {
  /** URLスラッグ（ファイル名から生成される） */
  readonly id: string;
  readonly title: string;
  /** 記事の要約。一覧・SNSカード・RSSに使う（frontmatterで明示する） */
  readonly description: string;
  /** YYYY-MM-DD */
  readonly date: string;
  readonly updatedAt: string;
  readonly tags: readonly string[];
  readonly draft: boolean;
  /** Markdown本文（生テキスト） */
  readonly body: string;
  /** 本文から算出した読了時間（分） */
  readonly readingMinutes: number;
}

const SLUG_FORBIDDEN = /[^a-z0-9\s-]/g;

/** 記事ファイル名（URLスラッグ）を生成する。英数字以外は落とし、空になった場合はdateベースのフォールバックを推奨する。 */
export function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(SLUG_FORBIDDEN, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
