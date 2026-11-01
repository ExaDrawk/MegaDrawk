import { useEffect, useState } from "react";
import { Eye, MessageCircle } from "lucide-react";

interface PostStatsProps {
  readonly postId: string;
}

interface CommentsChangedDetail {
  readonly postId?: unknown;
  readonly count?: unknown;
}

const VIEW_SESSION_PREFIX = "post-view:";
const formatCount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(value);

/**
 * 記事の閲覧数とコメント数。閲覧はセッション内で1回だけ加算し、
 * コメント数は投稿・編集後の `comments:changed` イベントにも追従する。
 */
export function PostStats({ postId }: PostStatsProps) {
  const [views, setViews] = useState<number | null>(null);
  const [comments, setComments] = useState<number | null>(null);

  useEffect(() => {
    let disposed = false;
    const sessionKey = VIEW_SESSION_PREFIX + postId;
    let counted = false;
    try {
      counted = sessionStorage.getItem(sessionKey) === "1";
    } catch {
      // 保存領域が使えない環境では、その場の表示だけ行う
    }

    const viewRequest = fetch(
      `/api/views/${encodeURIComponent(postId)}`,
      counted ? {} : { method: "POST" },
    )
      .then((response) =>
        response.ok ? (response.json() as Promise<{ views?: unknown }>) : null,
      )
      .then((payload) => {
        if (
          payload &&
          typeof payload.views === "number" &&
          Number.isFinite(payload.views)
        ) {
          if (!disposed) setViews(payload.views);
          if (!counted) {
            try {
              sessionStorage.setItem(sessionKey, "1");
            } catch {
              // 保存できなくても表示は継続する
            }
          }
        }
      })
      .catch(() => {});

    const commentRequest = fetch(
      `/api/comments/${encodeURIComponent(postId)}?count=1`,
    )
      .then((response) =>
        response.ok ? (response.json() as Promise<{ count?: unknown }>) : null,
      )
      .then((payload) => {
        if (
          payload &&
          typeof payload.count === "number" &&
          Number.isFinite(payload.count)
        ) {
          if (!disposed) setComments(payload.count);
        }
      })
      .catch(() => {});

    void Promise.allSettled([viewRequest, commentRequest]);

    const onCommentsChanged = (event: Event) => {
      const detail = (event as CustomEvent<CommentsChangedDetail>).detail;
      if (
        detail?.postId === postId &&
        typeof detail.count === "number" &&
        Number.isFinite(detail.count)
      ) {
        const nextCount = detail.count;
        setComments((current) =>
          current === null ? nextCount : Math.max(current, nextCount),
        );
      }
    };
    window.addEventListener("comments:changed", onCommentsChanged);
    return () => {
      disposed = true;
      window.removeEventListener("comments:changed", onCommentsChanged);
    };
  }, [postId]);

  return (
    <div className="post-stats" aria-live="polite">
      {views !== null && (
        <span className="post-stats__item">
          <Eye size={14} aria-hidden="true" />
          <span>閲覧 {formatCount(views)}</span>
        </span>
      )}
      {comments !== null && (
        <span className="post-stats__item">
          <MessageCircle size={14} aria-hidden="true" />
          <span>コメント {formatCount(comments)}</span>
        </span>
      )}
    </div>
  );
}
