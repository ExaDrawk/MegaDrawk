import type { CommentItem, CommentRepository } from "@/domain/comment/types";

function storageKey(postId: string): string {
  return `blog-comments:${postId}`;
}

export const commentStorageRepository: CommentRepository = {
  getComments: (postId: string): CommentItem[] => {
    try {
      if (typeof window === "undefined") {
        return [];
      }
      const raw = localStorage.getItem(storageKey(postId));
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as CommentItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveComments: (postId: string, comments: CommentItem[]): void => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.setItem(storageKey(postId), JSON.stringify(comments));
    } catch {
      throw new Error("Failed to save comments to storage");
    }
  },
};
