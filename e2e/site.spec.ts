import { test, expect } from '@playwright/test';

test.describe('Site features', () => {
  test('has title and basic navigation', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/MEGADRAWK/);

    // Verify navigation links
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /Blog/i })).toBeVisible();
    await expect(
      page.getByText('src/config/blog.ts').or(page.getByText('createBlogPost'))
    ).toHaveCount(0);
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: /プライバシーポリシー/i })).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: /利用規約/i })).toBeVisible();
  });
});
