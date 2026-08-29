import { BlogPostEditor } from "@/components/admin/BlogPostEditor";

export const metadata = {
  title: "Admin Post Draft",
  description:
    "MEGADRAWK の管理用記事追加画面。記事草案を検証し、createBlogPost 用コードを生成します。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPostNewPage() {
  return (
    <div className="animate-enter-up">
      <section className="page-section">
        <header className="page-header">
          <p className="eyebrow">
            Admin / Posts / New
          </p>
          <h1 className="page-title">
            記事追加の管理画面
          </h1>
          <p className="page-description">
            UI層は入力と状態表示、ドメイン層は記事生成ルール、インフラ層は将来のCMSやDB差し替えを担当する前提です。
            今回は静的運用を壊さないため、保存処理を持たない最小構成で、
            `src/config/blog.ts` に追加するコード生成までを管理画面で完結させています。
          </p>
        </header>

        <BlogPostEditor />
      </section>
    </div>
  );
}
