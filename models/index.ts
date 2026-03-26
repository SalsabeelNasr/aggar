export type RegionId =
  | 'new_cairo'
  | 'zamalek'
  | 'maadi'
  | 'sheikh_zayed'
  | 'el_gouna'
  | 'hurghada'
  | 'north_coast'
  | 'sharm'
  | 'dahab'
  | 'luxor_aswan'
  | 'nasr_city_6th_october'
  | 'industrial_informal'
  | 'other';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Region {
  id: RegionId;
  name: LocalizedString;
  avgOccupancy: number;
  avgNightlyRate: number;
  premiumLevel: 'high' | 'medium' | 'elite';
  bestFitAudiences: LocalizedString[];
  topPropertyTypes: LocalizedString[];
  seasonalityNotes: LocalizedString;
  marketFact: LocalizedString;
}

export type PropertyType = 'chalet' | 'apartment' | 'studio' | 'villa';

// =========================
// Master-spec evaluation flow model (Wizard + Results)
// =========================

export type ListingStatus = 'not_listed' | 'listed_doing_well' | 'listed_underperform' | 'listed_barely_any_bookings';

/** Already-listed answers that skip the "State" step; `FURNISHED_RENO` is implied (see Step0Listed). */
export const LISTING_STATUS_SKIP_STATE_STEP: ListingStatus[] = [
  'listed_doing_well',
  'listed_underperform',
  'listed_barely_any_bookings',
];

export function listingStatusSkipsPropertyStateStep(status: ListingStatus | undefined): boolean {
  return status !== undefined && LISTING_STATUS_SKIP_STATE_STEP.includes(status);
}

/** Wizard property condition — three paths in `Step3State`; listed users imply `FURNISHED_RENO`. */
export type PropertyStateFlag = 'SHELL' | 'FINISHED_EMPTY' | 'FURNISHED_RENO';

export type ManagementMode = 'MANAGED' | 'DIY_ASSISTED' | 'DIY_FULL';

export type ACCoverage = 'none_or_broken' | 'one_old_unit' | 'adequate_functional' | 'efficient_full_coverage';
export type InternetSpeed = 'none_or_adsl' | 'basic_under_50' | 'fiber_100_plus' | 'mesh_200_plus';

/** Case A: SHELL / unfinished — current finishing level */
export type UnfinishedFinishingLevel = 'shell_core' | 'semi_finished' | 'needs_renovation';

/** Case A: infrastructure checklist items */
export type UnfinishedInfrastructureId =
  | 'electricity_meter'
  | 'water_meter'
  | 'natural_gas'
  | 'fiber_ready';

/** Case A: smart home tier */
export type UnfinishedSmartHome = 'basic' | 'smart_ready' | 'full_automation';

/** Case A: finishing budget band per sqm */
export type UnfinishedBudgetPerSqm = 'economy' | 'premium' | 'luxury_custom';

/** Case A: financing preference */
export type UnfinishedFinancingPreference = 'lump_sum' | 'installment_12_24' | 'bank_loan_3_5y';

/** Case B: furnishing scope (multi-select checklist) */
export type FurnishingScopeId = 'furniture' | 'appliances' | 'styling_decor';

/** Design style (carousel) — unfurnished + furnished flows */
export type FurnishingAesthetic =
  | 'boho'
  | 'hotel_like'
  | 'coastal'
  | 'industrial'
  | 'fun'
  | 'modern_minimalist'
  | 'classic';

/** Case B: installation deadline (finished empty) */
export type FurnishingInstallDeadline = 'under_3_weeks' | 'weeks_4_8' | 'months_3_plus';

/** Case B: total furnishing budget band (EGP) */
export type FurnishingBudgetBand = 'budget_250_450k' | 'premium_500_850k' | 'luxury_1m_plus';

/** Case B: primary payment / financing preference */
export type FurnishingPaymentPreference =
  | 'cash_package_discount'
  | 'short_installments_card_6_12'
  | 'long_finance_valu_contact_halan'
  | 'revenue_share_management';

export type ResultsAccess = 'teaser' | 'full';

export interface WizardLead {
  fullName: string;
  email: string;
  whatsapp: string;
  preferredContactTime: 'morning' | 'afternoon' | 'evening';
  consentToPartnerNetwork: boolean;
  submittedAtISO?: string;
}

/** Property step: outdoor areas (multi-select) */
export type OutdoorSpaceId = 'balcony' | 'terrace' | 'garden';

/** Property step: essential STR / hosting tech (multi-select) */
export type EssentialTechId = 'smart_lock' | 'mesh_wifi' | 'smart_tv_sound';

/** How guests get reliable access (bawab, self-serve lock, or not yet). */
export type GuestAccessSolution = 'bawab_concierge' | 'smart_lock_or_lockbox' | 'none';

export interface WizardRegulatorySignals {
  inGatedCompound?: boolean;
  hasLift?: boolean;
  floorNumber?: number;
  guestAccessSolution?: GuestAccessSolution;
}

/** Furnished flow — Step 5 host qualification (revenue, pain, compliance, timing) */
export type FurnishedOccupancyBand = 'under_30' | 'between_30_60' | 'over_60';
export type FurnishedPricingStrategy = 'flat_rate' | 'manual_seasonal' | 'dynamic_tool';
export type FurnishedOperationalPainId =
  | 'pain_operations'
  | 'pain_management'
  | 'pain_financial'
  | 'pain_compliance'
  | 'pain_restocking_consumables';
