import Link from "next/link";
import { SITE } from "@/config/site";

export default function NotFound() {
  return (
    <div className="status-page">
      <main className="text-center">
        <h1
          className="text-7xl font-extrabold mb-3 tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          404
        </h1>
        <p
          className="mb-8 text-sm max-w-sm mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          お探しのページは見つかりませんでした。
        </p>
        <Link href="/" className="status-page-btn">
          {SITE.name} トップに戻る
        </Link>
      </main>
    </div>
  );
}
