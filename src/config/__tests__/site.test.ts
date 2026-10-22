import { describe, it, expect } from "vitest";
import { SITE, NAV_LINKS, FOOTER_LINKS } from "@/config/site";

describe("SITE config", () => {
  it("has all required fields", () => {
    expect(SITE.name).toBeDefined();
    expect(SITE.ownerName).toBeDefined();
    expect(SITE.description).toBeDefined();
    expect(SITE.domain).toBeDefined();
    expect(SITE.url).toBeDefined();
    expect(SITE.email).toBeDefined();
    expect(SITE.locale).toBeDefined();
    expect(SITE.language).toBeDefined();
    expect(SITE.themeColor).toBeDefined();
    expect(SITE.keywords.length).toBeGreaterThan(0);
    expect(SITE.social).toBeDefined();
    expect(SITE.social.x).toBeDefined();
    expect(SITE.social.xHandle).toBeDefined();
  });

  it("email is a valid address on the site domain", () => {
    expect(SITE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(SITE.email.endsWith(`@${SITE.domain}`)).toBe(true);
  });

  it("url starts with https://", () => {
    expect(SITE.url).toMatch(/^https:\/\//);
  });

  it("url contains the domain", () => {
    expect(SITE.url).toContain(SITE.domain);
  });

  it("themeColor is a valid hex color", () => {
    expect(SITE.themeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("locale is a valid BCP 47 variant", () => {
    expect(SITE.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
  });

  it("social X URL is valid", () => {
    expect(SITE.social.x).toMatch(/^https:\/\/x\.com\//);
  });

  it("social X handle starts with @", () => {
    expect(SITE.social.xHandle).toMatch(/^@/);
  });

  it("distinguishes site name from owner name", () => {
    expect(SITE.name).not.toBe(SITE.ownerName);
  });
});

describe("NAV_LINKS config", () => {
  it("has at least one link", () => {
    expect(NAV_LINKS.length).toBeGreaterThanOrEqual(1);
  });

  it("each link has label and href", () => {
    for (const link of NAV_LINKS) {
      expect(link.label).toBeDefined();
      expect(link.href).toBeDefined();
    }
  });

  it("each link href starts with /", () => {
    for (const link of NAV_LINKS) {
      expect(link.href).toMatch(/^\//);
    }
  });
});

describe("FOOTER_LINKS config", () => {
  it("has at least one group", () => {
    expect(Object.keys(FOOTER_LINKS).length).toBeGreaterThanOrEqual(1);
  });

  it("each group has label and non-empty links", () => {
    for (const group of Object.values(FOOTER_LINKS)) {
      expect(group.label).toBeDefined();
      expect(group.links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("each link has label and href", () => {
    for (const group of Object.values(FOOTER_LINKS)) {
      for (const link of group.links) {
        expect(link.label).toBeDefined();
        expect(link.href).toBeDefined();
      }
    }
  });

  it("pages group keeps the same knowledge as NAV_LINKS", () => {
    expect(FOOTER_LINKS.pages.links).toEqual(NAV_LINKS);
  });
});
