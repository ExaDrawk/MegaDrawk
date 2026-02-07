import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Web App Manifest.
 * All values derived from SITE config (single source of truth).
 * themeColor references SITE.themeColor (#0f172a = Tailwind slate-900).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    lang: SITE.language,
  };
}
