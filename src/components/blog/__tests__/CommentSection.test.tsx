import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommentSection } from "../CommentSection";

describe("CommentSection", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly with no comments initially", () => {
    render(<CommentSection postId="test-post" />);
    expect(screen.getByRole("heading", { name: "コメント" })).toBeDefined();
    expect(screen.getByPlaceholderText("名前")).toBeDefined();
    expect(screen.getByPlaceholderText("コメントを書く")).toBeDefined();
  });

  it("shows an error when trying to submit an empty form", () => {
    render(<CommentSection postId="test-post" />);
    const button = screen.getByRole("button", { name: "送信" });
    fireEvent.click(button);

    expect(screen.getByText("名前を入力してください。")).toBeDefined();
  });
});