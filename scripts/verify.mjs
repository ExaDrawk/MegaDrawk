import { spawn, execFileSync } from "node:child_process";
import { mkdir, writeFile, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const output = path.resolve("verification/latest");
await mkdir(output, { recursive: true });
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const manifest = {
  startedAt: new Date().toISOString(),
  commit: git("rev-parse", "HEAD"),
  changes: git("status", "--short"),
  runtime: process.version,
  package: "megadrawk",
  variant: "astro-static",
  gates: [],
};
const gates = [
  ["encoding", ["run", "check:encoding"]],
  ["format", ["run", "format:check"]],
  ["lint", ["run", "lint"]],
  ["types", ["run", "typecheck"]],
  ["unit", ["test"]],
  ["build", ["run", "build"]],
  ["audit", ["audit", "--json"]],
  ["browser", ["run", "e2e"]],
];
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run through npm run verify");
for (const [name, args] of gates) {
  const startedAt = new Date().toISOString();
  console.log(`Verifying ${name}...`);
  let log = "";
  const child = spawn(process.execPath, [npmCli, ...args], {
    env: { ...process.env, NO_COLOR: undefined },
    stdio: ["ignore", "pipe", "pipe"],
  });
  for (const stream of [child.stdout, child.stderr])
    stream.on("data", (chunk) => {
      log += chunk;
      process.stdout.write(chunk);
    });
  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  const logPath = path.join(output, name + ".log");
  await writeFile(logPath, log);
  manifest.gates.push({
    name,
    command: "npm " + args.join(" "),
    startedAt,
    finishedAt: new Date().toISOString(),
    exitCode,
    log: logPath,
  });
  await writeFile(
    path.join(output, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  if (exitCode !== 0) {
    process.exitCode = 1;
    break;
  }
}
if (!process.exitCode) {
  const html = await readFile("dist/index.html", "utf8");
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  manifest.home = {
    htmlBytes: Buffer.byteLength(html),
    htmlGzipBytes: gzipSync(html).length,
    hydratedIslands: (html.match(/<astro-island\b/g) ?? []).length,
    inlineScriptBytes: scripts.reduce(
      (size, item) => size + Buffer.byteLength(item[2]),
      0,
    ),
  };
  manifest.artifacts = (await readdir("dist/_astro"))
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.resolve("dist/_astro", file));
  manifest.screenshots = [];
  for (const file of await readdir("screenshots")) {
    const screenshot = path.resolve("screenshots", file);
    if (
      file.endsWith(".png") &&
      (await stat(screenshot)).mtimeMs >= Date.parse(manifest.startedAt)
    )
      manifest.screenshots.push(screenshot);
  }
  manifest.browser = path.resolve("verification/e2e.json");
  manifest.buildOutput = path.resolve("dist");
  manifest.generatedHeadersBytes = (await stat("dist/_headers")).size;
  manifest.finishedAt = new Date().toISOString();
  await writeFile(
    path.join(output, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    "Verification passed. Evidence: verification/latest/manifest.json",
  );
}
