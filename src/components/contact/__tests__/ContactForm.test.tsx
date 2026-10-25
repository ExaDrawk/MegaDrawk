import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/ContactForm";

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

const originalFetch = globalThis.fetch;

function mockContactFetch(status = 200) {
  return vi.fn(
    async () => new Response(JSON.stringify({ ok: true }), { status }),
  );
}

function postBodies(): unknown[] {
  return (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
    .filter(([url]) => String(url).includes("/api/contact"))
    .map(([, init]) => JSON.parse(String((init as RequestInit).body)));
}

function fillValidForm() {
  fireEvent.change(screen.getByRole("textbox", { name: "お名前" }), {
    target: { value: "山田 太郎" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "お問い合わせ内容" }), {
    target: { value: "お問い合わせ内容です。" },
  });
}

beforeEach(() => {
  globalThis.fetch = mockContactFetch() as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders the reply checkbox with an optional email and no legacy note", () => {
    render(<ContactForm siteKey="test-site-key" />);

    const checkbox = screen.getByRole("checkbox", { name: "返信を希望する" });
    expect((checkbox as HTMLInputElement).checked).toBe(false);
    expect(
      screen.getByRole("textbox", { name: "メールアドレス（任意）" }),
    ).toBeDefined();
    expect(screen.queryByText(/返信が必要な場合は、本文に/)).toBeNull();
  });

  it("toggles the email field between optional and required with the checkbox", () => {
    render(<ContactForm siteKey="test-site-key" />);

    const checkbox = screen.getByRole("checkbox", { name: "返信を希望する" });
    fireEvent.click(checkbox);
    const requiredBox = screen.getByRole("textbox", {
      name: "メールアドレス（必須）",
    }) as HTMLInputElement;
    expect(requiredBox.required).toBe(true);

    fireEvent.click(checkbox);
    const optionalBox = screen.getByRole("textbox", {
      name: "メールアドレス（任意）",
    }) as HTMLInputElement;
    expect(optionalBox.required).toBe(false);
  });

  it("rejects a reply request without an email before any network call", () => {
    render(<ContactForm siteKey="test-site-key" />);
    fillValidForm();
    fireEvent.click(screen.getByRole("checkbox", { name: "返信を希望する" }));

    fireEvent.click(screen.getByRole("button", { name: "送信する" }));

    expect(
      screen.getByText(
        "返信をご希望の場合は、メールアドレスを入力してください。",
      ),
    ).toBeDefined();
    expect(postBodies()).toHaveLength(0);
  });

  it("sends wantsReply=true with the email when a reply is requested", async () => {
    render(<ContactForm siteKey="test-site-key" />);
    fillValidForm();
    fireEvent.change(
      screen.getByRole("textbox", { name: "メールアドレス（任意）" }),
      { target: { value: "taro@example.com" } },
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "返信を希望する" }));

    fireEvent.click(screen.getByRole("button", { name: "送信する" }));

    await waitFor(() => {
      expect(screen.getByText(/送信しました/)).toBeDefined();
    });
    const bodies = postBodies();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({
      name: "山田 太郎",
      email: "taro@example.com",
      wantsReply: true,
    });
  });

  it("sends wantsReply=false when no reply is requested", async () => {
    render(<ContactForm siteKey="test-site-key" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "送信する" }));

    await waitFor(() => {
      expect(screen.getByText(/送信しました/)).toBeDefined();
    });
    const bodies = postBodies();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ wantsReply: false });
  });
});
