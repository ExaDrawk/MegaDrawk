"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE, NAV_LINKS } from "@/config/site";
import { Menu, X } from "lucide-react";
import {
  BrandLockup,
  getBrandLockupContainerClassName,
} from "@/components/layout/BrandLockup";

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
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        height: "var(--header-height)",
        background: "rgba(245, 247, 251, 0.86)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between"
        style={{
          maxWidth: "var(--max-width)",
          paddingInline: "var(--space-page-x)",
        }}
      >
        <a
          href="/"
          className={`${getBrandLockupContainerClassName("header")} min-h-11 rounded-lg transition-opacity duration-150 hover:opacity-80`}
          aria-label={`${SITE.name} トップページ`}
          onClick={closeMenu}
        >
          <BrandLockup preset="header" />
        </a>

        <nav className="hidden sm:block" aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="action action-ghost min-h-11 rounded-full px-4"
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
          className="site-menu-trigger action action-ghost -mr-2 min-h-11 min-w-11 p-2"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="mobile-menu sm:hidden"
          aria-label="モバイルナビゲーション"
        >
          <ul className="flex flex-col p-2">
            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <a
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={link.href}
                    className="action action-ghost w-full justify-start px-3"
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
