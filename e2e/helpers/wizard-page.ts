import { type Page, type Locator } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

type Locale = 'en' | 'ar';

/**
 * Page Object Model for the Evaluate Wizard page.
 */
export class WizardPage {
  readonly page: Page;
  readonly locale: Locale;
  readonly basePath: string;

  constructor(page: Page, locale: Locale = 'en') {
    this.page = page;
    this.locale = locale;
    // Use explicit locale prefix for both locales to avoid middleware redirects
    this.basePath = locale === 'en' ? '/en/evaluate' : '/ar/evaluate';
  }

  // ─── Navigation ────────────────────────────────────────────

  async goto() {
    await this.page.goto(this.basePath);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** The bottom nav bar containing Previous/Next buttons */
  private get navBar() {
    return this.page.locator('.sticky.bottom-4');
  }

  async clickNext() {
    const text = this.locale === 'ar' ? 'التالي' : 'Next';
    await this.navBar.getByRole('button', { name: text }).click();
  }

  async clickPrev() {
    const loc =
      this.locale === 'ar'
        ? this.navBar.getByRole('button', { name: 'السابق' }).or(this.navBar.getByRole('button', { name: 'رجوع' }))
        : this.navBar.getByRole('button', { name: 'Previous' }).or(this.navBar.getByRole('button', { name: 'Back' }));
    await loc.click();
  }

  async clickGenerateReport() {
    const text = this.locale === 'ar' ? 'إنشاء تقريري' : 'Generate my report';
    await this.navBar.getByRole('button', { name: text }).click();
  }

  getNextButton(): Locator {
    return this.navBar.getByRole('button', { name: this.locale === 'ar' ? 'التالي' : 'Next' });
  }

  getGenerateButton(): Locator {
    return this.navBar.getByRole('button', { name: this.locale === 'ar' ? 'إنشاء تقريري' : 'Generate my report' });
  }

  // ─── Error Selectors ──────────────────────────────────────

  getErrorBanner(): Locator {
    return this.page.locator('[role="alert"]');
  }

  getSubmitError(): Locator {
    return this.page.locator('.border-red-200.bg-red-50');
  }

  // ─── Step 0: Property / Asset ─────────────────────────────

  async selectPropertyType(type: 'apartment' | 'villa' | 'chalet' | 'studio') {
    const labels: Record<string, Record<Locale, string>> = {
      apartment: { en: 'Apartment', ar: 'شقة' },
      villa: { en: 'Villa', ar: 'فيلا' },
      chalet: { en: 'Chalet', ar: 'شاليه' },
      studio: { en: 'Studio', ar: 'ستوديو' },
    };
    await this.page.getByRole('button', { name: labels[type][this.locale] }).click();
  }

  // Number inputs: labels lack htmlFor, so use min/max attributes for reliable selection
  async fillBedrooms(n: number) {
    await this.page.locator('input[type="number"][min="0"][max="10"]').first().fill(String(n));
  }

  async fillBathrooms(n: number) {
    await this.page.locator('input[type="number"][min="1"][max="10"]').fill(String(n));
  }

  async fillSleepCapacity(n: number) {
    await this.page.locator('input[type="number"][min="1"][max="20"]').fill(String(n));
  }

  async fillPropertySize(n: number) {
    await this.page.locator('input[type="number"][min="10"][max="2000"]').first().fill(String(n));
  }

  async toggleGatedCompound(value: boolean) {
    const ariaLabel = this.locale === 'ar' ? /كمبوند/ : /gated compound/i;
    const toggle = this.page.getByRole('switch', { name: ariaLabel });
    // Always click once first to set an explicit boolean (initial state may be undefined)
    await toggle.click();
    const checked = await toggle.getAttribute('aria-checked');
    if ((checked === 'true') !== value) {
      await toggle.click();
    }
  }

  async toggleLift(value: boolean) {
    const ariaLabel = this.locale === 'ar' ? /مصعد/ : /lift/i;
    const toggle = this.page.getByRole('switch', { name: ariaLabel });
    await toggle.click();
    const checked = await toggle.getAttribute('aria-checked');
    if ((checked === 'true') !== value) {
      await toggle.click();
    }
  }

  // ─── Step 1: Location ─────────────────────────────────────

  async selectRegion(regionLabel: string) {
    // Regions load asynchronously. Wait for buttons to appear.
    const button = this.page.getByRole('button', { name: regionLabel });
    await button.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await button.isVisible()) {
      await button.click();
    } else {
      await this.page.locator('select').first().selectOption({ label: regionLabel });
    }
  }

