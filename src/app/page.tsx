import { SITE, SERVICES } from "@/config/site";
import { UI, ANIMATION_DELAYS } from "@/config/theme";
import { MeetPicksIcon } from "@/components/icons/MeetPicksIcon";
import { ExternalLink } from "lucide-react";

/**
 * Landing page — React Server Component.
 *
 * Design decisions:
 * - RSC (no 'use client') for maximal SSR/SEO performance.
 * - CSS animations replace framer-motion (~30KB saved).
 * - Semantic HTML: <header>, <main>, <footer>, <nav>, <article>.
 * - Skip-navigation link for keyboard/screen-reader users (WCAG 2.1 §2.4.1).
 * - All text from config constants (DRY).
 */
export default function Home() {
  const meetpicks = SERVICES[0];
  const year = new Date().getFullYear();

  return (
    <div
      className={`min-h-screen ${UI.background} ${UI.text.primary} flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* Skip navigation — WCAG 2.1 §2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        メインコンテンツへスキップ
      </a>

      {/* Background Effects */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <main
        id="main-content"
        className="relative z-10 text-center px-6 max-w-2xl w-full"
        role="main"
      >
        {/* Branding */}
        <header
          className="mb-12 animate-fade-in-up"
          style={{ animationDelay: `${ANIMATION_DELAYS.branding}ms` }}
        >
          <div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl shadow-2xl shadow-cyan-500/30"
            role="img"
            aria-label={`${SITE.name} ロゴ`}
          />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            {SITE.name}
          </h1>
          <p className={`${UI.text.secondary} mt-2 text-sm`}>
            {SITE.tagline}
          </p>
        </header>

        {/* Services */}
        <nav aria-label="サービス一覧">
          <article
            className={`group block p-8 rounded-3xl transition-all duration-300 animate-fade-in-up ${UI.card.base} ${UI.card.hover}`}
            style={{ animationDelay: `${ANIMATION_DELAYS.serviceCard}ms` }}
          >
            <a
              href={meetpicks.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
              aria-label={`${meetpicks.name} — ${meetpicks.description}`}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <MeetPicksIcon
                  className="w-16 h-16 rounded-xl shadow-lg"
                  aria-hidden="true"
                />
                <div className="text-left">
                  <h2 className="text-2xl font-bold group-hover:text-cyan-400 transition-colors">
                    {meetpicks.name}
                  </h2>
                  <span className={`text-xs ${UI.text.muted} font-mono`}>
                    {meetpicks.subdomain}
                  </span>
                </div>
              </div>
              <p
                className={`${UI.text.secondary} text-sm leading-relaxed mb-6`}
              >
                {meetpicks.description}
              </p>
              <div
                className={`flex items-center justify-center gap-2 ${UI.text.accent} text-sm font-semibold`}
              >
                <span>サイトを開く</span>
                <ExternalLink
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </a>
          </article>
        </nav>

        {/* Footer */}
        <footer
          className="mt-16 text-slate-600 text-xs animate-fade-in"
          style={{ animationDelay: `${ANIMATION_DELAYS.footer}ms` }}
        >
          <p>&copy; {year} {SITE.legalName}</p>
        </footer>
      </main>
    </div>
  );
}
