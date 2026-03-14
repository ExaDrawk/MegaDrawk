/** 作品カテゴリ */
export type WorkCategory = "diorama" | "digital";

/** 作品データ型 */
export interface WorkItem {
  readonly id: string;
  readonly category: WorkCategory;
  readonly title: string;
  readonly description: string;
  readonly tools?: readonly string[];
  readonly imageAlt: string;
  readonly comingSoon?: boolean;
}

/** カテゴリラベル */
export const WORK_CATEGORIES: Record<WorkCategory, string> = {
  diorama: "Diorama",
  digital: "Digital Experiments",
} as const;

/**
 * 作品一覧
 * ※ ジオラマの具体的なタイトル・賞歴は本人が公開するまで創作禁止。
 *   プレースホルダーとして「準備中」の枠を用意。
 */
export const WORKS: readonly WorkItem[] = [
  {
    id: "diorama-1",
    category: "diorama",
    title: "作品準備中",
    description: "手のひらサイズのミニチュア世界。詳細は近日公開予定です。",
    imageAlt: "ジオラマ作品1",
    comingSoon: true,
  },
  {
    id: "diorama-2",
    category: "diorama",
    title: "作品準備中",
    description: "手のひらサイズのミニチュア世界。詳細は近日公開予定です。",
    imageAlt: "ジオラマ作品2",
    comingSoon: true,
  },
  {
    id: "diorama-3",
    category: "diorama",
    title: "作品準備中",
    description: "手のひらサイズのミニチュア世界。詳細は近日公開予定です。",
    imageAlt: "ジオラマ作品3",
    comingSoon: true,
  },
  {
    id: "digital-svg",
    category: "digital",
    title: "PNG→SVG変換実験",
    description:
      "Gemini 3.1 Pro / Flashを使用してPNG画像をSVG形式に変換する実験。",
    tools: ["Gemini 3.1 Pro", "Gemini 3.1 Flash"],
    imageAlt: "PNG to SVG conversion experiment",
    comingSoon: false,
  },
  {
    id: "digital-quiver",
    category: "digital",
    title: "quiver arrow 1.0 テスト",
    description:
      "quiver arrow 1.0のSVG単独性能テスト。非常に優れた結果を確認。",
    tools: ["quiver arrow 1.0"],
    imageAlt: "quiver arrow SVG performance test",
    comingSoon: false,
  },
] as const;
