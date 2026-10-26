import { afterEach, describe, expect, it, vi } from "vitest";
import {
  IMAGE_LIMITS,
  availableImageName,
  markdownImage,
  scrollRatio,
  validateImage,
} from "../src/domain/blog/images";
import { saveArticle } from "../src/infra/articles/github";
import { articleImages } from "../src/infra/articles/images";

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64",
);
const content =
  '---\ntitle: Demo\ndescription: Demo\ndate: "2026-10-26"\ndraft: true\n---\n本文';
afterEach(() => vi.unstubAllGlobals());
function github(
  options: {
    conflict?: boolean;
    failBlob?: boolean;
    otherReference?: boolean;
  } = {},
) {
  const writes: { route: string; body: Record<string, unknown> }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const route = url.split("/MegaDrawk/")[1]!;
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (init?.method && init.method !== "GET") writes.push({ route, body });
      if (route === "git/ref/heads/main")
        return Response.json({ object: { sha: "head" } });
      if (route === "git/commits/head")
        return Response.json({ tree: { sha: "tree" } });
      if (route.startsWith("git/trees/tree?"))
        return Response.json({
          truncated: false,
          tree: [
            { path: "src/content/blog/demo.md", sha: "old", type: "blob" },
            {
              path: "src/content/blog-assets/demo/image.png",
              sha: "image",
              type: "blob",
            },
            ...(options.otherReference
              ? [
                  {
                    path: "src/content/blog/other.md",
                    sha: "other",
                    type: "blob",
                  },
                ]
              : []),
          ],
        });
      if (route === "git/blobs/other")
        return Response.json({
          content: Buffer.from("![x](/blog-assets/demo/image.png)").toString(
            "base64",
          ),
        });
      if (route === "git/blobs")
        return options.failBlob
          ? new Response(null, { status: 500 })
          : Response.json({ sha: "new-blob" });
      if (route === "git/trees") return Response.json({ sha: "new-tree" });
      if (route === "git/commits") return Response.json({ sha: "new-commit" });
      if (route === "git/refs/heads/main")
        return options.conflict
          ? new Response(null, { status: 422 })
          : Response.json({});
      throw new Error(`Unexpected request ${route}`);
    }),
  );
  return writes;
}
describe("article image rules", () => {
  it("validates signatures, paths and limits", () => {
    expect(() => validateImage("image.png", png)).not.toThrow();
    expect(availableImageName("画像.PNG", new Set())).toBe("image.png");
    expect(availableImageName("画像.png", new Set(["image.png"]))).toBe(
      "image-1.png",
    );
    for (const name of ["../image.png", "image.jpg", "image.svg"])
      expect(() => validateImage(name, png)).toThrow();
    expect(() =>
      validateImage("image.png", new Uint8Array(IMAGE_LIMITS.file + 1)),
    ).toThrow();
    expect(scrollRatio(50, 200, 100)).toBe(0.5);
    expect(scrollRatio(0, 10, 20)).toBe(0);
    expect(markdownImage("[x]\n", "/image.png")).toBe("![ x  ](</image.png>)");
  });
  it("commits Markdown and images with a single non-forced ref update", async () => {
    const writes = github();
    const response = await saveArticle("token", {
      name: "demo.md",
      content,
      sha: "old",
      additions: [{ name: "new.png", base64: png.toString("base64") }],
      deletions: ["image.png"],
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      sha: "new-blob",
      commit: "new-commit",
    });
    const tree = writes.find((w) => w.route === "git/trees")!;
    expect(tree.body.tree).toHaveLength(3);
    expect(writes.filter((w) => w.route === "git/refs/heads/main")).toEqual([
      {
        route: "git/refs/heads/main",
        body: { sha: "new-commit", force: false },
      },
    ]);
  });
  it("preserves the branch on partial upload failure", async () => {
    const writes = github({ failBlob: true });
    expect(
      (await saveArticle("token", { name: "demo.md", content, sha: "old" }))
        .status,
    ).toBe(502);
    expect(writes.some((w) => w.route === "git/refs/heads/main")).toBe(false);
  });
  it("returns conflicts without force", async () => {
    github({ conflict: true });
    expect(
      (await saveArticle("token", { name: "demo.md", content, sha: "old" }))
        .status,
    ).toBe(409);
    const writes = github();
    expect(
      (await saveArticle("token", { name: "demo.md", content, sha: "stale" }))
        .status,
    ).toBe(409);
    expect(writes).toHaveLength(0);
  });
  it("refuses deletion referenced by another article", async () => {
    const writes = github({ otherReference: true });
    expect(
      (
        await saveArticle("token", {
          name: "demo.md",
          content,
          sha: "old",
          deletions: ["image.png"],
        })
      ).status,
    ).toBe(400);
    expect(writes).toHaveLength(0);
  });
  it("rejects overwrites and unsafe asset queries", async () => {
    const writes = github();
    expect(
      (
        await saveArticle("token", {
          name: "demo.md",
          content,
          sha: "old",
          additions: [{ name: "image.png", base64: png.toString("base64") }],
        })
      ).status,
    ).toBe(409);
    expect(writes).toHaveLength(0);
    expect((await articleImages("token", "../demo.md", null)).status).toBe(400);
    expect((await articleImages("token", "demo.md", "../x.png")).status).toBe(
      400,
    );
  });
});
