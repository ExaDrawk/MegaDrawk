import { SITE, FOOTER_LINKS } from "@/config/site";
import { BrandLockup, getBrandLockupContainerClassName } from "@/components/layout/BrandLockup";
import { XProfileLink } from "@/components/ui/XProfileLink";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__identity">
            <a
              href="/"
              className={`${getBrandLockupContainerClassName("footer")} site-brand`}
              aria-label={`${SITE.name} トップページ`}
            >
              <BrandLockup preset="footer" />
            </a>
            <p className="site-footer__tagline">作品と活動記録を、ひとつの場所に。</p>
            <XProfileLink
              href={SITE.social.x}
              label={SITE.social.xHandle}
              ariaLabel="X (Twitter)"
              className="action action-dark"
              iconSize={14}
              showExternalIcon
            />
          </div>

          <nav className="site-footer__nav" aria-label="フッターナビゲーション">
            <p className="site-footer__nav-title">Index</p>
            {Object.values(FOOTER_LINKS).map((group) => (
              <div key={group.label}>
                <p className="mono-label site-footer__group-label">{group.label}</p>
                {group.links.map((link) => (
                  <a key={link.href} href={link.href} className="site-footer__link">
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>{SITE.domain}</span>
          <span>
            &copy; {year} {SITE.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
