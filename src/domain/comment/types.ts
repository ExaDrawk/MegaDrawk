export interface CommentItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface CommentRepository {
  getComments(postId: string): CommentItem[];
  saveComments(postId: string, comments: CommentItem[]): void;
}

/** コメント入力値の検証ルール（単一の権威ある情報源） */
export const COMMENT_LIMITS = {
  maxNameLength: 30,
  maxMessageLength: 500,
} as const;

export type CommentValidationError =
  "name-empty" | "name-too-long" | "message-empty" | "message-too-long";

export function validateCommentInput(name: string, message: string): CommentValidationError | null {
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

function isCommentItem(value: unknown): value is CommentItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.createdAt === "string"
  );
}

export function isCommentItemArray(value: unknown): value is CommentItem[] {
  return Array.isArray(value) && value.every(isCommentItem);
}
