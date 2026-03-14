import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Dynamic robots.txt generation.
 * Replaces static public/robots.txt to avoid hardcoded domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
