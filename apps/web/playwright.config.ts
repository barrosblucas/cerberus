import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  webServer: [
    {
      command: "pnpm --filter @app/api dev",
      port: 5500,
      reuseExistingServer: true,
    },
    {
      command: "pnpm --filter @app/web dev --host",
      port: 3000,
      reuseExistingServer: true,
    },
  ],
});
