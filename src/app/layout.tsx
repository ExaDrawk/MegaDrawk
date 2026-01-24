import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SITE } from "../config/site";
import "./globals.css";

const interSans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        <script
          async
          nonce={nonce}
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4594218580257200"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${interSans.variable} ${jetBrainsMono.variable} antialiased`}
        nonce={nonce}
      >
        {children}
      </body>
    </html>
  );
}
