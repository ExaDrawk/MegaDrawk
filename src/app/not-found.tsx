import Link from "next/link";
import { SITE } from "@/config/site";

/**
 * Custom 404 page.
 *
 * Uses .status-page / .status-page-btn from globals.css.
 * No theme.ts dependency — all visuals via CSS custom properties.
 */
export default function NotFound() {
  return (
    <div className="status-page">
      <main className="text-center">
        <h1 className="text-7xl font-extrabold mb-3 tracking-tight">
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
