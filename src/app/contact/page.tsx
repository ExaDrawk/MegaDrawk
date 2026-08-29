import { SITE } from "@/config/site";
import { XProfileLink } from "@/components/ui/XProfileLink";

export const metadata = {
  title: "Contact",
  description: `${SITE.name}への連絡先。X（Twitter）からお気軽にお声がけください。`,
};

export default function ContactPage() {
  return (
    <div className="animate-enter-up">
      <section className="page-section">
        <header className="page-header">
          <h1 className="page-title">Contact</h1>
        </header>
        <div style={{ maxWidth: "var(--content-width)" }}>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            ご連絡はXからお気軽にどうぞ。
          </p>

          <div className="mt-8">
            <XProfileLink
              href={SITE.social.x}
              label={SITE.social.xHandle}
              ariaLabel={`X（${SITE.social.xHandle}）`}
              className="action action-primary"
              iconSize={15}
              showExternalIcon
            />
          </div>
        </div>
      </section>
    </div>
  );
}
