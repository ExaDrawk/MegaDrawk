"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE, NAV_LINKS } from "@/config/site";
import { Menu, X } from "lucide-react";
import { BrandLockup, getBrandLockupContainerClassName } from "@/components/layout/BrandLockup";

export function SiteHeader({ pathname }: { pathname: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    firstMenuLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a
          href="/"
          className={`${getBrandLockupContainerClassName("header")} site-brand`}
          aria-label={`${SITE.name} トップページ`}
          onClick={closeMenu}
        >
          <BrandLockup preset="header" />
        </a>

        <p className="site-header__mark" aria-hidden="true">
          independent / builder&apos;s index
        </p>

        <nav className="site-nav" aria-label="メインナビゲーション">
          <ul className="site-nav__list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="site-nav__link"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="site-menu-trigger"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="モバイルナビゲーション">
          <ul className="site-nav__list">
            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <a
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={link.href}
                    className="site-nav__link"
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
