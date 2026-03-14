import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { BLOG_POSTS } from "@/config/blog";
import { formatJaDate } from "@/lib/date";

export const metadata: Metadata = {
  title: "Blog",
  description: `${SITE.name}のブログ。ジオラマ制作、Unity学習、AIツール実験の記録。`,
};

export default function BlogPage() {
  return (
    <div className="animate-enter-up">
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1 className="section-heading">Blog</h1>
        <p className="section-description">
          ジオラマ制作、Unity学習記録、AIツールの実験など。
        </p>

        <div className="mt-10" style={{ maxWidth: "var(--content-width)" }}>
          {BLOG_POSTS.length > 0 ? (
            <div className="flex flex-col">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.id}
                  className="py-6 transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <time
                    dateTime={post.date}
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatJaDate(post.date)}
                  </time>
                  <h2
                    className="mt-1.5 text-lg font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
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
                ブログ記事はまだ公開されていません。
              </p>
              <a
                href={SITE.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 text-sm"
                style={{ color: "var(--color-link)" }}
              >
                Xで最新情報を見る
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
