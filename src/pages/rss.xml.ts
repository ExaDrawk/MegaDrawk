import type { APIRoute } from "astro";
import { getPublishedBlogPosts } from "@/config/blog";
import { buildRssFeed, toRssItems } from "@/lib/rss";

export const GET: APIRoute = async () =>
  new Response(buildRssFeed(toRssItems(await getPublishedBlogPosts())), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
