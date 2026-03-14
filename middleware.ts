import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * AdSense 関連の許可オリジン
 * CSP で AdSense スクリプト・フレーム・画像・接続を許可するために必要。
 */
const ADSENSE_SCRIPT_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://adservice.google.com",
  "https://adservice.google.co.jp",
  "https://www.googletagservices.com",
  "https://partner.googleadservices.com",
  "https://tpc.googlesyndication.com",
  "https://www.google.com",
  "https://www.google.co.jp",
];

const ADSENSE_FRAME_ORIGINS = [
  "https://googleads.g.doubleclick.net",
  "https://tpc.googlesyndication.com",
  "https://www.google.com",
  "https://www.google.co.jp",
];

const ADSENSE_IMG_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://www.google.com",
  "https://www.google.co.jp",
  "https://googleads.g.doubleclick.net",
];

const ADSENSE_CONNECT_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://adservice.google.com",
  "https://adservice.google.co.jp",
];

function buildCsp(nonce: string): string {
  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `'self' 'nonce-${nonce}' ${ADSENSE_SCRIPT_ORIGINS.join(" ")}`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: ${ADSENSE_IMG_ORIGINS.join(" ")}`,
    "font-src": "'self' data: https://fonts.gstatic.com",
    "connect-src": `'self' ${ADSENSE_CONNECT_ORIGINS.join(" ")}`,
    "media-src": "'none'",
    "frame-src": ADSENSE_FRAME_ORIGINS.join(" "),
    "child-src": "'none'",
    "worker-src": "'self'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "upgrade-insecure-requests": "",
  };

  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join("; ");
}

const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "accelerometer=()",
  "autoplay=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "gyroscope=()",
  "magnetometer=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "usb=()",
  "browsing-topics=()",
].join(", ");

const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const MAX_URL_LENGTH = 2048;

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function middleware(request: NextRequest) {
  if (!ALLOWED_METHODS.has(request.method)) {
    return new NextResponse(null, { status: 405 });
  }

  if (request.nextUrl.href.length > MAX_URL_LENGTH) {
    return new NextResponse(null, { status: 414 });
  }

  const nonce = generateNonce();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|assets|robots\\.txt|sitemap\\.xml|ads\\.txt|manifest\\.webmanifest|\\.well-known).*)",
  ],
};
