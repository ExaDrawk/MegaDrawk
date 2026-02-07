import { SITE } from "@/config/site";
import { LAYOUT } from "@/config/theme";
import { ArrowRight } from "lucide-react";

/**
 * Hero section — prominent brand display with CTA.
 *
 * Designed for maximum visual impact as the first viewport.
 * CTA links to the services section for single-page flow.
 */
export function HeroBrand({ delay = 0 }: { delay?: number }) {
  return (
    <header
      className="animate-enter-up text-center pt-32 pb-20 sm:pt-40 sm:pb-28"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Logo mark */}
      <div
        className="animate-float mx-auto mb-10"
        style={{
          width: LAYOUT.logoSize,
          height: LAYOUT.logoSize,
          borderRadius: LAYOUT.logoRadius,
          background:
            "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
          boxShadow:
            "0 8px 32px var(--color-brand-glow), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
        role="img"
        aria-label={`${SITE.name} ロゴ`}
      />

      {/* Site name */}
      <h1
        className="text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none"
        style={
          { fontWeight: "var(--font-heading-weight)" } as React.CSSProperties
        }
      >
        {SITE.name}
      </h1>

      {/* Tagline */}
      <p
        className="mt-4 text-base sm:text-lg tracking-wide max-w-md mx-auto"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {SITE.tagline}
      </p>

      {/* Description */}
      <p
        className="mt-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
        style={{ color: "var(--color-text-muted)" }}
      >
        {SITE.description}
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#services"
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[var(--radius-button)] transition-all duration-[var(--duration-normal)]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
            boxShadow: "0 4px 16px var(--color-brand-glow)",
          }}
        >
          サービスを見る
          <ArrowRight
            size={16}
            className="transition-transform duration-[var(--duration-normal)] group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-button)] transition-all duration-[var(--duration-normal)] hover:bg-[var(--color-surface-overlay-hover)]"
          style={{
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          お問い合わせ
        </a>
      </div>
    </header>
  );
}
