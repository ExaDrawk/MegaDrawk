import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `${SITE.name}への連絡先。X（Twitter）からお気軽にお声がけください。`,
};

export default function ContactPage() {
  return (
    <div className="animate-enter-up">
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1 className="section-heading">Contact</h1>
        <div style={{ maxWidth: "var(--content-width)" }}>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ご連絡はXからお気軽にどうぞ。
          </p>

          <div className="mt-8">
            <a
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white rounded-md transition-colors duration-150"
              style={{ background: "var(--color-accent)" }}
            >
              X（{SITE.social.xHandle}）
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>

          <div
            className="mt-10 p-5 rounded-lg"
            style={{
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              同じ高安動脈炎の方は、お気軽に声をかけてください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
