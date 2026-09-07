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
      <section className="page-section" aria-labelledby="about-title">
        <header className="page-header">
          <h1 id="about-title" className="page-title text-3xl sm:text-4xl font-bold tracking-tight">
            About
          </h1>
          <p className="page-description mt-3 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            MEGADRAWKは、{SITE.ownerName}の作品と活動記録をまとめたサイトです。
          </p>
        </header>

        <div className="surface p-6 rounded-md border border-[var(--color-border-subtle)] mt-8" aria-label="プロフィール">
          <h2 className="text-base font-bold tracking-tight">プロフィール</h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            日本の大学生 / 個人開発
          </p>
          <h2 className="text-base font-bold tracking-tight mt-5">目標</h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            AGIまで生きるのが第一目標。
          </p>
        </div>

        <div className="mt-12" aria-labelledby="projects-heading">
          <div className="pb-3 border-b border-[var(--color-border-subtle)]">
            <h2 id="projects-heading" className="text-xl font-bold tracking-tight">
              個人開発
            </h2>
          </div>

          <div className="mt-6 divide-y divide-[var(--color-border-subtle)]">
            {PROJECTS.map((project) => (
              <article key={project.name} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight">
                    {project.name}
                  </h3>
                  <a
                    className="text-link text-sm font-medium inline-flex items-center gap-1 shrink-0"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.linkLabel}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded border border-[var(--color-border-subtle)]" style={{ color: "var(--color-text-muted)" }}>
                    {project.platform}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
