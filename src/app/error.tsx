"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="status-page">
      <main className="text-center">
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          エラーが発生しました
        </h1>
        <p
          className="mb-8 text-sm max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          予期しないエラーが発生しました。再度お試しください。
        </p>
        <button type="button" onClick={reset} className="status-page-btn">
          再試行
        </button>
      </main>
    </div>
  );
}
