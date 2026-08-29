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
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title">About</h1>
        </header>
        <div className="content-stack" style={{ maxWidth: "var(--content-width)" }}>
          {/* ── 基本プロフィール ── */}
          <div>
            <h2 className="section-title text-lg" style={{ color: "var(--color-text)" }}>
              プロフィール
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Drawkは日本の大学生です。
            </p>
          </div>

          <section aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="section-title text-lg"
              style={{ color: "var(--color-text)" }}
            >
              個人開発
            </h2>
            <p className="section-description">
              法律学習と日々の学びを支えるアプリ・拡張機能を作っています。
            </p>
            <div className="content-stack" style={{ gap: "1rem", marginTop: "1.5rem" }}>
              {PROJECTS.map((project) => (
                <article
                  key={project.name}
                  className="surface surface-interactive"
                  style={{ padding: "1.25rem 1.375rem" }}
                >
                  <span className="tag">{project.platform}</span>
                  <h3
                    className="section-title text-lg"
                    style={{ marginTop: "0.875rem", color: "var(--color-text)" }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ margin: "0.75rem 0 0", color: "var(--color-text-secondary)" }}
                  >
                    {project.description}
                  </p>
                  <a
                    className="text-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: "0.75rem" }}
                  >
                    {project.linkLabel}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
