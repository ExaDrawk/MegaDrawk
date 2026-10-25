import { describe, it, expect } from "vitest";
import { toBlogParagraphs } from "@/lib/blogBody";

describe("toBlogParagraphs", () => {
  it("splits body on blank lines", () => {
    expect(toBlogParagraphs("一段落目\n\n二段落目")).toEqual([
      "一段落目",
      "二段落目",
    ]);
  });

  it("keeps single newlines inside a paragraph", () => {
    expect(toBlogParagraphs("行1\n行2\n\n次の段落")).toEqual([
      "行1\n行2",
      "次の段落",
    ]);
  });

  it("trims surrounding whitespace and drops empty paragraphs", () => {
    expect(toBlogParagraphs("\n\n 前後の空白 \n\n\n\n最後\n\n")).toEqual([
      "前後の空白",
      "最後",
    ]);
  });

  it("returns a single paragraph for text without blank lines", () => {
    expect(toBlogParagraphs("ひとつの段落")).toEqual(["ひとつの段落"]);
  });
});
