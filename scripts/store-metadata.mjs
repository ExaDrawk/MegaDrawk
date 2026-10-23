import { parse } from "parse5";

export async function fetchStoreListing(packageId, fetchPage = fetch) {
  const url =
    "https://play.google.com/store/apps/details?id=" +
    packageId +
    "&hl=ja&gl=JP";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetchPage(url, {
        redirect: "error",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok)
        throw new Error(`Store unavailable: ${packageId} (${response.status})`);
      return parseStorePage(await response.text(), packageId);
    } catch (error) {
      if (attempt === 3) throw error;
      console.warn(
        `Retrying verified store listing: ${packageId} (${attempt}/3)`,
      );
    }
  }
  throw new Error("Store verification did not complete");
}

export function parseStorePage(html, packageId) {
  const metadata = new Map();
  const applications = [];
  function visit(node) {
    const attrs = Object.fromEntries(
      (node.attrs ?? []).map((a) => [a.name, a.value]),
    );
    if (node.tagName === "meta" && attrs.property)
      metadata.set(attrs.property, attrs.content);
    if (node.tagName === "script" && attrs.type === "application/ld+json") {
      const value = JSON.parse(
        node.childNodes.map((n) => n.value ?? "").join(""),
      );
      applications.push(...(Array.isArray(value) ? value : [value]));
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  const app = applications.find((a) => a["@type"] === "SoftwareApplication");
  const canonical = new URL(
    metadata.get("og:url") ?? "https://invalid.invalid",
  );
  if (
    !app ||
    canonical.hostname !== "play.google.com" ||
    canonical.searchParams.get("id") !== packageId ||
    app.author?.name !== "Drawk"
  )
    throw new Error(
      `Unexpected store listing: ${packageId}; canonical=${canonical.hostname}${canonical.pathname}?id=${canonical.searchParams.get("id")}; application=${app?.["@type"] ?? "missing"}; publisher=${app?.author?.name ?? "missing"}`,
    );
  const name = app.name;
  const description = metadata.get("og:description");
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    typeof description !== "string" ||
    !description.trim() ||
    description.length > 300 ||
    [...(name + description)].some(
      (character) =>
        character.codePointAt(0) < 32 ||
        character === String.fromCodePoint(65533),
    )
  )
    throw new Error(`Invalid metadata: ${packageId}`);
  const icon = new URL(app.image);
  if (
    icon.protocol !== "https:" ||
    icon.hostname !== "play-lh.googleusercontent.com" ||
    icon.username ||
    icon.password
  )
    throw new Error("Unexpected icon origin");
  return {
    name,
    description,
    iconUrl: icon.href + "=s256",
    href: "https://play.google.com/store/apps/details?id=" + packageId,
  };
}
