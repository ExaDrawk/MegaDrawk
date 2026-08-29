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

          {/* ── 病歴（X Bioの一文のみ） ── */}
          <div>
            <h2 className="section-title text-lg" style={{ color: "var(--color-text)" }}>
              病歴
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              2025年9月に持病の高安動脈炎による胸部大動脈瘤、severe
              ARのためBentall手術（ベントール手術）を受け、機械弁を挿入。身体障害1級。リンヴォック15mg、プレドニン8mgを服用中。
            </p>
          </div>

          {/* ── 目標 ── */}
          <div>
            <h2 className="section-title text-lg" style={{ color: "var(--color-text)" }}>
              目標
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              AGIまで生きるのが第一目標。
            </p>
          </div>

          {/* ── メッセージ ── */}
          <div className="notice p-5 sm:p-6">
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              高安動脈炎や他の疾患で闘病中の方がいらっしゃいましたら、
              お気軽にXで声をかけてください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
