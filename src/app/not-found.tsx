import Link from "next/link";
import { SITE } from "@/config/site";
import { UI } from "@/config/theme";

/**
 * Custom 404 page.
 * Uses theme constants from config (DRY).
 * Semantic HTML with proper heading hierarchy.
 */
export default function NotFound() {
  return (
    <div
      className={`min-h-screen ${UI.background} ${UI.text.primary} flex flex-col items-center justify-center px-6`}
    >
      <main className="text-center" role="main">
        <h1 className="text-7xl font-black mb-2 tracking-tight">404</h1>
        <p className={`${UI.text.secondary} mb-8 text-sm`}>
          お探しのページは見つかりませんでした。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {SITE.name} トップに戻る
        </Link>
      </main>
    </div>
  );
}
