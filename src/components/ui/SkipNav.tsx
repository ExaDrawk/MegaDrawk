export function SkipNav({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-3 focus:left-3 focus:z-[100]
        focus:inline-block focus:px-4 focus:py-2
        focus:text-sm focus:font-semibold focus:text-white
        focus:rounded-md
      "
      style={{ background: "var(--color-accent)" }}
    >
      メインコンテンツへスキップ
    </a>
  );
}
