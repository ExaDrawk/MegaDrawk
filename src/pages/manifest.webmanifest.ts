import type { APIRoute } from "astro";
import { SITE } from "@/config/site";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      name: SITE.name,
      short_name: SITE.name,
      description: SITE.description,
      start_url: "/",
      display: "standalone",
      background_color: SITE.themeColor,
      theme_color: SITE.themeColor,
      lang: SITE.language,
      icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
};
