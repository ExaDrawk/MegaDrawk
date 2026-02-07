// @ts-check

/**
 * Remote image patterns derived from SERVICES config.
 * Mirrors CSP img-src directives in middleware.ts.
 *
 * NOTE: next.config.js runs in Node.js context (not bundled),
 * so we use require() for the config import.
 */
const REMOTE_IMAGE_PATTERNS = [
  { protocol: "https", hostname: "meetpicks.megadrawk.com" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SECURITY: Suppress X-Powered-By header (OWASP ASVS V14.4.1)
  poweredByHeader: false,

  // Double-render detection for safer component lifecycle
  reactStrictMode: true,

  // Allowed remote image origins
  images: {
    remotePatterns: REMOTE_IMAGE_PATTERNS,
    // Security: disallow arbitrary remote images via loader
    dangerouslyAllowSVG: false,
  },

  // Additional security headers for static assets not handled by middleware
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "off" },
      ],
    },
  ],
};

module.exports = nextConfig;
