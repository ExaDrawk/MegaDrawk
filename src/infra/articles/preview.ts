import { checkAdminAccess, type CommentsEnv } from "../comments/server";

export interface PrivateBlogBundle {
  readonly articles: Record<string, string>;
  readonly media: Record<string, { body: string; contentType: string }>;
  readonly headers: Record<string, string>;
}

/** nullは公開の静的ファイルへ委譲。非公開データは必ず認証後に返す。 */
export async function privateBlogResponse(
  request: Request,
  env: CommentsEnv,
  bundle: PrivateBlogBundle,
): Promise<Response | null> {
  const url = new URL(request.url);
  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return new Response(null, { status: 404 });
  }
  const match = /^\/blog\/([a-z0-9][a-z0-9-]*)\/?$/.exec(pathname);
  const id = match?.[1];
  const html =
    id && Object.hasOwn(bundle.articles, id) ? bundle.articles[id] : undefined;
  const media = Object.hasOwn(bundle.media, pathname)
    ? bundle.media[pathname]
    : undefined;
  if (html === undefined && media === undefined) return null;
  const headers = new Headers(bundle.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Vary", "Cookie, X-Admin-Token");
  const denied = await checkAdminAccess(env, request);
  if (denied)
    return new Response(null, {
      status: denied.status === 401 ? 404 : 503,
      headers,
    });
  if (!["GET", "HEAD"].includes(request.method)) {
    headers.set("Allow", "GET, HEAD");
    return new Response(null, { status: 405, headers });
  }
  headers.set("Content-Type", media?.contentType ?? "text/html; charset=utf-8");
  const body = media
    ? Uint8Array.from(atob(media.body), (c) => c.charCodeAt(0))
    : html;
  return new Response(request.method === "HEAD" ? null : body, { headers });
}
