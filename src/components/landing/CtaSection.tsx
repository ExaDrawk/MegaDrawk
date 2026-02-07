import { SITE } from "@/config/site";
import { Mail } from "lucide-react";

/**
 * CTA section — call to action for enterprise inquiries.
 *
 * Pure RSC. Contact email derived from SITE config.
 * Prominent visual treatment to drive conversion.
 */
export function CtaSection({ delay = 0 }: { delay?: number }) {
  return (
    <section
      id="contact"
      className="animate-enter-up w-full"
      style={{ animationDelay: `${delay}ms` }}
      aria-label="お問い合わせ"
    >
      <div
        className="mx-auto max-w-3xl rounded-[var(--radius-card)] p-10 sm:p-14 text-center relative overflow-hidden"
        style={{
          background: "var(--color-surface-overlay)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(6,182,212,0.06), transparent 70%)",
          }}
          aria-hidden="true"
        />

        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          導入をご検討ですか？
        </h2>

        <p
          className="mt-4 text-base max-w-lg mx-auto leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          エンタープライズ導入、カスタマイズ、技術的なご質問など、
          お気軽にお問い合わせください。専任チームが対応いたします。
        </p>

        <div className="mt-8">
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white rounded-[var(--radius-button)] transition-all duration-[var(--duration-normal)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
              boxShadow: "0 4px 16px var(--color-brand-glow)",
            }}
          >
            <Mail
              size={16}
              className="transition-transform duration-[var(--duration-normal)] group-hover:scale-110"
              aria-hidden="true"
            />
            お問い合わせ
          </a>
        </div>

        <p
          className="mt-4 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {SITE.contactEmail}
        </p>
      </div>
    </section>
  );
}
