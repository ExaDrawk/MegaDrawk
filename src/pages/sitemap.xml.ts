import type { APIRoute } from "astro";
import { SITE } from "@/config/site";
import { getLatestBlogUpdateDate } from "@/config/blog";
export const GET: APIRoute = () => {
  const date = getLatestBlogUpdateDate();
  const routes = ["", "/about", "/blog", "/contact", "/privacy", "/terms"];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    routes
      .map(
        (route) =>
          "<url><loc>" +
          SITE.url +
          route +
          "</loc>" +
          ((route === "" || route === "/blog") && date
            ? "<lastmod>" + date + "</lastmod>"
            : "") +
          "</url>",
      )
      .join("") +
    "</urlset>";
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
