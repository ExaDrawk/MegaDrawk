import { SITE, FOOTER_LINKS, NAV_LINKS } from "@/config/site";

/**
 * Full site footer with link groups, branding, and legal info.
 *
 * Pure RSC. Year computed at build time.
 * All content derived from config (single source of truth).
 */
export function SiteFooter({ delay = 0 }: { delay?: number }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="animate-enter-fade w-full border-t"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: "var(--color-border-subtle)",
        color: "var(--color-text-muted)",
      }}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16">
        {/* Top section: Brand + Link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-4 group">
              <div
                className="w-8 h-8 rounded-lg shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
                }}
                aria-hidden="true"
              />
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {SITE.name}
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              {SITE.tagline}
            </p>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((group) => (
            <div key={group.label}>
              <h3
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-[var(--duration-normal)] hover:text-[var(--color-brand-light)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t text-xs"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <p>&copy; {year} {SITE.legalName}. All rights reserved.</p>
          <nav aria-label="フッターナビゲーション">
            <ul className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors duration-[var(--duration-normal)] hover:text-[var(--color-brand-light)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
