import type { APIRoute } from "astro";
import { SITE } from "@/config/site";
import { getLatestBlogUpdateDate, getPublishedBlogPosts } from "@/config/blog";
import { escapeXml } from "@/lib/xml";

export const GET: APIRoute = () => {
  const date = getLatestBlogUpdateDate();
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const entries = [
    ...staticRoutes.map((route) => ({
      // ホームはcanonicalと一致させるため末尾スラッシュ付きにする
      loc: SITE.url + (route || "/"),
      lastmod: (route === "" || route === "/blog") && date ? date : null,
    })),
    ...getPublishedBlogPosts().map((post) => ({
      loc: SITE.url + "/blog/" + post.id,
      lastmod: post.updatedAt,
    })),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries
      .map(
        (entry) =>
          "<url><loc>" +
          escapeXml(entry.loc) +
          "</loc>" +
          (entry.lastmod ? "<lastmod>" + entry.lastmod + "</lastmod>" : "") +
          "</url>",
      )
      .join("") +
    "</urlset>";
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
