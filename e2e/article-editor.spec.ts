import { test, expect, type Page } from "@playwright/test";

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64",
);
const content =
  '---\ntitle: "編集テスト"\ndescription: "テスト"\ndate: "2026-10-26"\ndraft: true\n---\n\n' +
  Array.from(
    { length: 100 },
    (_, i) =>
      `## 見出し ${i}\n\n日本語の記事本文です。入力とスクロールを検証します。\n\n`,
  ).join("");
async function setup(page: Page) {
  let writes = 0;
  await page.route("**/api/admin/comments", (r) =>
    r.fulfill({ json: { comments: [] } }),
  );
  await page.route("**/api/admin/articles**", async (r) => {
    const request = r.request(),
      url = new URL(request.url());
    if (request.method() === "PUT") {
      writes++;
      await new Promise((resolve) => setTimeout(resolve, 300));
      return r.fulfill({
        json: { ok: true, sha: `saved-${writes}`, commit: `commit-${writes}` },
      });
    }
    if (url.searchParams.has("images"))
      return r.fulfill({ json: { images: [] } });
    if (url.searchParams.has("file"))
      return r.fulfill({ json: { name: "demo.md", sha: "old", content } });
    return r.fulfill({ json: { articles: [{ name: "demo.md", sha: "old" }] } });
  });
  await page.goto("/admin/articles");
  await page
    .getByRole("combobox", { name: "記事を選択" })
    .selectOption("demo.md");
  await expect(
    page.getByRole("textbox", { name: "本文（Markdown）" }),
  ).toHaveValue(content);
}

test("Japanese bold needs no spaces in preview or published article", async ({
  page,
}) => {
  await setup(page);
  const body = page.getByRole("textbox", { name: "本文（Markdown）" });
  await body.fill(
    '---\ntitle: "太字の確認"\ndate: "2026-10-26"\ndraft: true\n---\n設定へ戻り、**「外観」→「スキン」**を開いて',
  );
  const preview = page.locator(".editor-preview-scroll .prose-content");
  await expect(preview.locator("strong")).toHaveText("「外観」→「スキン」");
  await expect(preview).toHaveText("設定へ戻り、「外観」→「スキン」を開いて");
  await page.goto("/blog/2026-10-26-tjapocket-skin-import");
  const paragraph = page
    .locator(".prose-content p")
    .filter({ hasText: "設定へ戻り、" });
  await expect(paragraph.locator("strong").first()).toHaveText(
    "「外観」→「スキン」",
  );
  await expect(paragraph).not.toContainText("**");
  await expect(paragraph).toContainText(
    "設定へ戻り、「外観」→「スキン」を開いて",
  );
});
test("full-width editor keeps DOM, cursor, scroll and edits made while saving", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setup(page);
  const body = page.getByRole("textbox", { name: "本文（Markdown）" });
  const bounds = await page.locator(".editor-panes").boundingBox();
  expect(bounds!.width).toBeGreaterThan(1350);
  await body.evaluate((el: HTMLTextAreaElement) => {
    el.scrollTop = 500;
    el.setSelectionRange(100, 105);
    el.dataset.identity = "original";
    el.dispatchEvent(new Event("scroll"));
  });
  await expect
    .poll(() =>
      page.locator(".editor-preview-scroll").evaluate((el) => el.scrollTop),
    )
    .toBeGreaterThan(0);
  const scroll = await body.evaluate((el) => el.scrollTop);
  await page.getByRole("button", { name: "非公開で保存" }).click();
  await expect(page.getByText(/保存しました/)).toBeVisible();
  expect(await body.getAttribute("data-identity")).toBe("original");
  expect(
    await body.evaluate((el: HTMLTextAreaElement) => [
      el.selectionStart,
      el.selectionEnd,
      el.scrollTop,
    ]),
  ).toEqual([100, 105, scroll]);
  await page.getByRole("button", { name: "非公開で保存" }).click();
  await body.fill(content + "保存中の追加入力");
  await expect(page.getByText(/未保存の変更があります/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "非公開で保存" }),
  ).toBeEnabled();
  await expect(body).toHaveValue(content + "保存中の追加入力");
  await expect(page.getByText(/未保存の変更があります/)).toBeVisible();
  await page.screenshot({
    path: "screenshots/article-editor-desktop.png",
    fullPage: true,
  });
  const separator = page.getByRole("separator");
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", "51");
  await page.getByRole("checkbox", { name: "スクロール連動" }).uncheck();
  const previewTop = await page
    .locator(".editor-preview-scroll")
    .evaluate((el) => el.scrollTop);
  await body.evaluate((el) => {
    el.scrollTop = 1000;
    el.dispatchEvent(new Event("scroll"));
  });
  expect(
    await page.locator(".editor-preview-scroll").evaluate((el) => el.scrollTop),
  ).toBe(previewTop);
});
test("visibility, toolbar and image insertion share the actual textarea value", async ({
  page,
}) => {
  await setup(page);
  const body = page.getByRole("textbox", { name: "本文（Markdown）" });
  await page.getByRole("combobox", { name: "公開状態" }).selectOption("public");
  await expect(body).toHaveValue(
    content.replace("draft: true", "draft: false"),
  );
  await page.getByText("画像（0）", { exact: true }).click();
  await page
    .getByLabel("画像を追加", { exact: true })
    .setInputFiles({ name: "test.png", mimeType: "image/png", buffer: png });
  await page
    .getByRole("textbox", { name: "test.pngの代替テキスト" })
    .fill("検証画像");
  await body.evaluate((el: HTMLTextAreaElement) =>
    el.setSelectionRange(el.value.length, el.value.length),
  );
  await page.getByRole("button", { name: "本文へ挿入" }).click();
  await expect(body).toHaveValue(/!\[検証画像\]/);
  const request = page.waitForRequest((r) => r.method() === "PUT");
  await page.keyboard.press("Control+s");
  expect((await request).postDataJSON()).toMatchObject({
    additions: [{ name: "test.png" }],
    content: expect.stringContaining("draft: false"),
  });
  await expect(page.getByText(/保存しました/)).toBeVisible();
});
test("mobile switches panes and failed saves preserve input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  const body = page.getByRole("textbox", { name: "本文（Markdown）" });
  await expect(body).toBeVisible();
  await page.getByRole("button", { name: "プレビュー", exact: true }).click();
  await expect(body).toBeHidden();
  await page.getByRole("button", { name: "編集", exact: true }).click();
  await expect(body).toBeVisible();
  await page.route("**/api/admin/articles", (r) =>
    r.request().method() === "PUT"
      ? r.fulfill({ status: 409, json: { error: "他の更新と競合しました" } })
      : r.fallback(),
  );
  await body.fill(content + "保持する変更");
  await page.getByRole("button", { name: "非公開で保存" }).click();
  await expect(page.getByRole("alert")).toContainText("競合");
  await expect(body).toHaveValue(content + "保持する変更");
});
test("article images open a keyboard-accessible in-page viewer", async ({
  page,
}) => {
  await page.goto("/blog/2026-10-25-hello-megadrawk");
  await page.locator(".prose-content").evaluate((element, base64) => {
    const image = document.createElement("img");
    image.src = `data:image/png;base64,${base64}`;
    image.alt = "拡大テスト";
    element.appendChild(image);
  }, png.toString("base64"));
  const image = page.locator(".prose-content img").first();
  await expect(image).toBeVisible();
  await image.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "原寸表示" }).click();
  await expect(dialog).toHaveAttribute("data-original", "true");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(image).toBeFocused();
  await image.click();
  await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(image).toBeFocused();
  await image.click();
  await dialog.locator("figure").click({ position: { x: 10, y: 10 } });
  await expect(dialog).toHaveCount(0);
  expect(page.url()).toContain("/blog/2026-10-25-hello-megadrawk");
});

