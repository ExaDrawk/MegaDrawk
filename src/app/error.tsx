"use client";

import { ActionButton } from "@/components/ui/Action";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="status-page">
      <main className="status-page-content">
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
        <ActionButton onClick={reset}>
          再試行
        </ActionButton>
      </main>
    </div>
  );
}
