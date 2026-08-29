"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { useComments } from "@/hooks/useComments";
import { COMMENT_LIMITS } from "@/domain/comment/types";
import { ActionButton } from "@/components/ui/Action";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, isLoading, errorText, addComment } = useComments(postId);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);

    addComment(name, message, {
      onSuccess: () => {
        setMessage("");
        queueMicrotask(() => {
          submitLockRef.current = false;
          setIsSubmitting(false);
        });
      },
      onFailure: () => {
        submitLockRef.current = false;
        setIsSubmitting(false);
      },
    });
  }

  return (
    <section className="mt-5" aria-label="コメント欄">
      <h3 className="section-title text-base">コメント</h3>

      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <label className="form-field">
          <span className="sr-only">名前</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={COMMENT_LIMITS.maxNameLength}
            placeholder="名前"
            className="form-control"
            aria-describedby={errorText ? `${postId}-comment-error` : undefined}
          />
        </label>
        <label className="form-field">
          <span className="sr-only">コメント本文</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={COMMENT_LIMITS.maxMessageLength}
            placeholder="コメントを書く"
            className="form-control min-h-28"
            aria-describedby={errorText ? `${postId}-comment-error` : undefined}
          />
        </label>
        <ActionButton
          type="submit"
          className="justify-self-start"
          disabled={isLoading || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "送信"}
        </ActionButton>
        {errorText ? (
          <p
            id={`${postId}-comment-error`}
            className="text-sm"
            style={{ color: "var(--color-danger)" }}
            role="alert"
          >
            {errorText}
          </p>
        ) : null}
      </form>

      <div className="mt-5 flex flex-col gap-3" aria-live="polite">
        {isLoading ? (
          <div aria-busy="true" aria-label="コメント読み込み中" className="flex flex-col gap-3">
            {[0, 1].map((skeletonIndex) => (
              <div key={skeletonIndex} className="surface p-4">
                <div className="skeleton mb-3 h-3 w-24 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="surface-muted flex flex-col items-center gap-1 py-5 text-center">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              まだコメントはありません。
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              最初のコメントを書いてみましょう！
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="surface p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                  {comment.name}
                </p>
                <time
                  className="text-xs"
                  dateTime={comment.createdAt}
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {new Date(comment.createdAt).toLocaleString("ja-JP")}
                </time>
              </div>
              <p
                className="mt-2 whitespace-pre-wrap break-words text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {comment.message}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
