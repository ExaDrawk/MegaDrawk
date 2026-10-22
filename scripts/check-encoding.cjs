const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (
      [
        "node_modules",
        ".git",
        "dist",
        ".astro",
        "verification",
        "coverage",
        "test-results",
        "playwright-report",
        ".vscode",
        ".wrangler",
      ].includes(file)
    )
      continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(".");
let hasBom = [];
let hasUfffd = [];
const replacementChar = String.fromCharCode(0xfffd);

for (const file of files) {
  if (file.endsWith("check-encoding.cjs")) continue;
  const ext = path.extname(file);
  if (
    ![
      ".ts",
      ".tsx",
      ".js",
      ".cjs",
      ".mjs",
      ".astro",
      ".json",
      ".md",
      ".css",
    ].includes(ext)
  )
    continue;
  const buf = fs.readFileSync(file);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    hasBom.push(file);
  }
  const str = buf.toString("utf8");
  if (str.includes(replacementChar)) {
    hasUfffd.push(file);
  }
}

console.log("BOM files count:", hasBom.length);
if (hasBom.length > 0) console.log("BOM files:", hasBom);
console.log("U+FFFD files count:", hasUfffd.length);
if (hasUfffd.length > 0) console.log("U+FFFD files:", hasUfffd);

if (hasBom.length > 0 || hasUfffd.length > 0) {
  process.exit(1);
} else {
  const textFiles = files.filter((f) =>
    [".ts", ".tsx", ".js", ".cjs", ".mjs", ".json", ".md", ".css"].includes(
      path.extname(f),
    ),
  ).length;
  console.log(
    "All " + textFiles + " text files verified: UTF-8 BOM-free, no U+FFFD!",
  );
}