  async fillAddress(text: string) {
    const placeholder = this.locale === 'ar' ? 'مثال: ميفيدا، التجمع الخامس' : 'e.g., Mivida, Fifth Settlement';
    await this.page.locator(`input[placeholder="${placeholder}"]`).fill(text);
  }

  // ─── Step 2: Listing Status ───────────────────────────────

  async selectListingStatus(option: 'not_listed' | 'listed_doing_well' | 'listed_underperform' | 'listed_barely_any_bookings') {
    const labels: Record<string, Record<Locale, RegExp>> = {
      not_listed: { en: /not listed/i, ar: /ليس مُعلن/ },
      listed_doing_well: { en: /doing well/i, ar: /الأداء ممتاز/ },
      listed_underperform: { en: /not getting enough/i, ar: /الحجوزات ضعيفة/ },
      listed_barely_any_bookings: { en: /barely any/i, ar: /بالكاد/ },
    };
    await this.page.getByRole('button', { name: labels[option][this.locale] }).click();
  }

  // ─── Step 3: Property State ───────────────────────────────

  async selectState(flag: 'SHELL' | 'FINISHED_EMPTY' | 'FURNISHED') {
    // Use exact heading text to avoid "Finished" matching both "Finished (unfurnished)" and "Furnished"
    const labels: Record<string, Record<Locale, string>> = {
      SHELL: { en: 'Shell', ar: 'عظم' },
      FINISHED_EMPTY: { en: 'Finished (unfurnished)', ar: 'تشطيب كامل (غير مفروش)' },
      FURNISHED: { en: 'Furnished', ar: 'مفروش' },
    };
    // Click the button that contains the exact heading text
    const heading = this.page.locator('h3', { hasText: new RegExp(`^${labels[flag][this.locale].replace(/[()]/g, '\\$&')}$`) });
    await heading.click();
  }

  // SHELL sub-fields (selects have ids)
  async selectFinishingLevel(option: string) {
    await this.page.locator('#shell-finishing-level').selectOption(option);
  }

  async selectInfrastructure(options: string[]) {
    for (const opt of options) {
      const labels: Record<string, Record<Locale, RegExp>> = {
        electricity_meter: { en: /electricity/i, ar: /كهرباء/ },
        water_meter: { en: /water meter/i, ar: /مياه/ },
        natural_gas: { en: /natural gas/i, ar: /غاز/ },
        fiber_ready: { en: /fiber/i, ar: /فايبر/ },
      };
      await this.page.getByRole('button', { name: labels[opt][this.locale] }).click();
    }
  }

  async selectSmartHome(option: string) {
    await this.page.locator('#shell-smart-home').selectOption(option);
  }

  // FINISHED_EMPTY sub-fields
  async selectFurnishingScope(options: string[]) {
    // choiceRow variant uses checkboxes inside labels
    for (const opt of options) {
      const labels: Record<string, Record<Locale, RegExp>> = {
        furniture: { en: /Furniture/i, ar: /أثاث/ },
        appliances: { en: /Appliances/i, ar: /أجهزة/ },
        styling_decor: { en: /Styling|decor/i, ar: /ستايل|ديكور/ },
      };
      await this.page.getByText(labels[opt][this.locale]).click();
    }
  }

  async selectAesthetic(option: string) {
    const labels: Record<string, Record<Locale, string>> = {
      modern_minimalist: { en: 'Modern', ar: 'مودرن' },
      boho: { en: 'Boho', ar: 'بوهو' },
      hotel_like: { en: 'Hotel', ar: 'فندق' },
      coastal: { en: 'Coastal', ar: 'ساحلي' },
      industrial: { en: 'Artistic', ar: 'فني' },
      fun: { en: 'Fun', ar: 'مرح' },
      classic: { en: 'Classic', ar: 'كلاسيك' },
    };
    // The design carousel has its own Previous/Next buttons, so use exact name match
    await this.page.getByRole('button', { name: labels[option][this.locale], exact: true }).click();
  }

