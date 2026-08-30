import { SITE } from "@/config/site";
import { XProfileLink } from "@/components/ui/XProfileLink";

export const metadata = {
  title: "Contact",
  description: `${SITE.name}への連絡先。X（Twitter）からお気軽にお声がけください。`,
};

export default function ContactPage() {
  return (
    <div className="animate-enter-up">
      <section className="page-section" aria-labelledby="contact-title">
        <div className="contact-layout">
          <div className="contact-layout__message">
            <p className="eyebrow">Contact / open line</p>
            <h1 id="contact-title" className="page-title">
              Contact
            </h1>
            <p className="page-description">
              ご連絡はXからお気軽にどうぞ。制作や個人開発についてのメッセージを歓迎します。
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

          <aside className="contact-detail" aria-label="連絡先情報">
            <p className="contact-detail__label">Preferred channel</p>
            <p className="contact-detail__value">X / {SITE.social.xHandle}</p>
            <p className="section-description">
              公開アカウントへのリンクです。新しいタブで開きます。
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
