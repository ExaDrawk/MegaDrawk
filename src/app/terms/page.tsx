import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${SITE.name}の利用規約。本サイトの利用条件、禁止事項、免責事項について説明します。`,
};

/**
 * Terms of Service page.
 *
 * Required for professional site appearance and AdSense compliance.
 * Covers standard web service terms appropriate for a SaaS platform landing page.
 */
export default function TermsPage() {
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
          利用規約
        </h1>
        <p
          className="text-sm mb-10"
          style={{ color: "var(--color-text-muted)" }}
        >
          最終更新日: {lastUpdated}
        </p>

        {/* Introduction */}
        <Section title="第1条（適用）">
          <p>
            本利用規約（以下「本規約」）は、{SITE.legalName}（以下「当社」）が
            運営するウェブサイト{SITE.domain}（以下「本サイト」）の利用に関する条件を
            定めるものです。本サイトをご利用いただくことにより、
            お客様は本規約に同意したものとみなされます。
          </p>
          <p>
            本規約に同意いただけない場合は、本サイトのご利用をお控えください。
          </p>
        </Section>

        <Section title="第2条（定義）">
          <p>本規約において使用する用語の定義は以下のとおりです：</p>
          <ul>
            <li>
              <strong>「本サービス」</strong>とは、本サイトを通じて当社が提供する
              すべてのサービスおよびコンテンツを指します。
            </li>
            <li>
              <strong>「お客様」</strong>とは、本サイトを利用するすべての個人
              または法人を指します。
            </li>
            <li>
              <strong>「コンテンツ」</strong>とは、本サイトに掲載されるテキスト、
              画像、デザイン、ロゴ、ソフトウェアなどの一切の情報を指します。
            </li>
          </ul>
        </Section>

        <Section title="第3条（本サイトの利用）">
          <p>
            お客様は、本規約および適用される法令を遵守した上で、
            本サイトを利用するものとします。
          </p>
          <p>お客様は、本サイトの利用にあたり、以下の行為を行ってはなりません：</p>
          <ul>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>本サイトの運営を妨害する行為</li>
            <li>他のお客様の利用を妨害する行為</li>
            <li>当社または第三者の知的財産権を侵害する行為</li>
            <li>当社または第三者の名誉、信用を毀損する行為</li>
            <li>
              不正アクセス、クローリング、スクレイピングなど、
              本サイトの技術的保護措置を回避する行為
            </li>
            <li>
              本サイトのコンテンツを無断で複製、転載、改変、再配布する行為
            </li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </Section>

        <Section title="第4条（知的財産権）">
          <p>
            本サイトに掲載されるすべてのコンテンツ（テキスト、画像、デザイン、
            ロゴ、商標、ソフトウェアなど）に関する知的財産権は、当社または
            正当な権利者に帰属します。
          </p>
          <p>
            お客様は、当社の書面による事前の承諾なく、本サイトのコンテンツを
            複製、転載、改変、配布、公衆送信その他の利用をすることはできません。
          </p>
        </Section>

        <Section title="第5条（広告の表示）">
          <p>
            本サイトでは、第三者の広告配信サービス（Google AdSenseを含む）を
            利用して広告を掲載する場合があります。これらの広告配信事業者は、
            お客様のウェブサイト訪問履歴に基づいて適切な広告を配信するために、
            Cookieやその他の技術を使用する場合があります。
          </p>
          <p>
            広告配信における個人情報の取り扱いについては、当社の
            <Link
              href="/privacy"
              className="text-[var(--color-brand-light)] hover:underline"
            >
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>
        </Section>

        <Section title="第6条（免責事項）">
          <p>
            当社は、本サイトのコンテンツの正確性、完全性、有用性、
            最新性について保証するものではありません。
          </p>
          <ul>
            <li>
              本サイトの利用により生じたいかなる損害についても、
              当社は一切の責任を負いません。
            </li>
            <li>
              本サイトからリンクされた第三者のウェブサイトの内容について、
              当社は責任を負いません。
            </li>
            <li>
              本サイトの一時的な中断、停止、変更、終了について、
              当社はお客様に対して一切の責任を負いません。
            </li>
            <li>
              本サイトに掲載される広告の内容については、
              広告主が責任を負うものとし、当社は一切の責任を負いません。
            </li>
          </ul>
        </Section>

        <Section title="第7条（サービスの変更・中断・終了）">
          <p>
            当社は、お客様に事前の通知をすることなく、本サイトの内容を変更し、
            またはその提供を中断もしくは終了することができるものとします。
            これによりお客様に生じた損害について、当社は一切の責任を負いません。
          </p>
        </Section>

        <Section title="第8条（利用規約の変更）">
          <p>
            当社は、必要と判断した場合には、お客様に通知することなく
            本規約を随時変更することができるものとします。変更後の利用規約は、
            本ページに掲載した時点から効力を生じるものとします。
          </p>
          <p>
            本規約の変更後に本サイトを利用された場合、
            変更後の利用規約に同意したものとみなされます。
          </p>
        </Section>

        <Section title="第9条（準拠法・管轄裁判所）">
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。
            本サイトに関して紛争が生じた場合には、
            当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </Section>

        {/* Contact */}
        <Section title="第10条（お問い合わせ）">
          <p>
            本規約に関するお問い合わせは、以下のメールアドレスまでご連絡ください。
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
