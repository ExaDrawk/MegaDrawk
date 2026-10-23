import { SITE, FOOTER_LINKS } from "@/config/site";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__credit">
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <nav aria-label="フッターナビゲーション">
          {[...FOOTER_LINKS.pages.links, ...FOOTER_LINKS.legal.links].map(
            (link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ),
          )}
          <a
            href={SITE.social.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            X
          </a>
        </nav>
      </div>
    </footer>
  );
}
