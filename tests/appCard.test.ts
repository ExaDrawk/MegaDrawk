import { describe, expect, it } from "vitest";
import { buildAppCardHtml, findAppByPackageId } from "../src/lib/appCard";

describe("findAppByPackageId", () => {
  it("finds TJA Pocket by package id", () => {
    const app = findAppByPackageId("com.drawk.tjapocket");
    expect(app?.name).toBe("TJA Pocket");
    expect(app?.href).toContain("id=com.drawk.tjapocket");
  });

  it("returns null for an unknown package id", () => {
    expect(findAppByPackageId("com.drawk.nonexistent")).toBeNull();
  });
});

describe("buildAppCardHtml", () => {
  it("builds the official Google Play badge with the app name", () => {
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).toContain('class="app-card"');
    expect(html).toContain(
      'href="https://play.google.com/store/apps/details?id=com.drawk.tjapocket"',
    );
    expect(html).toContain('src="/images/google-play-badge-ja.png"');
    expect(html).toContain('alt="Google Play で手に入れよう"');
    expect(html).toContain('aria-label="TJA Pocket を Google Play で開く"');
    expect(html).toContain("TJA Pocket");
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain("app-card__icon");
    expect(html).not.toContain("app-card__description");
  });

  it("escapes html special characters in app data", () => {
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).not.toMatch(/<(?!(?:\/)?(?:aside|a|p|img)\b)/);
  });

  it("returns null for an unknown package id", () => {
    expect(buildAppCardHtml("com.drawk.nonexistent")).toBeNull();
  });
});
