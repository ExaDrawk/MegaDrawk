import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  output: "static",
  trailingSlash: "never",
  integrations: [react()],
  build: { inlineStylesheets: "never" },
  markdown: {
    // ダークテーマ切替に追従させるため二重テーマで生成し、CSS側で切り替える
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },
  vite: { plugins: [tailwindcss()] },
});
