import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/domain/blog/post";
import {
  calculateReadingMinutes,
  countTags,
  pickAdjacentPosts,
  pickRelatedPosts,
} from "@/lib/blogUtils";

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: "post",
    title: "記事",
    description: "要約",
    date: "2026-01-01",
    updatedAt: "2026-01-01",
    tags: [],
    draft: false,
    body: "",
    readingMinutes: 1,
    ...overrides,
  };
}

describe("calculateReadingMinutes", () => {
  it("returns at least one minute for short bodies", () => {
    expect(calculateReadingMinutes("短い本文")).toBe(1);
  });

  it("scales with the prose length in Japanese characters", () => {
    // 550文字/分 → 1100文字で2分
    const body = "あ".repeat(1100);
    expect(calculateReadingMinutes(body)).toBe(2);
  });

  it("counts code blocks with a lighter weight", () => {
    const prose = "あ".repeat(550);
    const code = "```js\n" + "a".repeat(1100) + "\n```";
    expect(calculateReadingMinutes(prose + code)).toBe(2);
  });
});

describe("pickRelatedPosts", () => {
  const current = makePost({ id: "current", tags: ["astro", "制作メモ"] });
  const candidates = [
    makePost({ id: "same-tags", tags: ["astro"], date: "2026-03-01" }),
    makePost({ id: "no-tags", tags: ["別話題"], date: "2026-02-01" }),
    makePost({ id: "shared", tags: ["制作メモ", "展示"], date: "2026-01-15" }),
  ];

  it("keeps only posts sharing at least one tag and excludes self", () => {
    const related = pickRelatedPosts(current, candidates, 3);
    expect(related.map((post) => post.id)).toEqual(["same-tags", "shared"]);
  });

  it("respects the limit", () => {
    expect(
      pickRelatedPosts(current, candidates, 1).map((post) => post.id),
    ).toEqual(["same-tags"]);
  });
});

describe("countTags", () => {
  it("counts posts per tag and sorts by count then name", () => {
    const posts = [
      makePost({ id: "a", tags: ["astro", "制作メモ"] }),
      makePost({ id: "b", tags: ["astro"] }),
      makePost({ id: "c", tags: ["展示"] }),
    ];
    expect(countTags(posts)).toEqual([
      { tag: "astro", count: 2 },
      { tag: "制作メモ", count: 1 },
      { tag: "展示", count: 1 },
    ]);
  });
});

describe("pickAdjacentPosts", () => {
  const sorted = [
    makePost({ id: "newest", date: "2026-03-01" }),
    makePost({ id: "middle", date: "2026-02-01" }),
    makePost({ id: "oldest", date: "2026-01-01" }),
  ];

  it("returns the newer and older neighbours in a date-sorted list", () => {
    const adjacent = pickAdjacentPosts("middle", sorted);
    expect(adjacent.newer?.id).toBe("newest");
    expect(adjacent.older?.id).toBe("oldest");
  });

  it("returns null for missing neighbours and unknown ids", () => {
    expect(pickAdjacentPosts("newest", sorted)).toEqual({
      newer: null,
      older: makePost({ id: "middle", date: "2026-02-01" }),
    });
    expect(pickAdjacentPosts("missing", sorted)).toEqual({
      newer: null,
      older: null,
    });
  });
});
