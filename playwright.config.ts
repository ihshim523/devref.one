import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:8765',
    viewport: { width: 1280, height: 720 },
    headless: true,
  },
  webServer: {
    command: 'python3 -m http.server 8765 --directory out',
    port: 8765,
    timeout: 10000,
    reuseExistingServer: true,
  },
});
