// Local verification server: applies the same generated headers as Cloudflare Pages.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const source = await readFile(path.join(root, "_headers"), "utf8");
const rules = [];
for (const line of source.split("\n")) {
  if (line.startsWith("/")) rules.push({ pattern: line, headers: {} });
  else if (line.startsWith("  ")) {
    const index = line.indexOf(":");
    if (index < 0 || !rules.length)
      throw new Error("Invalid static headers file");
    rules.at(-1).headers[line.slice(2, index)] = line.slice(index + 1).trim();
  }
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    for (const rule of rules) {
      if (
        rule.pattern.endsWith("*")
          ? pathname.startsWith(rule.pattern.slice(0, -1))
          : pathname === rule.pattern
      ) {
        for (const [key, value] of Object.entries(rule.headers))
          response.setHeader(key, value);
      }
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD, OPTIONS" }).end();
      return;
    }
    if (request.method === "OPTIONS") {
      response.writeHead(204, { Allow: "GET, HEAD, OPTIONS" }).end();
      return;
    }
    if (
      pathname.includes("\0") ||
      pathname.includes("\\") ||
      pathname
        .split("/")
        .some(
          (part, index) =>
            part.startsWith(".") && !(index === 1 && part === ".well-known"),
        ) ||
      pathname === "/_headers"
    ) {
      response.writeHead(404).end();
      return;
    }
    let file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      response.writeHead(404).end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      await stat(file);
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      response.statusCode = 404;
      file = path.join(root, "404.html");
    }
    const body = await readFile(file);
    response.setHeader(
      "Content-Type",
      types[path.extname(file)] ?? "application/octet-stream",
    );
    response.setHeader("Content-Length", body.length);
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    if (error instanceof URIError) response.writeHead(400).end();
    else {
      console.error(error);
      response.writeHead(500).end("Unable to serve page");
    }
  }
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1", () =>
  console.log("Static preview ready"),
);
