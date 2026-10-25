import { useEffect, useRef } from "react";
import { SITE } from "@/config/site";

/**
 * giscus（GitHub Discussions）によるコメント欄。
 * giscusの埋め込みスクリプトを読み込み、サイトのテーマ切替に追従させる。
 * このコンポーネントはclient:visibleで遅延読み込みする。
 */

const GISCUS_SCRIPT_URL = "https://giscus.app/client.js";
const GISCUS_ORIGIN = "https://giscus.app";

type GiscusTheme = "light" | "dark";

function currentTheme(): GiscusTheme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  // SSRではdocumentを参照できないため、テーマはマウント後に初期化する
  const themeRef = useRef<GiscusTheme>("light");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    themeRef.current = currentTheme();

    const config = {
      "data-repo": SITE.giscus.repo,
      "data-repo-id": SITE.giscus.repoId,
      "data-category": SITE.giscus.category,
      "data-category-id": SITE.giscus.categoryId,
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": themeRef.current,
      "data-lang": "ja",
      "data-loading": "lazy",
      crossorigin: "anonymous",
      async: "true",
    };

    const script = document.createElement("script");
    script.src = GISCUS_SCRIPT_URL;
    for (const [key, value] of Object.entries(config)) {
      script.setAttribute(key, value);
    }
    container.appendChild(script);

    // サイトのテーマ切替に追従する
    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: string }>).detail;
      const nextTheme: GiscusTheme =
        detail?.theme === "dark" ||
        document.documentElement.dataset.theme === "dark"
          ? "dark"
          : "light";
      if (nextTheme === themeRef.current) return;
      themeRef.current = nextTheme;
      const iframe = container.querySelector(
        "iframe.gh-iframe",
      ) as HTMLIFrameElement | null;
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: nextTheme } } },
        GISCUS_ORIGIN,
      );
    };
    document.addEventListener("themechange", onThemeChange);

    return () => {
      document.removeEventListener("themechange", onThemeChange);
      container.replaceChildren();
    };
  }, []);

  return (
    <section className="post-comments-section" aria-label="コメント">
      <h2 className="section-title">コメント</h2>
      <p className="text-sm mt-2" data-color="color-text-muted">
        GitHubアカウントでサインインするとコメントできます。コメントはGitHub
        Discussions上に公開されます。アカウントをお持ちでない場合は、
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
        からご連絡ください。
      </p>
      <div className="mt-4" ref={containerRef} />
    </section>
  );
}
