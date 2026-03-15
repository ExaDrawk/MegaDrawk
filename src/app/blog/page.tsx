import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { CommentSection } from "@/components/blog/CommentSection";

export const metadata: Metadata = {
  title: "Blog",
  description: `${SITE.name}のブログ。ジオラマ制作、Unity学習、AIツール実験の記録。`,
};

export default function BlogPage() {
  const posts = getPublishedBlogPosts();

  return (
    <div className="animate-enter-up">
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1 className="section-heading">Blog</h1>
        <p className="section-description">
          まずは短いメモから書けるようにしています。
        </p>

        <div className="mt-10" style={{ maxWidth: "var(--content-width)" }}>
          {posts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-6 transition-all duration-300 rounded-xl"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg-subtle)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <time
                    dateTime={post.date}
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "var(--color-primary-muted)" }}
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
                      <span key={tag} className="tag bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 pt-4" style={{ borderTop: "1px dashed var(--color-border-subtle)" }}>
                    <CommentSection postId={post.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card p-8 border-dashed border-2 rounded-xl flex flex-col items-center text-center">
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
