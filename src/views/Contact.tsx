import { SITE } from "@/config/site";
import { XProfileLink } from "@/components/ui/XProfileLink";

export const metadata = {
  title: "Contact",
  description: `${SITE.name}への連絡先。`,
};

export default function ContactPage() {
  return (
    <div>
      <section className="page-section" aria-labelledby="contact-title">
        <header className="page-header">
          <h1
            id="contact-title"
            className="page-title text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Contact
          </h1>
          <p
            className="page-description mt-3 text-base leading-relaxed"
            data-color="color-text-secondary"
          >
            ご連絡はX（{SITE.social.xHandle}）のDMまで。
          </p>
        </header>

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
      </section>
    </div>
  );
}
