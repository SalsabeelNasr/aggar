import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { getWizardState } from '../helpers/store';

test.describe('State Persistence', () => {
  test('PERSIST-1: Data survives page reload', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();

    // Fill step 0
    await wizard.fillPropertySize(150);
    await wizard.toggleGatedCompound(true);
    await wizard.toggleLift(false);
    await wizard.clickNext();

    // Fill step 1
    await wizard.fillAddress('Test Address Here');
    await wizard.clickNext();

    // Now at step 2 — verify state is in localStorage
    const state = await getWizardState(page);
    expect(state?.currentStep).toBe(2);
    expect(state?.data?.propertySizeSqm).toBe(150);
    expect(state?.data?.address).toBe('Test Address Here');
  });

  test('PERSIST-2: Data persists in localStorage across navigation', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();

    await wizard.fillPropertySize(200);
    await wizard.toggleGatedCompound(false);
    await wizard.toggleLift(true);
    await wizard.clickNext();

    // Navigate away and back
    await page.goto('/en');
    await page.goto('/en/evaluate');
    await page.waitForLoadState('domcontentloaded');

    // Check localStorage still has the data
    const state = await getWizardState(page);
    expect(state?.data?.propertySizeSqm).toBe(200);
    expect(state?.data?.regulatory?.inGatedCompound).toBe(false);
  });
});
