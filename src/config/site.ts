export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk Industries",
  tagline: "未来を精緻化する / Refining the Future",
  description:
    "MegaDrawk Industries は、法務、経営、そして最先端のテクノロジーを融合させ、ミッションクリティカルな業務におけるレジリエンスと生産性を極限まで高めるための次世代プラットフォームを提供しています。私たちは、不確実な未来をデータと論理で精緻化し、確かな意思決定を支える基盤を構築します。",
  baseDomain: "megadrawk.com",
} as const;

export const UI_TEXT = {
  heroHeadline: "レジリエントな未来基盤を構築する。",
  heroSubheadline: "ミッションクリティカルな業務を支える、法務とオペレーションの中核プラットフォーム。データ、論理、そして確信をその手に。",
  eyebrow: "エンタープライズ・エコシステム",
  operationalRigor: "運用の厳格性 24/7",
  servicesHeading: "ソリューション / Solutions",
  servicesSubheading: "2つのフラッグシップが、企業の知を統合し、次世代の業務基盤を形作ります。",

  // Mission Section
  missionHeading: "私たちの使命 / Our Mission",
  missionText: "MegaDrawk Industries の使命は、複雑化する社会における「情報の不確実性」を最小化することです。法的整合性、迅速な意思決定、持続可能なオペレーション。これら三位一体の調和を、高度なシステムデザインを通じて実現します。私たちは単なるソフトウェア提供者ではなく、企業のレジリエンスを強化する戦略的パートナーです。",

  // Technology Section
  techHeading: "コア・テクノロジー / Core Technology",
  techSubheading: "妥協のない技術選定が、圧倒的な信頼性を生みます。",
  techFocus1: "リアルタイム・エンジニアリング",
  techFocus1Desc: "ミリ秒単位の精度が求められる意思決定の現場において、遅延のないデータ処理と同期を実現します。",
  techFocus2: "堅牢なセキュリティ",
  techFocus2Desc: "金融機関レベルの暗号化とアクセスコントロールにより、企業の最重要資産である「知」を守り抜きます。",
  techFocus3: "AIと人間知能の調和",
  techFocus3Desc: "高度な言語処理エンジンと人間の直感を融合させ、ノイズを排除した有益なインサイトを提供します。",

  // Privacy & Compliance
  privacyHeading: "法的開示とポリシー / Compliance",
  privacySubheading: "当サイトは、透明性と誠実な対話を重視し、適切な情報公開を行っています。",
  footerPrivacy: "プライバシーポリシー",
  footerContact: "お問い合わせ",
  footerSuffix: "All rights reserved.",
} as const;

export const SERVICES = [
  {
    name: "MeetPicks",
    subdomain: "meetpicks.megadrawk.com",
    description: "高度な意思決定を支える、次世代ミーティング管理プラットフォーム。会議の前後・最中におけるあらゆる情報を統合し、決定事項とその背景にある「文脈」を自動的に構造化します。組織の意思決定スピードを劇的に加速させる、知のエンジニアリングツールです。",
    url: "http://meetpicks.megadrawk.com",
    iconUrl: "http://meetpicks.megadrawk.com/icon.png",
  },
  {
    name: "LawDrawk",
    subdomain: "lawdrawk.com",
    description: "法務プロフェッショナルのための、堅牢なワークフロー支援システム。条文、判例、そして社内規定の膨大な海から最適解を導き出します。法的リスクの可視化から契約管理まで、法務部門のDX（デジタルトランスフォーメーション）をトータルで支える中核システムです。",
    url: "https://lawdrawk.com",
    iconUrl: "https://lawdrawk.com/icon.svg",
  },
] as const;

export type Service = (typeof SERVICES)[number];
