import { SITE } from "@/config/site";
import { getPublishedBlogPosts } from "@/config/blog";
import { formatJaDate } from "@/lib/date";
import { ArrowUpRight } from "lucide-react";
import { ActionLink } from "@/components/ui/Action";

export default function HomePage() {
  const latestPosts = getPublishedBlogPosts().slice(0, 3);

  return (
    <div className="animate-enter-up">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="eyebrow">Field notes / independent build</p>
          <h1 id="home-title" className="home-hero__title">
            {SITE.name}
          </h1>
          <p className="home-hero__lede">{SITE.heroCopy}</p>
          <div className="home-hero__actions">
            <ActionLink href="/blog">
              ブログを読む
              <ArrowUpRight size={16} aria-hidden="true" />
            </ActionLink>
            <ActionLink href="/about" variant="secondary">
              個人開発を見る
            </ActionLink>
          </div>
        </div>

        <aside className="hero-plate" aria-label="MEGADRAWKのステートメント">
          <div className="hero-plate__top">
            <span className="hero-plate__label">Current / open notes</span>
            <span className="hero-plate__status">live</span>
          </div>
          <div className="hero-plate__mark" aria-hidden="true">
            M/
          </div>
          <div className="hero-plate__bottom">
            <p className="hero-plate__statement">法律と制作を、同じ机で。</p>
            <span className="hero-plate__label" aria-hidden="true">
              01
            </span>
          </div>
        </aside>
      </section>

      <section className="home-rail" aria-labelledby="latest-heading">
        <div className="home-rail__intro">
          <p className="eyebrow">01 / notes</p>
          <h2 id="latest-heading" className="section-title">
            Latest notes
          </h2>
          <p className="section-description">
            制作、学び、公開までの途中経過を短い記録にしています。
          </p>
        </div>

        <div>
          {latestPosts.length > 0 ? (
            <div className="notes-list">
              {latestPosts.map((post) => (
                <article key={post.id} className="note-row">
                  <time dateTime={post.date} className="note-meta">
                    {formatJaDate(post.date)}
                  </time>
                  <a href={`/blog#${post.id}`} className="note-row__link">
                    <h3 className="note-row__title">{post.title}</h3>
                    <p className="note-row__excerpt">{post.excerpt}</p>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-muted empty-state">
              <p>まだ記事がありません。新しい記事の公開をお待ちください。</p>
            </div>
          )}
        </div>
      </section>

      <section className="home-brief" aria-labelledby="brief-heading">
        <div>
          <p className="eyebrow">02 / the brief</p>
          <h2 id="brief-heading" className="section-title">
            つくる。記録する。次へ進む。
          </h2>
          <p className="section-description">
            MEGADRAWKは、作品と活動記録をまとめた場所です。個人開発の現在地はAboutに、更新のログはBlogに残しています。
          </p>
        </div>
        <div className="home-brief__links">
          <a className="home-brief__link" href="/about">
            <span>個人開発の一覧</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a className="home-brief__link" href="/contact">
            <span>連絡先</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
