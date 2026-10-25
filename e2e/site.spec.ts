import { test, expect } from "@playwright/test";
for (const route of ["/", "/about"])
  test("published catalog on " + route, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/MEGADRAWK/);
    for (const name of [
      "どこでも六法",
      "証ぴた 証明写真作成・印刷",
      "TJA Pocket",
      "Multi-Subtitles for YouTube",
    ])
      await expect(
        page.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
    for (const id of ["roppo", "syopita", "tjapocket"])
      await expect(
        page.locator(
          'a.project__store[href="https://play.google.com/store/apps/details?id=com.drawk.' +
            id +
            '"]',
        ),
      ).toBeVisible();
    expect(await page.locator("main").innerText()).not.toMatch(
      /条文スコープ|テスト公開|病歴|高安動脈炎|Bentall|ベントール|機械弁|身体障害|リンヴォック|プレドニン|闘病/,
    );
    if (route === "/")
      await expect(
        page.getByRole("heading", { level: 1, name: "MEGADRAWK" }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole("heading", { name: "プロフィール" }),
      ).toBeVisible();
  });
for (const [route, name] of [
  ["/blog", "Blog"],
  ["/contact", "Contact"],
  ["/privacy", "プライバシーポリシー"],
  ["/terms", "利用規約"],
] as const)
  test("page " + route, async ({ page }) => {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { level: 1, name, exact: true }),
    ).toBeVisible();
  });

test("projects display their platform labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".project__platform").first()).toHaveText(
    "Androidアプリ",
  );
  const extension = page
    .locator(".project", { hasText: "Multi-Subtitles for YouTube" })
    .locator(".project__platform");
  await expect(extension).toHaveText("Chrome拡張機能");
});

const POST_ID = "2026-10-25-hello-megadrawk";

test("blog post page renders markdown, toc, reading time and per-post og image", async ({
  page,
}) => {
  await page.goto(`/blog/${POST_ID}`);
  await expect(
    page.getByRole("heading", { level: 1, name: "MEGADRAWKへようこそ" }),
  ).toBeVisible();
  await expect(page.getByText(/約\d+分/)).toBeVisible();
  // 目次（見出しが3つあるため表示される）
  const toc = page.getByRole("navigation", { name: "目次" });
  await expect(toc).toBeVisible();
  await expect(toc.locator("a")).toHaveCount(3);
  await expect(toc.locator("a").first()).toHaveAttribute(
    "href",
    "#公開しているもの",
  );
  await toc.locator("a").first().click();
  // Markdownのシンタックスハイライト（ビルド時にShikiで着色されたコードブロック）
  await expect(page.locator(".prose-content .astro-code")).toHaveCount(1);
  // 記事ごとのOG画像
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `https://megadrawk.com/og/${POST_ID}.png`,
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "MEGADRAWKへようこそ",
  );
  // 記事は1件なので前後ナビゲーション・関連記事は出ない
  await expect(page.locator(".post-navigation")).toHaveCount(0);
  await expect(page.locator(".post-related")).toHaveCount(0);
});

test("per-post og image is generated as png", async ({ request }) => {
  const image = await request.get(`/og/${POST_ID}.png`);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");
  const body = await image.body();
  // PNGシグネチャ
  expect(body.subarray(0, 4).toString("binary")).toBe("\x89PNG");
});

test("giscus comments container is embedded on the post page", async ({
  page,
}) => {
  await page.goto(`/blog/${POST_ID}`);
  const comments = page.getByRole("region", { name: "コメント" });
  // client:visibleのため、コメント欄が視界に入った時点でハイドレーションする
  await comments.scrollIntoViewIfNeeded();
  await expect(comments).toBeVisible();
  // giscusスクリプトがCSP許可オリジンから読み込まれる
  await expect(page.locator('script[src*="giscus.app/client.js"]')).toHaveCount(
    1,
  );
  const csp = (await page.request.get("/")).headers()[
    "content-security-policy"
  ];
  expect(csp).toContain("https://giscus.app");
});

test("tag pages list the posts that carry the tag", async ({ page }) => {
  await page.goto("/tags/制作品");
  await expect(
    page.getByRole("heading", { level: 1, name: "#制作品" }),
  ).toBeVisible();
  await expect(page.getByText("1件の記事")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "MEGADRAWKへようこそ" }),
  ).toBeVisible();
  await page.goto("/tags/存在しないタグ");
  expect((await page.request.get("/tags/存在しないタグ")).status()).toBe(404);
});

test("rss and sitemap include the published post", async ({ request }) => {
  const feed = await (await request.get("/rss.xml")).text();
  expect(feed).toContain(`<link>https://megadrawk.com/blog/${POST_ID}</link>`);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>https://megadrawk.com/blog/${POST_ID}</loc>`);
});
