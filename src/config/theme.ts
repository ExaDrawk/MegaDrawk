/** アニメーション遅延（セクション順序の表現） */
export const STAGGER = {
  header: 0,
  hero: 100,
  section1: 200,
  section2: 300,
  section3: 400,
  footer: 500,
} as const;

/** レイアウトトークン */
export const LAYOUT = {
  maxWidth: "68rem",
  contentWidth: "42rem",
  headerHeight: "4rem",
} as const;
