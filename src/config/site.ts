/**
 * Site-wide configuration — single source of truth.
 *
 * Referenced by:
 * - middleware.ts  → CSP allowed origins
 * - layout.tsx     → Metadata, OGP, JSON-LD
 * - sitemap.ts     → Sitemap generation
 * - robots.ts      → robots.txt generation
 * - manifest.ts    → PWA manifest
 * - page.tsx       → UI rendering
 *
 * All URLs, domain names, and branding text MUST originate here.
 */
export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk",
  tagline: "統合ユーティリティプラットフォーム",
  description: "MegaDrawkは高性能なユーティリティスイートです。",
  domain: "megadrawk.com",
  url: "https://megadrawk.com",
  locale: "ja_JP",
  language: "ja",
  themeColor: "#0f172a",
} as const;

export const SERVICES = [
  {
    id: "meetpicks",
    name: "MeetPicks",
    subdomain: "meetpicks.megadrawk.com",
    url: "https://meetpicks.megadrawk.com",
    description:
      "次世代の会議アーキテクチャプラットフォーム。意思決定コンテキストと組織インテリジェンスを精密に構築。",
  },
] as const;

export type Service = (typeof SERVICES)[number];
export type SiteConfig = typeof SITE;
