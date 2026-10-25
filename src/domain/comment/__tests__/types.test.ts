import { describe, it, expect } from "vitest";
import {
  COMMENT_ERROR_MESSAGES,
  COMMENT_LIMITS,
  isCommentItem,
  isCommentItemArray,
  validateCommentInput,
} from "@/domain/comment/types";

describe("validateCommentInput", () => {
  it("returns null for valid input", () => {
    expect(validateCommentInput("Drawk", "こんにちは")).toBeNull();
  });

  it("returns name-empty for blank name", () => {
    expect(validateCommentInput("   ", "メッセージ")).toBe("name-empty");
  });

  it("returns name-too-long when name exceeds the limit", () => {
    const longName = "あ".repeat(COMMENT_LIMITS.maxNameLength + 1);
    expect(validateCommentInput(longName, "メッセージ")).toBe("name-too-long");
  });

  it("returns message-empty for blank message", () => {
    expect(validateCommentInput("Drawk", "   ")).toBe("message-empty");
  });

  it("returns message-too-long when message exceeds the limit", () => {
    const longMessage = "あ".repeat(COMMENT_LIMITS.maxMessageLength + 1);
    expect(validateCommentInput("Drawk", longMessage)).toBe("message-too-long");
  });

  it("accepts input exactly at the limit boundary", () => {
    const maxName = "あ".repeat(COMMENT_LIMITS.maxNameLength);
    const maxMessage = "い".repeat(COMMENT_LIMITS.maxMessageLength);
    expect(validateCommentInput(maxName, maxMessage)).toBeNull();
  });
});

describe("isCommentItemArray", () => {
  it("returns true for a valid CommentItem array", () => {
    expect(
      isCommentItemArray([
        {
          id: 1,
          name: "Drawk",
          message: "こんにちは",
          createdAt: "2026-01-01T00:00:00.000Z",
          parentId: null,
        },
      ]),
    ).toBe(true);
  });

  it("returns true for an empty array", () => {
    expect(isCommentItemArray([])).toBe(true);
  });

  it("returns false for an array with a malformed item", () => {
    expect(
      isCommentItemArray([
        {
          id: 1,
          name: "Drawk",
          message: "こんにちは",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
    ).toBe(false);
  });

  it("returns false for non-array values", () => {
    expect(isCommentItemArray(null)).toBe(false);
    expect(isCommentItemArray("not-an-array")).toBe(false);
    expect(isCommentItemArray({})).toBe(false);
  });

  it("rejects stored comments with invalid dates or over-limit input", () => {
    const comment = {
      id: 1,
      name: "Drawk",
      message: "hello",
      createdAt: "2026-01-01T00:00:00.000Z",
      parentId: null,
    };
    expect(isCommentItemArray([{ ...comment, createdAt: "not-a-date" }])).toBe(
      false,
    );
    expect(
      isCommentItemArray([
        { ...comment, name: "x".repeat(COMMENT_LIMITS.maxNameLength + 1) },
      ]),
    ).toBe(false);
    expect(isCommentItemArray([{ ...comment, id: "1" }])).toBe(false);
  });
});

describe("COMMENT_ERROR_MESSAGES", () => {
  it("has a message for every validation error", () => {
    for (const code of [
      "name-empty",
      "name-too-long",
      "message-empty",
      "message-too-long",
    ] as const) {
      expect(COMMENT_ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    }
  });
});

describe("isCommentItem", () => {
  it("accepts server-shaped comments", () => {
    expect(
      isCommentItem({
        id: 1,
        name: "Drawk",
        message: "こんにちは",
        createdAt: "2026-10-25T12:00:00Z",
        parentId: null,
      }),
    ).toBe(true);
  });

  it("accepts replies with a numeric parentId", () => {
    expect(
      isCommentItem({
        id: 2,
        name: "Drawk",
        message: "こんにちは",
        createdAt: "2026-10-25T12:00:00Z",
        parentId: 1,
      }),
    ).toBe(true);
  });

  it("rejects items that would fail validation or have wrong types", () => {
    expect(
      isCommentItem({
        id: "1",
        name: "Drawk",
        message: "こんにちは",
        createdAt: "2026-10-25T12:00:00Z",
        parentId: null,
      }),
    ).toBe(false);
    expect(
      isCommentItem({
        id: 2,
        name: "",
        message: "本文",
        createdAt: "x",
        parentId: null,
      }),
    ).toBe(false);
    expect(
      isCommentItem({
        id: 3,
        name: "Drawk",
        message: "こんにちは",
        createdAt: "2026-10-25T12:00:00Z",
        parentId: "1",
      }),
    ).toBe(false);
  });
});
