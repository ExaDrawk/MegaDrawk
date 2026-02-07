import { STAGGER } from "@/config/theme";
import { SkipNav } from "@/components/ui/SkipNav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { HeroBrand } from "@/components/landing/HeroBrand";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { CtaSection } from "@/components/landing/CtaSection";

/**
 * MegaDrawk official landing page — React Server Component.
 *
 * Architecture:
 * - Zero client JS (pure RSC). Animations are CSS-only.
 * - Decomposed into focused, testable section components.
 * - All content derived from config (src/config/site.ts).
 * - Visual tokens via CSS custom properties (globals.css).
 * - Stagger timing via theme config (src/config/theme.ts).
 */
export default function Home() {
  return (
    <>
      <SkipNav />
      <AmbientBackground />
      <SiteHeader delay={STAGGER.header} />

      <div className="min-h-screen flex flex-col items-center relative px-5 sm:px-8">
        <main
          id="main-content"
          className="w-full max-w-5xl flex flex-col items-center gap-24 sm:gap-32 pb-24"
        >
          <HeroBrand delay={STAGGER.hero} />
          <AboutSection delay={STAGGER.about} />
          <FeaturesGrid delay={STAGGER.features} />
          <ServicesSection delay={STAGGER.services} />
          <CtaSection delay={STAGGER.cta} />
        </main>

        <SiteFooter delay={STAGGER.footer} />
      </div>
    </>
  );
}
