import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/config/site";
import {
  BrandLockup,
  getBrandLockupContainerClassName,
} from "@/components/layout/BrandLockup";
import { XProfileLink } from "@/components/ui/XProfileLink";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
        color: "var(--color-text-muted)",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="mx-auto py-12 sm:py-14"
        style={{
          maxWidth: "var(--max-width)",
          paddingInline: "var(--space-page-x)",
        }}
      >
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className={`${getBrandLockupContainerClassName("footer")} min-h-11 rounded-lg transition-opacity duration-150 hover:opacity-80`}
              aria-label={SITE.name}
            >
              <BrandLockup preset="footer" />
            </Link>
            {SITE.tagline ? (
              <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                {SITE.tagline}
              </p>
            ) : null}
            <XProfileLink
              href={SITE.social.x}
              label={SITE.social.xHandle}
              ariaLabel="X (Twitter)"
              className="action action-secondary mt-4 rounded-full"
              iconSize={14}
              showExternalIcon
            />
          </div>

          {Object.values(FOOTER_LINKS).map((group) => (
            <div key={group.label}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {group.label}
              </h3>
              <ul className="flex flex-col">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 pt-6 text-xs leading-6"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          <p>&copy; {year} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
