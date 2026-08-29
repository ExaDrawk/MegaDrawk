import { SITE } from "@/config/site";
import { XProfileLink } from "@/components/ui/XProfileLink";

export const metadata = {
  title: "プライバシーポリシー",
  description: `${SITE.name}のプライバシーポリシー。`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026年2月9日";

  return (
    <div className="animate-enter-up">
      <article className="page-section content-column">
        <a href="/" className="text-link mb-7">
          ← トップに戻る
        </a>

        <h1 className="page-title">プライバシーポリシー</h1>
        <p className="mb-10 mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
          最終更新日: {lastUpdated}
        </p>

        <div className="prose-content">
          <h2>はじめに</h2>
          <p>
            当サイト（{SITE.domain}）の運営者（以下「運営者」）は、
            当サイトをご利用いただくお客様のプライバシーを尊重し、 個人情報の保護に努めています。
          </p>

          <h2>収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります：</p>
          <h3>自動的に収集される情報</h3>
          <ul>
            <li>IPアドレス</li>
            <li>ブラウザの種類とバージョン</li>
            <li>オペレーティングシステム</li>
            <li>参照元URL</li>
            <li>当サイト内でのアクセスページと滞在時間</li>
          </ul>

          <h2>Cookie（クッキー）について</h2>
          <p>
            当サイトでは、アクセス解析および広告配信のためにCookieを使用しています。
            お客様はブラウザの設定によりCookieの受け入れを拒否することができます。
          </p>

          <h2>第三者広告配信（Google AdSense）</h2>
          <p>
            当サイトでは、Google AdSenseを利用して広告を配信しています。Googleは、
            お客様のウェブサイトへのアクセス情報に基づきCookieを使用して
            パーソナライズされた広告を配信する場合があります。
          </p>
          <p>
            パーソナライズド広告の無効化は{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Googleの広告設定
            </a>{" "}
            から行えます。
          </p>

          <h2>お問い合わせ</h2>
          <p>
            本プライバシーポリシーに関するご質問は{" "}
            <XProfileLink
              href={SITE.social.x}
              label={`X（${SITE.social.xHandle}）`}
              className="inline-flex items-center gap-1.5"
              iconSize={14}
            />{" "}
            までご連絡ください。
          </p>
        </div>
      </article>
    </div>
  );
}
