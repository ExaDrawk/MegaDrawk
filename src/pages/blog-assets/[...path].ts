import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import { articleAssetTypes } from "../../domain/blog/assets";

export async function getStaticPaths() {
  const root = path.resolve("src/content/blog-assets");
  let files;
  try {
    files = await readdir(root, { recursive: true, withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return files
    .filter((file) => file.isFile())
    .map((file) => {
      const filename = path.join(file.parentPath, file.name);
      const contentType =
        articleAssetTypes[path.extname(file.name).toLowerCase()];
      if (!contentType)
        throw new Error(`Unsupported article asset: ${file.name}`);
      return {
        params: {
          path: path.relative(root, filename).split(path.sep).join("/"),
        },
        props: { filename, contentType },
      };
    });
}

// 開発時にも同じURLで確認できる。非公開の生成物はprepare-staticで取り除く。
export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await readFile(props.filename)), {
    headers: { "Content-Type": props.contentType },
  });
