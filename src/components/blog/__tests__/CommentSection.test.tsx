import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("prevents duplicate comments from a rapid double submit", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
    render(<CommentSection postId="test-post" />);

    fireEvent.change(screen.getByPlaceholderText("名前"), {
      target: { value: "Drawk" },
    });
    fireEvent.change(screen.getByPlaceholderText("コメントを書く"), {
      target: { value: "同じコメント" },
    });

    const button = screen.getByRole("button", { name: "送信" });
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByText("同じコメント")).toHaveLength(1);
    });
    expect(setItem).toHaveBeenCalledTimes(1);
  });
});
