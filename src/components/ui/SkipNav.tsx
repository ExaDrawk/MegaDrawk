/**
 * Skip navigation link — WCAG 2.1 §2.4.1.
 *
 * Hidden until focused via keyboard Tab.
 * Styled to appear as a floating pill when active.
 */
export function SkipNav({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[100]
        focus:inline-block focus:px-4 focus:py-2
        focus:text-sm focus:font-semibold focus:text-white
        focus:rounded-[var(--radius-button)]
      "
      style={{
        background: "var(--color-brand)",
      }}
    >
      メインコンテンツへスキップ
    </a>
  );
}
