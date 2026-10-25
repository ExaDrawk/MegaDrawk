import { SITE } from "@/config/site";
import type { BlogPost } from "@/domain/blog/post";
import { escapeXml } from "@/lib/xml";

export interface RssItem {
  readonly title: string;
  readonly link: string;
  readonly description: string;
  readonly pubDate: string;
}

function toRfc822(date: string): string {
  const parsed = new Date(date + "T00:00:00Z");
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string provided to RSS feed: ${date}`);
  }
  return parsed.toUTCString();
}

export function toRssItems(posts: readonly BlogPost[]): readonly RssItem[] {
  return posts.map((post) => ({
    title: post.title,
    link: `${SITE.url}/blog/${post.id}`,
    description: post.excerpt,
    pubDate: toRfc822(post.date),
  }));
}

export function buildRssFeed(items: readonly RssItem[]): string {
  const latest = items[0]?.pubDate;
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0">' +
    "<channel>" +
    `<title>${escapeXml(SITE.name)}</title>` +
    `<link>${SITE.url}</link>` +
    `<description>${escapeXml(SITE.description)}</description>` +
    `<language>${SITE.language}</language>` +
    (latest ? `<lastBuildDate>${latest}</lastBuildDate>` : "") +
    items
      .map(
        (item) =>
          "<item>" +
          `<title>${escapeXml(item.title)}</title>` +
          `<link>${item.link}</link>` +
          `<guid>${item.link}</guid>` +
          `<pubDate>${item.pubDate}</pubDate>` +
          `<description>${escapeXml(item.description)}</description>` +
          "</item>",
      )
      .join("") +
    "</channel>" +
    "</rss>"
  );
}
