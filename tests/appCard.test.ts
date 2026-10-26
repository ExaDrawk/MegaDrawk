import { describe, expect, it } from "vitest";
import { buildAppCardHtml, findAppByPackageId } from "../src/lib/appCard";

describe("findAppByPackageId", () => {
  it("finds TJA Pocket by package id", () => {
    const app = findAppByPackageId("com.drawk.tjapocket");
    expect(app?.name).toBe("TJA Pocket");
    expect(app?.href).toContain("id=com.drawk.tjapocket");
    expect(app?.iconSrc).toMatch(/^\/images\/projects\/.+\.png$/);
  });

  it("returns null for an unknown package id", () => {
    expect(findAppByPackageId("com.drawk.nonexistent")).toBeNull();
  });
});

describe("buildAppCardHtml", () => {
  it("builds a card with store link, icon and escaped texts", () => {
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).toContain('class="app-card"');
    expect(html).toContain(
      'href="https://play.google.com/store/apps/details?id=com.drawk.tjapocket"',
    );
    expect(html).toContain('src="/images/projects/');
    expect(html).toContain("TJA Pocket");
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("escapes html special characters in app data", () => {
    // store-listingsの値に < > が入ってもカードが壊れない
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).not.toMatch(/<(?!(?:\/)?(?:div|a|p|h3|img|span)\b)/);
  });

  it("returns null for an unknown package id", () => {
    expect(buildAppCardHtml("com.drawk.nonexistent")).toBeNull();
  });
});
