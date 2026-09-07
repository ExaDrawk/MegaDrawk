import type { Metadata } from "next";
import { BlogPostEditor } from "@/components/admin/BlogPostEditor";

export const metadata: Metadata = {
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
    <div>
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title text-3xl font-bold tracking-tight">記事追加の管理画面</h1>
          <p className="page-description mt-2">
            記事草案の作成、入力検証、および設定ファイル用コードの生成を行います。
          </p>
        </header>

        <BlogPostEditor />
      </section>
    </div>
  );
}
