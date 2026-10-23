import { describe, it, expect } from "vitest";
import { parseStorePage } from "../scripts/store-metadata.mjs";
const make = (
  changes: Record<string, unknown> = {},
  canonical = "com.drawk.roppo",
) =>
  '<meta property="og:url" content="https://play.google.com/store/apps/details?id=' +
  canonical +
  '"><meta property="og:description" content="法令を検索 &amp; 閲覧"><script type="application/ld+json">' +
  JSON.stringify({
    "@type": "SoftwareApplication",
    name: "どこでも六法",
    author: { name: "Drawk" },
    image: "https://play-lh.googleusercontent.com/icon",
    ...changes,
  }) +
  "</script>";
describe("Google Play metadata boundary", () => {
  it("extracts decoded text and the canonical production URL", () => {
    expect(parseStorePage(make(), "com.drawk.roppo")).toMatchObject({
      name: "どこでも六法",
      description: "法令を検索 & 閲覧",
      href: "https://play.google.com/store/apps/details?id=com.drawk.roppo",
    });
  });
  it("rejects unrelated listings, publisher changes and untrusted images", () => {
    expect(() =>
      parseStorePage(make({}, "com.other.app"), "com.drawk.roppo"),
    ).toThrow();
    expect(() =>
      parseStorePage(make({ author: { name: "Other" } }), "com.drawk.roppo"),
    ).toThrow();
    for (const image of [
      "http://play-lh.googleusercontent.com/icon",
      "https://evil.invalid/icon",
      "data:image/svg+xml,x",
    ])
      expect(() =>
        parseStorePage(make({ image }), "com.drawk.roppo"),
      ).toThrow();
  });
  it("fails clearly on login pages, removed apps or malformed metadata", () => {
    expect(() => parseStorePage("<h1>Login</h1>", "com.drawk.roppo")).toThrow();
    expect(() =>
      parseStorePage(make({ name: "" }), "com.drawk.roppo"),
    ).toThrow();
  });
});
