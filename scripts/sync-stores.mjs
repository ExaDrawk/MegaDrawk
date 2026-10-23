import {
  readFile,
  writeFile,
  mkdir,
  rename,
  readdir,
  unlink,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseStorePage } from "./store-metadata.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apps = JSON.parse(
  await readFile(path.join(root, "src/config/store-apps.json"), "utf8"),
);
const snapshot = path.join(root, "src/config/store-listings.json");
const results = [];
// Fetch and validate every listing before replacing the shared snapshot.
for (const app of apps) {
  if (
    !/^[a-z0-9-]+$/.test(app.id) ||
    !/^com\.drawk\.[a-z]+$/.test(app.packageId)
  )
    throw new Error("Invalid app registry");
  const url =
    "https://play.google.com/store/apps/details?id=" +
    app.packageId +
    "&hl=ja&gl=JP";
  const response = await fetch(url, { redirect: "error" });
  if (!response.ok)
    throw new Error(`Store unavailable: ${app.packageId} (${response.status})`);
  const metadata = parseStorePage(await response.text(), app.packageId);
  const icon = await fetch(metadata.iconUrl, { redirect: "error" });
  if (!icon.ok || !icon.headers.get("content-type")?.startsWith("image/"))
    throw new Error("Invalid store icon response");
  const bytes = Buffer.from(await icon.arrayBuffer());
  if (bytes.length > 1024 * 1024 || bytes.length < 8)
    throw new Error("Invalid icon size");
  // PNG signature is required; untrusted SVG/HTML can never enter public assets.
  if (
    !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    throw new Error("Expected a PNG icon");
  const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const imageSrc = "/images/projects/" + app.id + "-" + digest + ".png";
  results.push({
    app: {
      id: app.id,
      packageId: app.packageId,
      name: metadata.name,
      description: metadata.description,
      href: metadata.href,
      imageSrc,
    },
    bytes,
  });
}
await mkdir(path.join(root, "public/images/projects"), { recursive: true });
for (const result of results)
  await writeFile(path.join(root, "public", result.app.imageSrc), result.bytes);
const text =
  JSON.stringify(
    results.map((r) => r.app),
    null,
    2,
  ) + "\n";
await writeFile(snapshot + ".tmp", text);
await rename(snapshot + ".tmp", snapshot);
const currentImages = new Set(
  results.map((result) => path.basename(result.app.imageSrc)),
);
for (const file of await readdir(path.join(root, "public/images/projects"))) {
  if (
    apps.some((app) =>
      new RegExp("^" + app.id + "-[a-f0-9]{12}\\.png$").test(file),
    ) &&
    !currentImages.has(file)
  ) {
    await unlink(path.join(root, "public/images/projects", file));
  }
}
console.log(
  `Verified ${results.length} public Google Play listings. Snapshot updated.`,
);
