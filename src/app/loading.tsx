import { LAYOUT } from "@/config/theme";

/**
 * Loading skeleton — route transition state.
 *
 * Uses CSS custom properties from globals.css + LAYOUT tokens from theme.ts.
 * Matches the hero section shape to minimize perceived layout shift.
 */
export default function Loading() {
  return (
    <div className="status-page">
      <div className="flex flex-col items-center gap-5 animate-pulse">
        <div
          className="rounded-[var(--radius-card)]"
          style={{
            width: LAYOUT.logoSize,
            height: LAYOUT.logoSize,
            borderRadius: LAYOUT.logoRadius,
            background: "var(--color-surface-overlay)",
          }}
        />
        <div
          className="w-64 h-9 rounded-lg"
          style={{ background: "var(--color-surface-overlay)" }}
        />
        <div
          className="w-40 h-5 rounded-md"
          style={{ background: "var(--color-surface-overlay)" }}
        />
        <div
          className="w-full max-w-xl h-24 mt-6 rounded-[var(--radius-card)]"
          style={{ background: "var(--color-surface-overlay)" }}
        />
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-[var(--radius-card)]"
              style={{ background: "var(--color-surface-overlay)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
