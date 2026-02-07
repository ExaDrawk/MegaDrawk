import { describe, it, expect } from "vitest";
import { SITE, SERVICES } from "@/config/site";

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
