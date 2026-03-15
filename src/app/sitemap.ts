import type { MetadataRoute } from "next";
import { getLatestBlogUpdateDate, getPublishedBlogPosts } from "@/config/blog";
import { SITE } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestBlogUpdate = getLatestBlogUpdateDate();
  const fallbackDate = new Date().toISOString();
  const lastBlogModified = latestBlogUpdate ?? fallbackDate;
  const posts = getPublishedBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: latestBlogUpdate ?? fallbackDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: lastBlogModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/contact`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terms`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog#${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
