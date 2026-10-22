import { SITE } from "@/config/site";
import { PROJECTS } from "@/config/projects";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { ActionLink } from "@/components/ui/Action";
import { ProjectIcon } from "@/components/ui/ProjectIcon";
import {
  BrandLockup,
  getBrandLockupContainerClassName,
} from "@/components/layout/BrandLockup";

export default function HomePage() {
  const latestPosts = getPublishedBlogPosts().slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-16" aria-labelledby="home-title">
        <div className="max-w-2xl">
          <h1
            id="home-title"
            className={`page-title ${getBrandLockupContainerClassName("hero")}`}
          >
            <span className="sr-only">{SITE.name}</span>
            <BrandLockup preset="hero" priority hideAlt />
          </h1>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed"
            data-color="color-text-secondary"
          >
            {SITE.heroCopy}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ActionLink href="/about">
              個人開発を見る
              <ArrowUpRight size={15} aria-hidden="true" />
            </ActionLink>
            <ActionLink href="/blog" variant="secondary">
              ブログを読む
            </ActionLink>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section aria-labelledby="projects-heading">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <h2
            id="projects-heading"
            className="text-lg sm:text-xl font-bold tracking-tight"
          >
            個人開発
          </h2>
          <a
            href="/about"
            className="text-link text-xs sm:text-sm inline-flex items-center gap-1 font-mono"
          >
            すべて見る
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECTS.map((project) => (
            <article
              key={project.name}
              className="surface p-5 rounded-md border border-[var(--color-border-subtle)] flex flex-col justify-between hover:border-[var(--color-accent)] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <ProjectIcon
                    src={project.imageSrc}
                    alt={project.name}
                    href={project.href}
                    size="sm"
                  />
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-mono rounded border border-[var(--color-border-subtle)]"
                      data-color="color-text-muted"
                    >
                      {project.platform}
                    </span>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                      aria-label={`${project.name}（外部リンク）`}
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <h3 className="text-base font-bold tracking-tight mt-4">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    {project.name}
                  </a>
                </h3>
                <p
                  className="mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3"
                  data-color="color-text-secondary"
                >
                  {project.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link text-xs inline-flex items-center gap-1 font-mono"
                >
                  {project.linkLabel}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent Notes Section */}
      <section aria-labelledby="latest-heading">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <h2
            id="latest-heading"
            className="text-lg sm:text-xl font-bold tracking-tight"
          >
            最近の記事
          </h2>
          <a
            href="/blog"
            className="text-link text-xs sm:text-sm inline-flex items-center gap-1 font-mono"
          >
            すべて見る
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="mt-6">
          {latestPosts.length > 0 ? (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {latestPosts.map((post) => (
                <article key={post.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <a href={`/blog#${post.id}`} className="group">
                      <h3 className="text-base font-semibold group-hover:text-[var(--color-primary)] transition-colors">
                        {post.title}
                      </h3>
                    </a>
                    <time
                      dateTime={post.date}
                      className="text-xs font-mono"
                      data-color="color-text-muted"
                    >
                      {formatJaDate(post.date)}
                    </time>
                  </div>
                  <p
                    className="mt-1 text-sm line-clamp-2"
                    data-color="color-text-secondary"
                  >
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted p-8 text-center rounded-md border border-[var(--color-border-subtle)]">
              <p className="text-sm" data-color="color-text-secondary">
                まだ記事はありません。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export const metadata = { title: "", description: SITE.description };
