import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * ブログ記事コレクション。src/content/blog/*.md を正本とする。
 * id（URLスラッグ）はファイル名から生成される。
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(300),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD")
      .optional(),
    tags: z.array(z.string().min(1).max(30)).max(10).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
