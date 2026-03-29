import type { Page } from '@playwright/test';
import { MOCK_REPORT } from './mock-data';

interface MockOptions {
  status?: number;
  body?: unknown;
  delay?: number;
}

/**
 * Intercept POST /api/evaluate and return a mock response.
 * Must be called BEFORE the page makes the request (before or after goto is fine).
 */
export async function mockEvaluateApi(page: Page, options: MockOptions = {}) {
  const { status = 200, body = { report: MOCK_REPORT }, delay = 0 } = options;

  // Use glob pattern — matches only /api/evaluate exactly
  await page.route('**/api/evaluate', async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

/** Mock /api/evaluate to return a 500 error. */
export async function mockEvaluateApiError(page: Page) {
  await mockEvaluateApi(page, { status: 500, body: { error: 'Internal Server Error' } });
}
