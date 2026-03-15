import { useState, useCallback, useEffect } from "react";
import type { CommentItem } from "@/domain/comment/types";
import { commentStorageRepository } from "@/infra/storage/commentStorage";

export function useComments(postId: string) {
  // Read storage after mount so SSR and hydration start from the same snapshot.
  const [comments, setComments] = useState<CommentItem[]>([]);

  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setComments(commentStorageRepository.getComments(postId));
  }, [postId]);

  const addComment = useCallback(
    (name: string, message: string) => {
      const trimmedName = name.trim();
      const trimmedMessage = message.trim();

      setErrorText("");

      if (!trimmedName) {
        setErrorText("名前を入力してください。");
        return false;
      }
      if (!trimmedMessage) {
        setErrorText("コメント本文を入力してください。");
        return false;
      }

      const next: CommentItem[] = [
        {
          id: `${Date.now()}`,
          name: trimmedName,
          message: trimmedMessage,
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ];

      try {
        commentStorageRepository.saveComments(postId, next);
        setComments(next);
        return true;
      } catch {
        setErrorText("コメントの保存に失敗しました。");
        return false;
      }
    },
    [comments, postId]
  );

  return {
    comments,
    errorText,
    addComment,
  };
}
