import { describe, it, expect } from "vitest";
import { LAYOUT } from "@/config/theme";

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
