import { SITE } from "@/config/site";

export const metadata = {
  title: "About",
  description: `${SITE.ownerName}について。プロフィールと個人開発の活動を紹介。`,
};

const PROJECTS = [
  {
    platform: "Androidアプリ",
    name: "どこでも六法",
    description:
      "日本の主要法令を検索・閲覧できる法令学習支援アプリです。条文番号や法令名から条文を探し、参照条文への移動、閲覧履歴、表示設定、法令グループ管理、端末に保存した法令のオフライン閲覧に対応しています。",
    href: "https://play.google.com/apps/testing/com.drawk.roppo",
    linkLabel: "Google Play（テスト公開）",
  },
  {
    platform: "Chrome拡張機能",
    name: "Multi-Subtitles for YouTube",
    description:
      "YouTubeで複数の字幕言語を同時に表示できます。ネイティブ字幕・自動生成字幕・翻訳字幕に対応し、字幕ごとの配置、表示設定、WatchとShortsの位置を調整できます。設定はChrome内に保存され、アカウントや外部サーバーを必要としません。",
    href: "https://chromewebstore.google.com/detail/multi-subtitles-for-youtu/ndgdichjchjkakemdjmimflnjipcpbbd",
    linkLabel: "Chrome ウェブストア",
  },
  {
    platform: "Chrome拡張機能",
    name: "条文スコープ",
    description:
      "ウェブページ上の「民法第709条」などの法令参照を検出し、e-Govの条文をChromeのサイドパネルで確認できる法律学習用拡張機能です。条文の検索・タブ・履歴・メモ・お気に入り・JSONバックアップに対応しています。",
    href: "https://chromewebstore.google.com/detail/%E6%9D%A1%E6%96%87%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97/mmmciilhhdlldepiemjjjajiphcphgcp",
    linkLabel: "Chrome ウェブストア",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="animate-enter-up">
      <section className="page-section" aria-labelledby="about-title">
        <div className="about-intro">
          <div>
            <p className="eyebrow">About / Drawk</p>
            <h1 id="about-title" className="page-title">
              About
            </h1>
            <p className="about-intro__statement">つくる人の、現在地。</p>
            <p className="page-description">
              MEGADRAWKは、{SITE.ownerName}の作品と活動記録をまとめたサイトです。
            </p>
          </div>
          <aside className="about-intro__aside" aria-label="プロフィール">
            <p>Profile</p>
            <p>日本の大学生 / 個人開発</p>
          </aside>
        </div>

        <div className="project-index" aria-labelledby="projects-heading">
          <p className="project-index__head" id="projects-heading">
            Selected builds / 個人開発
          </p>
          {PROJECTS.map((project) => (
            <article key={project.name} className="project-entry">
              <div className="project-entry__body">
                <h2>{project.name}</h2>
                <p className="project-entry__description">
                  {project.platform}。{project.description}
                </p>
              </div>
              <div className="project-entry__meta">
                <a
                  className="project-entry__link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.linkLabel}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
