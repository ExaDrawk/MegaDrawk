import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  inlineScriptHashes,
  inlineStyleHashes,
  inlineStyleAttrHashes,
  assertStaticHtml,
  securityHeaders,
} from "./security.mjs";

const root = path.resolve("dist");
async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(name)));
    else if (entry.name.endsWith(".html")) files.push(name);
  }
  return files;
}
const files = await htmlFiles(root);
if (!files.length) throw new Error("No generated HTML found");
const hashes = new Set();
const styleHashes = new Set();
const attrHashes = new Set();
for (const file of files) {
  const html = await readFile(file, "utf8");
  try {
    assertStaticHtml(html);
  } catch (error) {
    throw new Error(`Unsafe generated HTML: ${file}`, { cause: error });
  }
  for (const hash of inlineScriptHashes(html)) hashes.add(hash);
  for (const hash of inlineStyleHashes(html)) styleHashes.add(hash);
  for (const hash of inlineStyleAttrHashes(html)) attrHashes.add(hash);
  if (html.includes("/_next/"))
    throw new Error(`Next.js output remains: ${file}`);
}
const headers = securityHeaders([...hashes], [...styleHashes], {
  turnstile: Boolean(process.env.PUBLIC_TURNSTILE_SITE_KEY?.trim()),
  styleAttrHashes: [...attrHashes],
});
await writeFile(
  path.join(root, "_headers"),
  "/*\n" +
    Object.entries(headers)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n") +
    "\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n/admin/*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n/admin\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n",
);
console.log(
  `Static security headers prepared: ${files.length} HTML files, ${hashes.size} script hashes.`,
);
