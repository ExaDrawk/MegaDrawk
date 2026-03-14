import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { WORKS, WORK_CATEGORIES } from "@/config/works";
import type { WorkCategory } from "@/config/works";

export const metadata: Metadata = {
  title: "Works",
  description: `${SITE.name}の作品一覧。ジオラマ制作とデジタル実験。`,
};

export default function WorksPage() {
  const categories = Object.entries(WORK_CATEGORIES) as [WorkCategory, string][];
  const hasAnyWork = WORKS.length > 0;

  return (
    <div className="animate-enter-up">
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1 className="section-heading">Works</h1>
        <p className="section-description">
          手のひらサイズのミニチュア世界と、テクノロジーを使った実験の記録。
        </p>

        {hasAnyWork ? (
          categories.map(([categoryId, categoryLabel]) => {
            const items = WORKS.filter((w) => w.category === categoryId);

            return (
              <div key={categoryId} className="mt-12">
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: "var(--color-text)" }}
                >
                  {categoryLabel}
                </h2>
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((work) => (
                      <div key={work.id} className="card">
                        <div
                          className="card-image-placeholder"
                          role="img"
                          aria-label={work.imageAlt}
                        >
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
                          {work.tools && work.tools.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {work.tools.map((tool) => (
                                <span key={tool} className="tag">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-6">
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      このカテゴリの作品は現在準備中です。
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="card p-6 mt-8">
            <p style={{ color: "var(--color-text-secondary)" }}>
              公開中の作品はまだありません。更新までお待ちください。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
