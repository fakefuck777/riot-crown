import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PREVIEW_PORT ?? 4173);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx shopify hydrogen preview --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    // `hydrogen preview` cold start + CI runners can exceed 120s (GitHub Actions timeout).
    // Increased to 600s (10 minutes) for complex builds with 3D components
    timeout: 600_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
