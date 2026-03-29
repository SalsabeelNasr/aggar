import type { Page } from '@playwright/test';

const STORAGE_KEY = 'aggar-evaluation-v10';

interface PersistedState {
  data: Record<string, unknown>;
  currentStep: number;
  lead: Record<string, unknown>;
  diyGuideLead: Record<string, unknown> | null;
  report: Record<string, unknown> | null;
  resultsAccess: 'teaser' | 'full';
}

const DEFAULT_LEAD = {
  fullName: '',
  email: '',
  whatsapp: '',
  preferredContactTime: 'afternoon',
  consentToPartnerNetwork: false,
};

/**
 * Seed the Zustand persisted store via addInitScript so it's available
 * before the page JS runs. Must be called BEFORE page.goto().
 */
export async function seedWizardState(
  page: Page,
  overrides: {
    data?: Record<string, unknown>;
    currentStep?: number;
    lead?: Record<string, unknown>;
    report?: Record<string, unknown> | null;
    resultsAccess?: 'teaser' | 'full';
  }
) {
  const state: PersistedState = {
    data: overrides.data ?? {},
    currentStep: overrides.currentStep ?? 0,
    lead: overrides.lead ?? DEFAULT_LEAD,
    diyGuideLead: null,
    report: overrides.report ?? null,
    resultsAccess: overrides.resultsAccess ?? 'teaser',
  };

  const serialized = JSON.stringify({ state, version: 0 });

  // addInitScript runs before any page JS — ensures Zustand sees the seeded state
  await page.addInitScript(
    ([key, val]) => {
      localStorage.setItem(key, val);
    },
    [STORAGE_KEY, serialized] as const
  );
}

/** Read the persisted wizard state from localStorage. */
export async function getWizardState(page: Page): Promise<PersistedState | null> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw).state ?? null;
    } catch {
      return null;
    }
  }, STORAGE_KEY);
}

/** Clear the persisted wizard state from localStorage. */
export async function clearWizardState(page: Page) {
  // Use addInitScript to clear BEFORE page JS runs
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
}
