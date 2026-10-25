/**
 * ブログ本文を段落へ分割する。
 * 空行（2つ以上の連続改行）を段落境界、単一改行は著者の意図した改行として保持する。
 */
export function toBlogParagraphs(body: string): readonly string[] {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}
