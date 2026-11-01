import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PostStats } from "@/components/blog/PostStats";

const originalFetch = globalThis.fetch;

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  window.sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("PostStats", () => {
  it("shows views and comments from the API", async () => {
    globalThis.fetch = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/api/views/")) {
          expect(init?.method).toBe("POST");
          return new Response(JSON.stringify({ views: 1234 }), {
            status: 200,
          });
        }
        if (url.includes("/api/comments/") && url.includes("count=1")) {
          return new Response(JSON.stringify({ count: 5 }), { status: 200 });
        }
        return new Response("{}", { status: 200 });
      },
    ) as unknown as typeof fetch;

    render(<PostStats postId="post-1" />);

    await waitFor(() => expect(screen.getByText("閲覧 1,234")).toBeDefined());
    await waitFor(() => expect(screen.getByText("コメント 5")).toBeDefined());
    expect(window.sessionStorage.getItem("post-view:post-1")).toBe("1");
  });

  it("reads the view count without incrementing in the same session", async () => {
    window.sessionStorage.setItem("post-view:post-1", "1");
    globalThis.fetch = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/api/views/")) {
          expect(init?.method).toBeUndefined();
          return new Response(JSON.stringify({ views: 9 }), { status: 200 });
        }
        return new Response(JSON.stringify({ count: 0 }), { status: 200 });
      },
    ) as unknown as typeof fetch;

    render(<PostStats postId="post-1" />);

    await waitFor(() => expect(screen.getByText("閲覧 9")).toBeDefined());
  });

  it("updates the comment count from comments:changed", async () => {
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/views/")) {
        return new Response(JSON.stringify({ views: 1 }), { status: 200 });
      }
      return new Response(JSON.stringify({ count: 2 }), { status: 200 });
    }) as unknown as typeof fetch;

    render(<PostStats postId="post-1" />);
    await waitFor(() => expect(screen.getByText("コメント 2")).toBeDefined());

    act(() => {
      window.dispatchEvent(
        new CustomEvent("comments:changed", {
          detail: { postId: "post-1", count: 4 },
        }),
      );
    });

    await waitFor(() => expect(screen.getByText("コメント 4")).toBeDefined());

    act(() => {
      window.dispatchEvent(
        new CustomEvent("comments:changed", {
          detail: { postId: "post-1", count: 1 },
        }),
      );
    });
    await waitFor(() => expect(screen.getByText("コメント 4")).toBeDefined());
  });
});
