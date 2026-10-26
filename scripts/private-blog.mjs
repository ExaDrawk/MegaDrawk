import { mkdir, readdir, readFile, writeFile, rm, cp } from "node:fs/promises";
import path from "node:path";
import { articleAssetTypes } from "../src/domain/blog/assets.ts";
import {
  readArticleDraft,
  isValidArticleFilename,
} from "../src/domain/blog/markdown.ts";

/** @returns {import("../src/infra/articles/preview").PrivateBlogBundle} */
const empty = () => ({ articles: {}, media: {}, headers: {} });

/** 非公開HTML・素材はWorkerの内部データにし、ASSETSへ残さない。 */
export async function preparePrivateBlog(root, headers) {
  const bundle = { ...empty(), headers };
  const output = path.join(root, "dist");
  const sources = path.join(root, "src/content/blog");
  async function assets(directory, prefix, draft) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink())
        throw new Error("Article assets cannot be symlinks");
      const file = path.join(directory, entry.name);
      const url = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) await assets(file, url, draft);
      else {
        const contentType =
          articleAssetTypes[path.extname(entry.name).toLowerCase()];
        if (!contentType) throw new Error(`Unsupported article asset: ${file}`);
        if (draft)
          bundle.media[url] = {
            body: (await readFile(file)).toString("base64"),
            contentType,
          };
        else {
          const target = path.join(output, url);
          await mkdir(path.dirname(target), { recursive: true });
          await cp(file, target);
        }
      }
    }
  }
  // Never leave a previous public asset copy in a reused build directory.
  await rm(path.join(output, "blog-assets"), { recursive: true, force: true });
  for (const name of await readdir(sources)) {
    if (!isValidArticleFilename(name))
      throw new Error(`Invalid article filename: ${name}`);
    const id = name.slice(0, -3);
    const draft = readArticleDraft(
      await readFile(path.join(sources, name), "utf8"),
    );
    if (draft) {
      const directory = path.join(output, "blog", id);
      const html = await readFile(path.join(directory, "index.html"), "utf8");
      bundle.articles[id] = html;
      await rm(directory, { recursive: true });
    }
    await assets(
      path.join(root, "src/content/blog-assets", id),
      `/blog-assets/${id}`,
      draft,
    );
  }
  await mkdir(path.join(root, ".astro"), { recursive: true });
  await writeFile(
    path.join(root, ".astro/private-blog.json"),
    JSON.stringify(bundle),
  );
  return bundle;
}

if (process.argv.includes("--init")) {
  await mkdir(".astro", { recursive: true });
  try {
    await writeFile(".astro/private-blog.json", JSON.stringify(empty()), {
      flag: "wx",
    });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}
