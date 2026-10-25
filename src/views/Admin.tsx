import { ActionLink } from "@/components/ui/Action";

export const metadata = {
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
          <h1 className="page-title text-3xl font-bold tracking-tight">
            管理メニュー
          </h1>
          <p className="page-description mt-2">
            記事の追加・編集、コメントの管理、草案の作成を行います。
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="surface p-5 sm:p-6">
            <h2 className="section-title text-lg">記事の追加・編集</h2>
            <p
              className="mt-3 text-sm leading-7"
              data-color="color-text-secondary"
            >
              Markdownのまま記事を追加・編集・削除します。保存すると自動でサイトに反映されます。
            </p>
            <ActionLink href="/admin/articles" className="mt-6">
              記事管理画面へ
            </ActionLink>
          </article>
          <article className="surface p-5 sm:p-6">
            <h2 className="section-title text-lg">コメント管理</h2>
            <p
              className="mt-3 text-sm leading-7"
              data-color="color-text-secondary"
            >
              コメントの一覧・削除と、管理人コメントの投稿（返信を含む）を行います。
            </p>
            <ActionLink href="/admin/comments" className="mt-6">
              コメント管理画面へ
            </ActionLink>
          </article>
          <article className="surface p-5 sm:p-6">
            <h2 className="section-title text-lg">草案エディター</h2>
            <p
              className="mt-3 text-sm leading-7"
              data-color="color-text-secondary"
            >
              入力内容から記事のMarkdownファイルを生成します。完成したら記事管理画面から保存してください。
            </p>
            <ActionLink href="/admin/posts/new" className="mt-6">
              草案エディターへ
            </ActionLink>
          </article>
        </div>
      </section>
    </div>
  );
}