  async togglePetFriendly(value: boolean) {
    const ariaLabel = this.locale === 'ar' ? /حيوانات/ : /pet-?friendly/i;
    const toggle = this.page.getByRole('switch', { name: ariaLabel });
    // Always click once to set an explicit boolean (initial state may be undefined)
    // Then click again if the result doesn't match the desired value
    await toggle.click();
    const checked = await toggle.getAttribute('aria-checked');
    if ((checked === 'true') !== value) {
      await toggle.click();
    }
  }

  async selectInstallDeadline(option: string) {
    // Has id="furnishing-install-deadline"
    await this.page.locator('#furnishing-install-deadline').selectOption(option);
  }

  // FURNISHED sub-fields
  async selectWaterHeating(optionText: RegExp) {
    // Radio list with name="furnishedWaterHeating"
    await this.page.getByText(optionText).click();
  }

  async selectBeddingTier(option: string) {
    // Has id="furnished-bedding-tier"
    await this.page.locator('#furnished-bedding-tier').selectOption(option);
  }

  async selectGuestPolicy(options: string[]) {
    for (const opt of options) {
      const labels: Record<string, Record<Locale, RegExp>> = {
        mixed_groups_allowed: { en: /mixed/i, ar: /مختلطة/ },
        couples_allowed: { en: /couples/i, ar: /أزواج/ },
        families_marriage_cert_only: { en: /families/i, ar: /عائلات/ },
        egyptians_only: { en: /egyptians only/i, ar: /مصريين فقط/ },
        non_egyptians_only: { en: /non.?egyptians/i, ar: /غير مصريين/ },
      };
      // Checkboxes inside labels
      await this.page.getByText(labels[opt][this.locale]).click();
    }
  }

  // ─── Step 4: Budget ───────────────────────────────────────

  async selectBudgetBand(label: RegExp) {
    // Budget band buttons have text inside a <span>, getByText is more reliable
    await this.page.locator('button').filter({ hasText: label }).first().click();
  }

  // Radio buttons are React-controlled. Click the label (not the input) to trigger onChange.
  async selectBudgetPerSqm(optionText: RegExp) {
    await this.page.locator('label').filter({ hasText: optionText }).filter({ has: this.page.locator('input[name="unfinishedBudgetPerSqm"]') }).click();
  }

  async selectFinancingPreference(optionText: RegExp) {
    await this.page.locator('label').filter({ hasText: optionText }).filter({ has: this.page.locator('input[name="unfinishedFinancingPreference"]') }).click();
  }

  async selectFurnishingBudget(optionText: RegExp) {
    await this.page.locator('label').filter({ hasText: optionText }).filter({ has: this.page.locator('input[name="furnishingBudgetBand"]') }).click();
  }

  async selectPaymentPreference(optionText: RegExp) {
    await this.page.locator('label').filter({ hasText: optionText }).filter({ has: this.page.locator('input[name="furnishingPaymentPreference"]') }).click();
  }

  // ─── Step 5: Photos ───────────────────────────────────────

  private _tmpDir: string | null = null;

  async createTestPhoto(name = 'test-photo.png'): Promise<string> {
    if (!this._tmpDir) {
      this._tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wizard-e2e-'));
    }
    const filePath = path.join(this._tmpDir, name);
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(filePath, png);
    return filePath;
  }

  async uploadPhotos(count = 1) {
    const paths: string[] = [];
    for (let i = 0; i < count; i++) {
      paths.push(await this.createTestPhoto(`photo-${i}.png`));
    }
    await this.page.locator('#wizard-photo-upload').setInputFiles(paths);
  }

  async selectPhotoChecklist(options: string[]) {
    for (const opt of options) {
      const labels: Record<string, Record<Locale, RegExp>> = {
        balcony_window_view: { en: /View from balcony/i, ar: /الإطلالة من البلكونة/ },
        kitchen_cabinets_cleanliness_proof: { en: /kitchen.*cabinets/i, ar: /خزائن.*المطبخ/ },
        mattress_pillows_hotel_tuck: { en: /mattress|pillows/i, ar: /مرتبة|مخدات/ },
        smart_lock_keyless_entry: { en: /smart lock/i, ar: /قفل ذكي/ },
        wifi_speed_screenshot_or_router: { en: /wi-?fi|speed/i, ar: /واي فاي|سرعة/ },
        fire_safety_smoke_detectors: { en: /fire safety|smoke/i, ar: /سلامة.*حريق|دخان/ },
      };
      // Checkboxes in labels
      await this.page.getByText(labels[opt][this.locale]).click();
    }
  }

