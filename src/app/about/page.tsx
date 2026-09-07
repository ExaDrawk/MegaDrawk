import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.ownerName}について。プロフィールと活動記録。`,
};

export default function AboutPage() {
  return (
    <div>
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title">About</h1>
        </header>
        <div
          className="content-stack"
          style={{ maxWidth: "var(--content-width)" }}
        >
          {/* ── 基本プロフィール ── */}
          <div>
            <h2
              className="section-title text-lg"
              style={{ color: "var(--color-text)" }}
            >
              プロフィール
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Drawkは日本の大学生です。
            </p>
          </div>

          {/* ── 目標 ── */}
          <div>
            <h2
              className="section-title text-lg"
              style={{ color: "var(--color-text)" }}
            >
              目標
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              AGIまで生きるのが第一目標。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
