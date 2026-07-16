import type { CommentItem, CommentRepository } from "@/domain/comment/types";
import { isCommentItemArray } from "@/domain/comment/types";

function storageKey(postId: string): string {
  return `blog-comments:${postId}`;
}

function assertBrowserEnvironment(): void {
  if (typeof window === "undefined") {
    throw new Error("Comment storage is only available in the browser.");
  }
}

export const commentStorageRepository: CommentRepository = {
  getComments: (postId: string): CommentItem[] => {
    assertBrowserEnvironment();

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
    assertBrowserEnvironment();

    window.localStorage.setItem(storageKey(postId), JSON.stringify(comments));
  },
};
