import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { AdminArticlesScreen } from "../AdminArticles";
import type { ReactNode } from "react";

vi.mock("../AdminGate", () => ({
  AdminGate: ({ children }: { children: ReactNode }) => children,
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("article publication controls", () => {
  it("starts with private state, saves the selected visibility and reuses the new SHA for later saves", async () => {
    const content =
      '---\ntitle: "Demo"\ndate: "2026-10-26"\ndraft: true\n---\nOriginal body\n';
    const writes: { content: string; sha: string }[] = [];
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, options?: RequestInit) => {
        if (options?.method === "PUT") {
          writes.push(JSON.parse(String(options.body)));
          return Response.json({ ok: true, sha: "new-sha" });
        }
        if (url.includes("?images")) return Response.json({ images: [] });
        if (url.includes("?file="))
          return Response.json({ name: "demo.md", sha: "old-sha", content });
        return Response.json({
          articles: [{ name: "demo.md", sha: "old-sha" }],
        });
      }),
    );
    render(<AdminArticlesScreen />);
    await screen.findByRole("option", { name: "demo.md" });
    fireEvent.change(screen.getByRole("combobox", { name: "記事を選択" }), {
      target: { value: "demo.md" },
    });
    const visibility = await screen.findByRole("combobox", {
      name: "公開状態",
    });
    expect(
      screen.getByRole("option", {
        name: "非公開（管理者のみ）",
        selected: true,
      }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "非公開で保存" })).toBeDefined();
    fireEvent.change(visibility, { target: { value: "public" } });
    fireEvent.click(screen.getByRole("button", { name: "公開して保存" }));
    await screen.findByText(/保存しました/);
    expect(writes[0]?.content).toContain("draft: false");
    expect(writes[0]?.content).toContain("Original body");
    expect(writes[0]?.sha).toBe("old-sha");
    fireEvent.change(screen.getByRole("combobox", { name: "公開状態" }), {
      target: { value: "private" },
    });
    fireEvent.click(screen.getByRole("button", { name: "非公開で保存" }));
    await waitFor(() => expect(writes.length).toBe(2));
    expect(writes[1]?.content).toContain("draft: true");
    expect(writes[1]?.sha).toBe("new-sha");
    await screen.findByRole("link", { name: "記事を確認" });
  });
});
