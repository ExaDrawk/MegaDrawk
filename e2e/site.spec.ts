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
      await expect(page.getByText(name).first()).toBeVisible();
    for (const id of ["roppo", "syopita", "tjapocket"])
      await expect(
        page
          .locator(
            'a[href="https://play.google.com/store/apps/details?id=com.drawk.' +
              id +
              '"]',
          )
          .first(),
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

test("app list uses Play Store icons, descriptions and screenshots", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".app-list__item")).toHaveCount(4);
  await expect(
    page.locator(
      '.app-list__icon[src^="https://play-lh.googleusercontent.com/"]',
    ),
  ).toHaveCount(3);
  await expect(
    page.locator(
      '.app-list__shot[src^="https://play-lh.googleusercontent.com/"]',
    ),
  ).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "TJA PocketをGoogle Playで見る" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "TJAファイルで遊べるリズムゲーム。スキンや音色、操作感を自分好みに。",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Multi-Subtitles for YouTubeをChrome ウェブストアで見る",
    }),
  ).toBeVisible();
  await page.goto("/about");
  await expect(page.locator(".app-list__item")).toHaveCount(4);
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
