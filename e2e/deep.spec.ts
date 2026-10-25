import { test, expect } from "@playwright/test";

test.describe("Deep interactive tests", () => {
  test("Mobile menu toggles correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", {
      name: /メニューを開く|メニューを閉じる/i,
    });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileNav = page.getByRole("navigation", {
      name: "モバイルナビゲーション",
    });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "About" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test("X/Twitter link on contact page opens correctly or has valid href", async ({
    page,
  }) => {
    await page.goto("/contact");
    const xLink = page.getByRole("link", { name: /X（/i });
    await expect(xLink).toHaveAttribute("href", /x\.com/);
    await expect(xLink).toHaveAttribute("target", "_blank");
    await expect(xLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("blog post page keeps the draft editor flow working after markdown migration", async ({
    page,
  }) => {
    await page.goto("/blog");
    // 記事一覧から個別ページへ遷移できる
    const postLink = page.getByRole("link", { name: "ブログをはじめました" });
    await expect(postLink).toBeVisible();
    await postLink.click();
    await expect(page).toHaveURL(/\/blog\/2026-10-25-hello-megadrawk/);
    await expect(
      page.getByRole("heading", { level: 1, name: "ブログをはじめました" }),
    ).toBeVisible();
  });

  test("Security headers are present", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};

    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("Admin pages are not indexed by search engines", async ({ page }) => {
    await page.goto("/admin");
    const metaRobots = page.locator('meta[name="robots"]');
    await expect(metaRobots).toHaveAttribute("content", /noindex/i);
  });
});
