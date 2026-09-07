import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { PROJECTS } from "@/config/projects";

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

          {/* ── 個人開発 ── */}
          <section aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="section-title text-lg"
              style={{ color: "var(--color-text)" }}
            >
              個人開発
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              法律学習と日々の学びを支えるアプリ・拡張機能を作っています。
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {PROJECTS.map((project) => (
                <article
                  key={project.name}
                  className="surface p-5 sm:p-6"
                >
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {project.platform}
                  </span>
                  <h3
                    className="mt-2 text-lg font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {project.description}
                  </p>
                  <div className="mt-4">
                    <a
                      className="text-link inline-flex items-center gap-1"
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
