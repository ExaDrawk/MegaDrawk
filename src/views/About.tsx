import { SITE } from "@/config/site";
import { ProjectList } from "@/components/ui/ProjectList";

export const metadata = {
  title: "About",
  description:
    SITE.ownerName +
    "のプロフィール、このサイトの内容、記事の編集方針、広告の取り扱い。",
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
        <h2 className="section-label">プロフィール</h2>
        <p>
          {SITE.ownerName}
          です。日本の大学生で、個人開発をしています。AndroidアプリとChrome拡張機能を作り、実際にGoogle
          PlayとChromeウェブストアで公開しています。
        </p>
      </div>

      <div className="prose-content">
        <h2>このサイトについて</h2>
        <p>
          {SITE.name}
          は、制作したアプリの紹介と、使い方の解説、開発中の判断や試行錯誤の記録をまとめたサイトです。アプリの画面を実際の端末で確認し、操作手順はできるだけ具体的に書いています。アプリの更新で画面や仕様が変わった場合は、記事の内容も見直します。
        </p>
        <p>
          記事は、実際に使った機能や確認できた動作をもとに書いています。未確認の推測を事実として書かないこと、バージョンや端末によって結果が変わる場合はその条件を添えることを方針にしています。誤りを見つけた場合は、
          <a href="/contact">お問い合わせ</a>
          からご連絡いただければ確認して訂正します。
        </p>

        <h2>掲載しているアプリ</h2>
        <p>
          Google
          Playで公開しているAndroidアプリと、Chromeウェブストアで公開している拡張機能です。ストアの掲載情報は自動で取得し、変更があればこのサイトにも反映しています。
        </p>
      </div>

      <section className="about-projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-label">
          個人開発
        </h2>
        <ProjectList />
      </section>

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
