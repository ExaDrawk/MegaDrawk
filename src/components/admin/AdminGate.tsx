import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ActionButton } from "@/components/ui/Action";

/**
 * 管理ページ共通のパスワードゲート。
 * ポップアップでパスワードを入力させ、サーバー側で検証して
 * HttpOnlyセッションCookieを発行する。パスワードは保存せず入力欄にのみ存在する。
 */

type GateState = "checking" | "locked" | "open";

export function AdminGate({ children }: { children: ReactNode }) {
  const [gateState, setGateState] = useState<GateState>("checking");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const opened = useRef(false);
  if (gateState === "open") opened.current = true;
  useEffect(() => {
    const expired = () => setGateState("locked");
    window.addEventListener("admin-auth-required", expired);
    return () => window.removeEventListener("admin-auth-required", expired);
  }, []);

  const check = useCallback(async () => {
    setGateState("checking");
    try {
      const response = await fetch("/api/admin/comments");
      if (response.status === 401) {
        setGateState("locked");
      } else if (response.ok) {
        setGateState("open");
      } else {
        setGateState("locked");
        setErrorText("認証状態の確認に失敗しました。再度お試しください。");
      }
    } catch {
      setGateState("locked");
      setErrorText("認証状態の確認に失敗しました。再度お試しください。");
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !password) return;
    setSubmitting(true);
    setErrorText("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        // 入力済みのパスワードを即刻消去してから開く
        setPassword("");
        setGateState("open");
      } else {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setErrorText(payload?.error ?? "認証に失敗しました。");
      }
    } catch {
      setErrorText("認証に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  let overlay: ReactNode = null;
  if (gateState === "checking") {
    overlay = (
      <div className="surface p-6" aria-busy="true">
        <div className="skeleton mb-3 h-4 w-40 rounded" />
        <div className="skeleton h-24 rounded" />
      </div>
    );
  }

  if (gateState === "locked") {
    overlay = (
      <div
        className="admin-gate-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-gate-title"
      >
        <div className="admin-gate-dialog">
          <h2 id="admin-gate-title" className="section-title">
            パスワード
          </h2>
          <p className="mt-2 text-sm" data-color="color-text-secondary">
            管理メニューに入るにはパスワードを入力してください。
          </p>
          <form className="mt-5 grid gap-3" onSubmit={login}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              autoComplete="off"
              autoFocus
              aria-describedby={errorText ? "admin-gate-error" : undefined}
            />
            <ActionButton
              type="submit"
              className="justify-self-start"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "確認中..." : "入る"}
            </ActionButton>
            {errorText ? (
              <p
                id="admin-gate-error"
                className="text-sm"
                data-color="color-danger"
                role="alert"
              >
                {errorText}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div hidden={gateState !== "open"} inert={gateState !== "open"}>
        {opened.current ? children : null}
      </div>
      {overlay}
    </>
  );
}
