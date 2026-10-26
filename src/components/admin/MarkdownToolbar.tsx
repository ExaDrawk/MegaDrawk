import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import type { RefObject } from "react";

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
}

interface InsertResult {
  text: string;
  selectStart: number;
  selectEnd: number;
}

/**
 * Markdown編集ツールバー。ボタン一つで記法を挿入・解除できる。
 * テキストエリアの選択範囲を尊重し、挿入後は選択範囲を復元する。
 */
export function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
}: MarkdownToolbarProps) {
  const apply = (
    transform: (selected: string, start: number, end: number) => InsertResult,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const result = transform(selected, start, end);
    onChange(value.slice(0, start) + result.text + value.slice(end));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectStart, result.selectEnd);
    });
  };

  /** 選択範囲（無ければプレースホルダ）をprefix/suffixで囲む */
  const wrap = (prefix: string, suffix: string, placeholder: string) =>
    apply((selected, start) => {
      const inner = selected || placeholder;
      return {
        text: `${prefix}${inner}${suffix}`,
        selectStart: start + prefix.length,
        selectEnd: start + prefix.length + inner.length,
      };
    });

  /** 現在行（選択行）への行頭記法のトグル */
  const toggleLinePrefix = (prefix: string) =>
    apply((selected, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIndex = value.indexOf("\n", end);
      const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
      const lines = value.slice(lineStart, lineEnd).split("\n");
      const allHave = lines.every((line) => line.startsWith(prefix));
      const next = lines
        .map((line) => (allHave ? line.slice(prefix.length) : prefix + line))
        .join("\n");
      return {
        text: next,
        selectStart: lineStart,
        selectEnd: lineStart + next.length,
      };
    });

  const buttons = [
    {
      key: "h2",
      label: "見出し2",
      icon: Heading2,
      action: () => toggleLinePrefix("## "),
    },
    {
      key: "h3",
      label: "見出し3",
      icon: Heading3,
      action: () => toggleLinePrefix("### "),
    },
    {
      key: "bold",
      label: "太字",
      icon: Bold,
      action: () => wrap("**", "**", "太字"),
    },
    {
      key: "italic",
      label: "斜体",
      icon: Italic,
      action: () => wrap("*", "*", "斜体"),
    },
    {
      key: "link",
      label: "リンク",
      icon: Link2,
      action: () => wrap("[", "](https://)", "リンクテキスト"),
    },
    {
      key: "list",
      label: "箇条書き",
      icon: List,
      action: () => toggleLinePrefix("- "),
    },
    {
      key: "listOrdered",
      label: "番号付きリスト",
      icon: ListOrdered,
      action: () => toggleLinePrefix("1. "),
    },
    {
      key: "quote",
      label: "引用",
      icon: Quote,
      action: () => toggleLinePrefix("> "),
    },
    {
      key: "code",
      label: "コードブロック",
      icon: Code,
      action: () =>
        apply((selected, start) => {
          const inner = selected || "code";
          return {
            text: "```\n" + inner + "\n```",
            selectStart: start + 4,
            selectEnd: start + 4 + inner.length,
          };
        }),
    },
  ] as const;

  return (
    <div
      className="flex flex-wrap gap-1"
      role="toolbar"
      aria-label="Markdown編集ツール"
    >
      {buttons.map(({ key, label, icon: Icon, action }) => (
        <button
          key={key}
          type="button"
          className="admin-toolbar-button"
          title={label}
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={action}
        >
          <Icon size={15} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
