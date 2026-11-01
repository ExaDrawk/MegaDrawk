import { SITE } from "@/config/site";

export const metadata = {
  title: "About",
  description: SITE.ownerName + "のプロフィール、運営者情報、広告の取り扱い。",
};

export default function AboutPage() {
  return (
    <section className="page-section" aria-labelledby="about-title">
      <header className="page-header">
        <h1 id="about-title" className="page-title">
          About
        </h1>
      </header>

      <div className="profile">
        <p>
          私の名前は{SITE.ownerName}
          です。趣味はいくつかありますが、最近はAndroidやWindows向けの個人開発をすることが多いです。
        </p>
        <p>
          これまでに、六法アプリの「どこでも六法」、証明写真作成アプリの「証ぴた」、リズムゲームの「TJA
          Pocket」などを制作してきました。
        </p>
        <p>
          他にも、ジオラマ制作をたまにします。最近はアプリ開発が中心になっていますが、こちらもそのうち再開したいと思っています。
        </p>
      </div>

      <div className="prose-content">
        <h2>運営者情報</h2>
        <p>
          運営者: {SITE.ownerName}
          <br />
          サイト名: {SITE.name}
          <br />
          連絡先: <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          <br />
          活動拠点: 日本
        </p>

        <h2>広告について</h2>
        <p>
          本サイトは、Google
          AdSenseによる広告を掲載しています。広告は記事やアプリ紹介など、内容のあるページにのみ表示し、プライバシーポリシー・利用規約・お問い合わせ・エラーページには表示しません。広告の内容はGoogleの配信判断によるもので、運営者が個別の広告主を選んでいるわけではありません。
        </p>
        <p>
          広告の表示に伴うCookieなどの取り扱いは、
          <a href="/privacy">プライバシーポリシー</a>
          に記載しています。広告のパーソナライズは
          <a
            href="https://myadcenter.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Googleの広告設定
          </a>
          から変更できます。
        </p>

        <h2>お問い合わせ</h2>
        <p>
          記事の内容、アプリの不具合、掲載に関するご連絡は
          <a href="/contact">お問い合わせ</a>
          または
          <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          へお願いします。すべてのご連絡に返信できるとは限りませんが、内容を確認して対応します。
        </p>
      </div>
    </section>
  );
}
