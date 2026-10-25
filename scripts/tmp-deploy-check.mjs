import { chromium } from "@playwright/test";

const ACCOUNT_ID = "4afb212869663a5f699798ced8ff9a0f";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0];
const page = await context.newPage();
await page.goto("https://dash.cloudflare.com/" + ACCOUNT_ID + "/home", {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(3000);
const state = await page.evaluate(async (accountId) => {
  const api = async (path) => {
    const res = await fetch("/api/v4" + path, { credentials: "include" });
    return res.json().catch(() => null);
  };
  const deployments = await api(
    "/accounts/" +
      accountId +
      "/pages/projects/megadrawk/deployments?per_page=1",
  );
  const latest = deployments?.result?.[0];
  if (!latest) return { error: "no deployment" };
  const config = latest.deployment_config ?? {};
  const summarize = (env) => ({
    envVars: Object.fromEntries(
      Object.entries(env?.env_vars ?? {}).map(([key, value]) => [
        key,
        typeof value === "object" ? { type: value.type } : "plain",
      ]),
    ),
    compatFlags: env?.compatibility_flags,
  });
  return {
    id: latest.id,
    commit: latest.deployment_trigger?.metadata?.commit_hash?.slice(0, 7),
    production: summarize(config.production ?? {}),
    preview: summarize(config.preview ?? {}),
  };
}, ACCOUNT_ID);
console.log(JSON.stringify(state, null, 2));
await page.close();
await browser.close();
