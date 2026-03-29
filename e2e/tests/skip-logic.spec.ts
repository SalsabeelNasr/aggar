import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { getWizardState } from '../helpers/store';

test.describe('Skip Logic and Navigation', () => {
  test('SKIP-1: Listed status skips Step 3, auto-sets FURNISHED', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(2);

    // Select "listed_doing_well"
    await wizard.selectListingStatus('listed_doing_well');
    await wizard.clickNext();

    // Should skip State step — verify Budget heading is showing
    await expect(page.getByText(/investment budget/i)).toBeVisible({ timeout: 5000 });

    // State should be FURNISHED
    const state = await getWizardState(page);
    expect(state?.data?.stateFlag).toBe('FURNISHED');
  });

  test('SKIP-2: Previous from Budget (when State skipped) returns to Listed', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(2);

    await wizard.selectListingStatus('listed_underperform');
    await wizard.clickNext();

    // Now on Budget, click Previous
    await wizard.clickPrev();

    // Should show Listed step heading
    await expect(page.getByText(/Is it listed/i).or(page.getByText(/listed yet/i))).toBeVisible({ timeout: 5000 });
  });

  test('SKIP-3: Stepper removes State label when skipped', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.quickFillToStep(2);

    await wizard.selectListingStatus('listed_doing_well');
    await wizard.clickNext();

    // Stepper should not show "State" label
    const stepper = wizard.getStepper();
    await expect(stepper).not.toContainText('State');
  });

  test('NAV-1: Previous from Step 0 navigates to home', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await wizard.goto();
    await wizard.clickPrev();
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});
