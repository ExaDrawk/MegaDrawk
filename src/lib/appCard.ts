import listings from "../config/store-listings.json";

/**
 * 記事内にアプリ紹介カードを埋め込むための変換。
 * Markdown中に `[app:パッケージID]` のみの行を書くと、
 * store-listings.json（毎日のストア同期の正本）からカードを組み立てる。
 */

export interface AppCardData {
  readonly packageId: string;
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly iconSrc: string;
}

interface ListingEntry {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly href?: unknown;
  readonly imageSrc?: unknown;
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
    typeof listing.imageSrc !== "string"
  ) {
    return null;
  }
  return {
    packageId,
    name: listing.name,
    description: listing.description,
    href: listing.href,
    iconSrc: listing.imageSrc,
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

/** アプリ紹介カードのHTMLを組み立てる。見つからなければnull（本文をそのまま残す）。 */
export function buildAppCardHtml(packageId: string): string | null {
  const app = findAppByPackageId(packageId);
  if (!app) return null;
  const name = escapeHtml(app.name);
  const description = escapeHtml(app.description);
  const href = escapeHtml(app.href);
  const icon = escapeHtml(app.iconSrc);
  return (
    `<div class="app-card">` +
    `<a class="app-card__icon" href="${href}" target="_blank" rel="noopener noreferrer">` +
    `<img src="${icon}" alt="" width="64" height="64" loading="lazy" decoding="async" />` +
    `</a>` +
    `<div class="app-card__body">` +
    `<p class="app-card__platform">Androidアプリ</p>` +
    `<h3 class="app-card__name"><a href="${href}" target="_blank" rel="noopener noreferrer">${name}</a></h3>` +
    `<p class="app-card__description">${description}</p>` +
    `<a class="app-card__store" href="${href}" target="_blank" rel="noopener noreferrer">Google Play で開く<span aria-hidden="true"> ↗</span></a>` +
    `</div></div>`
  );
}
