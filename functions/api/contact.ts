/// <reference types="@cloudflare/workers-types" />
import { SITE } from "../../src/config/site";
import {
  trimContactInput,
  validateContactInput,
  type ContactInput,
} from "../../src/domain/contact/contact";

export interface ContactFunctionEnv {
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly BREVO_API_KEY?: string;
}

const JSON_BODY_LIMIT_BYTES = 32 * 1024;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

interface ContactRequestBody extends ContactInput {
  readonly turnstileToken?: unknown;
  readonly company?: unknown;
}

interface BrevoEmailPayload {
  readonly sender: { readonly name: string; readonly email: string };
  readonly to: readonly { readonly email: string }[];
  readonly replyTo: { readonly email: string };
  readonly subject: string;
  readonly textContent: string;
}

/** 送信者・宛先は連絡先の正本 SITE.email にのみ依存する。 */
export function buildBrevoEmail(input: ContactInput): BrevoEmailPayload {
  return {
    sender: { name: SITE.name, email: SITE.email },
    to: [{ email: SITE.email }],
    replyTo: { email: input.email },
    subject: `【${SITE.name}】お問い合わせ（${input.name}様）`,
    textContent: `${input.name}様よりお問い合わせがありました。\n\n返信先: ${input.email}\n\n${input.message}`,
  };
}

async function verifyTurnstile(
  token: string,
  secretKey: string,
  remoteAddress: string | null,
): Promise<boolean> {
  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
      ...(remoteAddress ? { remoteip: remoteAddress } : {}),
    }),
  });
  if (!response.ok) {
    return false;
  }
  const result = (await response.json()) as { success?: unknown };
  return result.success === true;
}

async function sendViaBrevo(
  payload: BrevoEmailPayload,
  apiKey: string,
): Promise<boolean> {
  const response = await fetch(BREVO_EMAIL_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response.ok;
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// Responseはグローバルスコープで生成できず、ボディの再利用もできないため
// 毎リクエスト内で生成する。
function successResponse(): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const onRequestPost: PagesFunction<ContactFunctionEnv> = async (
  context,
) => {
  const { TURNSTILE_SECRET_KEY, BREVO_API_KEY } = context.env;
  if (!TURNSTILE_SECRET_KEY || !BREVO_API_KEY) {
    return errorResponse(
      "お問い合わせフォームは現在利用できません。メールまたはXでご連絡ください。",
      500,
    );
  }

  const raw = await context.request.text();
  if (raw.length > JSON_BODY_LIMIT_BYTES) {
    return errorResponse("送信データが大きすぎます。", 413);
  }

  let body: ContactRequestBody;
  try {
    body = JSON.parse(raw) as ContactRequestBody;
  } catch {
    return errorResponse("送信内容を読み取れませんでした。", 400);
  }

  // ハニーポットは人間には表示されない。入力がある場合はボットとして静かに成功扱いにする。
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return successResponse();
  }

  if (typeof body.turnstileToken !== "string" || !body.turnstileToken) {
    return errorResponse(
      "スパム防止の確認が完了していません。ページを再読み込みしてください。",
      400,
    );
  }

  if (
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string"
  ) {
    return errorResponse("送信内容の形式が正しくありません。", 400);
  }

  const input = trimContactInput({
    name: body.name,
    email: body.email,
    message: body.message,
  });
  const validationError = validateContactInput(input);
  if (validationError) {
    return errorResponse(
      "入力内容を確認してください（文字数・メールアドレスの形式）。",
      400,
    );
  }

  const remoteAddress = context.request.headers.get("CF-Connecting-IP") ?? null;
  const humanVerified = await verifyTurnstile(
    body.turnstileToken,
    TURNSTILE_SECRET_KEY,
    remoteAddress,
  ).catch(() => false);
  if (!humanVerified) {
    return errorResponse(
      "スパム防止の確認に失敗しました。時間をおいて再度お試しください。",
      400,
    );
  }

  const delivered = await sendViaBrevo(
    buildBrevoEmail(input),
    BREVO_API_KEY,
  ).catch(() => false);
  if (!delivered) {
    return errorResponse(
      "送信に失敗しました。恐れ入りますがメールまたはXでご連絡ください。",
      502,
    );
  }

  return successResponse();
};
