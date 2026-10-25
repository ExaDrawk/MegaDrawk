const ESCAPE_TABLE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** XMLの5つの特殊文字をエスケープする（RSS・sitemap共通の唯一の実装）。 */
export function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) => ESCAPE_TABLE[character] ?? character,
  );
}
