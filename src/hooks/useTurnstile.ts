import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstileウィジェットの描画とトークン取得を共有するフック。
 * お問い合わせフォームとコメント欄の双方で使う（DRY）。
 */

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstilePromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }
  turnstilePromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        reject(new Error("Turnstile script loaded but API is unavailable."));
      }
    });
    script.addEventListener("error", () => {
      turnstilePromise = null;
      reject(new Error("Turnstile script failed to load."));
    });
    document.head.appendChild(script);
  });
  return turnstilePromise;
}

export function useTurnstile(
  siteKey: string,
  onToken: (token: string) => void,
): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
  failed: boolean;
  reset: () => void;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // コールバックはref経由で参照し、再レンダリングでウィジェットが再生成されないようにする
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    let disposed = false;
    loadTurnstile()
      .then((turnstile) => {
        if (disposed || !containerRef.current) {
          return;
        }
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
          theme: "auto",
        });
        setReady(true);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const reset = useCallback(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { containerRef, ready, failed, reset };
}
