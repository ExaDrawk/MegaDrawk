import Link from "next/link";
import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const latestPosts = getPublishedBlogPosts().slice(0, 3);

  return (
    <div className="animate-enter-up">
      {/* ── Hero ── */}
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {SITE.name}
        </h1>
        <p
          className="mt-4 text-lg sm:text-xl font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {SITE.tagline}
        </p>
        <p
          className="mt-6 text-base leading-relaxed"
          style={{
            color: "var(--color-text-secondary)",
            maxWidth: "var(--content-width)",
          }}
        >
          手のひらサイズのミニチュア世界を制作している大学生です。
          最近はUnityへの初挑戦や、AIツールを使った実験にも取り組んでいます。
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent-hover))",
            }}
          >
            ブログを読む
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-[var(--color-bg-secondary)]"
            style={{
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            プロフィール
          </Link>
        </div>
      </section>

      {/* ── Latest Blog ── */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading text-2xl font-bold" style={{ marginBottom: 0 }}>
            Latest Blog
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors duration-150 hover:text-[var(--color-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            すべて見る →
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="p-5 transition-all duration-300 rounded-xl hover:shadow-md group"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)"
                }}
              >
                <Link href={`/blog#${post.id}`} className="block">
                  <time
                    dateTime={post.date}
                    className="text-xs font-medium"
                    style={{ color: "var(--color-primary-muted)" }}
                  >
                    {formatJaDate(post.date)}
                  </time>
                  <h3
                    className="mt-2 text-lg font-semibold group-hover:text-[var(--color-primary)] transition-colors duration-200"
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
          <div className="card p-8 border-dashed border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-[var(--color-bg-secondary)]" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <p className="text-center font-medium" style={{ color: "var(--color-text-secondary)" }}>
              まだ記事がありません。新しい記事の公開をお待ちください。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
