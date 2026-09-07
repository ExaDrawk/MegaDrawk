import Link from "next/link";
import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowUpRight } from "lucide-react";
import { ActionLink } from "@/components/ui/Action";

export default function HomePage() {
  const latestPosts = getPublishedBlogPosts().slice(0, 3);

  return (
    <div>
      <section className="page-section" aria-labelledby="home-title">
        <div className="max-w-2xl">
          <h1 id="home-title" className="page-title text-4xl sm:text-5xl font-bold tracking-tight">
            {SITE.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {SITE.heroCopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ActionLink href="/blog">
              ブログを読む
              <ArrowUpRight size={16} aria-hidden="true" />
            </ActionLink>
            <ActionLink href="/about" variant="secondary">
              個人開発を見る
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="latest-heading">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
          <h2 id="latest-heading" className="text-xl font-bold tracking-tight">
            最近の記事
          </h2>
          <Link href="/blog" className="text-link text-sm inline-flex items-center gap-1">
            すべて見る
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-6">
          {latestPosts.length > 0 ? (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {latestPosts.map((post) => (
                <article key={post.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <Link href={`/blog#${post.id}`} className="group">
                      <h3 className="text-base font-semibold group-hover:text-[var(--color-primary)] transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <time dateTime={post.date} className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                      {formatJaDate(post.date)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted p-8 text-center">
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                まだ記事がありません。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
