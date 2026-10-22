import { SITE } from "@/config/site";
import { XProfileLink } from "@/components/ui/XProfileLink";

export const metadata = {
  title: "利用規約",
  description: `${SITE.name}の利用規約。`,
};

export default function TermsPage() {
  const lastUpdated = "2026年2月9日";

  return (
    <div>
      <article className="page-section content-column">
        <a href="/" className="text-link mb-7">
          ← トップに戻る
        </a>

        <h1 className="page-title text-3xl font-bold tracking-tight">
          利用規約
        </h1>
        <p className="document-meta mt-2">最終更新日: {lastUpdated}</p>

        <div className="prose-content">
          <h2>第1条（適用）</h2>
          <p>
            本利用規約（以下「本規約」）は、当サイト（{SITE.domain}）の
            利用に関する条件を定めるものです。当サイトをご利用いただくことにより、
            本規約に同意したものとみなされます。
          </p>

          <h2>第2条（禁止事項）</h2>
          <p>当サイトの利用にあたり、以下の行為を禁止します：</p>
          <ul>
            <li>法令または公序良俗に違反する行為</li>
            <li>当サイトの運営を妨害する行為</li>
            <li>当サイトのコンテンツを無断で複製、転載、改変する行為</li>
            <li>不正アクセスやスクレイピング等の行為</li>
          </ul>

          <h2>第3条（知的財産権）</h2>
          <p>
            当サイトに掲載されるすべてのコンテンツに関する著作権は、
            運営者または正当な権利者に帰属します。
          </p>

          <h2>第4条（免責事項）</h2>
          <p>
            当サイトのコンテンツの正確性、完全性、有用性について
            保証するものではありません。当サイトの利用により生じた
            いかなる損害についても、運営者は責任を負いません。
          </p>

          <h2>第5条（準拠法）</h2>
          <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>

          <h2>第6条（お問い合わせ）</h2>
          <p>
            本規約に関するお問い合わせは{" "}
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
