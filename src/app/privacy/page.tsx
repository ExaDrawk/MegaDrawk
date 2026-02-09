import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${SITE.name}のプライバシーポリシー。個人情報の取り扱い、Cookie の使用、第三者広告配信について説明します。`,
};

/**
 * Privacy Policy page — required for Google AdSense compliance.
 *
 * Covers:
 * - Personal information collection & use
 * - Cookie usage & third-party ad serving (Google AdSense)
 * - User rights and data management
 * - COPPA compliance
 * - Contact information
 *
 * Ref: https://support.google.com/adsense/answer/10502938
 */
export default function PrivacyPolicyPage() {
  const lastUpdated = "2026年2月9日";

  return (
    <div className="min-h-screen flex flex-col items-center px-5 sm:px-8 pt-24 pb-16">
      <article className="w-full max-w-3xl prose-container">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors duration-[var(--duration-normal)] hover:text-[var(--color-brand-light)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          ← トップに戻る
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          プライバシーポリシー
        </h1>
        <p
          className="text-sm mb-10"
          style={{ color: "var(--color-text-muted)" }}
        >
          最終更新日: {lastUpdated}
        </p>

        {/* Introduction */}
        <Section title="はじめに">
          <p>
            {SITE.legalName}（以下「当社」）は、当社が運営するウェブサイト{SITE.domain}
            （以下「本サイト」）をご利用いただくお客様のプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーでは、
            本サイトにおける個人情報の収集、使用、開示、および保護について説明します。
          </p>
        </Section>

        {/* Information Collection */}
        <Section title="収集する情報">
          <p>本サイトでは、以下の情報を収集する場合があります：</p>
          <SubSection title="自動的に収集される情報">
            <ul>
              <li>IPアドレス</li>
              <li>ブラウザの種類とバージョン</li>
              <li>オペレーティングシステム</li>
              <li>参照元URL</li>
              <li>本サイト内でのアクセスページと滞在時間</li>
              <li>デバイス情報（画面解像度、言語設定など）</li>
            </ul>
          </SubSection>
          <SubSection title="お客様が提供する情報">
            <ul>
              <li>
                お問い合わせフォームやメールを通じてお客様が自発的に提供する氏名、
                メールアドレスなどの連絡先情報
              </li>
            </ul>
          </SubSection>
        </Section>

        {/* Use of Information */}
        <Section title="情報の利用目的">
          <p>収集した情報は、以下の目的で利用します：</p>
          <ul>
            <li>本サイトの運営、維持、改善</li>
            <li>お問い合わせへの対応</li>
            <li>利用状況の分析とサービス向上</li>
            <li>セキュリティの確保と不正利用の防止</li>
            <li>法令上の義務の遵守</li>
          </ul>
        </Section>

        {/* Cookies */}
        <Section title="Cookie（クッキー）について">
          <p>
            本サイトでは、ユーザー体験の向上やアクセス解析のためにCookieを使用しています。
            Cookieとは、ウェブサイトがお客様のブラウザに送信する小さなテキストファイルです。
          </p>
          <SubSection title="当社が使用するCookieの種類">
            <ul>
              <li>
                <strong>必須Cookie</strong>：本サイトの基本的な機能を提供するために必要なCookieです。
              </li>
              <li>
                <strong>分析Cookie</strong>：本サイトの利用状況を把握し、サービス改善に活用するためのCookieです。
              </li>
              <li>
                <strong>広告Cookie</strong>：第三者広告配信事業者がお客様に適切な広告を表示するために使用するCookieです（詳細は下記をご確認ください）。
              </li>
            </ul>
          </SubSection>
          <p>
            お客様は、ブラウザの設定によりCookieの受け入れを拒否することができます。
            ただし、Cookieを無効にした場合、本サイトの一部機能が正常に動作しない可能性があります。
          </p>
        </Section>

        {/* Third-party Advertising — Google AdSense */}
        <Section title="第三者広告配信（Google AdSense）">
          <p>
            本サイトでは、第三者広告配信事業者であるGoogleが提供するGoogle
            AdSenseを利用して広告を配信しています。
          </p>
          <SubSection title="パーソナライズド広告について">
            <p>
              Googleは、お客様の本サイトや他のウェブサイトへのアクセス情報に基づき、
              Cookieを使用してパーソナライズされた広告を配信する場合があります。
              お客様は、
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand-light)] hover:underline"
              >
                Googleの広告設定
              </a>
              にアクセスすることで、パーソナライズド広告を無効にすることができます。
            </p>
          </SubSection>
          <SubSection title="第三者配信事業者のCookieの無効化">
            <p>
              第三者配信事業者によるCookieの使用を無効にするには、
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand-light)] hover:underline"
              >
                aboutads.info
              </a>
              にアクセスしてください。
            </p>
          </SubSection>
          <SubSection title="Googleのプライバシーポリシー">
            <p>
              Googleによる情報の取り扱いについての詳細は、
              <a
                href="https://policies.google.com/technologies/ads?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand-light)] hover:underline"
              >
                Googleのポリシーと規約
              </a>
              をご確認ください。
            </p>
          </SubSection>
        </Section>

        {/* Third-party Links */}
        <Section title="第三者のウェブサイトへのリンク">
          <p>
            本サイトには、第三者のウェブサイトへのリンクが含まれる場合があります。
            これらの外部サイトのプライバシー慣行について当社は責任を負いません。
            外部サイトをご利用の際は、各サイトのプライバシーポリシーをご確認ください。
          </p>
        </Section>

        {/* Data Security */}
        <Section title="情報の保護">
          <p>
            当社は、お客様の個人情報を不正アクセス、改ざん、漏洩、
            破壊から保護するために、合理的な技術的・組織的セキュリティ対策を講じています。
            ただし、インターネット上での情報伝送は完全に安全であることを保証できるものではありません。
          </p>
        </Section>

        {/* Children's Privacy — COPPA */}
        <Section title="児童のプライバシー（COPPA準拠）">
          <p>
            本サイトは、13歳未満のお子様を対象としたサービスではありません。
            当社は、13歳未満のお子様から意図的に個人情報を収集することはありません。
            13歳未満のお子様の個人情報が収集されたことが判明した場合、
            当社は速やかに当該情報を削除するための措置を講じます。
          </p>
        </Section>

        {/* Data Retention */}
        <Section title="情報の保存期間">
          <p>
            収集した個人情報は、利用目的の達成に必要な期間のみ保存します。
            法令により保存が義務付けられている場合を除き、
            目的達成後は速やかに安全な方法で削除または匿名化します。
          </p>
        </Section>

        {/* User Rights */}
        <Section title="お客様の権利">
          <p>お客様は、以下の権利を有しています：</p>
          <ul>
            <li>当社が保有するお客様の個人情報へのアクセスの請求</li>
            <li>個人情報の訂正または削除の請求</li>
            <li>個人情報の処理の制限の請求</li>
            <li>Cookieの設定変更（ブラウザ設定による）</li>
          </ul>
          <p>
            これらの権利を行使される場合は、下記のお問い合わせ先までご連絡ください。
          </p>
        </Section>

        {/* Policy Changes */}
        <Section title="プライバシーポリシーの変更">
          <p>
            当社は、法令の変更やサービスの変更に伴い、本プライバシーポリシーを
            随時更新する場合があります。変更があった場合は、本ページにて改訂版を
            公開し、最終更新日を更新します。重要な変更がある場合は、
            本サイト上で適切な通知を行います。
          </p>
        </Section>

        {/* Contact */}
        <Section title="お問い合わせ">
          <p>
            本プライバシーポリシーに関するご質問やお問い合わせは、
            以下のメールアドレスまでご連絡ください。
          </p>
          <p className="mt-3">
            <strong>メールアドレス：</strong>{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-[var(--color-brand-light)] hover:underline"
            >
              {SITE.contactEmail}
            </a>
          </p>
        </Section>
      </article>
    </div>
  );
}

/* ── Reusable section components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl sm:text-2xl font-bold tracking-tight mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <div
        className="text-sm sm:text-base leading-relaxed flex flex-col gap-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_li]:leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {children}
      </div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 mb-2">
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
