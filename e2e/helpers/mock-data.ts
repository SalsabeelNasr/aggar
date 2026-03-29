/**
 * Mock data for e2e tests — valid wizard data snapshots and mock report.
 */

export const VALID_CONTACT = {
  fullName: 'Test User',
  email: 'test@example.com',
  whatsapp: '+201234567890',
};

const BASE_DATA = {
  regionId: 'new_cairo',
  address: 'Mivida, Fifth Settlement',
  listingStatus: 'not_listed',
  propertyType: 'apartment',
  bedrooms: 2,
  bathrooms: 1,
  sleepCapacity: 4,
  acCoverage: 'adequate_functional',
  internetSpeed: 'fiber_100_plus',
  photoUpload: {
    files: [{ id: 'test-photo-1', url: 'blob:test', name: 'photo1.png' }],
    aiSignals: [],
  },
  hassleLevel: 5,
  mode: 'MANAGED',
  regulatory: {
    inGatedCompound: true,
    hasLift: true,
    floorNumber: 3,
    guestAccessSolution: undefined,
  },
  budgetBand: '50_150k',
  propertySizeSqm: 120,
};

/** Complete non-furnished FINISHED_EMPTY path data (8 steps, finalStep=7). */
export const VALID_FINISHED_EMPTY_DATA = {
  ...BASE_DATA,
  stateFlag: 'FINISHED_EMPTY',
  furnishingScope: ['furniture', 'appliances'],
  furnishingAesthetic: 'modern_minimalist',
  petFriendly: false,
  furnishingInstallDeadline: 'weeks_4_8',
  furnishingBudgetBand: 'premium_500_850k',
  furnishingPaymentPreference: 'cash_package_discount',
};

/** Complete non-furnished SHELL path data (8 steps, finalStep=7). */
export const VALID_SHELL_DATA = {
  ...BASE_DATA,
  stateFlag: 'SHELL',
  unfinishedFinishingLevel: 'semi_finished',
  unfinishedInfrastructure: ['electricity_meter', 'water_meter'],
  unfinishedSmartHome: 'basic',
  unfinishedBudgetPerSqm: 'economy',
  unfinishedFinancingPreference: 'lump_sum',
};

/** Complete furnished MANAGED path data (10 steps, finalStep=9). */
export const VALID_FURNISHED_DATA = {
  ...BASE_DATA,
  stateFlag: 'FURNISHED',
  furnishedUnitLuxe: {
    waterHeating: 'electric_standard',
    beddingTier: 'hotel_style_white',
    smartHomeLuxe: ['smart_lock_existing'],
  },
  petFriendly: true,
  guestPolicyAudiences: ['mixed_groups_allowed', 'couples_allowed'],
  furnishedPhotoChecklist: ['balcony_window_view'],
  hasPropertyManagerOrCompany: 'yes',
  hasDedicatedCleaningTeam: 'yes',
  regulatory: {
    inGatedCompound: true,
    hasLift: true,
    floorNumber: 3,
    guestAccessSolution: 'smart_lock_or_lockbox',
  },
  furnishedAreas: ['kitchen', 'bathrooms'],
  furnishedLeadQualification: {
    operationalPainIds: ['pain_operations'],
    monthlyRevenueEgp: 15000,
    occupancyBand: 'between_30_60',
    pricingStrategy: 'flat_rate',
    listingStack: 'channel_manager',
    cleaningSupport: 'trusted_cleaner',
    guestResponseTime: 'under_5_min',
  },
};

/** Listed property data (skips step 3, stateFlag auto-set to FURNISHED). */
export const VALID_LISTED_DATA = {
  ...VALID_FURNISHED_DATA,
  listingStatus: 'listed_underperform',
};

export const VALID_LEAD = {
  fullName: VALID_CONTACT.fullName,
  email: VALID_CONTACT.email,
  whatsapp: VALID_CONTACT.whatsapp,
  preferredContactTime: 'afternoon',
  consentToPartnerNetwork: false,
};

/** Minimal valid mock report matching EvaluationReport with version:1 + cardInsights. */
export const MOCK_REPORT = {
  version: 1,
  createdAtISO: '2026-01-01T00:00:00.000Z',
  wizardData: VALID_FINISHED_EMPTY_DATA,
  ruleResult: {
    score: 75,
    readinessLabel: { en: 'Ready', ar: 'جاهز' },
    flags: [],
    signals: [],
  },
  packageSet: {
    quick_start: { type: 'quick_start', enabled: [], totalEgp: 0, label: { en: 'Quick Start', ar: 'بداية سريعة' } },
    sweet_spot: { type: 'sweet_spot', enabled: [], totalEgp: 0, label: { en: 'Sweet Spot', ar: 'الخيار الأمثل' } },
    asset_flip: { type: 'asset_flip', enabled: [], totalEgp: 0, label: { en: 'Asset Flip', ar: 'تحويل العقار' } },
    custom: { type: 'custom', enabled: [], totalEgp: 0, label: { en: 'Custom', ar: 'مخصص' } },
  },
  region: {
    id: 'new_cairo',
    name: { en: 'New Cairo', ar: 'القاهرة الجديدة' },
    avgOccupancy: 65,
    avgNightlyRate: 120,
    premiumLevel: 'high',
    bestFitAudiences: [],
    topPropertyTypes: [],
    seasonalityNotes: { en: '', ar: '' },
    marketFact: { en: '', ar: '' },
  },
  areaMarketBaselines: { nightlyRateEgp: 3500, occupancyPct: 65 },
  revenueByPackage: {
    quick_start: { monthlyGrossEgp: 10000, annualGrossEgp: 120000 },
    sweet_spot: { monthlyGrossEgp: 15000, annualGrossEgp: 180000 },
    asset_flip: { monthlyGrossEgp: 20000, annualGrossEgp: 240000 },
    custom: { monthlyGrossEgp: 12000, annualGrossEgp: 144000 },
  },
  planFinancialsByPackage: {
    quick_start: { breakEvenMonths: { min: 6, max: 9 }, year1ProjectedNet: { min: 80000, max: 100000 } },
    sweet_spot: { breakEvenMonths: { min: 4, max: 7 }, year1ProjectedNet: { min: 120000, max: 150000 } },
    asset_flip: { breakEvenMonths: { min: 8, max: 12 }, year1ProjectedNet: { min: 180000, max: 220000 } },
    custom: { breakEvenMonths: { min: 5, max: 8 }, year1ProjectedNet: { min: 90000, max: 120000 } },
  },
  cardInsights: {
    neighbours: {
      typicalMonthlyUsd: 800,
      top10MonthlyUsd: 1500,
      peakSeasonNote: { en: 'Peak in summer', ar: 'الذروة في الصيف' },
    },
    readinessNarrative: { en: 'Good to go.', ar: 'جاهز للانطلاق.' },
    propertyAnalysisBullets: [
      { en: 'Well located', ar: 'موقع ممتاز' },
      { en: 'Good amenities', ar: 'مرافق جيدة' },
    ],
  },
};
