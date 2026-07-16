import { useCallback, useEffect, useRef, useState } from "react";
import type { CommentItem } from "@/domain/comment/types";
import {
  COMMENT_LIMITS,
  validateCommentInput,
  type CommentValidationError,
} from "@/domain/comment/types";
import { commentStorageRepository } from "@/infra/storage/commentStorage";

const ERROR_MESSAGES: Record<CommentValidationError, string> = {
  "name-empty": "名前を入力してください。",
  "name-too-long": `名前は${COMMENT_LIMITS.maxNameLength}文字以内で入力してください。`,
  "message-empty": "コメント本文を入力してください。",
  "message-too-long": `コメント本文は${COMMENT_LIMITS.maxMessageLength}文字以内で入力してください。`,
};

export interface UseCommentsResult {
  comments: CommentItem[];
  isLoading: boolean;
  errorText: string;
  addComment: (
    name: string,
    message: string,
    callbacks?: {
      readonly onSuccess?: () => void;
      readonly onFailure?: () => void;
    },
  ) => void;
}

export function useComments(postId: string): UseCommentsResult {
  // Read storage after mount so SSR and hydration start from the same snapshot.
  const [comments, setComments] = useState<CommentItem[]>([]);
  const commentsRef = useRef<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setErrorText("");

    try {
      const loaded = commentStorageRepository.getComments(postId);
      commentsRef.current = loaded;
      setComments(loaded);
    } catch {
      setErrorText("コメントの読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(
    (
      name: string,
      message: string,
      callbacks?: {
        readonly onSuccess?: () => void;
        readonly onFailure?: () => void;
      },
    ) => {
      setErrorText("");

      const validationError = validateCommentInput(name, message);
      if (validationError) {
        setErrorText(ERROR_MESSAGES[validationError]);
        callbacks?.onFailure?.();
        return;
      }

      const trimmedName = name.trim();
      const trimmedMessage = message.trim();

      const next: CommentItem[] = [
        {
          id: globalThis.crypto.randomUUID(),
          name: trimmedName,
          message: trimmedMessage,
          createdAt: new Date().toISOString(),
        },
        ...commentsRef.current,
      ];

      try {
        commentStorageRepository.saveComments(postId, next);
        commentsRef.current = next;
        setComments(next);
        callbacks?.onSuccess?.();
      } catch {
        setErrorText("コメントの保存に失敗しました。");
        callbacks?.onFailure?.();
      }
    },
    [postId],
  );

  return {
    comments,
    isLoading,
    errorText,
    addComment,
  };
}
