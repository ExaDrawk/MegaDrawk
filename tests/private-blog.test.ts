// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  access,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { readArticleDraft, setArticleDraft } from "../src/domain/blog/markdown";
import {
  privateBlogResponse,
  type PrivateBlogBundle,
} from "../src/infra/articles/preview";
import { createAdminSessionResponse } from "../src/infra/comments/server";
import { preparePrivateBlog } from "../scripts/private-blog.mjs";

const markdown =
  '---\ntitle: "Sample"\ndescription: "Demo"\ndate: "2026-10-26"\ntags: [guide]\n# keep this comment\ndraft: true\n---\n\nBody\n```yaml\ndraft: true\n```\n';

describe("article visibility", () => {
  it("updates only YAML visibility and preserves the body, metadata and comments", () => {
    const result = setArticleDraft(markdown, false);
    expect(result).toBe(
      markdown.replace("draft: true\n---", "draft: false\n---"),
    );
    expect(readArticleDraft(result)).toBe(false);
    expect(result).toContain("# keep this comment");
    expect(result.split("---\n").at(-1)).toBe(markdown.split("---\n").at(-1));
    expect(readArticleDraft(setArticleDraft(result, true))).toBe(true);
  });

  it("preserves inline comments and CRLF and adds missing visibility without reformatting metadata", () => {
    const input =
      '---\r\ntitle: "Long title"\r\ndraft: true # private\r\n---\r\nBody';
    expect(setArticleDraft(input, false)).toBe(
      input.replace("true # private", "false # private"),
    );
    const missing = input.replace("draft: true # private\r\n", "");
    const added = setArticleDraft(missing, true);
    expect(readArticleDraft(added)).toBe(true);
    expect(added).toBe(
      missing.replace("\r\n---\r\nBody", "\r\ndraft: true\r\n---\r\nBody"),
    );
  });

  it.each([
    'draft: "false"',
    "draft: [true]",
    "draft: false\ndraft: true",
    "title: [",
  ])("rejects ambiguous or malformed visibility: %s", (value) => {
    expect(() => readArticleDraft(`---\n${value}\n---\ntext`)).toThrow();
  });

  it("keeps draft HTML and binary assets out of static output across both visibility changes", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "megadrawk-private-"));
    const source = path.join(root, "src/content/blog/demo.md");
    const html = path.join(root, "dist/blog/demo/index.html");
    const media = path.join(root, "src/content/blog-assets/demo");
    try {
      await mkdir(path.dirname(source), { recursive: true });
      await mkdir(media, { recursive: true });
      await writeFile(
        path.join(media, "sample.zip"),
        new Uint8Array([0, 255, 30, 90]),
      );
      for (const draft of [true, false, true]) {
        await writeFile(source, setArticleDraft(markdown, draft));
        await mkdir(path.dirname(html), { recursive: true });
        await writeFile(html, "<h1>Private preview</h1>");
        const bundle = await preparePrivateBlog(root, {});
        if (draft) {
          expect(bundle.articles.demo).toContain("Private preview");
          expect(bundle.media["/blog-assets/demo/sample.zip"]!.body).toBe(
            "AP8eWg==",
          );
          await expect(access(html)).rejects.toThrow();
          await expect(
            access(path.join(root, "dist/blog-assets/demo/sample.zip")),
          ).rejects.toThrow();
        } else {
          expect(bundle.articles).toEqual({});
          expect(bundle.media).toEqual({});
          expect(
            await readFile(path.join(root, "dist/blog-assets/demo/sample.zip")),
          ).toEqual(Buffer.from([0, 255, 30, 90]));
          await expect(access(html)).resolves.toBeUndefined();
        }
      }
    } finally {
      if (!root.startsWith(path.join(tmpdir(), "megadrawk-private-")))
        throw new Error("Unsafe test cleanup");
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe("private article authorization", () => {
  const env = { ADMIN_DELETE_TOKEN: "fixture-password" };
  const bundle: PrivateBlogBundle = {
    articles: { demo: "<h1>secret body</h1>" },
    media: {
      "/blog-assets/demo/sample.zip": {
        body: "AP8eWg==",
        contentType: "application/zip",
      },
    },
    headers: { "X-Content-Type-Options": "nosniff" },
  };
  it.each(["/blog/demo", "/blog/demo/", "/blog-assets/demo/sample.zip"])(
    "does not disclose %s without valid authentication",
    async (pathname) => {
      const response = await privateBlogResponse(
        new Request(`https://example.com${pathname}`),
        env,
        bundle,
      );
      expect(response?.status).toBe(404);
      expect(await response?.text()).toBe("");
      expect(response?.headers.get("Cache-Control")).toContain("no-store");
      expect(response?.headers.get("X-Robots-Tag")).toContain("noindex");
    },
  );
  it("serves HTML and downloads using the existing HttpOnly session and sends no body on HEAD", async () => {
    const session = await createAdminSessionResponse(env, "fixture-password");
    const cookie = session.headers.get("Set-Cookie")!.split(";")[0]!;
    const headers = { Cookie: cookie };
    const article = await privateBlogResponse(
      new Request("https://example.com/blog/demo", { headers }),
      env,
      bundle,
    );
    expect(article?.status).toBe(200);
    expect(await article?.text()).toContain("secret body");
    const download = await privateBlogResponse(
      new Request("https://example.com/blog-assets/demo/sample.zip", {
        headers,
      }),
      env,
      bundle,
    );
    expect(download?.headers.get("Content-Type")).toBe("application/zip");
    expect(new Uint8Array(await download!.arrayBuffer())).toEqual(
      new Uint8Array([0, 255, 30, 90]),
    );
    const head = await privateBlogResponse(
      new Request("https://example.com/blog/demo", { headers, method: "HEAD" }),
      env,
      bundle,
    );
    expect(head?.status).toBe(200);
    expect(await head?.text()).toBe("");
  });
  it("fails closed with a missing secret and delegates only public or unknown resources", async () => {
    expect(
      (
        await privateBlogResponse(
          new Request("https://example.com/blog/demo"),
          {},
          bundle,
        )
      )?.status,
    ).toBe(503);
    expect(
      await privateBlogResponse(
        new Request("https://example.com/blog/public"),
        env,
        bundle,
      ),
    ).toBeNull();
    expect(
      await privateBlogResponse(
        new Request("https://example.com/blog/__proto__"),
        env,
        bundle,
      ),
    ).toBeNull();
  });
});
