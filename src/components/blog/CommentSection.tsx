import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
 * 返信はトップレベルコメントへの1階層のみ（サーバー側でルートに正規化される）。
 * スパム対策としてTurnstileとサーバー側の連投抑止を経由する。
 */

type SubmitStatus = "idle" | "submitting" | "error";

interface ReplyTarget {
  readonly id: number;
  readonly name: string;
}

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
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editStatus, setEditStatus] = useState<SubmitStatus>("idle");
  const [editErrorText, setEditErrorText] = useState("");
  const submitLockRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

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

  /** トップレベルコメントと、その返信（新しい順）を組み立てる。 */
  const threads = useMemo(() => {
    const byParent = new Map<number, CommentItem[]>();
    const topLevel: CommentItem[] = [];
    for (const comment of comments) {
      if (
        comment.parentId === null ||
        !comments.some((c) => c.id === comment.parentId)
      ) {
        topLevel.push(comment);
      } else {
        const list = byParent.get(comment.parentId) ?? [];
        list.push(comment);
        byParent.set(comment.parentId, list);
      }
    }
    const reverse = (list: CommentItem[]) => [...list].reverse();
    return topLevel.map((comment) => ({
      comment,
      replies: reverse(byParent.get(comment.id) ?? []),
    }));
  }, [comments]);

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

  function startReply(target: ReplyTarget) {
    setReplyTo(target);
    setStatus("idle");
    setErrorText("");
    // jsdom等のテスト環境ではscrollIntoViewが存在しないため存在時のみ呼ぶ
    formRef.current?.scrollIntoView?.({ block: "center" });
  }

  function cancelReply() {
    setReplyTo(null);
  }

  function startEdit(comment: CommentItem) {
    setEditingId(comment.id);
    setEditMessage(comment.message);
    setEditStatus("idle");
    setEditErrorText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditMessage("");
    setEditErrorText("");
  }

  async function onEditSave(commentId: number) {
    if (submitLockRef.current) {
      return;
    }
    const validationError = validateCommentInput("名前", editMessage);
    if (validationError) {
      setEditStatus("error");
      setEditErrorText(COMMENT_ERROR_MESSAGES[validationError]);
      return;
    }
    submitLockRef.current = true;
    setEditStatus("submitting");
    setEditErrorText("");
    try {
      const response = await fetch(
        `/api/comments/${encodeURIComponent(postId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: commentId, message: editMessage.trim() }),
        },
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setEditStatus("error");
        setEditErrorText(
          payload?.error ??
            "保存に失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }
      setEditingId(null);
      setEditMessage("");
      await refresh();
    } catch {
      setEditStatus("error");
      setEditErrorText(
        "ネットワークエラーにより保存できませんでした。時間をおいて再度お試しください。",
      );
    } finally {
      submitLockRef.current = false;
    }
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
            ...(replyTo ? { parentId: replyTo.id } : {}),
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
      setReplyTo(null);
      // Turnstileトークンは単回使用のため、次の投稿に備えてウィジェットを再発行する
      resetTurnstile();
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

  const renderComment = (comment: CommentItem, isReply: boolean) => (
    <article
      key={comment.id}
      className={isReply ? "surface p-4 sm:ml-10" : "surface p-4"}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold" data-color="color-text">
          {comment.name}
          {comment.isAdmin && (
            <span className="admin-badge" aria-label="管理人">
              管理人
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <time
            className="text-xs"
            dateTime={comment.createdAt}
            data-color="color-text-muted"
          >
            {new Date(comment.createdAt).toLocaleString("ja-JP")}
            {comment.editedAt ? "（編集済み）" : ""}
          </time>
          {!isReply && (
            <button
              type="button"
              className="text-link min-h-0 text-xs"
              onClick={() => startReply({ id: comment.id, name: comment.name })}
            >
              返信
            </button>
          )}
          {comment.editable && editingId !== comment.id && (
            <button
              type="button"
              className="text-link min-h-0 text-xs"
              onClick={() => startEdit(comment)}
            >
              編集
            </button>
          )}
        </div>
      </div>
      {editingId === comment.id ? (
        <div className="mt-2 grid gap-2">
          <textarea
            value={editMessage}
            onChange={(event) => setEditMessage(event.target.value)}
            maxLength={COMMENT_LIMITS.maxMessageLength}
            className="form-control min-h-24"
            aria-label="コメントを編集"
          />
          {editStatus === "error" && editErrorText ? (
            <p className="text-sm" data-color="color-danger" role="alert">
              {editErrorText}
            </p>
          ) : null}
          <div className="flex gap-2">
            <ActionButton
              onClick={() => void onEditSave(comment.id)}
              disabled={editStatus === "submitting"}
              aria-busy={editStatus === "submitting"}
            >
              {editStatus === "submitting" ? "保存中..." : "保存"}
            </ActionButton>
            <ActionButton variant="secondary" onClick={cancelEdit}>
              キャンセル
            </ActionButton>
          </div>
        </div>
      ) : (
        <p
          className="mt-2 whitespace-pre-wrap break-words text-sm"
          data-color="color-text-secondary"
        >
          {comment.message}
        </p>
      )}
    </article>
  );

  return (
    <section className="mt-5" aria-label="コメント欄">
      <h3 className="section-title text-base">コメント</h3>
      <p className="mt-2 text-xs" data-color="color-text-muted">
        誰でも投稿でき、このページに公開されます（投稿前の審査はありません。スパム防止のためIPをハッシュ化して保存します）。公開の場でのご連絡は
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

      <form
        ref={formRef}
        className="mt-4 grid gap-3"
        onSubmit={onSubmit}
        noValidate
      >
        {replyTo && (
          <p
            className="flex items-center justify-between text-xs"
            data-color="color-text-muted"
          >
            <span>{replyTo.name}さんへの返信を書いています</span>
            <button
              type="button"
              className="text-link min-h-0"
              onClick={cancelReply}
            >
              キャンセル
            </button>
          </p>
        )}
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
        ) : threads.length === 0 ? (
          <div className="surface-muted flex items-center justify-center py-5 text-center">
            <p className="text-xs" data-color="color-text-muted">
              まだコメントはありません。
            </p>
          </div>
        ) : (
          threads.map(({ comment, replies }) => (
            <div key={comment.id} className="flex flex-col gap-3">
              {renderComment(comment, false)}
              {replies.length > 0 && (
                <div className="flex flex-col gap-3">
                  {replies.map((reply) => renderComment(reply, true))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
