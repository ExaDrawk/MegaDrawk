import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  output: "static",
  markdown: {
    syntaxHighlight: "prism",
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://pagead2.googlesyndication.com https://www.google.com https://www.google.co.jp https://googleads.g.doubleclick.net",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://pagead2.googlesyndication.com https://adservice.google.com https://adservice.google.co.jp https://static.cloudflareinsights.com",
        "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://www.google.co.jp",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          "https://pagead2.googlesyndication.com",
          "https://adservice.google.com",
          "https://adservice.google.co.jp",
          "https://www.googletagservices.com",
          "https://partner.googleadservices.com",
          "https://tpc.googlesyndication.com",
          "https://www.google.com",
          "https://www.google.co.jp",
          "https://static.cloudflareinsights.com",
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
