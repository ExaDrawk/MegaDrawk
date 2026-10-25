const adsenseClient = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
if (adsenseClient && !/^ca-pub-\d{16}$/.test(adsenseClient)) {
  throw new Error("Invalid PUBLIC_ADSENSE_CLIENT");
}

/**
 * Cloudflare Turnstileのサイトキー。未設定ならお問い合わせフォームを出力しない。
 * 正式キーは 0x + 22文字、テストキーは 1x〜3x + 22文字。
 */
const turnstileSiteKey =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
if (turnstileSiteKey && !/^[0-3]x[0-9A-Za-z]{22}$/.test(turnstileSiteKey)) {
  throw new Error("Invalid PUBLIC_TURNSTILE_SITE_KEY");
}

/**
 * Cloudflare Web Analyticsのビーコントークン（32桁の16進数）。未設定ならビーコンを出力しない。
 */
const cfWebAnalyticsToken =
  import.meta.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim() ?? "";
if (cfWebAnalyticsToken && !/^[0-9a-f]{32}$/i.test(cfWebAnalyticsToken)) {
  throw new Error("Invalid PUBLIC_CF_WEB_ANALYTICS_TOKEN");
}

export const SITE_FEATURES = {
  adsenseClient,
  turnstileSiteKey,
  cfWebAnalyticsToken,
} as const;