test("reauthentication keeps the mounted editor and unsaved text", async ({
  page,
}) => {
  await setup(page);
  const body = page.getByRole("textbox", { name: "本文（Markdown）" });
  await body.fill(content + "再認証後も保持");
  await body.evaluate((el) => {
    el.dataset.identity = "before-auth";
  });
  await page.route("**/api/admin/articles", (r) =>
    r.request().method() === "PUT"
      ? r.fulfill({ status: 401, json: { error: "認証が切れました" } })
      : r.fallback(),
  );
  await page.getByRole("button", { name: "非公開で保存" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.route("**/api/admin/session", (r) =>
    r.fulfill({ json: { ok: true } }),
  );
  await dialog.locator('input[type="password"]').fill("local-test-only");
  await dialog.getByRole("button", { name: "入る", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(body).toHaveValue(content + "再認証後も保持");
  await expect(body).toHaveAttribute("data-identity", "before-auth");
});

test("Japanese image names work with drag-and-drop and clipboard paste", async ({
  page,
}) => {
  await setup(page);
  await page.getByText("画像（0）", { exact: true }).click();
  await page.locator(".image-dropzone").evaluate((element, base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], "画像.png", { type: "image/png" }));
    element.dispatchEvent(
      new DragEvent("drop", { bubbles: true, dataTransfer: transfer }),
    );
  }, png.toString("base64"));
  await expect(
    page.getByRole("textbox", { name: "image.pngの代替テキスト" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "本文（Markdown）" })
    .evaluate((element, base64) => {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const transfer = new DataTransfer();
      transfer.items.add(new File([bytes], "画像.png", { type: "image/png" }));
      element.dispatchEvent(
        new ClipboardEvent("paste", { bubbles: true, clipboardData: transfer }),
      );
    }, png.toString("base64"));
  await expect(
    page.getByRole("textbox", { name: "image-1.pngの代替テキスト" }),
  ).toBeVisible();
});
