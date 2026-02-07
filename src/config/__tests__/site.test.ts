import { describe, it, expect } from "vitest";
import { SITE, SERVICES, FEATURES, NAV_LINKS, FOOTER_LINKS } from "@/config/site";

describe("SITE config", () => {
  it("has all required fields", () => {
    expect(SITE.name).toBeDefined();
    expect(SITE.legalName).toBeDefined();
    expect(SITE.tagline).toBeDefined();
    expect(SITE.description).toBeDefined();
    expect(SITE.domain).toBeDefined();
    expect(SITE.url).toBeDefined();
    expect(SITE.locale).toBeDefined();
    expect(SITE.language).toBeDefined();
    expect(SITE.themeColor).toBeDefined();
    expect(SITE.contactEmail).toBeDefined();
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

  it("contactEmail is a valid email format", () => {
    expect(SITE.contactEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

describe("SERVICES config", () => {
  it("has at least one service", () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(1);
  });

  it("each service has required fields", () => {
    for (const service of SERVICES) {
      expect(service.id).toBeDefined();
      expect(service.name).toBeDefined();
      expect(service.subdomain).toBeDefined();
      expect(service.url).toBeDefined();
      expect(service.description).toBeDefined();
    }
  });

  it("each service URL is HTTPS", () => {
    for (const service of SERVICES) {
      expect(service.url).toMatch(/^https:\/\//);
    }
  });

  it("each service subdomain matches its URL hostname", () => {
    for (const service of SERVICES) {
      const url = new URL(service.url);
      expect(url.hostname).toBe(service.subdomain);
    }
  });
});

describe("FEATURES config", () => {
  it("has at least one feature", () => {
    expect(FEATURES.length).toBeGreaterThanOrEqual(1);
  });

  it("each feature has required fields", () => {
    for (const feature of FEATURES) {
      expect(feature.id).toBeDefined();
      expect(feature.icon).toBeDefined();
      expect(feature.title).toBeDefined();
      expect(feature.description).toBeDefined();
    }
  });

  it("feature IDs are unique", () => {
    const ids = FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
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
});
