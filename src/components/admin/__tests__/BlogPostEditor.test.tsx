import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlogPostEditor } from "@/components/admin/BlogPostEditor";
import { renderToStaticMarkup } from "react-dom/server";

describe("BlogPostEditor", () => {
  it("prevents editing the static form before the saved draft has loaded", () => {
    const html = renderToStaticMarkup(<BlogPostEditor />);
    const container = document.createElement("div");
    container.innerHTML = html;
    expect(container.querySelector("fieldset")?.disabled).toBe(true);
  });
  afterEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    window.localStorage.clear();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("shows the empty state before generating markdown", () => {
    render(<BlogPostEditor />);

    expect(
      screen.getByText(
        "まず左側で記事草案を入力し、Markdown生成を実行してください。",
      ),
    ).toBeDefined();
  });

  it("shows validation errors when required fields are missing", async () => {
    render(<BlogPostEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Markdownを生成" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
    });
    expect(screen.getByText("Title is required.")).toBeDefined();
  });

  it("shows generated markdown after a valid submission", async () => {
    render(<BlogPostEditor />);

    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "展示レポート" },
    });
    fireEvent.change(screen.getByLabelText("説明"), {
      target: { value: "展示の振り返りの要約です。" },
    });
    fireEvent.change(screen.getByLabelText("本文（Markdown）"), {
      target: { value: "## 会場\n\n展示の振り返りです。" },
    });
    fireEvent.change(screen.getByLabelText("タグ"), {
      target: { value: "展示, レポート" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Markdownを生成" }));

    await waitFor(() => {
      expect(screen.getByText("Markdownを生成しました")).toBeDefined();
    });
    expect(screen.getByText(/slug: /)).toBeDefined();
    expect(
      screen.getByText(/title: "展示レポート"/, { selector: "code" }),
    ).toBeDefined();
  });

  it("marks generated markdown as draft when the checkbox is on", async () => {
    render(<BlogPostEditor />);

    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "書きかけのメモ" },
    });
    fireEvent.change(screen.getByLabelText("説明"), {
      target: { value: "まだ公開しない要約。" },
    });
    fireEvent.change(screen.getByLabelText("本文（Markdown）"), {
      target: { value: "本文。" },
    });
    fireEvent.click(screen.getByLabelText(/下書き/));
    fireEvent.click(screen.getByRole("button", { name: "Markdownを生成" }));

    await waitFor(() => {
      expect(screen.getByText("Markdownを生成しました")).toBeDefined();
    });
    expect(screen.getByText(/draft: true/, { selector: "code" })).toBeDefined();
  });

  it("restores a saved draft from localStorage", async () => {
    window.localStorage.setItem(
      "admin:blog-post-draft",
      JSON.stringify({
        draft: {
          title: "保存済みタイトル",
          description: "保存済み説明",
          body: "保存済み本文",
          tags: "制作メモ",
          date: "2026-03-15",
          updatedAt: "",
          draft: false,
        },
        savedAt: "2026-03-15T12:00:00.000Z",
      }),
    );

    render(<BlogPostEditor />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("保存済みタイトル")).toBeDefined();
    });
    expect(screen.getByDisplayValue("保存済み本文")).toBeDefined();
    expect(screen.getByText(/自動保存:/)).toBeDefined();
  });

  it("preserves corrupt draft data instead of autosaving over it", async () => {
    const corrupt = '{"draft":';
    window.localStorage.setItem("admin:blog-post-draft", corrupt);
    const save = vi.spyOn(Storage.prototype, "setItem");
    render(<BlogPostEditor />);
    expect(
      screen.getByRole("button", { name: "草案を再読み込み" }),
    ).toBeDefined();
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(save).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("admin:blog-post-draft")).toBe(corrupt);
  });
});
