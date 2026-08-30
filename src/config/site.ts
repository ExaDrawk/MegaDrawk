/** サイト全体の基本設定（単一の権威ある情報源） */
export const SITE = {
  name: "MEGADRAWK",
  ownerName: "Drawk",
  tagline: "",
  description: "Drawkが運営するMEGADRAWK。作品と活動記録をまとめたサイト。",
  heroCopy: "大学生のDrawkが、日々の制作と学びを記録しています。",
  domain: "megadrawk.com",
  url: "https://megadrawk.com",
  locale: "ja_JP",
  language: "ja",
  themeColor: "#f5f6f8",
  keywords: ["MEGADRAWK", "Drawk", "ブログ", "ポートフォリオ", "制作記録"],
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
