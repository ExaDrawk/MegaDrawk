import { describe, it, expect } from "vitest";
import { STAGGER, LAYOUT } from "@/config/theme";

describe("STAGGER animation delays", () => {
  it("header comes first (zero delay)", () => {
    expect(STAGGER.header).toBe(0);
  });

  it("hero comes after header", () => {
    expect(STAGGER.hero).toBeGreaterThan(STAGGER.header);
  });

  it("sections are in ascending order", () => {
    const ordered = [
      STAGGER.header,
      STAGGER.hero,
      STAGGER.about,
      STAGGER.features,
      STAGGER.services,
      STAGGER.cta,
      STAGGER.footer,
    ];
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i]).toBeGreaterThan(ordered[i - 1]!);
    }
  });

  it("all values are non-negative integers", () => {
    for (const value of Object.values(STAGGER)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});

describe("LAYOUT tokens", () => {
  it("logoSize is a valid CSS dimension", () => {
    expect(LAYOUT.logoSize).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
  });

  it("logoRadius is a valid CSS dimension", () => {
    expect(LAYOUT.logoRadius).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
  });
});
