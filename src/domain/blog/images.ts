export const IMAGE_LIMITS = { file: 5 * 1024 * 1024, total: 15 * 1024 * 1024 };
export interface ImageAddition {
  name: string;
  base64: string;
}
export interface ArticleImage {
  name: string;
  sha: string;
  url: string;
}
export function availableImageName(
  raw: string,
  existing: ReadonlySet<string>,
): string {
  const dot = raw.lastIndexOf(".");
  const extension = dot < 0 ? "" : raw.slice(dot).toLowerCase();
  const base =
    (dot < 0 ? raw : raw.slice(0, dot))
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/^-+|-+$/g, "") || "image";
  let name = `${base}${extension}`,
    suffix = 1;
  while (existing.has(name)) name = `${base}-${suffix++}${extension}`;
  return name;
}
export function validImageName(name: string): boolean {
  return (
    /^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(png|jpe?g|webp|gif)$/i.test(name) &&
    !name.includes("..")
  );
}
export function imageType(bytes: Uint8Array): string | null {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n))
    return "png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpeg";
  if (["GIF87a", "GIF89a"].includes(ascii(0, 6))) return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}
export function validateImage(name: string, bytes: Uint8Array): void {
  const extension = name
    .split(".")
    .at(-1)
    ?.toLowerCase()
    .replace("jpg", "jpeg");
  if (
    !validImageName(name) ||
    !bytes.length ||
    bytes.length > IMAGE_LIMITS.file ||
    imageType(bytes) !== extension
  ) {
    throw new Error(
      "画像はPNG・JPEG・WebP・GIF、1枚5MiB以内で指定してください。",
    );
  }
}
export function assetUrl(article: string, name: string): string {
  return `/blog-assets/${article.slice(0, -3)}/${name}`;
}
export function markdownImage(alt: string, url: string): string {
  return `![${alt.replace(/[\\\[\]\r\n]/g, " ")}](<${url.replace(/[<>\r\n]/g, "")}>)`;
}
export function scrollRatio(
  top: number,
  height: number,
  client: number,
): number {
  return height <= client
    ? 0
    : Math.min(1, Math.max(0, top / (height - client)));
}
