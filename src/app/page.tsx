import Link from "next/link";
import { SITE } from "@/config/site";
import { WORKS } from "@/config/works";
import { BLOG_POSTS } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featuredWorks = WORKS.slice(0, 4);
  const latestPosts = BLOG_POSTS.slice(0, 3);

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
          className="mt-4 text-lg sm:text-xl"
          style={{ color: "var(--color-text-secondary)" }}
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
            href="/works"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-md transition-colors duration-150"
            style={{ background: "var(--color-accent)" }}
          >
            作品を見る
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-colors duration-150"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            プロフィール
          </Link>
        </div>
      </section>

      {/* ── Featured Works ── */}
      <section className="pb-16 sm:pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            Featured Works
          </h2>
          <Link
            href="/works"
            className="text-sm font-medium transition-colors duration-150 hover:text-[var(--color-text)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            すべて見る →
          </Link>
        </div>
        {featuredWorks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredWorks.map((work) => (
              <div key={work.id} className="card">
                <div className="card-image-placeholder" aria-label={work.imageAlt}>
                  {work.comingSoon ? "Coming Soon" : work.title}
                </div>
                <div className="card-body">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {work.title}
                  </h3>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6">
            <p style={{ color: "var(--color-text-secondary)" }}>
              作品はまだありません。公開準備ができ次第追加されます。
            </p>
            <Link href="/contact" className="inline-flex mt-4 text-sm" style={{ color: "var(--color-link)" }}>
              お問い合わせはこちら
            </Link>
          </div>
        )}
      </section>

      {/* ── Latest Blog ── */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            Latest Blog
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors duration-150 hover:text-[var(--color-text)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            すべて見る →
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          <div className="flex flex-col gap-0">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="py-5 transition-colors duration-150"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <time
                  dateTime={post.date}
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatJaDate(post.date)}
                </time>
                <h3
                  className="mt-1 text-base font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {post.excerpt}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-6">
            <p style={{ color: "var(--color-text-secondary)" }}>
              記事はまだありません。最新情報はXで更新します。
            </p>
            <a
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-4 text-sm"
              style={{ color: "var(--color-link)" }}
            >
              Xを見る
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
