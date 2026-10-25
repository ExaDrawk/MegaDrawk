import { useCallback, useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/Action";
import { AdminGate } from "@/components/admin/AdminGate";

/**
 * 記事管理画面（/admin/articles）。
 * 認可はHttpOnlyセッションCookie（AdminGateが発行）で行う。
 * Markdownをそのまま編集し、GitHubのmainへコミットする。
 * 保存するとCloudflare Pagesが自動再ビルドし、1〜2分で反映される。
 */

interface ArticleMeta {
  name: string;
  sha: string;
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
  const [errorText, setErrorText] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [currentSha, setCurrentSha] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    setErrorText("");
    try {
      const response = await fetch("/api/admin/articles");
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error("load failed");
      const payload = (await response.json()) as { articles?: ArticleMeta[] };
      setArticles(payload.articles ?? []);
      setState("ready");
    } catch {
      setState("error");
      setErrorText("記事一覧を読み込めませんでした。");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openArticle(name: string) {
    setErrorText("");
    try {
      const response = await fetch(
        `/api/admin/articles?file=${encodeURIComponent(name)}`,
      );
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error("open failed");
      const payload = (await response.json()) as {
        name: string;
        sha: string;
        content: string;
      };
      setFilename(payload.name);
      setContent(payload.content);
      setCurrentSha(payload.sha);
      setDirty(false);
      setSaveMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorText("記事の読み込みに失敗しました。");
    }
  }

  function newArticle() {
    const today = new Date().toISOString().slice(0, 10);
    setFilename(`${today}-new-post.md`);
    setContent(
      `---\ntitle: "記事タイトル"\ndescription: "この記事の要約を1〜2文で。"\ndate: "${today}"\ntags: []\ndraft: true\n---\n\n本文をMarkdownで書きます。\n`,
    );
    setCurrentSha(null);
    setDirty(false);
    setSaveMessage("");
  }

  async function save() {
    if (saving || !filename.trim() || !content.trim()) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const response = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: filename.trim(),
          content,
          sha: currentSha,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        setSaveMessage(payload?.error ?? "保存に失敗しました。");
        return;
      }
      setSaveMessage(
        "保存しました。GitHubにコミットしたので、1〜2分でサイトに反映されます。",
      );
      setDirty(false);
      await load();
    } catch {
      setSaveMessage("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  async function remove(name: string, sha: string) {
    if (
      !confirm(
        `${name}を削除します。サイトからも消えます（元に戻すにはGit履歴から復元）。よろしいですか？`,
      )
    ) {
      return;
    }
    const response = await fetch(
      `/api/admin/articles?file=${encodeURIComponent(name)}&sha=${encodeURIComponent(sha)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setErrorText("削除に失敗しました。");
      return;
    }
    if (filename === name) {
      setFilename("");
      setContent("");
      setCurrentSha(null);
    }
    setSaveMessage(`${name}を削除しました。1〜2分で反映されます。`);
    await load();
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
            <h2 className="section-title">エディタ</h2>
            <div className="mt-4 grid gap-4">
              <label className="form-field">
                <span className="form-label">
                  ファイル名（例: 2026-10-26-hello.md）
                </span>
                <input
                  value={filename}
                  onChange={(event) => {
                    setFilename(event.target.value);
                    setDirty(true);
                  }}
                  placeholder="2026-10-26-new-post.md"
                  className="form-control"
                  autoComplete="off"
                />
              </label>
              <label className="form-field">
                <span className="form-label">
                  本文（Markdown・frontmatter込み）
                </span>
                <textarea
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
                    setDirty(true);
                  }}
                  className="form-control min-h-96 font-mono text-sm"
                  spellCheck={false}
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <ActionButton
                  onClick={() => void save()}
                  disabled={saving || !filename || !content}
                  aria-busy={saving}
                >
                  {saving
                    ? "保存中..."
                    : currentSha
                      ? "保存して公開"
                      : "新規作成して公開"}
                </ActionButton>
                <ActionButton variant="secondary" onClick={newArticle}>
                  新規記事
                </ActionButton>
                {dirty && (
                  <span className="text-xs" data-color="color-text-muted">
                    未保存の変更があります
                  </span>
                )}
              </div>
              {saveMessage ? (
                <p
                  className="text-sm"
                  data-color="color-text-secondary"
                  role="status"
                >
                  {saveMessage}
                </p>
              ) : null}
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <h2 className="section-title">記事一覧</h2>
            <div className="mt-4 flex flex-col gap-2">
              {articles.length === 0 ? (
                <p className="text-sm" data-color="color-text-muted">
                  記事はまだありません。
                </p>
              ) : (
                articles.map((article) => (
                  <div
                    key={article.name}
                    className="surface-muted flex items-center justify-between gap-3 p-3"
                  >
                    <button
                      type="button"
                      className="text-link min-h-0 text-sm"
                      onClick={() => void openArticle(article.name)}
                    >
                      {article.name}
                    </button>
                    <button
                      type="button"
                      className="text-xs"
                      data-color="color-danger"
                      onClick={() => void remove(article.name, article.sha)}
                    >
                      削除
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
