import { createHash } from "node:crypto";
import { parse } from "parse5";

export function assertStaticHtml(html) {
  const visit = (node) => {
    for (const attribute of node.attrs ?? []) {
      if (attribute.name === "style" || attribute.name.startsWith("on"))
        throw new Error("Inline styles or event handlers found");
    }
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  };
  visit(parse(html));
}

const adScripts = [
  "https://pagead2.googlesyndication.com",
  "https://adservice.google.com",
  "https://adservice.google.co.jp",
  "https://www.googletagservices.com",
  "https://partner.googleadservices.com",
  "https://tpc.googlesyndication.com",
  "https://www.google.com",
  "https://www.google.co.jp",
];
const adFrames = [
  "https://googleads.g.doubleclick.net",
  "https://tpc.googlesyndication.com",
  "https://www.google.com",
  "https://www.google.co.jp",
];

function inlineElementHashes(html, element) {
  return [
    ...html.matchAll(
      new RegExp(`<${element}\\b([^>]*)>([\\s\\S]*?)<\\/${element}>`, "gi"),
    ),
  ]
    .filter((match) => !/\bsrc\s*=/i.test(match[1]))
    .map(
      (match) =>
        `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
    );
}

export const inlineScriptHashes = (html) => inlineElementHashes(html, "script");
export const inlineStyleHashes = (html) => inlineElementHashes(html, "style");

export function securityHeaders(hashes, styleHashes = [], options = {}) {
  // Turnstileはお問い合わせフォームが有効なビルドでのみ許可する（最小権限）。
  const turnstileOrigins = options.turnstile
    ? " https://challenges.cloudflare.com"
    : "";
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${[...new Set(hashes)].join(" ")} ${adScripts.join(" ")} https://static.cloudflareinsights.com${turnstileOrigins}`,
    "script-src-attr 'none'",
    `style-src 'self' ${[...new Set(styleHashes)].join(" ")}`,
    "style-src-attr 'none'",
    `img-src 'self' data: ${adScripts.join(" ")} https://googleads.g.doubleclick.net`,
    "font-src 'self'",
    `connect-src 'self' ${adScripts.join(" ")} https://googleads.g.doubleclick.net https://cloudflareinsights.com`,
    `frame-src ${adFrames.join(" ")}${turnstileOrigins}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'none'",
    "media-src 'none'",
  ].join("; ");
  return {
    "Content-Security-Policy": csp,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
  };
}
