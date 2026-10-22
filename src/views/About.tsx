import { SITE } from "@/config/site";
import { PROJECTS } from "@/config/projects";
import { ProjectIcon } from "@/components/ui/ProjectIcon";

export const metadata = {
  title: "About",
  description: `${SITE.ownerName}のプロフィールと個人開発。`,
};

export default function AboutPage() {
  return (
    <div>
      <section className="page-section" aria-labelledby="about-title">
        <header className="page-header">
          <h1
            id="about-title"
            className="page-title text-3xl sm:text-4xl font-bold tracking-tight"
          >
            About
          </h1>
        </header>

        <div
          className="surface p-6 rounded-md border border-[var(--color-border-subtle)] mt-8 max-w-xl"
          aria-label="プロフィール"
        >
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text)]">
            プロフィール
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            日本の大学生 / 個人開発
          </p>
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text)] mt-5">
            目標
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            AGIまで生きるのが第一目標。
          </p>
        </div>

        <div className="mt-14" aria-labelledby="projects-heading">
          <div className="pb-3 border-b border-[var(--color-border-subtle)]">
            <h2
              id="projects-heading"
              className="text-xl font-bold tracking-tight"
            >
              個人開発
            </h2>
          </div>

          <div className="mt-6 divide-y divide-[var(--color-border-subtle)]">
            {PROJECTS.map((project) => (
              <article
                key={project.name}
                className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
              >
                <ProjectIcon
                  src={project.imageSrc}
                  alt={project.name}
                  href={project.href}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg font-bold tracking-tight">
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-accent)] transition-colors"
                        >
                          {project.name}
                        </a>
                      </h3>
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-mono rounded border border-[var(--color-border-subtle)]"
                        data-color="color-text-muted"
                      >
                        {project.platform}
                      </span>
                    </div>
                    <a
                      className="text-link text-xs sm:text-sm font-mono inline-flex items-center gap-1 shrink-0"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.linkLabel}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                  <p
                    className="mt-2.5 text-sm leading-relaxed max-w-3xl"
                    data-color="color-text-secondary"
                  >
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
