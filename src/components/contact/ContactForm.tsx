import { useRef, useState } from "react";
import {
  CONTACT_ERROR_MESSAGES,
  CONTACT_LIMITS,
  trimContactInput,
  validateContactInput,
} from "@/domain/contact/contact";
import { useTurnstile } from "@/hooks/useTurnstile";
import { ActionButton } from "@/components/ui/Action";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  siteKey: string;
}

export function ContactForm({ siteKey }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [wantsReply, setWantsReply] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const submitLockRef = useRef(false);
  const { containerRef, ready, failed, reset } = useTurnstile(
    siteKey,
    setTurnstileToken,
  );

  function resetTurnstile() {
    setTurnstileToken("");
    reset();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) {
      return;
    }

    const trimmed = trimContactInput({ name, email, message, wantsReply });
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
          wantsReply: trimmed.wantsReply,
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
      setWantsReply(false);
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

      {status === "success" ? (
        <div className="status-panel mt-5" data-status="success" role="status">
          送信しました。返信をご希望の場合は、ご入力いただいたメールアドレス宛にご連絡いたします。
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
            <span className="form-label">
              メールアドレス（{wantsReply ? "必須" : "任意"}）
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={CONTACT_LIMITS.maxEmailLength}
              required={wantsReply}
              autoComplete="email"
              className="form-control"
              aria-describedby={errorText ? "contact-form-error" : undefined}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wantsReply}
              onChange={(event) => setWantsReply(event.target.checked)}
              className="h-4 w-4"
            />
            <span>返信を希望する</span>
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

          {failed ? (
            <p className="text-sm" data-color="color-danger" role="alert">
              スパム防止コンポーネントを読み込めませんでした。メールまたはXでご連絡ください。
            </p>
          ) : (
            <div className="cf-turnstile-container" ref={containerRef} />
          )}

          <ActionButton
            type="submit"
            className="justify-self-start"
            disabled={status === "submitting" || failed || !ready}
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
