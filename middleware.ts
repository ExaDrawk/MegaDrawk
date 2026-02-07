import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SERVICES } from "@/config/site";

/**
 * Allowed image origins derived from SERVICES config.
 * Single source of truth: src/config/site.ts
 */
const ALLOWED_IMG_ORIGINS = SERVICES.map((s) => `https://${s.subdomain}`);

/**
 * Build Content-Security-Policy header value.
 *
 * ACCEPTED RISK: style-src 'unsafe-inline' is required because Tailwind CSS v4
 * injects runtime styles via <style> elements. Documented per OWASP ASVS V14.4.
 *
 * References:
 * - OWASP ASVS V14.4 (HTTP Security Headers)
 * - OWASP Top 10 A05 (Security Misconfiguration)
 * - NIST SSDF PW.6 (Secure Configuration)
 */
function buildCsp(nonce: string): string {
  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: ${ALLOWED_IMG_ORIGINS.join(" ")}`,
    "font-src": "'self' data:",
    "connect-src": "'self'",
    "media-src": "'none'",
    "frame-src": "'none'",
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

/**
 * Comprehensive Permissions-Policy.
 * Disables all browser APIs not used by this application.
 * Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
 */
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

/** Generate a cryptographically random nonce (128-bit, base64). */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();

  // Pass nonce to server components via REQUEST headers only.
  // SECURITY: The nonce is NOT exposed as a response header.
  // Server components read it via headers().get("x-nonce").
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ── Security response headers (OWASP ASVS V14, NIST SSDF PW.6) ──
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Cross-Origin isolation headers
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api, _next/static, _next/image (framework routes)
     * - favicon.ico, assets (static public files)
     * - robots.txt, sitemap.xml, ads.txt (SEO/ad files)
     * - .well-known (RFC 8615 well-known URIs)
     * - manifest.webmanifest (PWA manifest)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|assets|robots\\.txt|sitemap\\.xml|ads\\.txt|manifest\\.webmanifest|\\.well-known).*)",
  ],
};
