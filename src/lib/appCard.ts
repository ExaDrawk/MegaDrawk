import listings from "../config/store-listings.json";

/**
 * 記事内のアプリ導線。Markdown中に `[app:パッケージID]` のみの行を書くと、
 * store-listings.json（毎日のストア同期の正本）から、ストアのアイコン・説明・
 * スクリーンショットを直接参照する短い紹介を組み立てる。
 */

export interface AppCardData {
  readonly packageId: string;
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly iconUrl: string;
  readonly screenshotUrl: string | null;
}

interface ListingEntry {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly href?: unknown;
  readonly iconUrl?: unknown;
  readonly screenshotUrls?: unknown;
}

const LISTINGS = listings as readonly ListingEntry[];

export const APP_TOKEN_PATTERN = /^\[app:([a-z0-9.]+)\]$/;

/** パッケージIDからアプリを探す（ストアhrefに含まれるパッケージIDで照合）。 */
export function findAppByPackageId(packageId: string): AppCardData | null {
  const listing = LISTINGS.find(
    (entry) =>
      typeof entry.href === "string" && entry.href.includes("id=" + packageId),
  );
  if (
    !listing ||
    typeof listing.name !== "string" ||
    typeof listing.description !== "string" ||
    typeof listing.href !== "string" ||
    typeof listing.iconUrl !== "string"
  ) {
    return null;
  }
  const screenshotUrl =
    Array.isArray(listing.screenshotUrls) &&
    typeof listing.screenshotUrls[0] === "string"
      ? listing.screenshotUrls[0]
      : null;
  return {
    packageId,
    name: listing.name,
    description: listing.description,
    href: listing.href,
    iconUrl: listing.iconUrl,
    screenshotUrl,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** ストア情報を使ったアプリ導線のHTMLを組み立てる。見つからなければnull。 */
export function buildAppCardHtml(packageId: string): string | null {
  const app = findAppByPackageId(packageId);
  if (!app) return null;
  const name = escapeHtml(app.name);
  const description = escapeHtml(app.description);
  const href = escapeHtml(app.href);
  const icon = escapeHtml(app.iconUrl);
  const shot = app.screenshotUrl ? escapeHtml(app.screenshotUrl) : null;
  const cardClass = shot ? "app-card" : "app-card app-card--text";
  return (
    `<aside class="${cardClass}">` +
    `<img class="app-card__icon" src="${icon}" alt="" width="48" height="48" loading="lazy" decoding="async" referrerpolicy="no-referrer" />` +
    `<div class="app-card__body">` +
    `<p class="app-card__eyebrow">Androidアプリ</p>` +
    `<p class="app-card__name">${name}</p>` +
    `<p class="app-card__description">${description}</p>` +
    `<a class="app-card__link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${name}をGoogle Playで見る">Google Playで見る<span aria-hidden="true"> ↗</span></a>` +
    `</div>` +
    (shot
      ? `<img class="app-card__shot" src="${shot}" alt="${name}のスクリーンショット" width="526" height="296" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
      : "") +
    `</aside>`
  );
}
