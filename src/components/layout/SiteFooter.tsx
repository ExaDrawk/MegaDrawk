import Image from "next/image";
import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text-muted)",
      }}
    >
      <div
        className="mx-auto px-6 sm:px-8 py-12"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* ── Site Info ── */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label={SITE.name}
            >
              <Image src="/icon.svg" alt="" width={20} height={20} aria-hidden="true" />
              <Image
                src="/logo.svg"
                alt={SITE.name}
                width={96}
                height={20}
                className="object-contain"
              />
            </Link>
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              {SITE.tagline}
            </p>
            <a
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm transition-colors duration-150"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="X (Twitter)"
            >
              {SITE.social.xHandle}
            </a>
          </div>

          {/* ── Link Groups ── */}
          {Object.values(FOOTER_LINKS).map((group) => (
            <div key={group.label}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:text-[var(--color-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Copyright ── */}
        <div
          className="mt-10 pt-6 text-xs"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          <p>&copy; {year} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
