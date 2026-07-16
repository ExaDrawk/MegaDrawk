import type { Metadata } from "next";
import { ActionLink } from "@/components/ui/Action";

export const metadata: Metadata = {
  title: "Admin",
  description: "MEGADRAWK の管理導線一覧です。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="animate-enter-up">
      <section className="page-section">
        <header className="page-header">
          <p className="eyebrow">
            Admin
          </p>
          <h1 className="page-title">管理メニュー</h1>
          <p className="page-description">
            公開サイトとは分離した管理導線です。現時点では静的ブログ運用に合わせて、
            記事草案の作成とコード生成に責務を限定しています。
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <article
            className="surface p-5 sm:p-6"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Posts
            </p>
            <h2 className="section-title mt-3">記事追加</h2>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              タイトル、本文、タグ、日付を入力し、
              `createBlogPost(...)` を生成して `BLOG_POSTS` に追加します。
            </p>
            <ActionLink href="/admin/posts/new" className="mt-6">
              記事追加画面へ
            </ActionLink>
          </article>

          <article
            className="surface-muted p-5 sm:p-6"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Next Step
            </p>
            <h2 className="section-title mt-3">将来の拡張余地</h2>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              CMS / DB 導入時はインフラ層だけ差し替え、UI層と記事生成ルールは流用する想定です。
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