  // ─── Step 6: Operations ───────────────────────────────────

  async selectManagementMode(mode: 'MANAGED' | 'DIY_ASSISTED' | 'DIY_FULL') {
    const labels: Record<string, Record<Locale, RegExp>> = {
      MANAGED: { en: /management company/i, ar: /شركة تشغيل/ },
      DIY_ASSISTED: { en: /co-?management/i, ar: /إدارة مشتركة/ },
      DIY_FULL: { en: /Full DIY/i, ar: /DIY كامل/ },
    };
    await this.page.getByRole('button', { name: labels[mode][this.locale] }).click();
  }

  // ─── Step 7: Pain Points (Furnished) ─────────────────────

  async selectPropertyManager(value: 'yes' | 'no') {
    // YesNoSwitchRow toggle — initial state is undefined, click sets to 'yes', click again sets to 'no'
    const ariaLabel = this.locale === 'ar'
      ? 'تبديل: مدير عقار أو شركة إدارة'
      : 'Toggle: property manager or management company';
    const toggle = this.page.getByRole('switch', { name: ariaLabel });
    // Click to set from undefined → 'yes'
    await toggle.click();
    if (value === 'no') {
      // Click again to toggle to 'no'
      await toggle.click();
    }
  }

  async selectCleaningTeam(value: 'yes' | 'no') {
    const ariaLabel = this.locale === 'ar'
      ? 'تبديل: فريق نظافة لمغادرة الضيوف'
      : 'Toggle: cleaning team for turnovers';
    const toggle = this.page.getByRole('switch', { name: ariaLabel });
    await toggle.click();
    if (value === 'no') {
      await toggle.click();
    }
  }

  async selectGuestAccess(option: string) {
    // GuestAccessReliabilityChoice renders card buttons with headings
    const labels: Record<string, Record<Locale, RegExp>> = {
      bawab_concierge: { en: /Bawab|concierge/i, ar: /بواب|كونسيرج/ },
      smart_lock_or_lockbox: { en: /Smart lock|lockbox/i, ar: /قفل ذكي|صندوق/ },
      none: { en: /Not yet/i, ar: /ليس بعد/ },
    };
    await this.page.getByRole('button', { name: labels[option][this.locale] }).click();
  }

  async selectFurnishedAreas(areas: string[]) {
    for (const area of areas) {
      const labels: Record<string, Record<Locale, string>> = {
        kitchen: { en: 'Kitchen', ar: 'المطبخ' },
        bathrooms: { en: 'Bathrooms', ar: 'الحمامات' },
        walls_paint: { en: 'Walls & paint', ar: 'الحوائط والدهان' },
        electrical: { en: 'Electrical', ar: 'الكهرباء' },
        ac_units: { en: 'AC units', ar: 'التكييفات' },
        all: { en: 'All of it', ar: 'كل شيء' },
      };
      const btn = this.page.getByRole('button', { name: labels[area][this.locale], exact: true });
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
    }
  }

  async selectOperationalPains(pains: string[]) {
    for (const pain of pains) {
      const labels: Record<string, Record<Locale, RegExp>> = {
        pain_operations: { en: /Operations/i, ar: /العمليات/ },
        pain_management: { en: /Management/i, ar: /الإدارة/ },
        pain_financial: { en: /Financial/i, ar: /المالية/ },
        pain_compliance: { en: /Compliance/i, ar: /الامتثال/ },
        pain_restocking_consumables: { en: /Restocking/i, ar: /إعادة التموين/ },
      };
      await this.page.getByText(labels[pain][this.locale]).click();
    }
  }

  // ─── Step 8: Furnished Performance ────────────────────────

  async selectListingStack(option: string) {
    // Multiple selects on page, listing stack is typically first
    await this.page.locator('select').first().selectOption(option);
  }

  async fillMonthlyRevenue(amount: number) {
    await this.page.locator('input[type="number"]').fill(String(amount));
  }

  async selectOccupancyBand(option: string) {
    await this.page.locator('select').last().selectOption(option);
  }

