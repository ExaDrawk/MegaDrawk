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
    <div>
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
                  {post.tags.length > 0 ? (
                    <p
                      className="mt-3 text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {post.tags.map((tag) => `#${tag}`).join(" ")}
                    </p>
                  ) : null}
                  <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
                    <CommentSection postId={post.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted flex min-h-40 items-center justify-center p-6 text-center sm:p-8">
              <p className="font-semibold text-lg" style={{ color: "var(--color-text-secondary)" }}>
                まだ記事はありません。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
