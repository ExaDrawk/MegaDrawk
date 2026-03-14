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
      STAGGER.section1,
      STAGGER.section2,
      STAGGER.section3,
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
  it("maxWidth is a valid CSS dimension", () => {
    expect(LAYOUT.maxWidth).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
  });

  it("contentWidth is a valid CSS dimension", () => {
    expect(LAYOUT.contentWidth).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
  });

  it("headerHeight is a valid CSS dimension", () => {
    expect(LAYOUT.headerHeight).toMatch(/^\d+(\.\d+)?(rem|px|em)$/);
  });
});
