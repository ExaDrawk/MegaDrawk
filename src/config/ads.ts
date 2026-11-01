/**
 * 広告を表示してよいページの判定（単一の権威ある情報源）。
 *
 * AdSenseのポリシー上、コンテンツのないページ・エラーページ・管理画面・
 * 法務ページには広告コードを置かない。記事と、記事一覧・タグ・運営者情報に
 * 限定して読み込む。
 */
const AD_ELIGIBLE_PATHS: readonly string[] = ["/", "/about", "/blog"];
const AD_ELIGIBLE_PREFIXES: readonly string[] = ["/blog/", "/tags/"];

export function isAdEligiblePath(pathname: string): boolean {
  const normalized =
    pathname.length === 0 ? "/" : pathname.replace(/\/+$/, "") || "/";
  if (AD_ELIGIBLE_PATHS.includes(normalized)) return true;
  return AD_ELIGIBLE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
