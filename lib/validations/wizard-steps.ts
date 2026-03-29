import type { ManagementMode, WizardData } from '@/models';
import { listingStatusSkipsPropertyStateStep } from '@/models';
import { isFurnishedPerformanceSectionVisible } from '@/lib/wizard/furnishedPerformanceVisibility';

export type WizardStepValidationResult = { ok: true } | { ok: false; errors: Record<string, string> };

type Locale = 'en' | 'ar';

const T = {
  en: {
    selectOption: 'Choose an option',
    fillField: 'Please complete this field',
    selectAtLeastOne: 'Select at least one option',
    zipPhotos: 'Upload and finish photo analysis',
    furnishedChecklist: 'Select at least one photo you can provide',
  },
  ar: {
    selectOption: 'اختار خيار',
    fillField: 'يا ريت تكمل الخانة دي',
    selectAtLeastOne: 'اختار خيار واحد على الأقل',
    zipPhotos: 'ارفع الصور وخلص التحليل',
    furnishedChecklist: 'اختار صورة واحدة على الأقل تقدر توفرها',
  },
} as const;

function m(locale: Locale) {
  return T[locale];
}

function fail(errors: Record<string, string>): WizardStepValidationResult {
  return { ok: false, errors };
}

export function validateEvaluationStep(params: {
  currentStep: number;
  data: WizardData;
  isFurnished: boolean;
  finalStep: number;
  locale: Locale;
}): WizardStepValidationResult {
  const { currentStep, data, isFurnished, finalStep, locale } = params;
  /** Final summary step: no extra validation here. */
  if (currentStep === finalStep) return { ok: true };

  switch (currentStep) {
    case 0:
      return validateStepAsset(data, locale);
    case 1:
      return validateStepLocation(data, locale);
    case 2:
      return validateStepListed(data, locale);
    case 3:
      if (listingStatusSkipsPropertyStateStep(data.listingStatus)) return { ok: true };
      return validateStepState(data, locale);
    case 4:
      return validateStepBudgetSize(data, locale);
    case 5:
      return validateStepPhotos(data, locale);
    case 6:
      return validateStepHassle(data, locale);
    case 7:
      if (isFurnished) return validateStepPainPoints(data, locale);
      return { ok: true };
    case 8:
      if (isFurnished) return validateStepFurnishedPerformance(data, locale);
      return { ok: true };
    default:
      return { ok: true };
  }
}

function validateStepAsset(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  if (!data.propertyType) errors.propertyType = s.selectOption;
  const br = data.bedrooms;
  if (br == null || Number.isNaN(br) || br < 0 || br > 10) errors.bedrooms = s.fillField;
  const bath = data.bathrooms;
  if (bath == null || Number.isNaN(bath) || bath < 1 || bath > 10) errors.bathrooms = s.fillField;
  const sleep = data.sleepCapacity;
  if (sleep == null || Number.isNaN(sleep) || sleep < 1 || sleep > 20) errors.sleepCapacity = s.fillField;
  if (typeof data.regulatory?.inGatedCompound !== 'boolean') errors.inGatedCompound = s.selectOption;
  if (typeof data.regulatory?.hasLift !== 'boolean') errors.hasLift = s.selectOption;
  return Object.keys(errors).length ? fail(errors) : { ok: true };
}

function validateStepLocation(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  if (!data.regionId || data.regionId === 'other') errors.regionId = s.selectOption;
  const addr = (data.address ?? '').trim();
  if (addr.length < 2) errors.address = s.fillField;
  return Object.keys(errors).length ? fail(errors) : { ok: true };
}

function validateStepListed(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  if (!data.listingStatus) errors.listingStatus = s.selectOption;
  if (Object.keys(errors).length) return fail(errors);
  return { ok: true };
}

function validateStepState(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const sf = data.stateFlag;
  const errors: Record<string, string> = {};
  if (!sf) return fail({ stateFlag: s.selectOption });

  if (sf === 'SHELL') {
    if (!data.unfinishedFinishingLevel) errors.unfinishedFinishingLevel = s.selectOption;
    if (!data.unfinishedInfrastructure?.length) errors.unfinishedInfrastructure = s.selectAtLeastOne;
    if (!data.unfinishedSmartHome) errors.unfinishedSmartHome = s.selectOption;
  } else if (sf === 'FINISHED_EMPTY') {
    if (!data.furnishingScope?.length) errors.furnishingScope = s.selectAtLeastOne;
    if (!data.furnishingAesthetic) errors.furnishingAesthetic = s.selectOption;
    if (typeof data.petFriendly !== 'boolean') errors.petFriendly = s.selectOption;
    if (!data.furnishingInstallDeadline) errors.furnishingInstallDeadline = s.selectOption;
  } else if (sf === 'FURNISHED') {
    if (!data.furnishedUnitLuxe?.waterHeating) errors.waterHeating = s.selectOption;
    if (!data.acCoverage) errors.acCoverage = s.selectOption;
    if (!data.internetSpeed) errors.internetSpeed = s.selectOption;
    if (!data.furnishedUnitLuxe?.beddingTier) errors.beddingTier = s.selectOption;
    if (typeof data.petFriendly !== 'boolean') errors.petFriendly = s.selectOption;
    if (!data.guestPolicyAudiences?.length) errors.guestPolicyAudiences = s.selectAtLeastOne;
    /** smartHomeLuxe optional (can be none selected) */
  }

  return Object.keys(errors).length ? fail(errors) : { ok: true };
}

