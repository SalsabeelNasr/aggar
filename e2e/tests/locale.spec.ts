import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { mockEvaluateApiError } from '../helpers/api-mock';
import { VALID_CONTACT } from '../helpers/mock-data';

test.describe('Locale Tests', () => {
  test('L-1: EN wizard renders English labels', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();

    await expect(wizard.getNextButton()).toBeVisible();
    await expect(wizard.getNextButton()).toHaveText(/Next/);
  });

  test('L-2: AR wizard renders Arabic labels', async ({ page }) => {
    const wizard = new WizardPage(page, 'ar');
    await wizard.goto();

    await expect(wizard.getNextButton()).toBeVisible();
    await expect(wizard.getNextButton()).toHaveText(/التالي/);
  });

  test('L-3: EN validation errors are in English', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.clickNext();

    await expect(page.getByText('Choose an option')).toBeVisible();
    await expect(page.getByText('Please complete this field')).toBeVisible();
  });

  test('L-4: AR validation errors are in Arabic', async ({ page }) => {
    const wizard = new WizardPage(page, 'ar');
    await wizard.goto();
    await wizard.clickNext();

    await expect(page.getByText('اختر خيارًا')).toBeVisible();
    await expect(page.getByText('يرجى إكمال هذا الحقل')).toBeVisible();
  });

  test('L-5: AR submit error is in Arabic', async ({ page }) => {
    const wizard = new WizardPage(page, 'ar');
    await mockEvaluateApiError(page);
    await wizard.goto();
    await wizard.quickFillToStep(7);

    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(wizard.getSubmitError()).toBeVisible({ timeout: 5000 });
    await expect(wizard.getSubmitError()).toContainText('تعذر إنشاء التقرير');

    wizard.cleanup();
  });
});
