import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";
import { AdminArticlesScreen } from "../AdminArticles";
import type { ReactNode } from "react";

vi.mock("../AdminGate", () => ({
  AdminGate: ({ children }: { children: ReactNode }) => children,
}));
beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("article publication controls", () => {
  it("starts with private state, saves the selected visibility and reuses the new SHA for later saves", async () => {
    const content =
      '---\ntitle: "Demo"\ndate: "2026-10-26"\ndraft: true\n---\nOriginal body\n';
    const writes: { content: string; sha: string }[] = [];
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
          articles: [
            {
              name: "demo.md",
              sha: "old-sha",
              title: "Demo",
              description: "",
              date: "2026-10-26",
              updatedAt: null,
              tags: [],
              draft: true,
              invalid: false,
            },
          ],
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

  it("filters the list and changes multiple visibility states without publishing by accident", async () => {
    const patches: {
      updates: { name: string; sha: string; draft: boolean }[];
    }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, options?: RequestInit) => {
        if (options?.method === "PATCH") {
          patches.push(JSON.parse(String(options.body)));
          return Response.json({
            ok: true,
            commit: "commit-sha",
            articles: [
              { name: "beta.md", sha: "sha-b2", draft: true },
              { name: "gamma.md", sha: "sha-c2", draft: true },
            ],
          });
        }
        if (url.includes("?images")) return Response.json({ images: [] });
        if (url.includes("?file="))
          return Response.json(
            { error: "unexpected article read" },
            { status: 500 },
          );
        return Response.json({
          articles: [
            {
              name: "alpha.md",
              sha: "sha-a",
              title: "Alpha",
              description: "A",
              date: "2026-11-03",
              updatedAt: null,
              tags: ["tag"],
              draft: true,
              invalid: false,
            },
            {
              name: "beta.md",
              sha: "sha-b",
              title: "Beta",
              description: "B",
              date: "2026-11-02",
              updatedAt: null,
              tags: [],
              draft: false,
              invalid: false,
            },
            {
              name: "gamma.md",
              sha: "sha-c",
              title: "Gamma",
              description: "C",
              date: "2026-11-01",
              updatedAt: null,
              tags: [],
              draft: true,
              invalid: false,
            },
          ],
        });
      }),
    );
    render(<AdminArticlesScreen />);
    await screen.findByText("Alpha");
    expect(screen.getByText("Beta")).toBeDefined();
    expect(screen.getByText("Gamma")).toBeDefined();

    const search = screen.getByRole("searchbox", { name: "記事を検索" });
    fireEvent.change(search, { target: { value: "Beta" } });
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.getByText("Beta")).toBeDefined();
    fireEvent.change(search, { target: { value: "" } });
    await screen.findByText("Alpha");

    fireEvent.click(screen.getByRole("checkbox", { name: "Betaを選択" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Gammaを選択" }));
    const bulk = document.querySelector(".admin-article-bulk") as HTMLElement;
    expect(bulk).toBeTruthy();
    fireEvent.click(within(bulk).getByRole("button", { name: "非公開にする" }));
    await screen.findByText(/2件を非公開にしました/);
    expect(patches).toHaveLength(1);
    expect(patches[0]?.updates).toEqual([
      { name: "beta.md", sha: "sha-b", draft: true },
      { name: "gamma.md", sha: "sha-c", draft: true },
    ]);

    fireEvent.click(screen.getByRole("checkbox", { name: "Alphaを選択" }));
    const bulkAfter = document.querySelector(
      ".admin-article-bulk",
    ) as HTMLElement;
    fireEvent.click(
      within(bulkAfter).getByRole("button", { name: "公開する" }),
    );
    const confirmation = screen
      .getByText(/1件の記事を公開します/)
      .closest('[role="alert"]') as HTMLElement;
    fireEvent.click(
      within(confirmation).getByRole("button", { name: "キャンセル" }),
    );
    expect(patches).toHaveLength(1);
  });
});
