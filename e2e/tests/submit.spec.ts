import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { mockEvaluateApi, mockEvaluateApiError } from '../helpers/api-mock';
import { getWizardState } from '../helpers/store';
import { VALID_CONTACT } from '../helpers/mock-data';

test.describe('Submission Tests', () => {
  test('SUB-1: Successful submission redirects to results', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 10000 });

    const state = await getWizardState(page);
    expect(state?.resultsAccess).toBe('full');
    expect(state?.report).not.toBeNull();

    wizard.cleanup();
  });

  test('SUB-2: API error shows error banner', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApiError(page);
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(wizard.getSubmitError()).toBeVisible({ timeout: 5000 });
    await expect(wizard.getSubmitError()).toContainText('Could not generate the report');
    await expect(page).toHaveURL(/\/evaluate/);

    wizard.cleanup();
  });

  test('SUB-3: Invalid report (version≠1) shows error', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page, { body: { report: { version: 2 } } });
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(wizard.getSubmitError()).toBeVisible({ timeout: 5000 });
    await expect(wizard.getSubmitError()).toContainText('Could not generate the report');

    wizard.cleanup();
  });

  test('SUB-4: Loading state shows Generating and disables button', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page, { delay: 2000 });
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    const genButton = page.getByRole('button', { name: /Generating/i });
    await expect(genButton).toBeVisible({ timeout: 3000 });
    await expect(genButton).toBeDisabled();

    await expect(page).toHaveURL(/\/results/, { timeout: 10000 });

    wizard.cleanup();
  });

  test('SUB-5: diyGuideLead populated after success', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 10000 });

    const state = await getWizardState(page);
    expect(state?.diyGuideLead).not.toBeNull();
    expect(state?.diyGuideLead?.fullName).toBe(VALID_CONTACT.fullName);

    wizard.cleanup();
  });
});
