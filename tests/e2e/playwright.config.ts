import { defineConfig, devices } from '@playwright/test';

// El frontend (Vite) debe estar en :5173 y el backend en :8080 con la BD cargada con DS-01.
// Los reportes quedan en tests/e2e/playwright-report y tests/e2e/test-results.
export default defineConfig({
  testDir: './specs',
  outputDir: './test-results',
  // Los specs comparten una sola BD y varios asumen DS-01 exacto: un solo worker, en orden.
  fullyParallel: false,
  workers: 1,
  // Con retries = 1 el trace "on-first-retry" se genera para todo fallo real.
  retries: 1,
  forbidOnly: !!process.env.CI,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    // Para video el equivalente de "only-on-failure" es "retain-on-failure".
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    cwd: '../../Frontend',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
