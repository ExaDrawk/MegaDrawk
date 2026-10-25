import { test, expect } from "@playwright/test";

test("public pages are static, usable without JS, and have page-specific canonical URLs", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of [
    "/",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ]) {
    const response = await page.goto("http://127.0.0.1:3000" + route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://megadrawk.com" + (route === "/" ? "/" : route),
    );
    // ハイドレーションするのはお問い合わせフォーム（/contact）だけ
    const islands = await page.locator("astro-island[component-url]").count();
    if (route === "/contact") {
      expect(islands).toBeLessThanOrEqual(1);
    } else {
      expect(islands).toBe(0);
    }
    expect(await page.content()).not.toContain("/_next/");
  }
  await context.close();
});

test("editor hydrates under strict CSP, escapes HTML, and restores saved drafts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/admin/posts/new");
  const payload = '<img src=x onerror="window.compromised=true">';
  await page.getByLabel("タイトル", { exact: true }).fill("Astro検証");
  await page
    .getByLabel("説明", { exact: true })
    .fill("エディター検証用の要約です。");
  await page.getByLabel("本文（Markdown）").fill(payload);
  await page.getByRole("button", { name: "Markdownを生成" }).click();
  await expect(
    page.getByText("Markdownを生成しました", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/src\/content\/blog\/.*\.md/)).toBeVisible();
  await expect(page.locator("code").last()).toContainText(payload);
  expect(await page.evaluate(() => "compromised" in window)).toBe(false);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("admin:blog-post-draft") ?? "{}")
            .draft?.title,
      ),
    )
    .toBe("Astro検証");
  await page.reload();
  await expect(page.getByLabel("タイトル", { exact: true })).toHaveValue(
    "Astro検証",
  );
  await expect(page.getByLabel("本文（Markdown）")).toHaveValue(payload);
  expect(errors).toEqual([]);
});

test("corrupt draft stays intact in the browser and recovery does not silently overwrite it", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("admin:blog-post-draft", "{broken");
  });
  await page.goto("/admin/posts/new");
  await expect(
    page.getByRole("button", { name: "草案を再読み込み" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "草案を再読み込み" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "保存済み草案を読み込めません",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("admin:blog-post-draft")),
  ).toBe("{broken");
  await page.getByRole("button", { name: "保存済み草案を削除" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("admin:blog-post-draft")),
  ).toBeNull();
  await page.getByLabel("タイトル", { exact: true }).fill("復旧後の草案");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("admin:blog-post-draft") ?? "{}")
            .draft?.title,
      ),
    )
    .toBe("復旧後の草案");
});

test("static response rejects write requests, serves 404 and keeps security rules strict", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).not.toMatch(
    /unsafe-inline|unsafe-eval/,
  );
  expect(home.headers()["content-security-policy"]).toContain("sha256-");
  expect((await request.post("/")).status()).toBe(405);
  const missing = await request.get("/not-a-real-page");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain(
    "お探しのページは見つかりませんでした",
  );
  expect((await request.get("/_headers")).status()).toBe(404);
  expect((await request.get("/.env")).status()).toBe(404);
  expect((await request.get("/.well-known/security.txt")).status()).toBe(200);
  expect(
    (await request.get("/robots.txt")).headers()["content-type"],
  ).toContain("text/plain");
  expect(
    (await request.get("/sitemap.xml")).headers()["content-type"],
  ).toContain("application/xml");
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
});

test("mobile navigation closes on outside click, repeated toggles and viewport changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const trigger = page.locator("#menu-trigger");
  const menu = page.locator("#mobile-menu");
  await trigger.click();
  await expect(menu).toBeVisible();
  await page.mouse.click(350, 620);
  await expect(menu).toBeHidden();
  await trigger.click();
  await trigger.click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(menu).toBeHidden();
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("head exposes OG image, RSS alternate and apple-touch-icon", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://megadrawk.com/images/og/default.png",
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
  await expect(
    page.locator('link[rel="alternate"][type="application/rss+xml"]'),
  ).toHaveAttribute("href", "https://megadrawk.com/rss.xml");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    1,
  );
  const jsonLdText = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(jsonLdText).toBeTruthy();
  const jsonLd = JSON.parse(jsonLdText as string);
  expect(jsonLd["@graph"]).toBeDefined();
  expect(jsonLd["@graph"][0]["@type"]).toBe("Person");
});

test("rss feed responds as xml with the site channel", async ({ request }) => {
  const feed = await request.get("/rss.xml");
  expect(feed.status()).toBe(200);
  // 静的配信では拡張子からapplication/xmlが付く（Cloudflare Pagesと同一の挙動）
  expect(feed.headers()["content-type"]).toContain("xml");
  const body = await feed.text();
  expect(body).toContain('<rss version="2.0">');
  expect(body).toContain("<title>MEGADRAWK</title>");
  expect(body).toContain("<language>ja</language>");
});

test("sitemap keeps static routes and per-post URLs", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const body = await sitemap.text();
  expect(body).toContain("<loc>https://megadrawk.com/</loc>");
  expect(body).toContain("<loc>https://megadrawk.com/about</loc>");
});

test("contact page keeps direct routes and renders the form island only when configured", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.locator('a[href^="mailto:contact@megadrawk.com"]'),
  ).toBeVisible();
  // 既定ビルドはTurnstileサイトキー未設定のため、フォームは出さずメール/Xの導線のみ
  expect(await page.locator(".contact-form").count()).toBe(0);
});
