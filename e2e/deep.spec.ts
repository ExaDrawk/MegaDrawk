import { test, expect } from '@playwright/test';

test.describe('Deep interactive tests', () => {
  test('Mobile menu toggles correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('astro-island').first()).not.toHaveAttribute('ssr', '');

    const menuButton = page.getByRole('button', { name: /メニューを開く|メニューを閉じる/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileNav = page.getByRole('navigation', { name: 'モバイルナビゲーション' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'About' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(mobileNav).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test('Astro hydration runs without CSP violations', async ({ page }) => {
    const cspViolations: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && /Content Security Policy|CSP/i.test(message.text())) {
        cspViolations.push(message.text());
      }
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('astro-island').first()).not.toHaveAttribute('ssr', '');

    const menuButton = page.getByRole('button', { name: 'メニューを開く' });
    await menuButton.click();
    await expect(page.getByRole('navigation', { name: 'モバイルナビゲーション' })).toBeVisible();
    expect(cspViolations).toEqual([]);
  });

  test('X/Twitter link on contact page opens correctly or has valid href', async ({ page }) => {
    await page.goto('/contact');
    const xLink = page.getByRole('link', { name: /X（/i });
    await expect(xLink).toHaveAttribute('href', /x\.com/);
    await expect(xLink).toHaveAttribute('target', '_blank');
    await expect(xLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Comment form validates empty name and message on blog page', async ({ page }) => {
    await page.goto('/blog');

    // The blog page always renders a comment form per article.
    // With no articles the page shows an empty state, so we only test
    // when the comment form is present.
    const nameInput = page.getByPlaceholder('名前');
    const messageInput = page.getByPlaceholder('コメントを書く');
    const submitButton = page.getByRole('button', { name: '送信' });

    if (await nameInput.isVisible()) {
      // Submit empty → should show name validation error
      await submitButton.click();
      await expect(page.getByText('名前を入力してください。')).toBeVisible();

      // Fill name but leave message empty → should show message validation error
      await nameInput.fill('Test User');
      await submitButton.click();
      await expect(page.getByText('コメント本文を入力してください。')).toBeVisible();

      // Fill both → comment should appear
      await messageInput.fill('This is a test comment from Playwright.');
      await submitButton.click();
      await expect(page.getByText('This is a test comment from Playwright.')).toBeVisible();
    }
  });

  test('static SEO metadata is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /megadrawk\.com/);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('Admin pages are not indexed by search engines', async ({ page }) => {
    await page.goto('/admin');
    const metaRobots = page.locator('meta[name="robots"]');
    await expect(metaRobots).toHaveAttribute('content', /noindex/i);
  });
});
