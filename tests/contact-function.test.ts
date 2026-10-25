import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { onRequestPost, buildBrevoEmail } from "../functions/api/contact";
import { SITE } from "@/config/site";

type HandlerContext = Parameters<typeof onRequestPost>[0];

const validBody = {
  name: "太郎",
  email: "taro@example.com",
  message: "お問い合わせ内容",
  wantsReply: false,
  turnstileToken: "token",
  company: "",
};

function createContext(
  body: string | undefined,
  env: Record<string, string> = {
    TURNSTILE_SECRET_KEY: "secret",
    BREVO_API_KEY: "brevo-key",
  },
): HandlerContext {
  return {
    request: new Request("https://megadrawk.com/api/contact", {
      method: "POST",
      ...(body === undefined
        ? {}
        : {
            body,
            headers: {
              "Content-Type": "application/json",
              "CF-Connecting-IP": "203.0.113.10",
            },
          }),
    }),
    env,
  } as unknown as HandlerContext;
}

function fetchMock() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("siteverify")) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ messageId: 1 }), { status: 201 });
  });
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock());
});

afterEach(() => {
  vi.unstubAllGlobals();
  globalThis.fetch = originalFetch;
});

describe("contact function", () => {
  it("delivers a valid submission through Brevo", async () => {
    const response = await onRequestPost(
      createContext(JSON.stringify(validBody)),
    );
    expect(response.status).toBe(200);
    const brevoCall = (
      globalThis.fetch as ReturnType<typeof vi.fn>
    ).mock.calls.find(([url]) => String(url).includes("api.brevo.com"));
    expect(brevoCall).toBeDefined();
    const payload = JSON.parse(brevoCall?.[1]?.body as string);
    expect(payload.sender.email).toBe(SITE.email);
    expect(payload.to).toEqual([{ email: SITE.email }]);
    expect(payload.replyTo.email).toBe("taro@example.com");
  });

  it("rejects invalid JSON with 400", async () => {
    const response = await onRequestPost(createContext("{broken"));
    expect(response.status).toBe(400);
  });

  it("rejects an oversized body with 413", async () => {
    const response = await onRequestPost(
      createContext(
        JSON.stringify({ ...validBody, message: "あ".repeat(40 * 1024) }),
      ),
    );
    expect(response.status).toBe(413);
  });

  it("returns 500 when the function is not configured", async () => {
    const response = await onRequestPost(
      createContext(JSON.stringify(validBody), {}),
    );
    expect(response.status).toBe(500);
  });

  it("rejects a missing Turnstile token", async () => {
    const body = { ...validBody, turnstileToken: "" };
    const response = await onRequestPost(createContext(JSON.stringify(body)));
    expect(response.status).toBe(400);
  });

  it("rejects when Turnstile verification fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false }), { status: 200 }),
      ),
    );
    const response = await onRequestPost(
      createContext(JSON.stringify(validBody)),
    );
    expect(response.status).toBe(400);
  });

  it("returns 502 when Brevo rejects the delivery", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("siteverify")) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
          });
        }
        return new Response("error", { status: 500 });
      }),
    );
    const response = await onRequestPost(
      createContext(JSON.stringify(validBody)),
    );
    expect(response.status).toBe(502);
  });

  it("rejects validation failures without sending", async () => {
    const response = await onRequestPost(
      createContext(JSON.stringify({ ...validBody, email: "invalid" })),
    );
    expect(response.status).toBe(400);
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.filter(([url]) => String(url).includes("brevo"))).toHaveLength(
      0,
    );
  });

  it("rejects a reply request without an email address", async () => {
    const response = await onRequestPost(
      createContext(
        JSON.stringify({ ...validBody, email: "", wantsReply: true }),
      ),
    );
    expect(response.status).toBe(400);
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.filter(([url]) => String(url).includes("brevo"))).toHaveLength(
      0,
    );
  });

  it("rejects a non-boolean reply flag", async () => {
    const response = await onRequestPost(
      createContext(JSON.stringify({ ...validBody, wantsReply: "yes" })),
    );
    expect(response.status).toBe(400);
  });

  it("delivers a submission without an email and omits Reply-To", async () => {
    const response = await onRequestPost(
      createContext(JSON.stringify({ ...validBody, email: "" })),
    );
    expect(response.status).toBe(200);
    const brevoCall = (
      globalThis.fetch as ReturnType<typeof vi.fn>
    ).mock.calls.find(([url]) => String(url).includes("api.brevo.com"));
    expect(brevoCall).toBeDefined();
    const payload = JSON.parse(brevoCall?.[1]?.body as string);
    expect(payload.replyTo).toBeUndefined();
    expect(payload.textContent).toContain("返信希望: なし");
    expect(payload.textContent).toContain("返信先: （記載なし）");
  });

  it("silently succeeds for honeypot bots without sending mail", async () => {
    const response = await onRequestPost(
      createContext(
        JSON.stringify({
          ...validBody,
          turnstileToken: "",
          company: "bot inc",
        }),
      ),
    );
    expect(response.status).toBe(200);
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls;
    expect(
      calls.filter(([url]) => String(url).includes("siteverify")),
    ).toHaveLength(0);
  });
});

describe("buildBrevoEmail", () => {
  it("builds the mail payload from the single contact authority", () => {
    const payload = buildBrevoEmail({
      name: "花子",
      email: "hanako@example.com",
      message: "こんにちは",
      wantsReply: true,
    });
    expect(payload.sender).toEqual({ name: SITE.name, email: SITE.email });
    expect(payload.subject).toContain("花子");
    expect(payload.replyTo).toEqual({ email: "hanako@example.com" });
    expect(payload.textContent).toContain("返信希望: あり");
    expect(payload.textContent).toContain("hanako@example.com");
    expect(payload.textContent).toContain("こんにちは");
  });

  it("omits Reply-To when the optional email is empty", () => {
    const payload = buildBrevoEmail({
      name: "花子",
      email: "",
      message: "こんにちは",
      wantsReply: false,
    });
    expect(payload.replyTo).toBeUndefined();
    expect(payload.textContent).toContain("返信希望: なし");
    expect(payload.textContent).toContain("返信先: （記載なし）");
  });
});
