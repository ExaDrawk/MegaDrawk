import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/about", "/blog", "/contact", "/privacy", "/terms"])
  test("public page accessibility " + route, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag2aaa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (route === "/privacy")
      await page.screenshot({
        path: "screenshots/privacy-mobile.png",
        fullPage: true,
      });
  });
for (const width of [320, 375, 414, 768, 1280])
  test("layout and accessibility at " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".site-brand .brand-wordmark")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "MegaDrawk" }),
    ).toBeVisible();
    await expect(page.locator("h1 .brand-wordmark")).toHaveAttribute(
      "src",
      "/logo.svg",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag2aaa"])
      .analyze();
    expect(results.violations).toEqual([]);
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter(
            (i) =>
              i instanceof HTMLImageElement &&
              (!i.complete || i.naturalWidth === 0),
          )
          .map((i) => i.getAttribute("src")),
      );
    expect(broken).toEqual([]);
    await page.screenshot({
      path: "screenshots/redesign-" + width + ".png",
      fullPage: true,
    });
  });
test("privacy matches actual storage and advertising behaviour", async ({
  page,
}) => {
  await page.goto("/privacy");
  await expect(page.getByText(/他の利用者には公開しません/)).toBeVisible();
  await expect(
    page.getByText(/CookieやlocalStorageを用いた利用者の追跡を行いません/),
  ).toBeVisible();
  await expect(
    page.getByText(
      "現在、本サイトでは広告配信スクリプトを読み込んでいません。",
    ),
  ).toBeVisible();
  expect(await page.locator('script[src*="googlesyndication"]').count()).toBe(
    0,
  );
  await page.goto("/terms");
  expect(await page.locator("main").innerText()).not.toContain(
    "いかなる損害についても",
  );
});

const axeTags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag2aaa"];

test("dark theme follows system preference, is overridable and passes axe", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const darkResults = await new AxeBuilder({ page })
    .withTags(axeTags)
    .analyze();
  expect(darkResults.violations).toEqual([]);

  await page.getByRole("button", { name: "ライトテーマに切り替え" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "ダークテーマに切り替え" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/contact");
  const lightResults = await new AxeBuilder({ page })
    .withTags(axeTags)
    .analyze();
  expect(lightResults.violations).toEqual([]);
});
