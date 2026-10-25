import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

// 公開アセット（OG画像・apple-touch-icon・manifestアイコン）を
// テンプレートHTMLからPlaywrightでレンダリングしてPNGとして保存する。
// 出力はgitにコミットされ、ブランド変更時のみ npm run assets:generate で再生成する。

const root = path.resolve(".");
const publicDir = path.join(root, "public");
const assetsDir = path.join(root, "scripts", "assets");
const iconUrl = pathToFileURL(path.join(publicDir, "icon.svg")).href;
const logoUrl = pathToFileURL(path.join(publicDir, "logo.svg")).href;

async function render(browser, html, { width, height, output }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const composedPath = path.join(assetsDir, ".composed.html");
  await writeFile(composedPath, html);
  try {
    // file://オリジンとして読み込まないとテンプレート内の file:// 画像が遮断される
    await page.goto(pathToFileURL(composedPath).href, {
      waitUntil: "networkidle",
    });
    await mkdir(path.dirname(output), { recursive: true });
    await page.screenshot({
      path: output,
      clip: { x: 0, y: 0, width, height },
    });
    console.log("Generated", path.relative(root, output));
  } finally {
    await page.close();
    await rm(composedPath, { force: true });
  }
}

const ogTemplate = (await readFile("scripts/assets/og-template.html", "utf8"))
  .replaceAll("__ICON__", iconUrl)
  .replaceAll("__LOGO__", logoUrl);
const iconTemplate = (size) =>
  readFile("scripts/assets/icon-template.html", "utf8").then((template) =>
    template
      .replaceAll("__ICON__", iconUrl)
      .replaceAll("__SIZE__", String(size)),
  );

const browser = await chromium.launch();
try {
  await render(browser, ogTemplate, {
    width: 1200,
    height: 630,
    output: path.join(publicDir, "images", "og", "default.png"),
  });
  for (const size of [180, 192, 512]) {
    const output =
      size === 180
        ? path.join(publicDir, "apple-touch-icon.png")
        : path.join(publicDir, "images", "icons", `icon-${size}.png`);
    await render(browser, await iconTemplate(size), {
      width: size,
      height: size,
      output,
    });
  }
} finally {
  await browser.close();
}
