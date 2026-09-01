import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { SITE } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipNav } from "@/components/ui/SkipNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.ownerName, url: SITE.url }],
  creator: SITE.ownerName,
  publisher: SITE.name,
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  alternates: {
    canonical: SITE.url,
  },
  category: "portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary",
    site: SITE.social.xHandle,
    title: SITE.name,
    description: SITE.description,
  },
};

function PersonJsonLd({ nonce }: { nonce?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.ownerName,
    url: SITE.url,
    description: SITE.description,
    sameAs: [SITE.social.x],
  };

  return (
    <script type="application/ld+json" nonce={nonce}>
      {JSON.stringify(jsonLd)}
    </script>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? undefined;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  return (
    <html lang={SITE.language}>
      <head>
        {adsenseClient ? (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            nonce={nonce}
          />
        ) : null}
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} antialiased`}>
        <PersonJsonLd nonce={nonce} />
        <SkipNav />
        <div className="page-container">
          <SiteHeader />
          <main id="main-content" className="page-main">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
