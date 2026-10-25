/** お問い合わせ入力値の検証ルール（単一の権威ある情報源。フォームUIとサーバー関数で共有する） */
export const CONTACT_LIMITS = {
  maxNameLength: 100,
  maxEmailLength: 254,
  maxMessageLength: 5000,
} as const;

export type ContactValidationError =
  | "name-empty"
  | "name-too-long"
  | "reply-email-required"
  | "email-too-long"
  | "email-invalid"
  | "message-empty"
  | "message-too-long";

export interface ContactInput {
  readonly name: string;
  /** 任意。返信希望のチェックがない場合は「返信を希望しない」問い合わせとして扱う。 */
  readonly email: string;
  readonly message: string;
  /** 返信を希望する場合は true。true のときメールアドレスが必須になる。 */
  readonly wantsReply: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function trimContactInput(input: ContactInput): ContactInput {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    wantsReply: input.wantsReply,
  };
}

export function validateContactInput(
  input: ContactInput,
): ContactValidationError | null {
  const trimmed = trimContactInput(input);

  if (!trimmed.name) {
    return "name-empty";
  }
  if (trimmed.name.length > CONTACT_LIMITS.maxNameLength) {
    return "name-too-long";
  }
  // 返信希望なのに返信先がない問い合わせは成立しないため、ここで即座に拒否する。
  if (trimmed.wantsReply && !trimmed.email) {
    return "reply-email-required";
  }
  // メールアドレスは任意。入力がある場合のみ形式・長さを検証する。
  if (trimmed.email) {
    if (trimmed.email.length > CONTACT_LIMITS.maxEmailLength) {
      return "email-too-long";
    }
    if (!EMAIL_PATTERN.test(trimmed.email)) {
      return "email-invalid";
    }
  }
  if (!trimmed.message) {
    return "message-empty";
  }
  if (trimmed.message.length > CONTACT_LIMITS.maxMessageLength) {
    return "message-too-long";
  }

  return null;
}

/** UI表示用のエラーメッセージ（単一の権威ある情報源） */
export const CONTACT_ERROR_MESSAGES: Readonly<
  Record<ContactValidationError, string>
> = {
  "name-empty": "お名前を入力してください。",
  "name-too-long": `お名前は${CONTACT_LIMITS.maxNameLength}文字以内で入力してください。`,
  "reply-email-required":
    "返信をご希望の場合は、メールアドレスを入力してください。",
  "email-too-long": `メールアドレスは${CONTACT_LIMITS.maxEmailLength}文字以内で入力してください。`,
  "email-invalid": "メールアドレスの形式が正しくありません。",
  "message-empty": "お問い合わせ内容を入力してください。",
  "message-too-long": `お問い合わせ内容は${CONTACT_LIMITS.maxMessageLength}文字以内で入力してください。`,
};
