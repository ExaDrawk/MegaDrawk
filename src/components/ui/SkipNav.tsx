export function SkipNav({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:left-3 focus:top-3 focus:z-[100]
        focus:inline-flex focus:min-h-11 focus:items-center focus:px-4 focus:py-2
        focus:rounded-md focus:bg-[var(--color-primary)]
        focus:text-sm focus:font-semibold focus:text-white
      "
    >
      メインコンテンツへスキップ
    </a>
  );
}
