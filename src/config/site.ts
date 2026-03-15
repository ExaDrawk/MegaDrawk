/** サイト全体の基本設定（単一の権威ある情報源） */
export const SITE = {
  name: "logo.svg",
  ownerName: "Drawk",
  tagline: "大学生 / ジオラマ制作 / テクノロジー",
  description:
    "Drawkが運営するlogo.svg。手のひらサイズのミニチュア世界を制作する大学生の作品と活動記録。",
  domain: "logo.svg.com",
  url: "https://logo.svg.com",
  locale: "ja_JP",
  language: "ja",
  themeColor: "#ffffff",
  social: {
    x: "https://x.com/Drawk1234",
    xHandle: "@Drawk1234",
  },
} as const;

/** ナビゲーションリンク */
const PAGE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const NAV_LINKS = PAGE_LINKS;

/** フッターリンク */
export const FOOTER_LINKS = {
  pages: {
    label: "ページ",
    links: PAGE_LINKS,
  },
  legal: {
    label: "法的情報",
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "利用規約", href: "/terms" },
    ],
  },
} as const;

export type NavLink = (typeof NAV_LINKS)[number];
export type SiteConfig = typeof SITE;
