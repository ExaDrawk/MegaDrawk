import { useCallback, useEffect, useRef, useState } from "react";
import {
  COMMENT_ERROR_MESSAGES,
  COMMENT_LIMITS,
  isCommentItemArray,
  validateCommentInput,
  type CommentItem,
} from "@/domain/comment/types";
import { SITE } from "@/config/site";
import { SITE_FEATURES } from "@/config/features";
import { useTurnstile } from "@/hooks/useTurnstile";
import { ActionButton } from "@/components/ui/Action";

/**
 * 公開コメント欄。誰でも投稿でき、サーバー（D1）に保存されて全員に表示される。
 * スパム対策としてTurnstileとサーバー側の連投抑止を経由する。
 */

type SubmitStatus = "idle" | "submitting" | "error";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const siteKey = SITE_FEATURES.turnstileSiteKey;
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorText, setErrorText] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const submitLockRef = useRef(false);

  const { containerRef, ready, failed, reset } = useTurnstile(
    siteKey,
    setTurnstileToken,
  );

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(
        `/api/comments/${encodeURIComponent(postId)}`,
      );
      if (!response.ok) throw new Error("failed to load comments");
      const payload = (await response.json()) as { comments?: unknown };
      if (!isCommentItemArray(payload.comments)) {
        throw new Error("invalid comments payload");
      }
      setComments(payload.comments);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function refresh() {
    try {
      const response = await fetch(
        `/api/comments/${encodeURIComponent(postId)}`,
      );
      const payload = (await response.json()) as { comments?: unknown };
      if (isCommentItemArray(payload.comments)) {
        setComments(payload.comments);
      }
    } catch {
      // 再取得の失敗では投稿自体は成功しているため、エラー表示はしない
    }
  }

  function resetTurnstile() {
    setTurnstileToken("");
    reset();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) {
      return;
    }

    const validationError = validateCommentInput(name, message);
    if (validationError) {
      setStatus("error");
      setErrorText(COMMENT_ERROR_MESSAGES[validationError]);
      return;
    }
    if (!turnstileToken) {
      setStatus("error");
      setErrorText(
        "スパム防止の確認がまだ完了していません。表示されたチェックを完了してください。",
      );
      return;
    }

    submitLockRef.current = true;
    setStatus("submitting");
    setErrorText("");
    try {
      const response = await fetch(
        `/api/comments/${encodeURIComponent(postId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            message: message.trim(),
            turnstileToken,
          }),
        },
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setErrorText(
          payload?.error ??
            "送信に失敗しました。時間をおいて再度お試しください。",
        );
        resetTurnstile();
        return;
      }
      setStatus("idle");
      setName("");
      setMessage("");
      setTurnstileToken("");
      await refresh();
    } catch {
      setStatus("error");
      setErrorText(
        "ネットワークエラーにより送信できませんでした。時間をおいて再度お試しください。",
      );
      resetTurnstile();
    } finally {
      submitLockRef.current = false;
    }
  }

  return (
    <section className="mt-5" aria-label="コメント欄">
      <h3 className="section-title text-base">コメント</h3>
      <p className="mt-2 text-xs" data-color="color-text-muted">
        誰でも投稿でき、このページに公開されます（投稿前の審査はありません。スパム防止のためIPをハッシュ化して保存します）。GitHubアカウントは不要です。公開の場でのご連絡は
        <a
          className="text-link min-h-0"
          href={`https://x.com/${SITE.social.xHandle.slice(1)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          X（{SITE.social.xHandle}）
        </a>
        や
        <a className="text-link min-h-0" href="/contact">
          お問い合わせフォーム
        </a>
        からもどうぞ。
      </p>

      <form className="mt-4 grid gap-3" onSubmit={onSubmit} noValidate>
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

        {failed ? (
          <p className="text-sm" data-color="color-danger" role="alert">
            スパム防止コンポーネントを読み込めませんでした。時間をおいて再度お試しください。
          </p>
        ) : (
          <div className="cf-turnstile-container" ref={containerRef} />
        )}

        <ActionButton
          type="submit"
          className="justify-self-start"
          disabled={!siteKey || !ready || failed || status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? "送信中..." : "送信"}
        </ActionButton>

        {status === "error" && errorText ? (
          <p
            id={`${postId}-comment-error`}
            className="text-sm"
            data-color="color-danger"
            role="alert"
          >
            {errorText}
          </p>
        ) : null}
      </form>

      <div className="mt-5 flex flex-col gap-3" aria-live="polite">
        {isLoading ? (
          <div
            aria-busy="true"
            aria-label="コメント読み込み中"
            className="flex flex-col gap-3"
          >
            <div className="surface p-4">
              <div className="skeleton mb-3 h-3 w-24 rounded" />
              <div className="skeleton h-4 w-full rounded" />
            </div>
          </div>
        ) : loadError ? (
          <div className="surface p-4 text-center">
            <p className="text-sm" data-color="color-danger" role="alert">
              コメントを読み込めませんでした。
            </p>
            <ActionButton className="mt-3" onClick={() => void loadComments()}>
              再読み込み
            </ActionButton>
          </div>
        ) : comments.length === 0 ? (
          <div className="surface-muted flex items-center justify-center py-5 text-center">
            <p className="text-xs" data-color="color-text-muted">
              まだコメントはありません。
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="surface p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold" data-color="color-text">
                  {comment.name}
                </p>
                <time
                  className="text-xs"
                  dateTime={comment.createdAt}
                  data-color="color-text-muted"
                >
                  {new Date(comment.createdAt).toLocaleString("ja-JP")}
                </time>
              </div>
              <p
                className="mt-2 whitespace-pre-wrap break-words text-sm"
                data-color="color-text-secondary"
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
