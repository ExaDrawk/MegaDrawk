import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommentSection } from "@/components/blog/CommentSection";

vi.mock("@/hooks/useTurnstile", async () => {
  const React = await import("react");
  return {
    useTurnstile: (siteKey: string, onToken: (token: string) => void) => {
      React.useEffect(() => {
        onToken("test-token");
      }, []);
      return {
        containerRef: { current: null },
        ready: true,
        failed: false,
        reset: vi.fn(),
      };
    },
  };
});

vi.mock("@/config/features", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  SITE_FEATURES: { turnstileSiteKey: "1x00000000000000000000AA" },
}));

const serverComments = {
  comments: [
    {
      id: 1,
      name: "既読者",
      message: "以前のコメント",
      createdAt: "2026-10-25T09:00:00Z",
    },
  ],
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  window.localStorage.clear();
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/api/comments/") && (url as string).length > 0) {
      return new Response(JSON.stringify(serverComments), { status: 200 });
    }
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("CommentSection", () => {
  it("loads and renders comments from the comments API", async () => {
    render(<CommentSection postId="post-1" />);

    await waitFor(() => {
      expect(screen.getByText("以前のコメント")).toBeDefined();
    });
    expect(screen.getByText("既読者")).toBeDefined();
  });

  it("shows a client validation error without network on empty submit", async () => {
    render(<CommentSection postId="post-1" />);
    await waitFor(() => screen.getByText("以前のコメント"));

    fireEvent.click(screen.getByRole("button", { name: "送信" }));

    expect(screen.getByText("名前を入力してください。")).toBeDefined();
    const postCalls = (
      globalThis.fetch as ReturnType<typeof vi.fn>
    ).mock.calls.filter(([, init]) => (init as RequestInit)?.method === "POST");
    expect(postCalls).toHaveLength(0);
  });

  it("posts the comment and refreshes the list", async () => {
    let posted = false;
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (init?.method === "POST") {
          expect(JSON.parse(String(init.body)).name).toBe("新規読者");
          posted = true;
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }
        if (url.includes("/api/comments/")) {
          return new Response(
            JSON.stringify({
              comments: posted
                ? [
                    {
                      id: 2,
                      name: "新規読者",
                      message: "応援しています！",
                      createdAt: "2026-10-25T12:00:00Z",
                    },
                  ]
                : [
                    {
                      id: 1,
                      name: "既読者",
                      message: "以前のコメント",
                      createdAt: "2026-10-25T09:00:00Z",
                    },
                  ],
            }),
            { status: 200 },
          );
        }
        return new Response("{}", { status: 200 });
      },
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(<CommentSection postId="post-1" />);
    await waitFor(() => screen.getByText("以前のコメント"));

    fireEvent.change(screen.getByPlaceholderText("名前"), {
      target: { value: "新規読者" },
    });
    fireEvent.change(screen.getByPlaceholderText("コメントを書く"), {
      target: { value: "応援しています！" },
    });
    fireEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText("応援しています！")).toBeDefined();
    });
  });

  it("shows the server rejection message such as the repost cooldown", async () => {
    globalThis.fetch = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "POST") {
          return new Response(
            JSON.stringify({
              error:
                "連続投稿はできません。10分ほど待ってから再度お試しください。",
            }),
            { status: 429 },
          );
        }
        return new Response(JSON.stringify({ comments: [] }), { status: 200 });
      },
    ) as unknown as typeof fetch;

    render(<CommentSection postId="post-1" />);
    await waitFor(() => screen.getByRole("button", { name: "送信" }));

    fireEvent.change(screen.getByPlaceholderText("名前"), {
      target: { value: "読者" },
    });
    fireEvent.change(screen.getByPlaceholderText("コメントを書く"), {
      target: { value: "コメント" },
    });
    fireEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText(/連続投稿はできません/)).toBeDefined();
    });
  });

  it("offers a reload when the comment list cannot be loaded", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response("{}", { status: 500 }),
    ) as unknown as typeof fetch;

    render(<CommentSection postId="post-1" />);
    await waitFor(() => {
      expect(
        screen.getByText("コメントを読み込めませんでした。"),
      ).toBeDefined();
    });
    expect(screen.getByRole("button", { name: "再読み込み" })).toBeDefined();
  });
});
