/** ブログ記事データ型 */
export interface BlogPost {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
  readonly tags: readonly string[];
}

/**
 * ブログ記事一覧（事実ベースのタイトルのみ）
 * ※ 創作禁止。本人の実際の活動に基づくテーマのみ。
 */
export const BLOG_POSTS: readonly BlogPost[] = [
  {
    id: "unity-first-try",
    title: "Unityを初めて触ってみた",
    excerpt:
      "2026年3月、初めてUnityを使ってみた記録。ゲームエンジンの第一印象と学んだこと。",
    date: "2026-03-01",
    tags: ["Unity", "学習記録"],
  },
  {
    id: "kimi-k25-free",
    title: "Kimi K2.5が無料になったので試してみた",
    excerpt:
      "KiloCodeでKimi K2.5を無料で使用。MiniMaxより安定していると感じた使用感をまとめます。",
    date: "2026-02-28",
    tags: ["AI", "Kimi K2.5"],
  },
  {
    id: "gemini-png-svg",
    title: "GeminiでPNGをSVGに変換する実験",
    excerpt:
      "Gemini 3.1 Pro / Flashを使ってPNG画像をSVG形式に変換する実験の結果と考察。",
    date: "2026-02-25",
    tags: ["AI", "Gemini", "SVG"],
  },
  {
    id: "quiver-arrow-test",
    title: "quiver arrow 1.0のSVG性能をテスト",
    excerpt:
      "quiver arrow 1.0のSVG単独性能を検証。非常に優れた結果が出た。",
    date: "2026-02-20",
    tags: ["SVG", "quiver arrow"],
  },
] as const;
