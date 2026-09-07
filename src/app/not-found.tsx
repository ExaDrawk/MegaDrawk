import { SITE } from "@/config/site";
import { ActionLink } from "@/components/ui/Action";

export default function NotFound() {
  return (
    <div className="status-page">
      <main className="status-page-content">
        <p className="eyebrow">Error / not found</p>
        <h1 className="page-title">404</h1>
        <p className="page-description mx-auto mb-8">お探しのページは見つかりませんでした。</p>
        <ActionLink href="/">
          {SITE.name} トップに戻る
        </ActionLink>
      </main>
    </div>
  );
}
