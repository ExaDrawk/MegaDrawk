export const SITE = {
  name: "MegaDrawk",
  legalName: "MegaDrawk Utility Stack",
  tagline: "Integrated Utility for Engineering & Operations",
  description:
    "MegaDrawk is a secure, browser-based utility suite integrating data transformation, syntax validation, and security tools. All processing occurs locally within your environment, ensuring absolute data privacy.",
  baseDomain: "megadrawk.com",
} as const;

export const UI_TEXT = {
  heroHeadline: "Rapid. Secure. Autonomous.",
  heroSubheadline: "From core engineering to operational deconstruction. A high-performance suite for analysis and transformation.",
  eyebrow: "Professional Toolkit",
  operationalRigor: "Zero-Trust Architecture",
  servicesHeading: "Core Architecture",
  servicesSubheading: "Bridging the gap between engineering and operations with 30+ dedicated utilities.",

  // Mission Section
  missionHeading: "Architectural Intent",
  missionText: "MegaDrawk is built on the principles of 'Zero Latency' and 'Zero Trust'. By eliminating server-side overhead and executing all logic in-process via client-side JavaScript, we maximize data privacy and execution speed. We prioritize pure functionality over abstraction, providing raw computational power directly in the browser.",

  // Technology Section
  techHeading: "Technical Specs",
  techSubheading: "A stack optimized for high-fidelity execution.",
  techFocus1: "In-Process Computing",
  techFocus1Desc: "Zero data transmission. All logic executes locally in the browser, ideal for sensitive data encapsulation and cryptographic integrity.",
  techFocus2: "Parsing Engines",
  techFocus2Desc: "Industry-standard parsers for JSON, SQL, and Markdown. Guaranteed structural accuracy and real-time error detection.",
  techFocus3: "Cryptographic Integrity",
  techFocus3Desc: "Standardized implementations for Base64, Hash, and UUID generation using cryptographically secure protocols (Crypto-JS).",

  // Privacy & Compliance
  privacyHeading: "Compliance",
  privacySubheading: "Operational transparency and data integrity disclosures.",
  footerPrivacy: "Privacy Protocol",
  footerContact: "Contact",
  footerSuffix: "All Rights Reserved",
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
    description: "Next-generation meeting architecture platform. Structure decision-making context and organizational intelligence with precision.",
    url: "https://meetpicks.megadrawk.com",
    iconUrl: ICONS.meetpicks,
    isGame: false,
  },
  {
    name: "LawDrawk",
    subdomain: "lawdrawk.com",
    description: "Robust workflow system for operational professionals. Derive optimal solutions from complex regulatory and internal documentation.",
    url: "https://lawdrawk.com",
    iconUrl: ICONS.lawdrawk,
    isGame: false,
  },
  {
    name: "Aura Refiner",
    subdomain: "aura.megadrawk.com",
    description: "High-speed logic simulator for refining uncertain data into crystalline structures.",
    url: "/aura-refiner",
    iconUrl: ICONS.aurarefiner,
    isGame: true,
  },
  {
    name: "Echo Control",
    subdomain: "echo.megadrawk.com",
    description: "Temporal puzzle architecture. Synchronize state across high-frequency reverberations and recalibrate the grid.",
    url: "/echo-control",
    iconUrl: ICONS.echocontrol,
    isGame: true,
  },
  {
    name: "Stream Wiring",
    subdomain: "wiring.megadrawk.com",
    description: "Circuit logic simulation. Extract pulses from environmental APIs to construct objective waveforms.",
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
