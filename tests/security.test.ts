import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  inlineScriptHashes,
  inlineStyleHashes,
  inlineStyleAttrHashes,
  assertStaticHtml,
  securityHeaders,
} from "../scripts/security.mjs";

describe("static CSP", () => {
  it("checks parsed attributes without rejecting escaped examples in content", () => {
    expect(() =>
      assertStaticHtml(
        '<p>Example: style="color:red" &lt;img onerror="alert(1)"&gt;</p>',
      ),
    ).not.toThrow();
    expect(() =>
      assertStaticHtml('<img src="x" onerror="alert(1)">'),
    ).toThrow();
    expect(() =>
      assertStaticHtml('<div style="display:none"></div>'),
    ).toThrow();
    expect(() =>
      assertStaticHtml(
        '<template><button onclick="alert(1)">bad</button></template>',
      ),
    ).toThrow();
  });
  it("hashes exact inline bytes and excludes external scripts", () => {
    const script = 'console.log("<safe>");\n';
    const expected = `'sha256-${createHash("sha256").update(script).digest("base64")}'`;
    expect(
      inlineScriptHashes(
        `<script>${script}</script><script src="/app.js"></script>`,
      ),
    ).toEqual([expected]);
    expect(inlineScriptHashes(`<script>${script.trim()}</script>`)).not.toEqual(
      [expected],
    );
  });
  it("does not allow inline attributes, eval, framing or external fonts", () => {
    const headers = securityHeaders([]);
    const csp = headers["Content-Security-Policy"];
    expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|nonce-/);
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("style-src-attr 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("font-src 'self'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("https://static.cloudflareinsights.com");
    expect(csp).toContain("https://cloudflareinsights.com");
  });
  it("permits only the exact generated island style", () => {
    const hashes = inlineStyleHashes(
      "<style>astro-island{display:contents}</style>",
    );
    expect(hashes).toHaveLength(1);
    expect(securityHeaders([], hashes)["Content-Security-Policy"]).toContain(
      hashes[0],
    );
    expect(hashes).not.toEqual(
      inlineStyleHashes("<style>body{display:none}</style>"),
    );
  });
});
describe("turnstile CSP", () => {
  it("does not allow Turnstile origins unless the contact form build enables it", () => {
    const disabled = securityHeaders([])["Content-Security-Policy"];
    expect(disabled).not.toContain("challenges.cloudflare.com");
    const enabled = securityHeaders([], [], {
      turnstile: true,
    })["Content-Security-Policy"];
    expect(enabled).toContain("https://challenges.cloudflare.com");
    const scriptDirectives = enabled
      .split("; ")
      .filter((directive) => directive.startsWith("script-src "));
    expect(scriptDirectives).toHaveLength(1);
    expect(scriptDirectives[0]).toContain("https://challenges.cloudflare.com");
    const frameDirectives = enabled
      .split("; ")
      .filter((directive) => directive.startsWith("frame-src"));
    expect(frameDirectives[0]).toContain("https://challenges.cloudflare.com");
  });
});

describe("shiki style attributes", () => {
  const shikiSpan =
    '<span style="--shiki-light:#D4D4D4;--shiki-dark:#C586C0;font-style:italic">const</span>';

  it("allows only shiki-shaped style attributes in generated HTML", () => {
    expect(() => assertStaticHtml(shikiSpan)).not.toThrow();
    expect(() =>
      assertStaticHtml('<div style="position:fixed;top:0">overlay</div>'),
    ).toThrow();
    expect(() =>
      assertStaticHtml(
        '<div style="background:url(https://evil.invalid/x)">leak</div>',
      ),
    ).toThrow();
    expect(() =>
      assertStaticHtml('<div style="color:red" onclick="alert(1)">x</div>'),
    ).toThrow();
  });

  it("permits style attributes via per-value hashes in style-src-attr", () => {
    const attrHashes = inlineStyleAttrHashes(shikiSpan);
    expect(attrHashes).toHaveLength(1);
    expect(attrHashes[0]).toMatch(/^'sha256-/);
    const headers = securityHeaders([], [], { styleAttrHashes: attrHashes });
    const csp = headers["Content-Security-Policy"];
    expect(csp).toContain(`style-src-attr ${attrHashes[0]}`);
    // ハッシュがないビルドでは従来どおり属性スタイルは全禁止
    expect(securityHeaders([], [])["Content-Security-Policy"]).toContain(
      "style-src-attr 'none'",
    );
  });
});
