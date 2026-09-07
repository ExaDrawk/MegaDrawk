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
    <div>
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title text-3xl font-bold tracking-tight">管理メニュー</h1>
          <p className="page-description mt-2">
            記事草案の作成とコード生成を行います。
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="surface p-5 sm:p-6">
            <h2 className="section-title text-lg">記事追加</h2>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              タイトル、本文、タグ、日付を入力して、ブログ記事のコードを生成します。
            </p>
            <ActionLink href="/admin/posts/new" className="mt-6">
              記事追加画面へ
            </ActionLink>
          </article>
        </div>
      </section>
    </div>
  );
}
