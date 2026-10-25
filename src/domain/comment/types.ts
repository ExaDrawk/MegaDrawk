/** サーバー（D1）から返る公開コメントの形。idはD1の採番。parentIdは返信先（ルートコメントのみ）。 */
export interface CommentItem {
  id: number;
  name: string;
  message: string;
  createdAt: string;
  parentId: number | null;
  /** 管理画面から投稿された管理人コメント（バッジ表示・返信免除の対象） */
  isAdmin?: boolean;
  /** 投稿者本人（同一IPハッシュ）が10分以内に編集できることを示すサーバー判定 */
  editable?: boolean;
  editedAt?: string | null;
}

/** コメント入力値の検証ルール（単一の権威ある情報源。コメント欄UIとComments Functionで共有する） */
export const COMMENT_LIMITS = {
  maxNameLength: 30,
  maxMessageLength: 2000,
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
    Number.isFinite(Date.parse(candidate.createdAt)) &&
    (candidate.parentId === null || typeof candidate.parentId === "number")
  );
}

/** 管理画面向けのコメント行（公開情報＋管理用メタ）。 */
export interface AdminCommentItem extends CommentItem {
  postId: string;
}

/** 編集可能期間（分）。投稿後この時間内のみ本人（同一IPハッシュ）が編集できる。 */
export const EDIT_WINDOW_MINUTES = 10;

/** 投稿のレート制限（単一の権威ある情報源。エラーメッセージにも使用する） */
export const COMMENT_RATE_LIMITS = {
  /** 同一IPの連続投稿に必要な間隔（秒） */
  intervalSeconds: 60,
  /** 10分間の投稿上限 */
  per10Minutes: 3,
  /** 1日（日本時間）の投稿上限 */
  perDay: 10,
  /** 同一記事の1日（日本時間）あたり投稿上限 */
  perPostPerDay: 3,
} as const;

/** 一般投稿フォームから予約している名前（管理人バッジのなりすまし防止）。管理者投稿は管理画面からのみ。 */
export function isReservedName(name: string): boolean {
  return name === "Drawk";
}

export function isCommentItemArray(value: unknown): value is CommentItem[] {
  return Array.isArray(value) && value.every(isCommentItem);
}
