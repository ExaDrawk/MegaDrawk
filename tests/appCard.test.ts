import { describe, expect, it } from "vitest";
import { buildAppCardHtml, findAppByPackageId } from "../src/lib/appCard";

describe("findAppByPackageId", () => {
  it("finds TJA Pocket with direct store imagery", () => {
    const app = findAppByPackageId("com.drawk.tjapocket");
    expect(app?.name).toBe("TJA Pocket");
    expect(app?.href).toContain("id=com.drawk.tjapocket");
    expect(app?.description).toContain("リズムゲーム");
    expect(app?.iconUrl).toMatch(
      /^https:\/\/play-lh\.googleusercontent\.com\//,
    );
    expect(app?.screenshotUrl).toMatch(
      /^https:\/\/play-lh\.googleusercontent\.com\//,
    );
  });

  it("returns null for an unknown package id", () => {
    expect(findAppByPackageId("com.drawk.nonexistent")).toBeNull();
  });
});

describe("buildAppCardHtml", () => {
  it("builds an app note from the store icon, description and screenshot", () => {
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).toContain('class="app-card"');
    expect(html).toContain(
      'href="https://play.google.com/store/apps/details?id=com.drawk.tjapocket"',
    );
    expect(html).toContain('src="https://play-lh.googleusercontent.com/');
    expect(html).toContain('class="app-card__description"');
    expect(html).toContain('class="app-card__shot"');
    expect(html).toContain("TJA Pocket");
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain("google-play-badge-ja.png");
    expect(html).not.toContain("app-card__badge");
  });

  it("escapes html special characters in app data", () => {
    const html = buildAppCardHtml("com.drawk.tjapocket");
    expect(html).not.toMatch(/<(?!(?:\/)?(?:aside|div|a|p|img|span)\b)/);
  });

  it("returns null for an unknown package id", () => {
    expect(buildAppCardHtml("com.drawk.nonexistent")).toBeNull();
  });
});
