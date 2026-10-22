import type { CommentItem, CommentRepository } from "@/domain/comment/types";
import { isCommentItemArray } from "@/domain/comment/types";

function storageKey(postId: string): string {
  return `blog-comments:${postId}`;
}

export const commentStorageRepository: CommentRepository = {
  getComments: (postId: string): CommentItem[] => {
    // SSR / Cloudflare Worker 環境では安全に空配列を返す。
    // localStorage の読み込みは useComments フックの useEffect 内（クライアントのみ）で行う。
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(storageKey(postId));
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isCommentItemArray(parsed)) {
      throw new Error(`Corrupted comment data for postId: ${postId}`);
    }

    return parsed;
  },

  saveComments: (postId: string, comments: CommentItem[]): void => {
    if (typeof window === "undefined") {
      throw new Error("Comment storage is only available in the browser.");
    }
    if (!isCommentItemArray(comments)) throw new Error("Invalid comment data");
    window.localStorage.setItem(storageKey(postId), JSON.stringify(comments));
  },
};
