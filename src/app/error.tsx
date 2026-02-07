"use client";

/**
 * Global error boundary.
 * Must be a client component (Next.js requirement).
 *
 * INTENTIONALLY uses hardcoded Tailwind classes instead of theme config
 * to minimize import dependencies — if the error is caused by a config
 * import failure, this page must still render correctly.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center px-6">
      <main className="text-center" role="main">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-slate-400 mb-8 text-sm max-w-md">
          予期しないエラーが発生しました。再度お試しください。
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          再試行
        </button>
      </main>
    </div>
  );
}
