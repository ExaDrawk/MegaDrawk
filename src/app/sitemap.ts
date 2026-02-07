import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Dynamic sitemap generation.
 * References SITE.url as the single source of truth for the domain.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
