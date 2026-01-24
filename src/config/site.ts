export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk Industries",
  tagline: "未来を精緻化する",
  description:
    "MegaDrawk Industries 公式ポータル。未来を精緻化する最先端システム。",
  baseDomain: "megadrawk.com",
} as const;

export const UI_TEXT = {
  heroHeadline: "レジリエントな未来基盤を構築する。",
  heroSubheadline: "ミッションクリティカルな業務を支える、法務とオペレーションの中核プラットフォーム。",
  eyebrow: "エンタープライズ・エコシステム",
  operationalRigor: "運用の厳格性",
  servicesHeading: "ソリューション",
  servicesSubheading: "2つのフラッグシップが、次世代の業務基盤を形作ります。",
  privacyHeading: "広告配信とCookieについて",
  privacySubheading: "Google AdSense の要件に基づく最低限の開示を記載しています。",
  footerPrivacy: "プライバシーポリシー",
  footerContact: "お問い合わせ",
  footerSuffix: "All rights reserved.",
} as const;

export const SERVICES = [
  {
    name: "MeetPicks",
    subdomain: "meetpicks.megadrawk.com",
    description: "高度な意思決定を支える、次世代ミーティング管理プラットフォーム。",
    url: "http://meetpicks.megadrawk.com",
    iconUrl: "http://meetpicks.megadrawk.com/icon.png",
  },
  {
    name: "LawDrawk",
    subdomain: "lawdrawk.com",
    description: "法務プロフェッショナルのための、堅牢なワークフロー支援システム。",
    url: "https://lawdrawk.com",
    iconUrl: "https://lawdrawk.com/icon.svg",
  },
] as const;

export type Service = (typeof SERVICES)[number];