function validateStepBudgetSize(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  if (!data.budgetBand) errors.budgetBand = s.selectOption;
  const sqm = data.propertySizeSqm;
  if (sqm == null || Number.isNaN(sqm) || sqm < 10 || sqm > 2000) errors.propertySizeSqm = s.fillField;

   if (data.stateFlag === 'SHELL') {
     if (!data.unfinishedBudgetPerSqm) errors.unfinishedBudgetPerSqm = s.selectOption;
     if (!data.unfinishedFinancingPreference) errors.unfinishedFinancingPreference = s.selectOption;
   }
   if (data.stateFlag === 'FINISHED_EMPTY') {
     if (!data.furnishingBudgetBand) errors.furnishingBudgetBand = s.selectOption;
     if (!data.furnishingPaymentPreference) errors.furnishingPaymentPreference = s.selectOption;
   }

  return Object.keys(errors).length ? fail(errors) : { ok: true };
}

function validateStepPhotos(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const files = data.photoUpload?.files?.length ?? 0;
  if (files < 1) return fail({ photoUpload: s.zipPhotos });

  if (data.stateFlag === 'FURNISHED') {
    const checklist = data.furnishedPhotoChecklist ?? [];
    if (checklist.length < 1) return fail({ furnishedPhotoChecklist: s.furnishedChecklist });
  }
  return { ok: true };
}

function validateStepHassle(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  if (!data.mode) return fail({ mode: s.selectOption });
  if (data.hassleLevel == null || data.hassleLevel < 0 || data.hassleLevel > 10) return fail({ hassleLevel: s.fillField });
  return { ok: true };
}

function validateStepPainPoints(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  const mode: ManagementMode = data.mode ?? 'MANAGED';

  if (mode === 'MANAGED') {
    if (!data.hasPropertyManagerOrCompany) errors.hasPropertyManagerOrCompany = s.selectOption;
    if (!data.hasDedicatedCleaningTeam) errors.hasDedicatedCleaningTeam = s.selectOption;
  }
  if (!data.regulatory?.guestAccessSolution) errors.guestAccessSolution = s.selectOption;

  if (!(data.furnishedAreas?.length ?? 0)) errors.furnishedAreas = s.selectAtLeastOne;

  if (isFurnishedPerformanceSectionVisible(mode, 'gapAudit')) {
    const pains = data.furnishedLeadQualification?.operationalPainIds ?? [];
    if (!pains.length) errors.operationalPainIds = s.selectAtLeastOne;
  }

  return Object.keys(errors).length ? fail(errors) : { ok: true };
}

function validateStepFurnishedPerformance(data: WizardData, locale: Locale): WizardStepValidationResult {
  const s = m(locale);
  const errors: Record<string, string> = {};
  const mode: ManagementMode = data.mode ?? 'MANAGED';
  const flq = data.furnishedLeadQualification;

  if (isFurnishedPerformanceSectionVisible(mode, 'listingStack') && !flq?.listingStack) {
    errors.listingStack = s.selectOption;
  }
  if (isFurnishedPerformanceSectionVisible(mode, 'cleaningSupport') && !flq?.cleaningSupport) {
    errors.cleaningSupport = s.selectOption;
  }
  if (isFurnishedPerformanceSectionVisible(mode, 'responseTime') && !flq?.guestResponseTime) {
    errors.guestResponseTime = s.selectOption;
  }

  if (isFurnishedPerformanceSectionVisible(mode, 'revenueDemand')) {
    if (flq?.monthlyRevenueEgp == null || Number.isNaN(flq.monthlyRevenueEgp) || flq.monthlyRevenueEgp < 0) {
      errors.monthlyRevenueEgp = s.fillField;
    }
    if (!flq?.occupancyBand) errors.occupancyBand = s.selectOption;
    if (!flq?.pricingStrategy) errors.pricingStrategy = s.selectOption;
  }

  return Object.keys(errors).length ? fail(errors) : { ok: true };
}
