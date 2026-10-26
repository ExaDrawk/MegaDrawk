import { test, expect } from "@playwright/test";

test("blockquote border has balanced spacing for paragraphs, lists and nested quotes", async ({
  page,
}) => {
  await page.goto("/blog/2026-10-26-tjapocket-skin-import");
  for (const width of [375, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const quote = page.locator(".prose-content blockquote").first();
      for (const html of [
        null,
        "<p>最初の段落</p><p>最後の段落</p>",
        "<ul><li>引用内のリスト</li></ul>",
        "<blockquote><p>入れ子の引用</p></blockquote>",
      ]) {
        if (html !== null)
          await quote.evaluate((el, value) => {
            el.innerHTML = value;
          }, html);
        const spacing = await quote.evaluate((el) => {
          const outer = el.getBoundingClientRect(),
            first = el.firstElementChild!.getBoundingClientRect(),
            last = el.lastElementChild!.getBoundingClientRect();
          return {
            top: first.top - outer.top,
            bottom: outer.bottom - last.bottom,
          };
        });
        expect(spacing.top).toBeGreaterThan(0);
        expect(Math.abs(spacing.top - spacing.bottom)).toBeLessThan(1);
      }
    }
  }
});
