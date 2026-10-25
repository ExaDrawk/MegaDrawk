/** サーバー（D1）から返る公開コメントの形。idはD1の採番。 */
export interface CommentItem {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

/** コメント入力値の検証ルール（単一の権威ある情報源。コメント欄UIとComments Functionで共有する） */
export const COMMENT_LIMITS = {
  maxNameLength: 30,
  maxMessageLength: 500,
} as const;

export type CommentValidationError =
  "name-empty" | "name-too-long" | "message-empty" | "message-too-long";

export function validateCommentInput(
  name: string,
  message: string,
): CommentValidationError | null {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    return "name-empty";
  }
  if (trimmedName.length > COMMENT_LIMITS.maxNameLength) {
    return "name-too-long";
  }
  if (!trimmedMessage) {
    return "message-empty";
  }
  if (trimmedMessage.length > COMMENT_LIMITS.maxMessageLength) {
    return "message-too-long";
  }

  return null;
}

/** UI表示用のエラーメッセージ（単一の権威ある情報源） */
export const COMMENT_ERROR_MESSAGES: Readonly<
  Record<CommentValidationError, string>
> = {
  "name-empty": "名前を入力してください。",
  "name-too-long": `名前は${COMMENT_LIMITS.maxNameLength}文字以内で入力してください。`,
  "message-empty": "コメント本文を入力してください。",
  "message-too-long": `コメント本文は${COMMENT_LIMITS.maxMessageLength}文字以内で入力してください。`,
};

/** サーバー応答のJSON検証（不正な形状は表示せず破棄する） */
export function isCommentItem(value: unknown): value is CommentItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    Number.isFinite(candidate.id) &&
    typeof candidate.name === "string" &&
    typeof candidate.message === "string" &&
    validateCommentInput(candidate.name, candidate.message) === null &&
    typeof candidate.createdAt === "string" &&
    Number.isFinite(Date.parse(candidate.createdAt))
  );
}

export function isCommentItemArray(value: unknown): value is CommentItem[] {
  return Array.isArray(value) && value.every(isCommentItem);
}
