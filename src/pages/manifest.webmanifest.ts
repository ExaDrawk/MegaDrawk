import type { APIRoute } from "astro";
import { SITE } from "@/config/site";
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: SITE.name,
      short_name: SITE.name,
      description: SITE.description,
      start_url: "/",
      display: "standalone",
      background_color: SITE.themeColor,
      theme_color: SITE.themeColor,
      lang: SITE.language,
      icons: [
        { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
        {
          src: "/images/icons/icon-192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "/images/icons/icon-512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
