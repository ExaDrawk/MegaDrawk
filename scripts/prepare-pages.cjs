/**
 * prepare-pages.cjs
 *
 * Post-build script for Cloudflare Pages deployment.
 * Restructures the OpenNext build output into the format expected
 * by Cloudflare Pages (worker + static assets + routes config).
 *
 * Run via: npm run deploy
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), ".open-next");
const assetsDir = path.join(outDir, "assets");
const workerPath = path.join(outDir, "worker.js");
const pagesWorkerPath = path.join(outDir, "_worker.js");
const routesPath = path.join(outDir, "_routes.json");

if (!fs.existsSync(outDir)) {
  throw new Error(".open-next directory not found. Run the OpenNext build first.");
}

if (!fs.existsSync(assetsDir)) {
  throw new Error(".open-next/assets directory not found. OpenNext assets missing.");
}

for (const entry of fs.readdirSync(assetsDir)) {
  const src = path.join(assetsDir, entry);
  const dest = path.join(outDir, entry);
  if (fs.existsSync(dest)) {
    continue;
  }
  fs.cpSync(src, dest, { recursive: true });
}

if (fs.existsSync(workerPath)) {
  fs.copyFileSync(workerPath, pagesWorkerPath);
} else {
  throw new Error("worker.js not found in .open-next output.");
}

// Only paths that exist as static files in the deployment may be excluded
// from the worker. Dynamic routes (robots.txt, sitemap.xml, manifest, pages)
// must keep hitting the worker, or Pages serves 404 / its default robots.txt.
const staticExcludes = fs
  .readdirSync(assetsDir, { withFileTypes: true })
  .flatMap((entry) => {
    if (entry.isFile()) {
      return [`/${entry.name}`];
    }
    return entry.name === "_next"
      ? ["/_next/*"]
      : [`/${entry.name}`, `/${entry.name}/*`];
  });

const routes = {
  version: 1,
  include: ["/*"],
  exclude: staticExcludes,
};

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
console.log("Prepared Cloudflare Pages worker and routes.");
