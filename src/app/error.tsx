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
        <h1 className="page-title text-2xl font-bold tracking-tight mb-2">エラーが発生しました</h1>
        <p className="page-description mx-auto mb-8">
          予期しないエラーが発生しました。再度お試しください。
        </p>
        <ActionButton onClick={reset}>
          再試行
        </ActionButton>
      </main>
    </div>
  );
}
