import type { APIRoute } from "astro";
import { SITE } from "@/config/site";
export const GET: APIRoute = () =>
  new Response(
    "User-agent: Mediapartners-Google\nAllow: /\nDisallow: /admin\n\n" +
      "User-agent: AdsBot-Google\nAllow: /\nDisallow: /admin\n\n" +
      "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: " +
      SITE.url +
      "/sitemap.xml\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
