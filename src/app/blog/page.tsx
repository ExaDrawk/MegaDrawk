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
    <div className="animate-enter-up">
      <section className="page-section" aria-labelledby="blog-title">
        <header className="page-header">
          <p className="eyebrow">Blog / working notes</p>
          <h1 id="blog-title" className="page-title">
            Blog
          </h1>
          <p className="blog-intro__statement">公開ログ。</p>
          <p className="page-description">
            制作、学び、公開までの途中経過を短いメモで残しています。
          </p>
        </header>

        <div className="blog-index">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} id={post.id} className="blog-entry">
                <h2 className="blog-entry__title">{post.title}</h2>
                <p className="blog-entry__excerpt">{post.excerpt}</p>
                <div className="blog-entry__tags" aria-label="タグ">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="note-meta blog-entry__date">
                  <time dateTime={post.date}>{formatJaDate(post.date)}</time>
                  {post.updatedAt !== post.date ? ` / 更新 ${formatJaDate(post.updatedAt)}` : null}
                </p>
                <div className="blog-entry__comments">
                  <CommentSection postId={post.id} />
                </div>
              </article>
            ))
          ) : (
            <div className="surface-muted empty-state">
              <div>
                <p>まだ公開中のブログ記事はありません。</p>
                <p className="empty-state__hint">
                  最初の記事を準備中です。公開まで少しお待ちください。
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
