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
 * - All components → Branding, navigation, content
 *
 * All URLs, domain names, and branding text MUST originate here.
 */
export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk",
  tagline: "統合ユーティリティプラットフォーム",
  description:
    "MegaDrawkは、組織の生産性を飛躍的に向上させる統合ユーティリティプラットフォームです。会議・プロジェクト管理・ナレッジ共有を一つのエコシステムで実現します。",
  domain: "megadrawk.com",
  url: "https://megadrawk.com",
  locale: "ja_JP",
  language: "ja",
  themeColor: "#0f172a",
  contactEmail: "contact@megadrawk.com",
} as const;

/**
 * Navigation links — rendered by SiteHeader and SiteFooter.
 * `href` values use fragment anchors for single-page navigation.
 */
export const NAV_LINKS = [
  { label: "特徴", href: "#features" },
  { label: "サービス", href: "#services" },
  { label: "お問い合わせ", href: "#contact" },
] as const;

/**
 * Child services offered under the MegaDrawk platform.
 * Each entry renders as a ServiceCard on the landing page.
 */
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

/**
 * Platform features displayed in the features grid.
 * Icon names reference lucide-react icon identifiers.
 */
export const FEATURES = [
  {
    id: "security",
    icon: "Shield" as const,
    title: "エンタープライズセキュリティ",
    description:
      "OWASP ASVSに準拠したセキュリティ基盤。多層防御・監査ログ・最小権限を設計レベルで組み込み。",
  },
  {
    id: "integration",
    icon: "Blocks" as const,
    title: "シームレス統合",
    description:
      "各サービスを統一APIで接続。認証・データ連携・ワークフローを1つのプラットフォームで完結。",
  },
  {
    id: "performance",
    icon: "Zap" as const,
    title: "高パフォーマンス",
    description:
      "エッジコンピューティング基盤を採用。グローバルCDNとサーバーレスアーキテクチャで低レイテンシを実現。",
  },
  {
    id: "analytics",
    icon: "BarChart3" as const,
    title: "インサイト分析",
    description:
      "組織全体のデータを可視化。意思決定を加速するリアルタイムダッシュボードとレポーティング。",
  },
  {
    id: "scalability",
    icon: "Globe" as const,
    title: "グローバルスケール",
    description:
      "数千人規模のチームにも対応。マルチリージョン・マルチテナント設計でスケーラビリティを保証。",
  },
  {
    id: "support",
    icon: "HeadphonesIcon" as const,
    title: "専任サポート",
    description:
      "エンタープライズ専任チームが導入から運用まで支援。SLA保証と24時間対応体制。",
  },
] as const;

/**
 * Footer link groups — organized by category.
 */
export const FOOTER_LINKS = {
  platform: {
    label: "プラットフォーム",
    links: [
      { label: "特徴", href: "#features" },
      { label: "サービス", href: "#services" },
      { label: "セキュリティ", href: "#features" },
    ],
  },
  company: {
    label: "企業情報",
    links: [
      { label: "お問い合わせ", href: "#contact" },
    ],
  },
  legal: {
    label: "法的情報",
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "利用規約", href: "/terms" },
    ],
  },
} as const;

export type Service = (typeof SERVICES)[number];
export type Feature = (typeof FEATURES)[number];
export type NavLink = (typeof NAV_LINKS)[number];
export type SiteConfig = typeof SITE;
