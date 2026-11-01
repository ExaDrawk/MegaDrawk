import listings from "../config/store-listings.json";

/**
 * 記事内のアプリ導線。Markdown中に `[app:パッケージID]` のみの行を書くと、
 * store-listings.json（毎日のストア同期の正本）から公式Google Playバッジを組み立てる。
 */

export interface AppCardData {
  readonly packageId: string;
  readonly name: string;
  readonly href: string;
}

interface ListingEntry {
  readonly name?: unknown;
  readonly href?: unknown;
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
    typeof listing.href !== "string"
  ) {
    return null;
  }
  return {
    packageId,
    name: listing.name,
    href: listing.href,
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

/** 公式Google PlayバッジのHTMLを組み立てる。見つからなければnull（本文をそのまま残す）。 */
export function buildAppCardHtml(packageId: string): string | null {
  const app = findAppByPackageId(packageId);
  if (!app) return null;
  const name = escapeHtml(app.name);
  const href = escapeHtml(app.href);
  return (
    `<aside class="app-card">` +
    `<a class="app-card__badge" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${name} を Google Play で開く">` +
    `<img src="/images/google-play-badge-ja.png" alt="Google Play で手に入れよう" width="646" height="250" loading="lazy" decoding="async" />` +
    `</a>` +
    `<p class="app-card__name">${name}</p>` +
    `</aside>`
  );
}
