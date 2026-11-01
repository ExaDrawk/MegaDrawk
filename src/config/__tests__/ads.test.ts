import { describe, expect, it } from "vitest";
import { isAdEligiblePath } from "../ads";

describe("isAdEligiblePath", () => {
  it("allows the home, about, blog index, articles and tag pages", () => {
    for (const path of [
      "/",
      "",
      "/about",
      "/about/",
      "/blog",
      "/blog/",
      "/blog/2026-10-26-tjapocket-skin-import",
      "/blog/2026-10-26-tjapocket-skin-import/",
      "/tags/TJA%20Pocket",
    ]) {
      expect(isAdEligiblePath(path), path).toBe(true);
    }
  });

  it("rejects legal, contact, error, admin and asset pages", () => {
    for (const path of [
      "/privacy",
      "/terms",
      "/contact",
      "/404",
      "/admin",
      "/admin/articles",
      "/blog-assets/x.png",
      "/rss.xml",
    ]) {
      expect(isAdEligiblePath(path), path).toBe(false);
    }
  });
});
