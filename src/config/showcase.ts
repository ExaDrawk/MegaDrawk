/**
 * トップページ検討用のショーケース。
 * Google Play デベロッパーページに掲載されているメイン画像を直接参照する。
 */
export type ShowcaseLayout = "bleed" | "column" | "triptych";

export interface ShowcaseItem {
  readonly src: string;
  readonly href: string;
  readonly alt: string;
}

export const SHOWCASE: readonly ShowcaseItem[] = [
  {
    src: "https://play-lh.googleusercontent.com/LdyAkf9ipUlAIYCm43qi5MvqSFeaHnMxmRaGsuE5DoLn-Jy7Sl-6LGA6-uBGtP50CKHI0Ohvp-JLw3CuYc7H=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.tjapocket",
    alt: "TJA Pocket",
  },
  {
    src: "https://play-lh.googleusercontent.com/NZCfc7tB2PU9qp1izg3EKJlE6R5jRhVNLkVQhD0aev2Sk95Y8WGts9Qa7f4ZVkKtsNsZZTvreNLYimC4uAiX=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.syopita",
    alt: "証ぴた 証明写真作成・印刷",
  },
  {
    src: "https://play-lh.googleusercontent.com/xcYdmJkXNTlr9iKu9g_AvBsXXuM3_PNCHKmEoqQ6qQjlQYBcgGtX2D4wctOb4Ydpsa0ilsK11pvRF9jp5EVPOJw=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.roppo",
    alt: "どこでも六法",
  },
];
