import { useCallback, useEffect, useState } from "react";
import { COMMENT_LIMITS, type AdminCommentItem } from "@/domain/comment/types";
import { ActionButton } from "@/components/ui/Action";
import { AdminGate } from "@/components/admin/AdminGate";

/**
 * コメント管理画面（/admin/comments）。
 * 認可はHttpOnlyセッションCookie（AdminGateが発行）で行い、
 * パスワードをJavaScript側に保存しない。
 */

export function AdminCommentsScreen() {
  return (
    <AdminGate>
      <AdminComments />
    </AdminGate>
  );
}

function AdminComments() {
  const [comments, setComments] = useState<AdminCommentItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorText, setErrorText] = useState("");
  const [postId, setPostId] = useState("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<AdminCommentItem | null>(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    setErrorText("");
    try {
      const response = await fetch("/api/admin/comments");
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error("load failed");
      const payload = (await response.json()) as { comments?: unknown };
      if (!Array.isArray(payload.comments)) throw new Error("bad payload");
      setComments(payload.comments as AdminCommentItem[]);
      setState("ready");
    } catch {
      setState("error");
      setErrorText("コメント一覧を読み込めませんでした。");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function postAdminComment() {
    if (posting || !postId.trim() || !message.trim()) return;
    setPosting(true);
    setPostError("");
    try {
      const response = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: postId.trim(),
          message: message.trim(),
          parentId: replyTo?.id ?? null,
        }),
      });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setPostError(payload?.error ?? "投稿に失敗しました。");
        return;
      }
      setMessage("");
      setReplyTo(null);
      await load();
    } finally {
      setPosting(false);
    }
  }

  async function removeComment(id: number, postIdOfComment: string) {
    if (!confirm(`コメント#${id}と、その返信を削除します。よろしいですか？`)) {
      return;
    }
    const response = await fetch(
      `/api/comments/${encodeURIComponent(postIdOfComment)}?id=${id}`,
      { method: "DELETE" },
    );
    if (response.ok) {
      await load();
    } else {
      setErrorText("削除に失敗しました。");
      setState("error");
    }
  }

  return (
    <div className="grid gap-6">
      {state === "loading" && (
        <div className="surface p-6" aria-busy="true">
          <div className="skeleton mb-3 h-4 w-40 rounded" />
          <div className="skeleton h-24 rounded" />
        </div>
      )}

      {state === "error" && (
        <div className="status-panel" data-status="error" role="alert">
          <p className="text-sm">{errorText}</p>
          <ActionButton className="mt-3" onClick={() => void load()}>
            再読み込み
          </ActionButton>
        </div>
      )}

      {state === "ready" && (
        <>
          <section className="surface p-5 sm:p-6">
            <h2 className="section-title">管理人コメントを投稿</h2>
            <div className="mt-4 grid gap-4">
              <label className="form-field">
                <span className="form-label">記事のスラッグ</span>
                <input
                  value={postId}
                  onChange={(event) => setPostId(event.target.value)}
                  placeholder="例: 2026-10-25-hello-megadrawk"
                  className="form-control"
                />
              </label>
              {replyTo && (
                <p
                  className="flex items-center justify-between text-xs"
                  data-color="color-text-muted"
                >
                  <span>
                    コメント#{replyTo.id}（{replyTo.name}
                    ）への返信として投稿します
                  </span>
                  <button
                    type="button"
                    className="text-link min-h-0"
                    onClick={() => setReplyTo(null)}
                  >
                    キャンセル
                  </button>
                </p>
              )}
              <label className="form-field">
                <span className="form-label">本文</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={COMMENT_LIMITS.maxMessageLength}
                  className="form-control min-h-24"
                />
              </label>
              <ActionButton
                className="justify-self-start"
                onClick={() => void postAdminComment()}
                disabled={posting}
                aria-busy={posting}
              >
                {posting ? "投稿中..." : "管理人として投稿"}
              </ActionButton>
              {postError ? (
                <p className="text-sm" data-color="color-danger" role="alert">
                  {postError}
                </p>
              ) : null}
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <h2 className="section-title">コメント一覧（新しい順）</h2>
            <div className="mt-4 flex flex-col gap-3">
              {comments.length === 0 ? (
                <p className="text-sm" data-color="color-text-muted">
                  コメントはまだありません。
                </p>
              ) : (
                comments.map((comment) => (
                  <article key={comment.id} className="surface-muted p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p
                        className="text-xs font-semibold"
                        data-color="color-text"
                      >
                        #{comment.id} {comment.name}
                        {comment.isAdmin && (
                          <span className="admin-badge">管理人</span>
                        )}
                      </p>
                      <div className="flex items-center gap-3">
                        <time
                          className="text-xs"
                          dateTime={comment.createdAt}
                          data-color="color-text-muted"
                        >
                          {new Date(comment.createdAt).toLocaleString("ja-JP")}
                        </time>
                        <button
                          type="button"
                          className="text-link min-h-0 text-xs"
                          onClick={() => {
                            setPostId(comment.postId);
                            setReplyTo(comment);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          返信
                        </button>
                        <button
                          type="button"
                          className="text-link min-h-0 text-xs"
                          onClick={() =>
                            void removeComment(comment.id, comment.postId)
                          }
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs" data-color="color-text-muted">
                      記事: {comment.postId}
                    </p>
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
        </>
      )}
    </div>
  );
}
