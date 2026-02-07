import { describe, it, expect } from "vitest";
import { UI, ANIMATION_DELAYS } from "@/config/theme";

describe("UI theme config", () => {
  it("has background class", () => {
    expect(UI.background).toBeDefined();
    expect(typeof UI.background).toBe("string");
  });

  it("has text color variants", () => {
    expect(UI.text.primary).toBeDefined();
    expect(UI.text.secondary).toBeDefined();
    expect(UI.text.muted).toBeDefined();
    expect(UI.text.accent).toBeDefined();
  });

  it("has card styles", () => {
    expect(UI.card.base).toBeDefined();
    expect(UI.card.hover).toBeDefined();
  });
});

describe("ANIMATION_DELAYS", () => {
  it("branding is the first (zero delay)", () => {
    expect(ANIMATION_DELAYS.branding).toBe(0);
  });

  it("serviceCard comes after branding", () => {
    expect(ANIMATION_DELAYS.serviceCard).toBeGreaterThan(
      ANIMATION_DELAYS.branding
    );
  });

  it("footer comes after serviceCard", () => {
    expect(ANIMATION_DELAYS.footer).toBeGreaterThan(
      ANIMATION_DELAYS.serviceCard
    );
  });

  it("all values are non-negative integers", () => {
    for (const value of Object.values(ANIMATION_DELAYS)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});
