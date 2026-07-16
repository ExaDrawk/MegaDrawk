import Link from "next/link";
import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowRight } from "lucide-react";
import { ActionLink } from "@/components/ui/Action";

export default function HomePage() {
  const latestPosts = getPublishedBlogPosts().slice(0, 3);

  return (
    <div className="animate-enter-up">
      <section className="page-section">
        <h1
          className="text-4xl font-bold leading-[1.06] tracking-[-0.045em] text-balance sm:text-5xl md:text-6xl"
          style={{ color: "var(--color-text)" }}
        >
          {SITE.name}
        </h1>
        {SITE.tagline ? (
          <p
            className="mt-4 text-lg sm:text-xl font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {SITE.tagline}
          </p>
        ) : null}
        <p
          className="page-description mt-6"
          style={{
            maxWidth: "var(--content-width)",
          }}
        >
          {SITE.heroCopy}
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <ActionLink
            href="/blog"
          >
            ブログを読む
            <ArrowRight size={16} aria-hidden="true" />
          </ActionLink>
          <ActionLink href="/about" variant="secondary">
            プロフィール
          </ActionLink>
        </div>
      </section>

      <section className="pb-8 sm:pb-12">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <h2 className="section-title">
            Latest Blog
          </h2>
          <Link
            href="/blog"
            className="text-link shrink-0"
          >
            すべて見る →
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="surface surface-interactive group"
              >
                <Link
                  href={`/blog#${post.id}`}
                  className="block rounded-[inherit] p-5 sm:p-6"
                >
                  <time
                    dateTime={post.date}
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatJaDate(post.date)}
                  </time>
                  <h3
                    className="mt-2 text-lg font-semibold transition-colors duration-150 group-hover:text-[var(--color-primary)]"
                    style={{ color: "var(--color-text)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-muted flex min-h-32 items-center justify-center p-6 sm:p-8">
            <p className="text-center font-medium" style={{ color: "var(--color-text-secondary)" }}>
              まだ記事がありません。新しい記事の公開をお待ちください。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
