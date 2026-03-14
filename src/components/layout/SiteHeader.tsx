"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, NAV_LINKS } from "@/config/site";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: "var(--header-height)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between h-full"
        style={{
          maxWidth: "var(--max-width)",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight transition-opacity duration-150 hover:opacity-70"
          style={{ color: "var(--color-text)" }}
          aria-label={`${SITE.name} トップページ`}
          onClick={closeMenu}
        >
          {SITE.name}
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden sm:block" aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
                    style={{
                      color: isActive
                        ? "var(--color-text)"
                        : "var(--color-text-secondary)",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Mobile Menu Button ── */}
        <button
          type="button"
          className="sm:hidden p-2 -mr-2 rounded-md transition-colors duration-150"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
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

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="sm:hidden"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-border)",
          }}
          aria-label="モバイルナビゲーション"
        >
          <ul className="flex flex-col py-2 px-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-sm font-medium transition-colors duration-150"
                    style={{
                      color: isActive
                        ? "var(--color-text)"
                        : "var(--color-text-secondary)",
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
