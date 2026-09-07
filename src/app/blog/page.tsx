import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { CommentSection } from "@/components/blog/CommentSection";

export const metadata = {
  title: "Blog",
  description: `${SITE.name}のブログ。制作記録とメモ。`,
};

export default function BlogPage() {
  const posts = getPublishedBlogPosts();

  return (
    <div>
      <section className="page-section" aria-labelledby="blog-title">
        <header className="page-header">
          <h1 id="blog-title" className="page-title text-3xl sm:text-4xl font-bold tracking-tight">
            Blog
          </h1>
          <p className="page-description mt-3 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            制作記録とメモ。
          </p>
        </header>

        <div className="mt-8 max-w-3xl">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  id={post.id}
                  className="surface p-6 rounded-md border border-[var(--color-border-subtle)]"
                >
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    <time dateTime={post.date}>{formatJaDate(post.date)}</time>
                    {post.updatedAt !== post.date ? (
                      <span>/ 更新 {formatJaDate(post.updatedAt)}</span>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight mt-2">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="タグ">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-mono rounded border border-[var(--color-border-subtle)]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
                    <CommentSection postId={post.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted p-8 text-center rounded-md border border-[var(--color-border-subtle)]">
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                まだ記事はありません。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
