export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk Industries",
  tagline: "未来を精緻化する",
  description:
    "MegaDrawk Industries は、法務、経営、そして最先端のテクノロジーを融合させ、ミッションクリティカルな業務におけるレジリエンスと生産性を極限まで高めるための次世代プラットフォームを提供しています。私たちは、不確実な未来をデータと論理で精緻化し、確かな意思決定を支える基盤を構築します。",
  baseDomain: "megadrawk.com",
} as const;

export const UI_TEXT = {
  heroHeadline: "レジリエントな未来基盤を構築する。",
  heroSubheadline: "ミッションクリティカルな業務を支える、法務とオペレーションの中核プラットフォーム。データ、論理、そして確信をその手に。",
  eyebrow: "エンタープライズ・エコシステム",
  operationalRigor: "24時間 稼働体制",
  servicesHeading: "ソリューション",
  servicesSubheading: "2つのフラッグシップが、企業の知を統合し、次世代の業務基盤を形作ります。",

  // Mission Section
  missionHeading: "私たちの使命",
  missionText: "MegaDrawk Industries の使命は、複雑化する社会における「情報の不確実性」を最小化することです。法的整合性、迅速な意思決定、持続可能なオペレーション。これら三位一体の調和を、高度なシステムデザインを通じて実現します。私たちは単なるソフトウェア提供者ではなく、企業のレジリエンスを強化する戦略的パートナーです。",

  // Technology Section
  techHeading: "コア・テクノロジー",
  techSubheading: "妥協のない技術選定が、圧倒的な信頼性を生みます。",
  techFocus1: "リアルタイム・エンジニアリング",
  techFocus1Desc: "ミリ秒単位の精度が求められる意思決定の現場において、遅延のないデータ処理と同期を実現します。",
  techFocus2: "堅牢なセキュリティ",
  techFocus2Desc: "金融機関レベルの暗号化とアクセスコントロールにより、企業の最重要資産である「知」を守り抜きます。",
  techFocus3: "AIと人間知能の調和",
  techFocus3Desc: "高度な言語処理エンジンと人間の直感を融合させ、ノイズを排除した有益なインサイトを提供します。",

  // Privacy & Compliance
  privacyHeading: "法的開示とポリシー",
  privacySubheading: "当サイトは、透明性と誠実な対話を重視し、適切な情報公開を行っています。",
  footerPrivacy: "プライバシーポリシー",
  footerContact: "お問い合わせ",
  footerSuffix: "全著作権所有",
} as const;