  async selectPricingStrategy(optionText: RegExp) {
    await this.page.getByText(optionText).click();
  }

  // ─── Contact Step ─────────────────────────────────────────

  async fillContact(fullName: string, whatsapp: string, email: string) {
    // Full name has htmlFor linking, so getByLabel works
    await this.page.getByLabel(this.locale === 'ar' ? 'الاسم بالكامل' : 'Full Name').fill(fullName);
    // WhatsApp might use a phone input component; try by label then fall back
    const whatsappInput = this.page.getByLabel(this.locale === 'ar' ? 'رقم واتساب' : 'WhatsApp number');
    await whatsappInput.fill(whatsapp);
    // Email
    await this.page.getByLabel(this.locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address').fill(email);
  }

  // ─── Quick Fill Helpers ────────────────────────────────────

  /**
   * Quickly fill required fields for a FINISHED_EMPTY non-furnished path
   * and advance to the specified step. Starts from step 0.
   */
  async quickFillToStep(targetStep: number, opts?: { state?: 'FINISHED_EMPTY' | 'SHELL' | 'FURNISHED' }) {
    const state = opts?.state ?? 'FINISHED_EMPTY';

    if (targetStep <= 0) return;

    // Step 0: Property
    await this.fillPropertySize(120);
    await this.toggleGatedCompound(true);
    await this.toggleLift(true);
    await this.clickNext();

    if (targetStep <= 1) return;

    // Step 1: Location
    await this.fillAddress('Test Address');
    await this.clickNext();

    if (targetStep <= 2) return;

    // Step 2: Listed (default not_listed, just advance)
    await this.clickNext();

    if (targetStep <= 3) return;

    // Step 3: State
    if (state === 'FINISHED_EMPTY') {
      await this.selectState('FINISHED_EMPTY');
      await this.selectFurnishingScope(['furniture']);
      await this.selectAesthetic('Modern');
      await this.togglePetFriendly(false);
      await this.selectInstallDeadline('weeks_4_8');
    } else if (state === 'SHELL') {
      await this.selectState('SHELL');
      await this.selectFinishingLevel('semi_finished');
      await this.selectInfrastructure(['electricity_meter']);
      await this.selectSmartHome('basic');
    } else if (state === 'FURNISHED') {
      await this.selectState('FURNISHED');
      await this.selectWaterHeating(/electric/i);
      await this.selectBeddingTier('hotel_style_white');
      await this.togglePetFriendly(true);
      await this.selectGuestPolicy(['mixed_groups_allowed']);
    }
    await this.clickNext();

    if (targetStep <= 4) return;

    // Step 4: Budget
    await this.selectBudgetBand(/50,000/);
    if (state === 'FINISHED_EMPTY') {
      await this.selectFurnishingBudget(/Premium|500/i);
      await this.selectPaymentPreference(/Cash|package/i);
    } else if (state === 'SHELL') {
      await this.selectBudgetPerSqm(/Economy|2,500/i);
      await this.selectFinancingPreference(/Lump sum|cash/i);
    }
    await this.clickNext();

    if (targetStep <= 5) return;

    // Step 5: Photos
    await this.uploadPhotos(1);
    if (state === 'FURNISHED') {
      await this.selectPhotoChecklist(['balcony_window_view']);
    }
    await this.clickNext();

    if (targetStep <= 6) return;

    // Step 6: Operations (default MANAGED)
    await this.clickNext();

    // For FURNISHED path, steps 7-8 are pain points and performance
    if (state === 'FURNISHED' && targetStep >= 7) {
      // Step 7: Pain Points
      await this.selectPropertyManager('yes');
      await this.selectCleaningTeam('yes');
      await this.selectGuestAccess('smart_lock_or_lockbox');
      await this.selectFurnishedAreas(['kitchen']);
      await this.clickNext();

      if (targetStep <= 8) return;

      // Step 8: Performance (MANAGED - minimal)
      await this.clickNext();
    }
  }

  // ─── Stepper ──────────────────────────────────────────────

  getStepper(): Locator {
    return this.page.locator('.mb-12').first();
  }

  // ─── Cleanup ──────────────────────────────────────────────

  cleanup() {
    if (this._tmpDir && fs.existsSync(this._tmpDir)) {
      fs.rmSync(this._tmpDir, { recursive: true, force: true });
    }
  }
}
