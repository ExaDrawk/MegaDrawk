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
