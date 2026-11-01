import { PROJECTS } from "./projects";

/**
 * トップページのショーケース。
 * Google Play デベロッパーページに掲載されているメイン画像を直接参照し、
 * アプリ名・説明はストア同期の正本（PROJECTS）から引く。
 */
export type ShowcaseLayout = "stage" | "bento" | "runway";

export interface ShowcaseItem {
  readonly src: string;
  readonly href: string;
  readonly alt: string;
  readonly name: string;
  readonly description: string;
}

const SOURCES = [
  {
    src: "https://play-lh.googleusercontent.com/LdyAkf9ipUlAIYCm43qi5MvqSFeaHnMxmRaGsuE5DoLn-Jy7Sl-6LGA6-uBGtP50CKHI0Ohvp-JLw3CuYc7H=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.tjapocket",
  },
  {
    src: "https://play-lh.googleusercontent.com/NZCfc7tB2PU9qp1izg3EKJlE6R5jRhVNLkVQhD0aev2Sk95Y8WGts9Qa7f4ZVkKtsNsZZTvreNLYimC4uAiX=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.syopita",
  },
  {
    src: "https://play-lh.googleusercontent.com/xcYdmJkXNTlr9iKu9g_AvBsXXuM3_PNCHKmEoqQ6qQjlQYBcgGtX2D4wctOb4Ydpsa0ilsK11pvRF9jp5EVPOJw=w1664-h940",
    href: "https://play.google.com/store/apps/details?id=com.drawk.roppo",
  },
] as const;

export const SHOWCASE: readonly ShowcaseItem[] = SOURCES.map(
  ({ src, href }) => {
    const project = PROJECTS.find((entry) => entry.href === href);
    return {
      src,
      href,
      alt: project?.name ?? "",
      name: project?.name ?? "",
      description: project?.description ?? "",
    };
  },
);
