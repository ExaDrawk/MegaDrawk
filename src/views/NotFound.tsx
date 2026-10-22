import { SITE } from "@/config/site";
import { ActionLink } from "@/components/ui/Action";

export default function NotFound() {
  return (
    <div className="status-page">
      <div className="status-page-content">
        <h1 className="page-title text-5xl font-bold tracking-tight mb-2">
          404
        </h1>
        <p className="page-description mx-auto mb-8">
          お探しのページは見つかりませんでした。
        </p>
        <ActionLink href="/">{SITE.name} トップに戻る</ActionLink>
      </div>
    </div>
  );
}
