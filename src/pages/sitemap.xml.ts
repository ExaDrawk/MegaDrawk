import type { APIRoute } from "astro";
import { getLatestBlogUpdateDate, getPublishedBlogPosts } from "@/config/blog";
import { SITE } from "@/config/site";

export const prerender = true;

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ??
      character,
  );
}

export const GET: APIRoute = () => {
  const fallbackDate = "2026-01-01";
  const latestBlogUpdate = getLatestBlogUpdateDate() ?? fallbackDate;
  const routes: Array<[string, string]> = [
    [SITE.url, latestBlogUpdate],
    [`${SITE.url}/about`, fallbackDate],
    [`${SITE.url}/blog`, latestBlogUpdate],
    [`${SITE.url}/contact`, fallbackDate],
    [`${SITE.url}/privacy`, fallbackDate],
    [`${SITE.url}/terms`, fallbackDate],
    ...getPublishedBlogPosts().map((post): [string, string] => [
      `${SITE.url}/blog#${post.id}`,
      post.updatedAt,
    ]),
  ];

  const body = routes
    .map(
      ([url, lastModified]) =>
        `<url><loc>${escapeXml(url)}</loc><lastmod>${lastModified}</lastmod></url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
