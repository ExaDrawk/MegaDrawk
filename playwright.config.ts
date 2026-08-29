import { defineConfig, devices } from "@playwright/test";

const defaultBaseURL = "http://127.0.0.1:3000";
const baseURL = process.env.BASE_URL ?? defaultBaseURL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer:
    baseURL === defaultBaseURL
      ? {
          command: "npm run start",
          url: defaultBaseURL,
          reuseExistingServer: !process.env.CI,
        }
      : undefined,
});
