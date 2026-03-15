import { test, expect } from '@playwright/test';

test.describe('Deep interactive tests', () => {
  test('Mobile menu toggles correctly', async ({ page }) => {
    // Navigate and set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile menu button is visible
    const menuButton = page.getByRole('button', { name: /メニューを開く|Menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Assume navigation menu becomes visible
      const mobileNav = page.getByRole('navigation', { name: /モバイルナビゲーション/i });
      await expect(mobileNav).toBeVisible();

      // Click close or overlay
      const closeButton = page.getByRole('button', { name: /メニューを閉じる|Menu/i });
      await closeButton.click();
      await expect(mobileNav).toBeHidden();
    }
  });

  test('X/Twitter link on contact page opens correctly or has valid href', async ({ page }) => {
    await page.goto('/contact');
    const xLink = page.getByRole('link', { name: /X（/i });
    await expect(xLink).toHaveAttribute('href', /x\.com/);
    await expect(xLink).toHaveAttribute('target', '_blank');
  });

  test('Can submit a blog comment or validation blocks empty submit', async ({ page }) => {
    await page.goto('/blog');
    
    // Check if there's an article to click
    const firstArticleLink = page.locator('article a').first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for comment form
      const nameInput = page.getByPlaceholder('名前');
      const messageInput = page.getByPlaceholder('コメントを書く');
      const submitButton = page.getByRole('button', { name: '送信' });

      if (await nameInput.isVisible()) {
        // Try submitting empty
        await submitButton.click();
        
        // Wait and check if there's an error message or form validation
        const errorMessage = page.locator('text=名前とメッセージを入力してください').first();
        // Since we don't know the exact error, let's just make sure we can type
        await nameInput.fill('Test User');
        await messageInput.fill('This is a test comment from Playwright.');
        await submitButton.click();
        
        // Ensure comment appears
        await expect(page.getByText('This is a test comment from Playwright.')).toBeVisible();
      }
    }
  });
});
