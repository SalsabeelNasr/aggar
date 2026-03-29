import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { mockEvaluateApi } from '../helpers/api-mock';
import { VALID_CONTACT } from '../helpers/mock-data';

test.describe('Validation Tests', () => {
  test('V-0: Step 0 — required fields validation', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();

    // propertySizeSqm is undefined, inGatedCompound and hasLift undefined
    await wizard.clickNext();

    await expect(wizard.getErrorBanner()).toBeVisible();
    await expect(page.getByText('Please complete this field')).toBeVisible();
    await expect(page.getByText('Choose an option')).toBeVisible();
  });

  test('V-1: Step 1 — Address min 2 chars', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(1);

    // Clear address and try to advance
    await wizard.fillAddress('');
    await wizard.clickNext();
    await expect(wizard.getErrorBanner()).toBeVisible();

    // Single char
    await wizard.fillAddress('A');
    await wizard.clickNext();
    await expect(wizard.getErrorBanner()).toBeVisible();

    // 2+ chars passes
    await wizard.fillAddress('AB');
    await wizard.clickNext();
    await expect(wizard.getErrorBanner()).not.toBeVisible();
  });

  test('V-3a: Step 3 SHELL — missing sub-fields', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(3);

    // Select SHELL but don't fill sub-fields
    await wizard.selectState('SHELL');
    await wizard.clickNext();

    await expect(wizard.getErrorBanner()).toBeVisible();
    await expect(page.getByText('Choose an option')).toBeVisible();
    await expect(page.getByText('Select at least one option')).toBeVisible();
  });

  test('V-3b: Step 3 FINISHED_EMPTY — missing sub-fields', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(3);

    // FINISHED_EMPTY is default but sub-fields are empty
    await wizard.selectState('FINISHED_EMPTY');
    await wizard.clickNext();

    await expect(wizard.getErrorBanner()).toBeVisible();
    await expect(page.getByText('Select at least one option')).toBeVisible();
    await expect(page.getByText('Choose an option')).toBeVisible();
  });

  test('V-5: Step 5 — no photos', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(5);

    // Don't upload photos, try to advance
    await wizard.clickNext();

    await expect(wizard.getErrorBanner()).toBeVisible();
    await expect(page.getByText(/Upload and finish photo analysis/i)).toBeVisible();

    wizard.cleanup();
  });

  test('V-Contact: Contact form validation', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();
    await wizard.quickFillToStep(7);

    // Click Generate without filling contact
    await wizard.clickGenerateReport();

    // Should show validation errors
    await expect(page.getByText(/full name/i)).toBeVisible();

    // Fill valid data
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();
    await expect(page).toHaveURL(/\/results/, { timeout: 10000 });

    wizard.cleanup();
  });
});
