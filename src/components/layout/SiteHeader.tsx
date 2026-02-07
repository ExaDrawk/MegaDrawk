import { SITE, NAV_LINKS } from "@/config/site";

/**
 * Site header — fixed navigation bar.
 *
 * Pure RSC, no client JS. Uses CSS backdrop-blur for glass effect.
 * Navigation links are derived from NAV_LINKS config (single source of truth).
 */
export function SiteHeader({ delay = 0 }: { delay?: number }) {
  return (
    <header
      className="animate-enter-fade fixed top-0 left-0 right-0 z-50"
      style={{
        animationDelay: `${delay}ms`,
        background: "rgba(11, 17, 33, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-5 sm:px-8 h-16">
        {/* Logo + Brand */}
        <a
          href="/"
          className="flex items-center gap-3 group"
          aria-label={`${SITE.name} トップページ`}
        >
          <div
            className="w-8 h-8 rounded-lg shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
            }}
            aria-hidden="true"
          />
          <span
            className="text-lg font-bold tracking-tight transition-colors duration-[var(--duration-normal)] group-hover:text-[var(--color-brand-light)]"
            style={{ color: "var(--color-text-primary)" }}
          >
            {SITE.name}
          </span>
        </a>

        {/* Navigation */}
        <nav aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-colors duration-[var(--duration-normal)] hover:bg-[var(--color-surface-overlay-hover)]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
