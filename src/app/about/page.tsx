import { SITE } from "@/config/site";

export const metadata = {
  title: "About",
  description: `${SITE.ownerName}について。プロフィールと活動記録。`,
};

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
        </div>
      </section>
    </div>
  );
}
