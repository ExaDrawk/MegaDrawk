import { describe, it, expect } from "vitest";
import {
  CONTACT_LIMITS,
  CONTACT_ERROR_MESSAGES,
  trimContactInput,
  validateContactInput,
} from "@/domain/contact/contact";

const validInput = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "お問い合わせ内容です。",
  wantsReply: false,
};

describe("validateContactInput", () => {
  it("accepts a valid input", () => {
    expect(validateContactInput(validInput)).toBeNull();
  });

  it("accepts a valid input that wants a reply", () => {
    expect(
      validateContactInput({ ...validInput, wantsReply: true }),
    ).toBeNull();
  });

  it("accepts an empty email because the address is optional", () => {
    expect(
      validateContactInput({ ...validInput, email: "", wantsReply: false }),
    ).toBeNull();
    expect(
      validateContactInput({ ...validInput, email: "   ", wantsReply: false }),
    ).toBeNull();
  });

  it("rejects a reply request without an email address", () => {
    expect(
      validateContactInput({ ...validInput, email: "", wantsReply: true }),
    ).toBe("reply-email-required");
    expect(
      validateContactInput({ ...validInput, email: "   ", wantsReply: true }),
    ).toBe("reply-email-required");
  });

  it("rejects empty fields", () => {
    expect(validateContactInput({ ...validInput, name: "  " })).toBe(
      "name-empty",
    );
    expect(validateContactInput({ ...validInput, message: " " })).toBe(
      "message-empty",
    );
  });

  it("rejects over-length fields", () => {
    expect(
      validateContactInput({
        ...validInput,
        name: "あ".repeat(CONTACT_LIMITS.maxNameLength + 1),
      }),
    ).toBe("name-too-long");
    expect(
      validateContactInput({
        ...validInput,
        email: "a".repeat(CONTACT_LIMITS.maxEmailLength) + "@example.com",
      }),
    ).toBe("email-too-long");
    expect(
      validateContactInput({
        ...validInput,
        message: "あ".repeat(CONTACT_LIMITS.maxMessageLength + 1),
      }),
    ).toBe("message-too-long");
  });

  it("rejects malformed email addresses", () => {
    expect(validateContactInput({ ...validInput, email: "not-an-email" })).toBe(
      "email-invalid",
    );
    expect(validateContactInput({ ...validInput, email: "a@b@c" })).toBe(
      "email-invalid",
    );
  });

  it("does not accept newline injection in email", () => {
    expect(
      validateContactInput({
        ...validInput,
        email: "a@example.com\nBcc: x@y.z",
      }),
    ).toBe("email-invalid");
  });
});

describe("trimContactInput", () => {
  it("trims every field", () => {
    expect(
      trimContactInput({
        name: " 名前 ",
        email: " a@b.jp ",
        message: " 本文 ",
        wantsReply: true,
      }),
    ).toEqual({
      name: "名前",
      email: "a@b.jp",
      message: "本文",
      wantsReply: true,
    });
  });
});

describe("CONTACT_ERROR_MESSAGES", () => {
  it("has a message for every validation error", () => {
    const codes = [
      "name-empty",
      "name-too-long",
      "reply-email-required",
      "email-too-long",
      "email-invalid",
      "message-empty",
      "message-too-long",
    ] as const;
    for (const code of codes) {
      expect(CONTACT_ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    }
  });
});
