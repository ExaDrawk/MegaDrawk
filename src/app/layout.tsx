import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/config/site";
import "./globals.css";

const interSans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Viewport configuration.
 * Exported separately per Next.js 14 convention (not inside metadata).
 * themeColor from SITE config (single source of truth).
 */
export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

/**
 * Site-wide metadata.
 *
 * Open Graph, Twitter, and standard HTML metadata are all derived from
 * SITE config to eliminate duplicate branding strings.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },

  // Twitter / X
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },

  // Icons — references the existing favicon.ico in /app
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * JSON-LD structured data for the organization.
 * Improves search engine understanding. Ref: https://schema.org/Organization
 */
function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Root layout — React Server Component.
 *
 * CSP nonce is generated in middleware.ts and passed via request headers.
 * Next.js automatically injects it into framework <script> tags.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE.language}>
      <body
        className={`${interSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
