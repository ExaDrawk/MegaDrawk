import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { CommentSection } from "@/components/blog/CommentSection";

export const metadata: Metadata = {
  title: "Blog",
  description: `${SITE.name}のブログ。制作記録とメモ。`,
};

export default function BlogPage() {
  const posts = getPublishedBlogPosts();

  return (
    <div className="animate-enter-up">
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title">Blog</h1>
          <p className="page-description">
            まずは短いメモから書けるようにしています。
          </p>
        </header>

        <div style={{ maxWidth: "var(--content-width)" }}>
          {posts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  id={post.id}
                  className="surface scroll-mt-28 p-5 sm:p-6"
                >
                  <time
                    dateTime={post.date}
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatJaDate(post.date)}
                  </time>
                  {post.updatedAt !== post.date ? (
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      更新: {formatJaDate(post.updatedAt)}
                    </p>
                  ) : null}
                  <h2
                    className="mt-1.5 text-xl font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mt-2 text-base leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
                    <CommentSection postId={post.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted flex min-h-40 flex-col items-center justify-center p-6 text-center sm:p-8">
              <p className="font-semibold text-lg" style={{ color: "var(--color-text-secondary)" }}>
                まだ公開中のブログ記事はありません。
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                最初の記事を準備中です。公開まで少しお待ちください。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
