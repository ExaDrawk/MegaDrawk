import { createHash } from "node:crypto";
import { parse } from "parse5";

// Shikiがコードブロックに出力するstyle属性値のみ許可する
// （CSS変数・色・フォント・スクロール指定。url()や配置系は値レベルで拒否する）。
const SAFE_STYLE_ATTR_PATTERN =
  /^(?:\s*(?:--[a-z0-9-]+|color|background-color|font-style|font-weight|text-decoration|white-space|overflow-x):[^;{}]*;?)*\s*$/i;
const STYLE_ATTR_FORBIDDEN =
  /url\(|expression|javascript:|@import|position\s*:/i;

export function assertStaticHtml(html) {
  const visit = (node) => {
    for (const attribute of node.attrs ?? []) {
      if (attribute.name === "style") {
        const value = attribute.value ?? "";
        if (
          value.length > 2048 ||
          STYLE_ATTR_FORBIDDEN.test(value) ||
          !SAFE_STYLE_ATTR_PATTERN.test(value)
        ) {
          throw new Error(
            `Disallowed style attribute found: ${value.slice(0, 80)}`,
          );
        }
      }
      if (attribute.name.startsWith("on"))
        throw new Error("Inline event handlers found");
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

/** style属性の値ごとのハッシュ（style-src-attrで許可リスト化するためのもの）。 */
export const inlineStyleAttrHashes = (html) => {
  const hashes = new Set();
  for (const match of html.matchAll(/style="([^"]*)"/gi)) {
    hashes.add(
      `'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`,
    );
  }
  return [...hashes];
};

export function securityHeaders(hashes, styleHashes = [], options = {}) {
  // Turnstileはお問い合わせフォームが有効なビルドでのみ許可する（最小権限）。
  const turnstileOrigins = options.turnstile
    ? " https://challenges.cloudflare.com"
    : "";
  // 広告オリジンはAdSense有効なビルドでのみ許可する。
  // （CSPはCloudflare Pagesの_headersで1行2,000文字上限のため、縮減も兼ねる）
  const adsense = Boolean(options.adsense);
  const adScriptOrigins = adsense ? " " + adScripts.join(" ") : "";
  const adImgOrigins = adsense
    ? " " +
      adScripts.join(" ") +
      " https://googleads.g.doubleclick.net https://tpc.googlesyndication.com"
    : "";
  const adConnectOrigins = adsense
    ? " " + adScripts.join(" ") + " https://googleads.g.doubleclick.net"
    : "";
  const adFrameOrigins = adsense ? " " + adFrames.join(" ") : "";
  // style属性はShikiの出力のみで、値ごとのハッシュで許可リスト化する。
  const styleAttrHashes = [...new Set(options.styleAttrHashes ?? [])];
  const styleSrcAttr = styleAttrHashes.length
    ? "'unsafe-hashes' " + styleAttrHashes.join(" ")
    : "'none'";
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${[...new Set(hashes)].join(" ")}${adScriptOrigins} https://static.cloudflareinsights.com${turnstileOrigins}`,
    "script-src-attr 'none'",
    `style-src 'self' ${[...new Set(styleHashes)].join(" ")}`,
    `style-src-attr ${styleSrcAttr}`,
    `img-src 'self' data:${adImgOrigins} https://github.com https://avatars.githubusercontent.com`,
    "font-src 'self'",
    `connect-src 'self'${adConnectOrigins} https://cloudflareinsights.com`,
    `frame-src 'self'${adFrameOrigins}${turnstileOrigins}`,
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
