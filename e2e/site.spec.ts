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

    // Verify featured projects on home page
    await expect(page.getByRole('heading', { name: 'どこでも六法' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Multi-Subtitles for YouTube' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '条文スコープ' })).toBeVisible();

    // Verify extra prose / poetic tagline is completely eliminated
    const homeContent = await page.content();
    expect(homeContent).not.toMatch(/作品と活動記録を、ひとつの場所に/);
  });

  test('about page loads and contains no medical or illness history', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'プロフィール' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '個人開発' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'どこでも六法' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Multi-Subtitles for YouTube' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '条文スコープ' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Google Play（テスト公開）/ })
    ).toHaveAttribute('href', 'https://play.google.com/apps/testing/com.drawk.roppo');
    await expect(page.getByRole('link', { name: /Chrome ウェブストア/ })).toHaveCount(2);
    await expect(page.getByRole('heading', { name: '目標' })).toBeVisible();

    const content = await page.content();
    expect(content).not.toMatch(/病歴|高安動脈炎|Bentall|ベントール|機械弁|身体障害|リンヴォック|プレドニン|闘病/);
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /Blog/i })).toBeVisible();
    await expect(
      page.getByText('src/config/blog.ts').or(page.getByText('createBlogPost'))
    ).toHaveCount(0);
  });

  test('contact page loads and contains no medical references', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();

    const content = await page.content();
    expect(content).not.toMatch(/高安動脈炎|闘病|疾患/);
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
