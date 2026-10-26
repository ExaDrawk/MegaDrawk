import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";

function Harness({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <>
      <MarkdownToolbar
        textareaRef={textareaRef}
        value={value}
        onChange={onChange}
      />
      <textarea ref={textareaRef} value={value} readOnly onChange={() => {}} />
    </>
  );
}

describe("MarkdownToolbar", () => {
  it("inserts ## at the current line via the 見出し2 button", async () => {
    const onChange = vi.fn();
    render(<Harness value={"1行目\n"} onChange={onChange} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    // キャレットを末尾へ
    textarea.setSelectionRange(4, 4);
    fireEvent.click(screen.getByRole("button", { name: "見出し2" }));
    expect(onChange).toHaveBeenCalledWith("1行目\n## ");
  });

  it("wraps selection with ** via the 太字 button", () => {
    const onChange = vi.fn();
    render(<Harness value="abc" onChange={onChange} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    textarea.setSelectionRange(0, 3);
    fireEvent.click(screen.getByRole("button", { name: "太字" }));
    expect(onChange).toHaveBeenCalledWith("**abc**");
  });
});
