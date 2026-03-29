import { test, expect } from '@playwright/test';
import { WizardPage } from '../helpers/wizard-page';
import { mockEvaluateApi } from '../helpers/api-mock';
import { getWizardState } from '../helpers/store';
import { VALID_CONTACT, MOCK_REPORT } from '../helpers/mock-data';

test.describe('Happy Path - Full Wizard Journeys', () => {
  test('HP-1: Non-furnished FINISHED_EMPTY full journey (EN)', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();

    // Step 0: Property
    await wizard.selectPropertyType('apartment');
    await wizard.fillPropertySize(120);
    await wizard.toggleGatedCompound(true);
    await wizard.toggleLift(true);
    await wizard.clickNext();

    // Step 1: Location (default new_cairo)
    await wizard.fillAddress('Mivida, Fifth Settlement');
    await wizard.clickNext();

    // Step 2: Listed (default not_listed)
    await wizard.clickNext();

    // Step 3: State — FINISHED_EMPTY
    await wizard.selectState('FINISHED_EMPTY');
    await wizard.selectFurnishingScope(['furniture', 'appliances']);
    await wizard.selectAesthetic('modern_minimalist');
    await wizard.togglePetFriendly(false);
    await wizard.selectInstallDeadline('weeks_4_8');
    await wizard.clickNext();

    // Step 4: Budget
    await wizard.selectBudgetBand(/50,000/);
    await wizard.selectFurnishingBudget(/Premium|500/i);
    await wizard.selectPaymentPreference(/Cash|package/i);
    await wizard.clickNext();

    // Step 5: Photos
    await wizard.uploadPhotos(1);
    await wizard.clickNext();

    // Step 6: Operations (default MANAGED)
    await wizard.clickNext();

    // Step 7: Contact (final step for non-furnished)
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 15000 });

    wizard.cleanup();
  });

  test('HP-2: Furnished MANAGED full journey (EN)', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();

    // Step 0
    await wizard.selectPropertyType('villa');
    await wizard.fillBedrooms(3);
    await wizard.fillBathrooms(2);
    await wizard.fillSleepCapacity(6);
    await wizard.fillPropertySize(200);
    await wizard.toggleGatedCompound(true);
    await wizard.toggleLift(false);
    await wizard.clickNext();

    // Step 1
    await wizard.fillAddress('Palm Hills');
    await wizard.clickNext();

    // Step 2: not listed
    await wizard.clickNext();

    // Step 3: FURNISHED
    await wizard.selectState('FURNISHED');
    await wizard.selectWaterHeating(/electric/i);
    await wizard.selectBeddingTier('hotel_style_white');
    await wizard.togglePetFriendly(true);
    await wizard.selectGuestPolicy(['mixed_groups_allowed']);
    await wizard.clickNext();

    // Step 4: Budget
    await wizard.selectBudgetBand(/50,000/);
    await wizard.clickNext();

    // Step 5: Photos + checklist
    await wizard.uploadPhotos(1);
    await wizard.selectPhotoChecklist(['balcony_window_view']);
    await wizard.clickNext();

    // Step 6: Operations — MANAGED
    await wizard.selectManagementMode('MANAGED');
    await wizard.clickNext();

    // Step 7: Pain Points (MANAGED)
    await wizard.selectPropertyManager('yes');
    await wizard.selectCleaningTeam('yes');
    await wizard.selectGuestAccess('smart_lock_or_lockbox');
    await wizard.selectFurnishedAreas(['kitchen', 'bathrooms']);
    await wizard.clickNext();

    // Step 8: Performance (MANAGED — minimal)
    await wizard.clickNext();

    // Step 9: Contact
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 15000 });

    wizard.cleanup();
  });

  test('HP-3: Listed property skips Step 3 (EN)', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();

    // Step 0
    await wizard.fillPropertySize(100);
    await wizard.toggleGatedCompound(false);
    await wizard.toggleLift(true);
    await wizard.clickNext();

    // Step 1
    await wizard.fillAddress('El Gouna Resort');
    await wizard.clickNext();

    // Step 2: listed_underperform (skips Step 3, implies FURNISHED)
    await wizard.selectListingStatus('listed_underperform');
    await wizard.clickNext();

    // Step 4: Budget (State skipped)
    await wizard.selectBudgetBand(/50,000/);
    await wizard.clickNext();

    // Step 5: Photos + furnished checklist
    await wizard.uploadPhotos(1);
    await wizard.selectPhotoChecklist(['balcony_window_view']);
    await wizard.clickNext();

    // Step 6: Operations — MANAGED
    await wizard.selectManagementMode('MANAGED');
    await wizard.clickNext();

    // Step 7: Pain Points (MANAGED)
    await wizard.selectPropertyManager('no');
    await wizard.selectCleaningTeam('no');
    await wizard.selectGuestAccess('bawab_concierge');
    await wizard.selectFurnishedAreas(['all']);
    await wizard.clickNext();

    // Step 8: Performance (MANAGED — minimal)
    await wizard.clickNext();

    // Step 9: Contact
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 15000 });

    wizard.cleanup();
  });

  test('HP-4: Non-furnished SHELL path (EN)', async ({ page }) => {
    const wizard = new WizardPage(page, 'en');
    await mockEvaluateApi(page);
    await wizard.goto();

    // Step 0
    await wizard.selectPropertyType('chalet');
    await wizard.fillBedrooms(1);
    await wizard.fillBathrooms(1);
    await wizard.fillSleepCapacity(2);
    await wizard.fillPropertySize(80);
    await wizard.toggleGatedCompound(false);
    await wizard.toggleLift(false);
    await wizard.clickNext();

    // Step 1
    await wizard.selectRegion('North Coast');
    await wizard.fillAddress('Hacienda Bay');
    await wizard.clickNext();

    // Step 2: not listed
    await wizard.clickNext();

    // Step 3: SHELL
    await wizard.selectState('SHELL');
    await wizard.selectFinishingLevel('semi_finished');
    await wizard.selectInfrastructure(['electricity_meter', 'water_meter']);
    await wizard.selectSmartHome('basic');
    await wizard.clickNext();

    // Step 4: Budget (SHELL)
    await wizard.selectBudgetBand(/50,000/);
    await wizard.selectBudgetPerSqm(/Economy|2,500/i);
    await wizard.selectFinancingPreference(/Lump sum|cash/i);
    await wizard.clickNext();

    // Step 5: Photos
    await wizard.uploadPhotos(1);
    await wizard.clickNext();

    // Step 6: Operations
    await wizard.clickNext();

    // Step 7: Contact
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 15000 });

    wizard.cleanup();
  });

  test('HP-5: Full journey in Arabic locale', async ({ page }) => {
    const wizard = new WizardPage(page, 'ar');
    await mockEvaluateApi(page);
    await wizard.goto();

    // Step 0
    await wizard.selectPropertyType('apartment');
    await wizard.fillPropertySize(120);
    await wizard.toggleGatedCompound(true);
    await wizard.toggleLift(true);
    await expect(wizard.getNextButton()).toHaveText(/التالي/);
    await wizard.clickNext();

    // Step 1
    await wizard.fillAddress('ميفيدا');
    await wizard.clickNext();

    // Step 2
    await wizard.clickNext();

    // Step 3: FINISHED_EMPTY
    await wizard.selectState('FINISHED_EMPTY');
    await wizard.selectFurnishingScope(['furniture', 'appliances']);
    await wizard.selectAesthetic('modern_minimalist');
    await wizard.togglePetFriendly(false);
    await wizard.selectInstallDeadline('weeks_4_8');
    await wizard.clickNext();

    // Step 4
    await wizard.selectBudgetBand(/٥٠/);
    await wizard.selectFurnishingBudget(/مميز|500/i);
    await wizard.selectPaymentPreference(/نقد/i);
    await wizard.clickNext();

    // Step 5
    await wizard.uploadPhotos(1);
    await wizard.clickNext();

    // Step 6
    await wizard.clickNext();

    // Step 7: Contact
    await wizard.fillContact(VALID_CONTACT.fullName, VALID_CONTACT.whatsapp, VALID_CONTACT.email);
    await expect(wizard.getGenerateButton()).toHaveText(/إنشاء تقريري/);
    await wizard.clickGenerateReport();

    await expect(page).toHaveURL(/\/results/, { timeout: 15000 });

    wizard.cleanup();
  });
});
