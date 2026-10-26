import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  buildBlogPostDraft,
  getInitialBlogPostDraftInput,
  type BlogPostDraftInput,
  type BlogPostDraftResult,
} from "@/domain/blog/admin";
import { blogDraftStorageRepository } from "@/infra/storage/blogDraftStorage";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { ActionButton } from "@/components/ui/Action";

const FIELD_LABELS: Record<keyof BlogPostDraftInput, string> = {
  title: "タイトル",
  description: "説明",
  body: "本文（Markdown）",
  tags: "タグ",
  date: "公開日",
  updatedAt: "更新日",
  draft: "下書き",
};

export function BlogPostEditor() {
  const [draftInput, setDraftInput] = useState<BlogPostDraftInput>(
    getInitialBlogPostDraftInput(),
  );
  const [result, setResult] = useState<BlogPostDraftResult | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [storageState, setStorageState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [isPending, startTransition] = useTransition();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [bodyRestoreCounter, setBodyRestoreCounter] = useState(0);
  const previewBody = draftInput.body;

  function updateField<K extends keyof BlogPostDraftInput>(
    key: K,
    value: BlogPostDraftInput[K],
  ) {
    dirtyRef.current = true;
    setDraftInput((current) => ({
      ...current,
      [key]: value,
    }));
    setResult(null);
    setErrorText(null);
    setCopied(false);
  }

  const clearPendingSave = useCallback(() => {
    if (saveTimerRef.current === null) {
      return;
    }

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }, []);

  const loadDraft = useCallback(() => {
    setStorageState("loading");
    setErrorText(null);
    try {
      const storedDraft = blogDraftStorageRepository.getDraft();

      if (storedDraft) {
        setDraftInput(storedDraft.draft);
        setSavedAt(storedDraft.savedAt);
        setBodyRestoreCounter((count) => count + 1);
      }
      setStorageState("ready");
    } catch {
      setStorageState("error");
      setErrorText(
        "保存済み草案を読み込めません。保存データを保持したまま、再読み込みできます。",
      );
    }
  }, []);

  useEffect(loadDraft, [loadDraft]);

  useEffect(() => {
    if (storageState !== "ready" || !dirtyRef.current) {
      return;
    }

    clearPendingSave();
    saveTimerRef.current = setTimeout(() => {
      try {
        const nextSavedAt = blogDraftStorageRepository.saveDraft(draftInput);
        setSavedAt(nextSavedAt);
        dirtyRef.current = false;
      } catch {
        setErrorText(
          "記事草案を保存できません。ブラウザの保存設定と空き容量を確認してください。",
        );
      } finally {
        saveTimerRef.current = null;
      }
    }, 300);

    return clearPendingSave;
  }, [clearPendingSave, draftInput, storageState]);

  function discardSavedDraft(resetInput = false) {
    clearPendingSave();
    try {
      blogDraftStorageRepository.clearDraft();
      dirtyRef.current = false;
      setSavedAt(null);
      setErrorText(null);
      setStorageState("ready");
      if (resetInput) {
        setDraftInput(getInitialBlogPostDraftInput());
        setBodyRestoreCounter((count) => count + 1);
        setResult(null);
        setCopied(false);
      }
    } catch {
      setErrorText(
        "保存済み草案を削除できません。ブラウザの保存設定を確認してください。",
      );
    }
  }

  function handleGenerate() {
    setErrorText(null);
    setCopied(false);

    startTransition(() => {
      try {
        const nextResult = buildBlogPostDraft(draftInput);
        setResult(nextResult);
      } catch (error) {
        setResult(null);
        setErrorText(
          error instanceof Error
            ? error.message
            : "記事草案の生成に失敗しました。",
        );
      }
    });
  }

  async function handleCopy() {
    if (!result || isCopying) {
      return;
    }

    setIsCopying(true);
    setErrorText(null);

    try {
      await navigator.clipboard.writeText(result.markdown);
      setCopied(true);
    } catch {
      setErrorText("コピーに失敗しました。手動でコピーしてください。");
      setCopied(false);
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
      <section className="surface p-5 sm:p-7">
        {storageState === "error" && (
          <ActionButton onClick={loadDraft}>草案を再読み込み</ActionButton>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title">記事草案を入力</h2>
            <a href="/admin" className="text-link min-h-0 text-xs">
              管理メニューへ戻る
            </a>
          </div>
          <p className="text-sm" data-color="color-text-secondary">
            入力内容から、`src/content/blog/`
            に保存するMarkdownファイルを生成します。
          </p>
          <p className="text-xs" data-color="color-text-muted">
            {savedAt
              ? `自動保存: ${new Date(savedAt).toLocaleString("ja-JP")}`
              : "入力内容はこのブラウザに自動保存されます。"}
          </p>
        </div>

        <form
          className="mt-7 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate();
          }}
        >
          <fieldset className="contents" disabled={storageState === "loading"}>
            <label className="form-field" htmlFor="draft-title">
              <span className="form-label">{FIELD_LABELS.title}</span>
              <input
                id="draft-title"
                value={draftInput.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="例: 春の展示で試した新しい地形表現"
                className="form-control"
              />
            </label>

            <label className="form-field" htmlFor="draft-description">
              <span className="form-label">{FIELD_LABELS.description}</span>
              <textarea
                id="draft-description"
                rows={2}
                value={draftInput.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="記事一覧とSNSカードに表示する要約を1〜2文で。"
                className="form-control"
              />
            </label>

            <label className="form-field" htmlFor="draft-body">
              <span className="form-label" id="draft-body-label">
                {FIELD_LABELS.body}
              </span>
              <MarkdownToolbar
                textareaRef={bodyTextareaRef}
                value={draftInput.body}
                onChange={(next) => updateField("body", next)}
              />
              <textarea
                id="draft-body"
                ref={bodyTextareaRef}
                key={"body-" + bodyRestoreCounter}
                aria-labelledby="draft-body-label"
                defaultValue={previewBody}
                onChange={(event) => updateField("body", event.target.value)}
                placeholder="Markdownで書けます。## 見出し、**強調**、```コードブロック``` など。"
                rows={12}
                className="form-control font-mono text-sm"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="form-field">
                <span className="form-label">{FIELD_LABELS.date}</span>
                <input
                  type="date"
                  value={draftInput.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  className="form-control"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{FIELD_LABELS.updatedAt}</span>
                <input
                  type="date"
                  value={draftInput.updatedAt}
                  onChange={(event) =>
                    updateField("updatedAt", event.target.value)
                  }
                  className="form-control"
                />
              </label>
            </div>

            <label className="form-field">
              <span className="form-label">{FIELD_LABELS.tags}</span>
              <input
                value={draftInput.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="例: 制作メモ, ジオラマ, 展示"
                className="form-control"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draftInput.draft}
                onChange={(event) => updateField("draft", event.target.checked)}
                className="h-4 w-4"
              />
              <span>
                {FIELD_LABELS.draft}
                として保存（本番サイトには公開されません）
              </span>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <ActionButton
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? "生成中..." : "Markdownを生成"}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => discardSavedDraft(true)}
              >
                入力をリセット
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => discardSavedDraft()}
              >
                保存済み草案を削除
              </ActionButton>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="grid gap-5" aria-live="polite">
        <article className="surface p-5 sm:p-7">
          <h2 className="section-title text-xl">画面状態</h2>
          {storageState === "loading" || isPending ? (
            <div
              className="mt-5 grid gap-3"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="skeleton h-6 w-32 rounded-full" />
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-40 rounded-xl" />
            </div>
          ) : errorText ? (
            <div className="status-panel mt-5" data-status="error" role="alert">
              <p className="text-sm font-semibold">
                入力内容を確認してください
              </p>
              <p className="mt-1 text-sm leading-6">{errorText}</p>
              <p className="mt-2 text-sm">
                タイトル・説明・本文を入れ、更新日は公開日以降にしてください。
              </p>
            </div>
          ) : result ? (
            <div className="status-panel mt-5" data-status="success">
              <p className="text-sm font-semibold">Markdownを生成しました</p>
              <p className="mt-1 text-sm leading-6">
                <code>{`src/content/blog/${result.filename}`}</code>{" "}
                として保存してコミットすると公開されます。
              </p>
              {savedAt ? (
                <p className="mt-2 text-sm">
                  草案もブラウザに保存済みなので、画面を閉じても復元できます。
                </p>
              ) : null}
            </div>
          ) : (
            <div className="surface-muted mt-5 px-5 py-8 text-center">
              <p className="mt-2 text-sm leading-6">
                まず左側で記事草案を入力し、Markdown生成を実行してください。
              </p>
            </div>
          )}
        </article>

        <article className="surface p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title text-xl">プレビュー</h2>
            {result ? (
              <span
                className="text-xs font-semibold"
                data-color="color-primary"
              >
                slug: {result.slug}
              </span>
            ) : null}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">
                {draftInput.title.trim() || "タイトル未入力"}
              </h3>
              <p className="mt-2 text-sm" data-color="color-text-secondary">
                {draftInput.description.trim() ||
                  "説明は一覧・RSS・SNSカードに使われます。"}
              </p>
              {result && result.tagList.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2" aria-label="タグ">
                  {result.tagList.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="surface p-5 shadow-none">
              {previewBody.trim() ? (
                <MarkdownPreview
                  markdown={previewBody}
                  titleOverride={draftInput.title}
                />
              ) : (
                <p className="text-sm" data-color="color-text-secondary">
                  本文を入力すると、ここにプレビューが表示されます。
                </p>
              )}
            </div>
          </div>
        </article>

        <article
          className="rounded-[var(--radius-xl)] border p-5 sm:p-7"
          data-code-panel
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">生成Markdown</h2>
            <ActionButton
              variant="dark"
              onClick={() => {
                void handleCopy();
              }}
              disabled={!result || isCopying}
              aria-busy={isCopying}
            >
              {isCopying
                ? "コピー中..."
                : copied
                  ? "コピー済み"
                  : "Markdownをコピー"}
            </ActionButton>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-2xl bg-black/25 p-5 text-sm leading-7">
            <code>
              {result?.markdown ??
                '---\ntitle: "..."\ndescription: "..."\ndate: "YYYY-MM-DD"\n---\n\n本文（Markdown）'}
            </code>
          </pre>
        </article>
      </section>
    </div>
  );
}
