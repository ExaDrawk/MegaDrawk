import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { PROJECTS } from "@/config/projects";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.ownerName}について。プロフィールと活動記録。`,
};

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
            <h2 className="mono-label mb-1">プロフィール</h2>
            <p>日本の大学生 / 個人開発</p>
            <h2 className="mono-label mt-3 mb-1">目標</h2>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              AGIまで生きるのが第一目標。
            </p>
          </aside>
        </div>

        <div className="project-index" aria-labelledby="projects-heading">
          <h2 className="project-index__head" id="projects-heading">
            個人開発
          </h2>
          {PROJECTS.map((project) => (
            <article key={project.name} className="project-entry">
              <div className="project-entry__body">
                <h2>{project.name}</h2>
                <p className="project-entry__description">
                  {project.platform}。{project.description}
                </p>
              </div>
              <div className="project-entry__meta">
                <span className="project-entry__platform">{project.platform}</span>
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
