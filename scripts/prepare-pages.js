const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), ".open-next");
const workerPath = path.join(outDir, "worker.js");
const pagesWorkerPath = path.join(outDir, "_worker.js");
const routesPath = path.join(outDir, "_routes.json");

if (!fs.existsSync(outDir)) {
  throw new Error(".open-next directory not found. Run the OpenNext build first.");
}

if (fs.existsSync(workerPath)) {
  fs.copyFileSync(workerPath, pagesWorkerPath);
} else {
  throw new Error("worker.js not found in .open-next output.");
}

const routes = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/_next/image/*",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ],
};

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
console.log("Prepared Cloudflare Pages worker and routes.");
