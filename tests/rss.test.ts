import { describe, it, expect } from "vitest";
import { escapeXml } from "@/lib/xml";
import { buildRssFeed, toRssItems } from "@/lib/rss";
import { createBlogPost } from "@/domain/blog/post";

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    expect(escapeXml(`a & b < c > d "e" 'f'`)).toBe(
      "a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;",
    );
  });

  it("keeps safe text untouched", () => {
    expect(escapeXml("制作メモ 2026")).toBe("制作メモ 2026");
  });

  it("never leaves a raw closing tag behind", () => {
    expect(escapeXml("</rss><script>alert(1)</script>")).not.toContain("<");
  });
});

describe("toRssItems", () => {
  it("maps posts to RSS items with per-post URLs and RFC 822 dates", () => {
    const post = createBlogPost({
      title: "Feed Item",
      body: "body text",
      date: "2026-10-01",
    });
    const items = toRssItems([post]);
    expect(items).toHaveLength(1);
    expect(items[0]?.link).toBe("https://megadrawk.com/blog/feed-item");
    expect(items[0]?.pubDate).toBe("Thu, 01 Oct 2026 00:00:00 GMT");
  });

  it("throws on an invalid date instead of emitting a broken feed", () => {
    const post = { ...createBlogPost({ title: "X", body: "y" }), date: "nope" };
    expect(() => toRssItems([post])).toThrow();
  });
});

describe("buildRssFeed", () => {
  it("builds a channel with site identity and escaped entries", () => {
    const post = createBlogPost({
      title: "RSS & <Escaping>",
      body: "本文",
      date: "2026-10-02",
    });
    const xml = buildRssFeed(toRssItems([post]));
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("<title>MEGADRAWK</title>");
    expect(xml).toContain("<link>https://megadrawk.com</link>");
    expect(xml).toContain("<language>ja</language>");
    expect(xml).toContain(
      "<lastBuildDate>Fri, 02 Oct 2026 00:00:00 GMT</lastBuildDate>",
    );
    expect(xml).toContain("RSS &amp; &lt;Escaping&gt;");
    expect(xml).toContain(
      "<guid>https://megadrawk.com/blog/rss-escaping</guid>",
    );
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it("omits lastBuildDate when there are no items", () => {
    expect(buildRssFeed([])).not.toContain("lastBuildDate");
  });
});
