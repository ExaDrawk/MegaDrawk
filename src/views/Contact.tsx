import { Mail } from "lucide-react";
import { SITE } from "@/config/site";
import { SITE_FEATURES } from "@/config/features";
import { ActionLink } from "@/components/ui/Action";
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
            ご連絡はメール（{SITE.email}）またはX（{SITE.social.xHandle}
            ）のDMまで。
          </p>
        </header>

        <div className="mt-8 flex flex-col items-start gap-3">
          <ActionLink
            href={`mailto:${SITE.email}`}
            aria-label={`メールで連絡（${SITE.email}）`}
          >
            <Mail size={15} aria-hidden="true" className="shrink-0" />
            <span>{SITE.email}</span>
          </ActionLink>
          <XProfileLink
            href={SITE.social.x}
            label={SITE.social.xHandle}
            ariaLabel={`X（${SITE.social.xHandle}）`}
            className="action action-secondary"
            iconSize={15}
            showExternalIcon
          />
        </div>
        {SITE_FEATURES.turnstileSiteKey ? (
          <p className="mt-6 text-sm" data-color="color-text-muted">
            メールソフトを開きたくない場合は、下のフォームからも送信できます。
          </p>
        ) : null}
      </section>
    </div>
  );
}
