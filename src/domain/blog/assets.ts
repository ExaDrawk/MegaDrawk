/** 記事素材の許可形式。HTMLやJavaScriptを同じオリジンで配信しない。 */
export const articleAssetTypes: Readonly<Record<string, string>> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".zip": "application/zip",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".mp3": "audio/mpeg",
  ".tja": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};
