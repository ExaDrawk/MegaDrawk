import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/Action";
import { AdminGate } from "@/components/admin/AdminGate";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import {
  readArticleDraft,
  setArticleDraft,
  isValidArticleFilename,
} from "@/domain/blog/markdown";
import {
  assetUrl,
  markdownImage,
  validateImage,
  IMAGE_LIMITS,
  scrollRatio,
  validImageName,
  type ArticleImage,
  type ImageAddition,
} from "@/domain/blog/images";

async function adminFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (response.status === 401)
    window.dispatchEvent(new Event("admin-auth-required"));
  return response;
}
interface ArticleMeta {
  name: string;
  sha: string;
}
interface PendingImage extends ImageAddition {
  preview: string;
  size: number;
}
export function AdminArticlesScreen() {
  return (
    <AdminGate>
      <AdminArticles />
    </AdminGate>
  );
}
function AdminArticles() {
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [sha, setSha] = useState<string | null>(null);
  const [baseline, setBaseline] = useState("");
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [imageState, setImageState] = useState<"loading" | "ready" | "error">(
    "ready",
  );
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [deletions, setDeletions] = useState<string[]>([]);
  const [alts, setAlts] = useState<Record<string, string>>({});
  const [linked, setLinked] = useState(true);
  const [tab, setTab] = useState("edit");
  const [split, setSplit] = useState(50);
  const [switchTarget, setSwitchTarget] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const activeScroll = useRef<"edit" | "preview">("edit");
  const saveRef = useRef<() => void>(() => {});
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const assetEpoch = useRef(0);
  const dirty =
    content !== baseline || pending.length > 0 || deletions.length > 0;
  let draft: boolean | null = null;
  try {
    draft = readArticleDraft(content);
  } catch {
    /* Incomplete YAML stays editable. */
  }
  function update(next: string) {
    setContent(next);
    setMessage("");
    const element = textareaRef.current;
    if (element && element.value !== next) {
      const start = element.selectionStart,
        end = element.selectionEnd,
        top = element.scrollTop;
      element.value = next;
      element.setSelectionRange(start, end);
      element.scrollTop = top;
    }
  }
  const load = useCallback(async () => {
    try {
      const response = await adminFetch("/api/admin/articles");
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? "認証が切れました。入力を保持したまま再認証してください。"
            : "記事一覧を読み込めませんでした。",
        );
      const payload = (await response.json()) as { articles: ArticleMeta[] };
      setArticles(payload.articles);
      setState("ready");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "記事一覧を読み込めませんでした。",
      );
      setState("error");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function loadImages(name: string) {
    const epoch = ++assetEpoch.current;
    setImageState("loading");
    try {
      const response = await adminFetch(
        `/api/admin/articles?images&file=${encodeURIComponent(name)}`,
      );
      if (!response.ok) throw new Error("画像一覧を読み込めませんでした。");
      const payload = (await response.json()) as { images: ArticleImage[] };
      if (epoch === assetEpoch.current) {
        setImages(payload.images);
        setImageState("ready");
      }
    } catch (e) {
      if (epoch === assetEpoch.current) {
        setImageState("error");
        setError(
          e instanceof Error ? e.message : "画像一覧を読み込めませんでした。",
        );
      }
    }
  }
  function clearImages() {
    ++assetEpoch.current;
    setImages([]);
    setPending([]);
    setDeletions([]);
    setAlts({});
    setImageState("ready");
  }
  async function open(name: string) {
    setSwitchTarget(null);
    setError("");
    setOpening(true);
    try {
      if (name === "new") {
        const date = new Date().toISOString().slice(0, 10);
        const text = `---\ntitle: "記事タイトル"\ndescription: "この記事の要約"\ndate: "${date}"\ntags: []\ndraft: true\n---\n\n`;
        setFilename(`${date}-new-post.md`);
        setSha(null);
        setBaseline("");
        update(text);
        clearImages();
      } else {
        const response = await adminFetch(
          `/api/admin/articles?file=${encodeURIComponent(name)}`,
        );
        if (!response.ok)
          throw new Error(
            "記事を読み込めませんでした。認証と通信状態を確認してください。",
          );
        const payload = (await response.json()) as {
          name: string;
          sha: string;
          content: string;
        };
        setFilename(payload.name);
        setSha(payload.sha);
        setBaseline(payload.content);
        update(payload.content);
        clearImages();
        void loadImages(payload.name);
      }
      setSavedAt("");
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.scrollTop = 0;
        textareaRef.current.setSelectionRange(0, 0);
      }
      if (previewRef.current) previewRef.current.scrollTop = 0;
    } catch (e) {
      setError(e instanceof Error ? e.message : "記事を読み込めませんでした。");
    } finally {
      setOpening(false);
    }
  }
  function requestOpen(name: string) {
    if (dirty) setSwitchTarget(name);
    else void open(name);
  }
  async function save() {
    if (
      saving ||
      adding ||
      opening ||
      !isValidArticleFilename(filename) ||
      !content.trim()
    )
      return;
    setSaving(true);
    setError("");
    setMessage("");
    const snapshot = {
      name: filename,
      content,
      sha,
      additions: pending.map(({ name, base64 }) => ({ name, base64 })),
      deletions: [...deletions],
    };
    try {
      readArticleDraft(content);
      const response = await adminFetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      const payload = (await response.json()) as {
        sha?: string;
        commit?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          payload.error ??
            "保存に失敗しました。認証と通信状態を確認してください。",
        );
      if (!payload.sha)
        throw new Error(
          "保存結果を確認できません。本文を保持しています。最新版を確認してください。",
        );
      const newSha = payload.sha;
      setSha(newSha);
      setBaseline(snapshot.content);
      setArticles((list) => [
        { name: snapshot.name, sha: newSha },
        ...list.filter((a) => a.name !== snapshot.name),
      ]);
      setPending((list) =>
        list.filter((p) => !snapshot.additions.some((a) => a.name === p.name)),
      );
      setDeletions((list) =>
        list.filter((name) => !snapshot.deletions.includes(name)),
      );
      setImages((list) => [
        ...list.filter((i) => !snapshot.deletions.includes(i.name)),
        ...snapshot.additions.map((a) => ({
          name: a.name,
          sha: newSha,
          url: assetUrl(snapshot.name, a.name),
        })),
      ]);
      setSavedAt(new Date().toLocaleTimeString("ja-JP"));
      setMessage("保存しました。サイトへの反映には通常1〜2分かかります。");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "保存に失敗しました。変更は保持されています。",
      );
    } finally {
      setSaving(false);
    }
  }
  saveRef.current = () => {
    void save();
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);
  function sync(source: "edit" | "preview") {
    if (!linked || syncing.current) return;
    activeScroll.current = source;
    const from = source === "edit" ? textareaRef.current : previewRef.current;
    const to = source === "edit" ? previewRef.current : textareaRef.current;
    if (!from || !to) return;
    const top =
      scrollRatio(from.scrollTop, from.scrollHeight, from.clientHeight) *
      Math.max(0, to.scrollHeight - to.clientHeight);
    if (Math.abs(to.scrollTop - top) < 1) return;
    syncing.current = true;
    to.scrollTop = top;
    requestAnimationFrame(() => {
      syncing.current = false;
    });
  }
  useEffect(() => {
    const observer = new ResizeObserver(() => sync(activeScroll.current));
    if (previewRef.current?.firstElementChild)
      observer.observe(previewRef.current.firstElementChild);
    if (panesRef.current) observer.observe(panesRef.current);
    return () => observer.disconnect();
    // Source scroll position is authoritative when preview dimensions change.
  }, [linked]);
  async function addFiles(files: File[]) {
    if (!isValidArticleFilename(filename) || adding || saving) return;
    setAdding(true);
    setError("");
    try {
      const next: PendingImage[] = [];
      const names = new Set(
        [...images, ...pendingRef.current].map((i) => i.name),
      );
      let total = pendingRef.current.reduce((n, p) => n + p.size, 0);
      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        let name = file.name
          .replace(/[^a-zA-Z0-9_.-]/g, "-")
          .replace(/^[^a-zA-Z0-9]+/, "");
        if (!name) name = "image.png";
        validateImage(name, bytes);
        total += bytes.length;
        if (total > IMAGE_LIMITS.total)
          throw new Error("画像の合計は15MiB以内にしてください。");
        const base = name.slice(0, name.lastIndexOf(".")),
          ext = name.slice(name.lastIndexOf("."));
        let suffix = 1;
        while (names.has(name)) {
          name = `${base}-${suffix++}${ext}`;
        }
        names.add(name);
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () =>
            reject(new Error("画像を読み込めませんでした。"));
          reader.readAsDataURL(file);
        });
        next.push({
          name,
          base64: data.split(",")[1]!,
          preview: data,
          size: bytes.length,
        });
      }
      setPending((list) => [...list, ...next]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "画像を追加できませんでした。");
    } finally {
      setAdding(false);
    }
  }
  function insert(name: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart,
      end = el.selectionEnd;
    const insertion = markdownImage(
      alts[name] ?? name,
      assetUrl(filename, name),
    );
    update(content.slice(0, start) + insertion + content.slice(end));
    el.focus();
    el.setSelectionRange(start + insertion.length, start + insertion.length);
  }
  async function deleteCurrent() {
    if (!sha || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await adminFetch(
        `/api/admin/articles?file=${encodeURIComponent(filename)}&sha=${encodeURIComponent(sha)}`,
        { method: "DELETE" },
      );
      if (!response.ok)
        throw new Error("削除できませんでした。変更は保持されています。");
      setArticles((list) => list.filter((a) => a.name !== filename));
      setFilename("");
      setSha(null);
      update("");
      setBaseline("");
      clearImages();
      setDeleteRequested(false);
      setMessage("記事を削除しました。サイトへの反映を待っています。");
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました。");
    } finally {
      setSaving(false);
    }
  }
  function resize(clientX: number) {
    const rect = panesRef.current?.getBoundingClientRect();
    if (rect)
      setSplit(
        Math.round(
          Math.min(
            70,
            Math.max(30, ((clientX - rect.left) / rect.width) * 100),
          ),
        ),
      );
  }
  const allImages = [
    ...images,
    ...pending.map((i) => ({
      name: i.name,
      sha: "",
      url: assetUrl(filename, i.name),
    })),
  ];
  const previewUrls = Object.fromEntries(
    allImages.map((i) => [
      i.url,
      pending.find((p) => p.name === i.name)?.preview ??
        `/api/admin/articles?images&file=${encodeURIComponent(filename)}&image=${encodeURIComponent(i.name)}`,
    ]),
  );
  return (
    <div className="article-workspace">
      {deleteRequested && (
        <div role="alert" className="status-panel">
          <p>
            この記事を削除します。未保存の変更も失われます。復元にはGit履歴を使います。
          </p>
          <ActionButton onClick={() => setDeleteRequested(false)}>
            編集を続ける
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => void deleteCurrent()}
          >
            記事を削除
          </ActionButton>
        </div>
      )}
      {state === "loading" && <p role="status">記事を読み込み中…</p>}
      {state === "error" && (
        <ActionButton onClick={() => void load()}>一覧を再取得</ActionButton>
      )}
      <div className="editor-controls">
        <label>
          記事
          <select
            aria-label="記事を選択"
            value={articles.some((a) => a.name === filename) ? filename : ""}
            disabled={saving || opening || adding}
            onChange={(e) => requestOpen(e.target.value)}
          >
            <option value="" disabled>
              記事を選択
            </option>
            {articles.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <ActionButton
          variant="secondary"
          disabled={saving || opening || adding}
          onClick={() => requestOpen("new")}
        >
          新規記事
        </ActionButton>
        <label>
          ファイル名
          <input
            aria-label="ファイル名"
            value={filename}
            readOnly={sha !== null}
            disabled={saving || adding || opening}
            onChange={(e) => setFilename(e.target.value)}
          />
        </label>
        <label>
          公開状態
          <select
            aria-label="公開状態"
            value={draft === null ? "invalid" : draft ? "private" : "public"}
            disabled={!content || opening}
            onChange={(e) => {
              try {
                update(setArticleDraft(content, e.target.value === "private"));
              } catch (err) {
                setError(String(err));
              }
            }}
          >
            {draft === null && <option value="invalid">設定を確認</option>}
            <option value="private">非公開（管理者のみ）</option>
            <option value="public">公開</option>
          </select>
        </label>
        <ActionButton
          disabled={
            saving ||
            adding ||
            opening ||
            draft === null ||
            !isValidArticleFilename(filename)
          }
          onClick={() => void save()}
          aria-busy={saving}
        >
          {saving ? "保存中..." : draft ? "非公開で保存" : "公開して保存"}
        </ActionButton>
        {sha && (
          <a
            className="text-link"
            href={`/blog/${filename.slice(0, -3)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            記事を確認
          </a>
        )}
      </div>
      <div className="editor-status">
        <span role="status">
          {dirty
            ? "未保存の変更があります"
            : savedAt
              ? `${savedAt} 保存済み`
              : ""}
          {message && `　${message}`}
        </span>
        <label>
          <input
            type="checkbox"
            checked={linked}
            onChange={(e) => setLinked(e.target.checked)}
          />
          スクロール連動
        </label>
      </div>
      {error && (
        <p role="alert" className="status-panel" data-status="error">
          {error}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              void loadImages(filename);
            }}
          >
            画像一覧を再取得
          </button>
        </p>
      )}
      {switchTarget && (
        <div className="status-panel" role="alert">
          <p>未保存の変更があります。別の記事を開くと変更が失われます。</p>
          <ActionButton onClick={() => setSwitchTarget(null)}>
            編集を続ける
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => void open(switchTarget)}
          >
            変更を破棄して開く
          </ActionButton>
        </div>
      )}
      <div className="editor-mobile-tabs">
        <button
          type="button"
          aria-pressed={tab === "edit"}
          onClick={() => setTab("edit")}
        >
          編集
        </button>
        <button
          type="button"
          aria-pressed={tab === "preview"}
          onClick={() => setTab("preview")}
        >
          プレビュー
        </button>
      </div>
      <div
        className="editor-panes"
        ref={panesRef}
        data-tab={tab}
        data-split={split}
      >
        <section className="editor-source">
          <div className="editor-pane-heading">
            <label htmlFor="article-body">本文（Markdown）</label>
            <MarkdownToolbar
              textareaRef={textareaRef}
              value={content}
              onChange={update}
            />
          </div>
          <textarea
            id="article-body"
            aria-label="本文（Markdown）"
            ref={textareaRef}
            defaultValue=""
            spellCheck={false}
            disabled={opening}
            onChange={(e) => {
              setContent(e.target.value);
              setMessage("");
            }}
            onScroll={() => sync("edit")}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files).filter((f) =>
                f.type.startsWith("image/"),
              );
              if (files.length) {
                e.preventDefault();
                void addFiles(files);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void addFiles(Array.from(e.dataTransfer.files));
            }}
            placeholder="記事を選ぶか、新規記事を作成してください。"
          />
        </section>
        <div
          className="editor-divider"
          role="separator"
          aria-label="編集欄の幅"
          aria-orientation="vertical"
          aria-valuemin={30}
          aria-valuemax={70}
          aria-valuenow={split}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              setSplit((n) =>
                Math.max(
                  30,
                  Math.min(70, n + (e.key === "ArrowRight" ? 1 : -1)),
                ),
              );
            }
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            resize(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              resize(e.clientX);
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        />
        <section className="editor-rendered">
          <div className="editor-pane-heading">プレビュー</div>
          <div
            className="editor-preview-scroll"
            ref={previewRef}
            onScroll={() => sync("preview")}
            onLoadCapture={() => sync(activeScroll.current)}
          >
            {content ? (
              <MarkdownPreview markdown={content} imageUrls={previewUrls} />
            ) : (
              <p>本文を入力するとプレビューが表示されます。</p>
            )}
          </div>
        </section>
      </div>
      {sha && (
        <button
          type="button"
          className="text-link justify-self-end"
          disabled={saving || opening || adding}
          onClick={() => setDeleteRequested(true)}
        >
          この記事を削除
        </button>
      )}
      <details className="editor-images">
        <summary>画像（{allImages.length}）</summary>
        <div
          className="image-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void addFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <label>
            画像を追加
            <input
              aria-label="画像を追加"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={
                !isValidArticleFilename(filename) ||
                adding ||
                saving ||
                imageState !== "ready"
              }
              onChange={(e) => {
                void addFiles(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </label>
          <p>
            PNG・JPEG・WebP・GIF。1枚5MiB、合計15MiBまで。保存時に反映します。
          </p>
        </div>
        {adding && <p role="status">画像を読み込み中…</p>}
        {imageState === "loading" && <p role="status">画像一覧を読み込み中…</p>}
        {imageState === "error" && (
          <button type="button" onClick={() => void loadImages(filename)}>
            画像一覧を再取得
          </button>
        )}
        {imageState === "ready" && !allImages.length && (
          <p>画像はまだありません。ここへ画像をドロップできます。</p>
        )}
        <div className="editor-image-grid">
          {allImages.map((image) => {
            const removed = deletions.includes(image.name),
              used = content.includes(image.url);
            return (
              <div className="editor-image-card" key={image.name}>
                <img
                  src={previewUrls[image.url]}
                  alt={alts[image.name] ?? image.name}
                  loading="lazy"
                />
                <p>
                  {image.name} ·{" "}
                  {removed ? "削除予定" : used ? "本文で使用中" : "未使用"}
                  {!image.sha && " · 追加予定"}
                </p>
                <label>
                  代替テキスト
                  <input
                    aria-label={`${image.name}の代替テキスト`}
                    value={alts[image.name] ?? image.name}
                    onChange={(e) =>
                      setAlts((v) => ({ ...v, [image.name]: e.target.value }))
                    }
                  />
                </label>
                <div>
                  <button
                    type="button"
                    disabled={removed}
                    onClick={() => insert(image.name)}
                  >
                    本文へ挿入
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(new URL(image.url, location.origin).href)
                        .then(() => setMessage("画像URLをコピーしました。"))
                        .catch(() => setError("URLをコピーできませんでした。"));
                    }}
                  >
                    URLをコピー
                  </button>
                  <button
                    type="button"
                    disabled={saving || used || !validImageName(image.name)}
                    onClick={() => {
                      if (!image.sha)
                        setPending((list) =>
                          list.filter((i) => i.name !== image.name),
                        );
                      else
                        setDeletions((list) =>
                          removed
                            ? list.filter((n) => n !== image.name)
                            : [...list, image.name],
                        );
                    }}
                  >
                    {!image.sha
                      ? "追加を取消"
                      : removed
                        ? "削除を取消"
                        : "保存時に削除"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
