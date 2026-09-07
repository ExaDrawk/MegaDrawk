export interface ProjectItem {
  readonly platform: string;
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly linkLabel: string;
  readonly imageSrc: string;
}

export const PROJECTS: readonly ProjectItem[] = [
  {
    platform: "Androidアプリ",
    name: "どこでも六法",
    description:
      "日本の主要法令を検索・閲覧できる法令学習支援アプリです。条文番号や法令名から条文を探し、参照条文への移動、閲覧履歴、表示設定、法令グループ管理、端末に保存した法令のオフライン閲覧に対応しています。",
    href: "https://play.google.com/apps/testing/com.drawk.roppo",
    linkLabel: "Google Play（テスト公開）",
    imageSrc: "/images/projects/roppo.png",
  },
  {
    platform: "Chrome拡張機能",
    name: "Multi-Subtitles for YouTube",
    description:
      "YouTubeで複数の字幕言語を同時に表示できます。ネイティブ字幕・自動生成字幕・翻訳字幕に対応し、字幕ごとの配置、表示設定、WatchとShortsの位置を調整できます。設定はChrome内に保存され、アカウントや外部サーバーを必要としません。",
    href: "https://chromewebstore.google.com/detail/multi-subtitles-for-youtu/ndgdichjchjkakemdjmimflnjipcpbbd",
    linkLabel: "Chrome ウェブストア",
    imageSrc: "/images/projects/multi-subtitles.png",
  },
  {
    platform: "Chrome拡張機能",
    name: "条文スコープ",
    description:
      "ウェブページ上の「民法第709条」などの法令参照を検出し、e-Govの条文をChromeのサイドパネルで確認できる法律学習用拡張機能です。条文の検索・タブ・履歴・メモ・お気に入り・JSONバックアップに対応しています。",
    href: "https://chromewebstore.google.com/detail/%E6%9D%A1%E6%96%87%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97/mmmciilhhdlldepiemjjjajiphcphgcp",
    linkLabel: "Chrome ウェブストア",
    imageSrc: "/images/projects/joubun-scope.png",
  },
] as const;