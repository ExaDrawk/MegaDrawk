import { useEffect, useRef, useState } from "react";
import {
  CONTACT_ERROR_MESSAGES,
  CONTACT_LIMITS,
  trimContactInput,
  validateContactInput,
} from "@/domain/contact/contact";
import { ActionButton } from "@/components/ui/Action";

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

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  siteKey: string;
}

export function ContactForm({ siteKey }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    let disposed = false;
    loadTurnstile()
      .then((turnstile) => {
        if (disposed || !widgetRef.current) {
          return;
        }
        widgetIdRef.current = turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
          theme: "auto",
        });
        setTurnstileReady(true);
      })
      .catch(() => {
        if (!disposed) setTurnstileFailed(true);
      });
    return () => {
      disposed = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  function resetTurnstile() {
    setTurnstileToken("");
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) {
      return;
    }

    const trimmed = trimContactInput({ name, email, message });
    const validationError = validateContactInput(trimmed);
    if (validationError) {
      setStatus("error");
      setErrorText(CONTACT_ERROR_MESSAGES[validationError]);
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed.name,
          email: trimmed.email,
          message: trimmed.message,
          turnstileToken,
          company: "",
        }),
      });
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
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setTurnstileToken("");
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
    <section className="contact-form" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="section-title">
        お問い合わせフォーム
      </h2>
      <p className="contact-form__note" data-color="color-text-muted">
        メールアドレスは任意です。返信が必要な場合は、本文にその旨と返信先をご記入ください。
      </p>

      {status === "success" ? (
        <div className="status-panel mt-5" data-status="success" role="status">
          送信しました。返信が必要な場合のみ、明記いただいた返信先へご連絡いたします。
        </div>
      ) : (
        <form
          className="contact-form__body mt-5 grid gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          <div className="honeypot-field" aria-hidden="true">
            <label>
              会社名
              <input
                type="text"
                name="company"
                value=""
                readOnly
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <label className="form-field">
            <span className="form-label">お名前</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={CONTACT_LIMITS.maxNameLength}
              required
              autoComplete="name"
              className="form-control"
            />
          </label>

          <label className="form-field">
            <span className="form-label">メールアドレス（任意）</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={CONTACT_LIMITS.maxEmailLength}
              autoComplete="email"
              className="form-control"
              aria-describedby={errorText ? "contact-form-error" : undefined}
            />
          </label>

          <label className="form-field">
            <span className="form-label">お問い合わせ内容</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={CONTACT_LIMITS.maxMessageLength}
              required
              className="form-control min-h-36"
              aria-describedby={errorText ? "contact-form-error" : undefined}
            />
          </label>

          {turnstileFailed ? (
            <p className="text-sm" data-color="color-danger" role="alert">
              スパム防止コンポーネントを読み込めませんでした。メールまたはXでご連絡ください。
            </p>
          ) : (
            <div className="cf-turnstile-container" ref={widgetRef} />
          )}

          <ActionButton
            type="submit"
            className="justify-self-start"
            disabled={
              status === "submitting" || turnstileFailed || !turnstileReady
            }
            aria-busy={status === "submitting"}
          >
            {status === "submitting" ? "送信中..." : "送信する"}
          </ActionButton>

          {status === "error" && errorText ? (
            <p
              id="contact-form-error"
              className="text-sm"
              data-color="color-danger"
              role="alert"
            >
              {errorText}
            </p>
          ) : null}
          {status === "submitting" ? (
            <p className="sr-only" role="status">
              送信中です。
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
