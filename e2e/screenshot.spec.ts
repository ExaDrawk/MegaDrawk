import { test } from '@playwright/test';

test.describe('Take Screenshots', () => {
  test('Capture Homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/home-desktop.png', fullPage: true });
  });

  test('Capture About Page', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/about-desktop.png', fullPage: true });
  });

  test('Capture Blog Page', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/blog-desktop.png', fullPage: true });
  });

  test('Capture Contact Page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/contact-desktop.png', fullPage: true });
  });

  test('Capture Mobile Menu Open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.getByRole('button', { name: /メニューを開く|Menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Wait for menu animation
      await page.waitForTimeout(500); 
      await page.screenshot({ path: 'screenshots/mobile-menu-open.png' });
    }
  });

  test('Capture Mobile Homepage', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/home-mobile.png', fullPage: true });
  });
});

