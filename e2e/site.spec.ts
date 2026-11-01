import { test, expect } from "@playwright/test";
for (const route of ["/", "/about"])
  test("published catalog on " + route, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/MEGADRAWK/);
    if (route === "/") {
      const slides = page.locator(".runway__slide img");
      await expect(slides).toHaveCount(3);
      for (const [index, name] of [
        "TJA Pocket",
        "証ぴた 証明写真作成・印刷",
        "どこでも六法",
      ].entries()) {
        await expect(slides.nth(index)).toHaveAttribute("alt", name);
      }
      await expect(page.locator("h1")).toHaveText("MEGADRAWK");
      for (const id of ["roppo", "syopita", "tjapocket"]) {
        await expect(
          page
            .locator(
              'a[href="https://play.google.com/store/apps/details?id=com.drawk.' +
                id +
                '"]',
            )
            .first(),
        ).toBeVisible();
      }
    } else {
      await expect(
        page.getByRole("heading", { level: 1, name: "About", exact: true }),
      ).toBeVisible();
      await expect(page.getByText(/私の名前はDrawkです/)).toBeVisible();
      await expect(page.getByText(/これまでに、六法アプリ/)).toBeVisible();
      await expect(page.getByText(/他にも、ジオラマ制作/)).toBeVisible();
      await expect(page.getByText("掲載しているアプリ")).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "プロフィール" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "このサイトについて" }),
      ).toHaveCount(0);
    }
    expect(await page.locator("main").innerText()).not.toMatch(
      /条文スコープ|テスト公開|病歴|高安動脈炎|Bentall|ベントール|機械弁|身体障害|リンヴォック|プレドニン|闘病/,
    );
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

test("homepage runway is full-width and navigable", async ({ page }) => {
  await page.goto("/");
  const info = await page.evaluate(() => ({
    main:
      document.querySelector("#main-content")?.getBoundingClientRect().width ??
      0,
    viewport: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  expect(info.main).toBeGreaterThanOrEqual(info.viewport - 1);
  expect(info.overflow).toBe(false);
  await expect(page.locator(".runway__masthead")).toBeVisible();
  await expect(page.locator(".runway__heading")).toHaveText(
    "私の個人制作アプリ",
  );
  await expect(page.locator(".runway__brand-wordmark")).toHaveAttribute(
    "src",
    "/logo-horizontal.svg",
  );
  await expect(page.locator(".runway__brand-icon")).toBeVisible();
  await expect(page.locator("[data-runway-name]")).toHaveText(/TJA Pocket/);
  await expect(page.locator("[data-runway-description]")).toContainText(
    "リズムゲーム",
  );
  await expect(page.locator("[data-runway-thumb]")).toHaveCount(3);
  await expect(page.locator("[data-runway-thumb]").first()).toHaveClass(
    /is-active/,
  );
  await page.locator("[data-runway-thumb]").nth(1).click();
  await expect(page.locator("[data-runway-thumb]").nth(1)).toHaveClass(
    /is-active/,
  );
  await expect(page.locator("[data-runway-name]")).toHaveText(/証ぴた/);
  await expect(page.locator("[data-runway-description]")).toContainText(
    "証明写真",
  );
});

test("blog list shows view and comment counts", async ({ page }) => {
  await page.route("**/api/post-stats**", async (route) => {
    const url = new URL(route.request().url());
    const ids = (url.searchParams.get("ids") ?? "").split(",").filter(Boolean);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        stats: Object.fromEntries(
          ids.map((id) => [id, { views: 1234, comments: 7 }]),
        ),
      }),
    });
  });
  await page.goto("/blog");
  const card = page.locator("article", {
    hasText: "TJA Pocketに曲を追加する方法",
  });
  await expect(card.getByText(/閲覧 1,234/)).toBeVisible();
  await expect(card.getByText(/コメント 7/)).toBeVisible();
});

const POST_ID = "2026-10-25-hello-megadrawk";

test("blog post page renders markdown, toc, reading time and per-post og image", async ({
  page,
}) => {
  await page.goto(`/blog/${POST_ID}`);
  await expect(
    page.getByRole("heading", { level: 1, name: "ブログをはじめました" }),
  ).toBeVisible();
  await expect(page.getByText(/約\d+分/)).toBeVisible();
  // 記事ごとのOG画像
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `https://megadrawk.com/og/${POST_ID}.png`,
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "ブログをはじめました",
  );
  // 記事の追加に合わせて前後ナビゲーションは出る。
  // 関連記事は公開中のタグ共有に依存するため、存在する場合だけ表示を検証する。
  await expect(page.locator(".post-navigation")).toHaveCount(1);
  const related = page.locator(".post-related");
  if ((await related.count()) > 0) {
    await expect(related.locator("a").first()).toBeVisible();
  }
});

test("per-post og image is generated as png", async ({ request }) => {
  const image = await request.get(`/og/${POST_ID}.png`);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");
  const body = await image.body();
  // PNGシグネチャ
  expect(body.subarray(0, 4).toString("binary")).toBe("\x89PNG");
});

test("comment form is account-free and degrades gracefully without turnstile config", async ({
  page,
}) => {
  await page.goto(`/blog/${POST_ID}`);
  const comments = page.getByRole("region", { name: "コメント欄" });
  await comments.scrollIntoViewIfNeeded();
  await expect(comments).toBeVisible();
  // ローカル検証ビルドはTurnstileサイトキー未設定のため、スパム防止UIなしでは
  // 送信できない（本番ビルドではウィジェットが表示され投稿できる）
  await expect(
    comments.getByText(/スパム防止コンポーネントを読み込めませんでした/),
  ).toBeVisible();
  await expect(comments.getByRole("button", { name: "送信" })).toBeDisabled();
});

test("tag pages list the posts that carry the tag", async ({ page }) => {
  await page.goto("/tags/サイト運営");
  await expect(
    page.getByRole("heading", { level: 1, name: "#サイト運営" }),
  ).toBeVisible();
  await expect(page.getByText(/\d+件の記事/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "ブログをはじめました" }),
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
