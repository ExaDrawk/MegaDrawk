import {
  isStoredBlogPostDraft,
  type BlogPostDraftInput,
  type StoredBlogPostDraft,
} from "@/domain/blog/admin";

const BLOG_DRAFT_STORAGE_KEY = "admin:blog-post-draft";

function assertBrowserEnvironment(): void {
  if (typeof window === "undefined") {
    throw new Error("Blog draft storage is only available in the browser.");
  }
}

export const blogDraftStorageRepository = {
  getDraft(): StoredBlogPostDraft | null {
    assertBrowserEnvironment();

    const raw = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isStoredBlogPostDraft(parsed)) {
      throw new Error("Corrupted blog draft data was found in localStorage.");
    }

    return parsed;
  },

  saveDraft(draft: BlogPostDraftInput): string {
    assertBrowserEnvironment();

    const savedAt = new Date().toISOString();
    const payload: StoredBlogPostDraft = {
      draft,
      savedAt,
    };

    window.localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(payload));

    return savedAt;
  },

  clearDraft(): void {
    assertBrowserEnvironment();
    window.localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
  },
};
