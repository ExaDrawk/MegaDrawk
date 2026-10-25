import { SITE } from "@/config/site";
import { SITE_FEATURES } from "@/config/features";
export const metadata = {
  title: "プライバシーポリシー",
  description: SITE.name + "の個人情報・端末内保存・外部サービスの取り扱い。",
};
export default function Privacy() {
  return (
    <article className="page-section content-column">
      <a className="text-link" href="/">
        トップに戻る
      </a>
      <h1 className="page-title">プライバシーポリシー</h1>
      <p className="document-meta">最終更新日: 2026年10月23日</p>
      <div className="prose-content">
        <p>
          {SITE.ownerName}は、{SITE.domain}
          で取り扱う情報について、次のとおり説明します。リンク先のアプリやストアには、それぞれのプライバシーポリシーが適用されます。
        </p>
        <h2>サイトの配信とアクセス解析</h2>
        <p>
          本サイトはCloudflare
          Pagesで配信しています。配信・不正アクセス防止のため、CloudflareがIPアドレス、ブラウザ情報、アクセス先などの通信情報を処理します。また、Cloudflare
          Web
          Analyticsを利用し、ページの閲覧数、参照元、表示速度などを把握してサイトの改善に役立てます。この解析はCookieやlocalStorageを用いた利用者の追跡を行いません。
        </p>
        <p>
          Cloudflareによる取り扱いは、
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflareのプライバシーポリシー
          </a>
          をご確認ください。
        </p>
        <h2>コメント欄</h2>
        <p>
          記事のコメント欄はアカウント登録なしで投稿でき、投稿された名前・本文・日時はサイト上に公開されます。投稿前の審査はありませんが、スパム防止のためCloudflare
          Turnstileによる人間確認と、IPアドレスをハッシュ化した連投抑止を利用します。ハッシュ化されたIPは投稿の抑制目的でのみ使用し、本サイトでは元のIPアドレスを保存しません。削除のご依頼は
          <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          へご連絡ください。
        </p>
        <h2>このブラウザに保存する情報</h2>
        <p>
          記事草案の入力内容は、利用中のブラウザのlocalStorageに保存します。本サイトのサーバーへ送信せず、他の利用者には公開しません。草案は編集画面から削除できます。サイトデータを削除すると復元できません。
        </p>
        <h2>お問い合わせ</h2>
        <p>
          メールやXでご連絡いただいた際は、連絡先とお問い合わせ内容を回答・対応のために利用します。対応に必要な範囲で保管し、不要になった情報は削除します。法令に基づく場合などを除き、本人の同意なく目的外に利用したり第三者に提供したりしません。外部サービスによる処理には、そのサービスの規定も適用されます。
        </p>
        {SITE_FEATURES.turnstileSiteKey ? (
          <p>
            お問い合わせフォームから送信された場合は、入力内容がスパム防止のためCloudflare
            Turnstileで検証され、Brevoのメール配信サービス経由で運営者へ届きます。これらの処理では、
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflareのプライバシーポリシー
            </a>
            と
            <a
              href="https://www.brevo.com/legal/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brevoのプライバシーポリシー
            </a>
            も適用されます。
          </p>
        ) : null}
        <h2>広告</h2>
        {SITE_FEATURES.adsenseClient ? (
          <>
            <p>
              Google
              AdSenseを利用します。Googleなどの広告配信事業者がCookie等を使用し、アクセス情報に応じた広告を表示する場合があります。
            </p>
            <p>
              <a
                href="https://policies.google.com/technologies/ads?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
              >
                Googleの広告に関する説明
              </a>
              と
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                広告設定
              </a>
              をご確認ください。Cookieはブラウザの設定でも管理できます。
            </p>
          </>
        ) : (
          <p>現在、本サイトでは広告配信スクリプトを読み込んでいません。</p>
        )}
        <h2>情報の管理とご相談</h2>
        <p>
          通信の暗号化、管理アカウントのアクセス制限、依存ソフトウェアの更新などにより、情報の漏えいや不正利用の防止に努めます。運営者が保有するご本人の情報について、利用目的の通知、開示、訂正、利用停止、削除などをご希望の場合は、
          <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          へご連絡ください。必要に応じて本人確認のうえ、法令に従って対応します。
        </p>
        <h2>変更</h2>
        <p>
          取り扱う情報やサービスを変更する場合は、本ページを更新します。重要な変更はサイト上でお知らせします。
        </p>
      </div>
    </article>
  );
}
