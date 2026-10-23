const adsenseClient = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
if (adsenseClient && !/^ca-pub-\d{16}$/.test(adsenseClient)) {
  throw new Error("Invalid PUBLIC_ADSENSE_CLIENT");
}
export const SITE_FEATURES = { adsenseClient } as const;