// 高解像度・堅牢なアイコンデータ（SVG）
const ICONS = {
  meetpicks: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="mp_g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9" />
          <stop offset="100%" style="stop-color:#14b8a6" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="white" />
      <rect width="90" height="90" x="5" y="5" rx="20" fill="url(#mp_g)" />
      <path d="M25 65V35l25 25 25-25v30" stroke="white" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M40 75h20" stroke="white" stroke-width="6" stroke-linecap="round" />
    </svg>
  `)}`,
  lawdrawk: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
      <path d="M 978.5 399 L 664.9806034311366 1222.903890901717 L 920 1222.903890901717 L 875.187416581958 1351.5594482421875 L 468.1507568359375 1351.5594482421875 L 739 639.7893066406251 L 537.5 734 L 978.5 399 Z M 997 697 C 1075.5 698 1311.9921394427276 689.5187519921118 1389.5 702 C 1463.3 713.1999999999999 1519.8 741.6999999999999 1559 787.5 C 1595.6666666666667 828.8333333333334 1615 887.5 1617 963.5 C 1597.8 1148.7666666666667 1536.4666666666667 1289.9333333333334 1433 1387 C 1352 1466.3333333333333 1258.9731529353633 1523.6113885805441 1152.5 1554 C 1026.8607803791035 1589.8588181043244 863.7 1577.6 820.5 1578 L 955.5136155045584 1223.1950202880641 C 1087.2 1208.7333333333333 1187.2 1161.8999999999999 1255 1082.5 L 1292.5 1036 C 1266.8999999999999 1102.7333333333333 1231.9283099890647 1155.4525046634367 1186.4078369140625 1200.9498291015625 C 1160.2691276626979 1227.0752459715434 1070 1285.5 1070 1285.5 L 1006.3543301105119 1452.755728464882 C 1142.5333333333333 1446.9333333333334 1243.5333333333333 1406.2666666666667 1310 1331 C 1358.2666666666667 1283.3999999999999 1396.9333333333334 1225.8999999999999 1426 1158.5 C 1451.5333333333333 1107.3666666666666 1464.5333333333333 1043.7 1465 967.5 C 1460.9333333333334 917.9 1445.6797620411166 878.9815123115729 1414.5 857 C 1367.8942138671875 824.1432495117188 1345.6849598395413 821.4631535542533 1220.5 822 C 1166.4001277777147 822.2320033025941 1004.1 822.8 950 823 L 997 697 Z M 1226.5 870 L 1122.3941826740759 1143.5817588928423 C 1081.2333333333333 1168.9333333333334 1029.7333333333333 1184.2666666666667 969 1190 L 1058.6071929791583 954.5194659205285 L 1226.5 870 Z" fill="#0f172a"/>
    </svg>
  `)}`,
  aurarefiner: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="ar_g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#f472b6" />
          <stop offset="100%" style="stop-color:#38bdf8" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ar_g)" stroke-width="2" stroke-dasharray="10 5" />
      <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="url(#ar_g)" opacity="0.8">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  `)}`,
  echocontrol: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="ec_g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#22d3ee" />
          <stop offset="100%" style="stop-color:#38bdf8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#ec_g)" stroke-width="4" stroke-dasharray="1 10" stroke-linecap="round" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="url(#ec_g)" stroke-width="2" opacity="0.5" />
      <circle cx="50" cy="50" r="10" fill="url(#ec_g)" />
    </svg>
  `)}`,
};

export const SERVICES = [
  {
    name: "MeetPicks",
    subdomain: "meetpicks.megadrawk.com",
    description: "高度な意思決定を支える、次世代ミーティング管理プラットフォーム。会議の前後・最中におけるあらゆる情報を統合し、決定事項とその背景にある「文脈」を自動的に構造化します。組織の意思決定スピードを劇的に加速させる、知のエンジニアリングツールです。",
    url: "https://meetpicks.megadrawk.com",
    iconUrl: ICONS.meetpicks,
    isGame: false,
  },
  {
    name: "LawDrawk",
    subdomain: "lawdrawk.com",
    description: "法務プロフェッショナルのための、堅牢なワークフロー支援システム。条文、判例、そして社内規定の膨大な海から最適解を導き出します。法的リスクの可視化から契約管理まで、法務部門のDX（デジタルトランスフォーメーション）をトータルで支える中核システムです。",
    url: "https://lawdrawk.com",
    iconUrl: ICONS.lawdrawk,
    isGame: false,
  },
  {
    name: "オーラ精製機",
    subdomain: "aura.megadrawk.com",
    description: "不確実なデータを論理の結晶へと変える、反射と選別の高速シミュレーター。",
    url: "/aura-refiner",
    iconUrl: ICONS.aurarefiner,
    isGame: true,
  },
  {
    name: "エコー制御",
    subdomain: "echo.megadrawk.com",
    description: "未来の予約を清算する、時間構造パズル。1回のタップが時間を超えて反響し、盤面を書き換える。静寂を取り戻せ。",
    url: "/echo-control",
    iconUrl: ICONS.echocontrol,
    isGame: true,
  },
  {
    name: "ストリーム配線",
    subdomain: "wiring.megadrawk.com",
    description: "現実世界のAPI（気象・為替・変動）からパルスを抽出し、信号干渉を制御して目的の波形を構築する回路パズル。",
    url: "/stream-wiring",
    iconUrl: ICONS.echocontrol, // Will use ec icon for now, might customize later
    isGame: true,
  },
] as const;

export type Service = (typeof SERVICES)[number];

export const ADSENSE_CONFIG = {
  id: "ca-pub-4594218580257200",
  allowedPaths: [
    '/',
    '/compliance',
    '/documentation',
    '/governance',
    '/tools',
  ]
} as const;
