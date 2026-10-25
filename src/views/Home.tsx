import { SITE } from "@/config/site";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { ProjectList } from "@/components/ui/ProjectList";
import { formatJaDate } from "@/lib/date";

export interface RecentPostSummary {
  readonly id: string;
  readonly title: string;
  readonly date: string;
}

export default function HomePage({
  posts,
}: {
  posts: readonly RecentPostSummary[];
}) {
  return (
    <div className="home">
      <header className="home-intro">
        <h1>
          <BrandLockup />
        </h1>
        <p>{SITE.heroCopy}</p>
      </header>
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-label">
          個人開発
        </h2>
        <ProjectList />
      </section>
      {posts.length > 0 && (
        <section className="recent-posts" aria-labelledby="latest-heading">
          <h2 className="section-label" id="latest-heading">
            最近の記事
          </h2>
          {posts.map((post) => (
            <article key={post.id}>
              <a href={"/blog/" + post.id}>{post.title}</a>
              <time dateTime={post.date}>{formatJaDate(post.date)}</time>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
export const metadata = { title: "", description: SITE.description };
