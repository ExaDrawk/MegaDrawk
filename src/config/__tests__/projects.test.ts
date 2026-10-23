import { describe, it, expect } from "vitest";
import { PROJECTS } from "../projects";
describe("published product catalog", () => {
  it("contains the three public Android releases and the subtitle extension", () => {
    expect(PROJECTS).toHaveLength(4);
    for (const id of ["roppo", "syopita", "tjapocket"]) {
      const p = PROJECTS.find(
        (p) =>
          p.href ===
          "https://play.google.com/store/apps/details?id=com.drawk." + id,
      );
      expect(p).toBeDefined();
      expect(p?.linkLabel).toBe("Google Play");
    }
    expect(
      PROJECTS.some((p) => p.href.includes("ndgdichjchjkakemdjmimflnjipcpbbd")),
    ).toBe(true);
  });
  it("contains no removed product or testing links", () => {
    expect(JSON.stringify(PROJECTS)).not.toMatch(
      /条文スコープ|mmmciilhhdlldepiemjjjajiphcphgcp|apps\/testing|テスト公開/,
    );
  });
  it("uses unique HTTPS store links and local image assets", () => {
    expect(new Set(PROJECTS.map((p) => p.href)).size).toBe(PROJECTS.length);
    for (const p of PROJECTS) {
      expect(new URL(p.href).protocol).toBe("https:");
      expect(p.imageSrc).toMatch(/^\/images\/projects\/[a-z0-9-]+\.png$/);
    }
  });
});
