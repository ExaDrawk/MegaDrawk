"use client";

import { useState } from "react";
import { useComments } from "@/hooks/useComments";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, errorText, addComment } = useComments(postId);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = addComment(name, message);
    if (success) {
      setMessage("");
    }
  }

  return (
    <section className="mt-5" aria-label="コメント欄">
      <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        コメント
      </h3>

      <form className="mt-3 flex flex-col gap-2" onSubmit={onSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={30}
          placeholder="名前"
          className="rounded-md px-3 py-2 text-sm"
          style={{ border: "1px solid var(--color-border)" }}
        />
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={500}
          placeholder="コメントを書く"
          className="rounded-md px-3 py-2 text-sm min-h-24"
          style={{ border: "1px solid var(--color-border)" }}
        />
        <button
          type="submit"
          className="inline-flex self-start rounded-md px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          送信
        </button>
        {errorText ? (
          <p className="text-xs" style={{ color: "#b91c1c" }}>
            {errorText}
          </p>
        ) : null}
      </form>

      <div className="mt-4 flex flex-col gap-2">
        {comments.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            まだコメントはありません。
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-md p-3"
              style={{ border: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex items-center justify-between gap-2">
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
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {comment.message}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
