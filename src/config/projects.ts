import listings from "./store-listings.json";
export interface ProjectItem {
  readonly platform: string;
  readonly operatingSystem: string;
  readonly applicationCategory: string;
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly linkLabel: string;
  readonly imageSrc: string;
}
const ANDROID = {
  platform: "Androidアプリ",
  operatingSystem: "Android",
  applicationCategory: "MobileApplication",
} as const;
export const PROJECTS: readonly ProjectItem[] = [
  ...listings.map((app) => ({
    ...ANDROID,
    name: app.name,
    description: app.description,
    href: app.href,
    linkLabel: "Google Play",
    imageSrc: app.imageSrc,
  })),
  {
    platform: "Chrome拡張機能",
    operatingSystem: "Chrome",
    applicationCategory: "BrowserApplication",
    name: "Multi-Subtitles for YouTube",
    description: "YouTubeの字幕を、複数の言語で同時に表示。",
    href: "https://chromewebstore.google.com/detail/multi-subtitles-for-youtu/ndgdichjchjkakemdjmimflnjipcpbbd",
    linkLabel: "Chrome ウェブストア",
    imageSrc: "/images/projects/multi-subtitles.png",
  },
];