export type FurnishedListingStack = 'channel_manager' | 'manual_ota' | 'other';
export type FurnishedCleaningSupport = 'trusted_cleaner' | 'need_roster' | 'unsure';
export type FurnishedGuestResponseTime = 'under_5_min' | 'about_1_hour' | 'several_hours' | 'often_miss';
export type FurnishedBuildingSecurity = 'compound_24_7' | 'bawab' | 'unsecured_street';
export type FurnishedTourismLicenseStatus = 'yes' | 'no' | 'need_help';
export type FurnishedStrInsuranceCoverage = 'yes' | 'no' | 'unknown';

export interface FurnishedLeadQualification {
  monthlyRevenueEgp?: number;
  occupancyBand?: FurnishedOccupancyBand;
  pricingStrategy?: FurnishedPricingStrategy;
  operationalPainIds?: FurnishedOperationalPainId[];
  /** Channel manager vs manual OTA app — co-management / DIY paths */
  listingStack?: FurnishedListingStack;
  /** On-ground cleaning — co-management / DIY paths */
  cleaningSupport?: FurnishedCleaningSupport;
  guestResponseTime?: FurnishedGuestResponseTime;
  buildingSecurity?: FurnishedBuildingSecurity;
  tourismLicenseStatus?: FurnishedTourismLicenseStatus;
  strInsuranceCoverage?: FurnishedStrInsuranceCoverage;
}

/** Furnished flow — Step 4 unit / premium readiness */
export type FurnishedWaterHeating = 'electric_standard' | 'central_gas_premium' | 'pressure_issues_peak';
export type FurnishedLuxeSmartHomeId =
  | 'smart_lock_existing'
  | 'noise_decibel_monitor'
  | 'smart_thermostat'
  | 'smoke_co_detectors';
export type FurnishedBeddingTier = 'hotel_style_white' | 'colored';

export type GuestPolicyAudienceId =
  | 'mixed_groups_allowed'
  | 'couples_allowed'
  | 'families_marriage_cert_only'
  | 'egyptians_only'
  | 'non_egyptians_only';

export interface FurnishedUnitLuxe {
  waterHeating?: FurnishedWaterHeating;
  smartHomeLuxe?: FurnishedLuxeSmartHomeId[];
  beddingTier?: FurnishedBeddingTier;
}

export type FurnishedPhotoChecklistId =
  | 'balcony_window_view'
  | 'kitchen_cabinets_cleanliness_proof'
  | 'mattress_pillows_hotel_tuck'
  | 'smart_lock_keyless_entry'
  | 'wifi_speed_screenshot_or_router'
  | 'fire_safety_smoke_detectors';

export interface WizardData {
  regionId?: RegionId;
  address?: string;

  listingStatus?: ListingStatus;

  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sleepCapacity?: number;

  outdoorSpace?: OutdoorSpaceId[];
  essentialTechNeeds?: EssentialTechId[];

  stateFlag?: PropertyStateFlag;

  // Conditional follow-ups
  furnishedRenoAreas?: Array<'kitchen' | 'bathrooms' | 'walls_paint' | 'electrical' | 'ac_units' | 'all'>;

  /** Managed mode: already have a property manager or property management company */
  hasPropertyManagerOrCompany?: 'yes' | 'no';
  /** Managed mode: already have a dedicated cleaning team (turnovers / housekeeping) */
  hasDedicatedCleaningTeam?: 'yes' | 'no';

  // Case A: SHELL / unfinished (State details)
  unfinishedFinishingLevel?: UnfinishedFinishingLevel;
  unfinishedInfrastructure?: UnfinishedInfrastructureId[];
  unfinishedSmartHome?: UnfinishedSmartHome;
  unfinishedBudgetPerSqm?: UnfinishedBudgetPerSqm;
  unfinishedFinancingPreference?: UnfinishedFinancingPreference;

  // FINISHED_EMPTY + FURNISHED_RENO (style / pet)
  furnishingAesthetic?: FurnishingAesthetic;
  petFriendly?: boolean;

  // Case B: FINISHED_EMPTY / unfurnished (State details)
  furnishingScope?: FurnishingScopeId[];
  furnishingInstallDeadline?: FurnishingInstallDeadline;
  furnishingBudgetBand?: FurnishingBudgetBand;
  furnishingPaymentPreference?: FurnishingPaymentPreference;

  // ROI-critical quick questions
  acCoverage?: ACCoverage;
  internetSpeed?: InternetSpeed;

  // Photos + AI
  photoUpload: {
    files: Array<{ id: string; url?: string; name?: string }>;
    aiSignals: string[];
    aiSummary?: {
      qualityTier?: 'low' | 'medium' | 'high';
      confidence?: number;
      visibleStrengths?: string[];
      visibleIssues?: string[];
      recommendedUpgrades?: string[];
    };
  };

  hassleLevel?: number; // 0..10
  mode?: ManagementMode;

  regulatory?: WizardRegulatorySignals;

  /** Furnished (`FURNISHED_RENO`) — cleared when state changes away */
  furnishedLeadQualification?: FurnishedLeadQualification;
  furnishedUnitLuxe?: FurnishedUnitLuxe;
  furnishedPhotoChecklist?: FurnishedPhotoChecklistId[];
  /** Furnished — which guest segments are allowed (multi-select) */
  guestPolicyAudiences?: GuestPolicyAudienceId[];
}

export interface WizardState {
  currentStep: number; // UI index (we'll map to spec steps)
  data: WizardData;
  lead: WizardLead;
  resultsAccess: ResultsAccess;
}
