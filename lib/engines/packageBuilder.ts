import type { Service } from '@/lib/data/services';
import type { BudgetBand } from '@/lib/data/budgetBands';
import { BUDGET_BAND_RANGES } from '@/lib/data/budgetBands';
import { getActiveServices } from '@/lib/data/serviceAccess';
import type { RuleEngineResult } from './ruleEngine';

export type PackageType = 'quick_start' | 'sweet_spot' | 'asset_flip' | 'custom';

export interface PackageResult {
  type: PackageType;
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  services: Service[];
  total_cost_min: number;
  total_cost_max: number;
  total_score_gain: number;
  fits_budget: boolean;
  user_budget_max?: number;
}

export interface CustomPackageResult {
  type: 'custom';
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  all_services: Service[];
  enabled_service_ids: string[];
  is_needed: Record<string, boolean>;
}

export interface PackageSet {
  quick_start: PackageResult;
  sweet_spot: PackageResult;
  asset_flip: PackageResult;
  custom: CustomPackageResult;
}

function sumCosts(services: Service[]): { min: number; max: number } {
  let min = 0;
  let max = 0;
  for (const s of services) {
    if (s.cost_unit === 'percent_of_revenue') continue;
    if (s.cost_unit === 'per_sqm') continue;
    min += s.cost_min_egp;
    max += s.cost_max_egp;
  }
  return { min, max };
}

function totalScoreGain(services: Service[]): number {
  return services.reduce((acc, s) => acc + s.score_contribution, 0);
}

/**
 * Build the 4 packages from rule engine results + user budget.
 *
 * - Quick Start: must_have services only (low budget)
 * - Sweet Spot: must_have + high_impact (optimized)
 * - Asset Flip: all missing services (superhost)
 * - Custom: full catalog with toggles
 */
export function buildPackages(ruleResult: RuleEngineResult, budgetBand?: BudgetBand): PackageSet {
  const { missingServices } = ruleResult;

  const budgetMax = budgetBand ? BUDGET_BAND_RANGES[budgetBand].max : Infinity;

  // Quick Start: must_have only
  const quickStartServices = missingServices.filter((s) => s.priority === 'must_have');
  const quickStartCost = sumCosts(quickStartServices);

  // Sweet Spot: must_have + high_impact
  const sweetSpotServices = missingServices.filter(
    (s) => s.priority === 'must_have' || s.priority === 'high_impact'
  );
  const sweetSpotCost = sumCosts(sweetSpotServices);

  // Asset Flip: all missing
  const assetFlipServices = [...missingServices];
  const assetFlipCost = sumCosts(assetFlipServices);

  const quick_start: PackageResult = {
    type: 'quick_start',
    name_en: 'Quick Start',
    name_ar: 'بداية سريعة',
    tagline_en: 'Get listed this month. Minimum spend, maximum speed.',
    tagline_ar: 'ابدأ هذا الشهر بأقل تكلفة وأسرع وقت.',
    services: quickStartServices,
    total_cost_min: quickStartCost.min,
    total_cost_max: quickStartCost.max,
    total_score_gain: totalScoreGain(quickStartServices),
    fits_budget: quickStartCost.max <= budgetMax,
    user_budget_max: budgetMax === Infinity ? undefined : budgetMax,
  };

  const sweet_spot: PackageResult = {
    type: 'sweet_spot',
    name_en: 'Sweet Spot',
    name_ar: 'المنطقة الذهبية',
    tagline_en: 'Invest in the look. Unlock the top 20% of your neighborhood.',
    tagline_ar: 'استثمار في الشكل لرفع الأداء.',
    services: sweetSpotServices,
    total_cost_min: sweetSpotCost.min,
    total_cost_max: sweetSpotCost.max,
    total_score_gain: totalScoreGain(sweetSpotServices),
    fits_budget: sweetSpotCost.max <= budgetMax,
    user_budget_max: budgetMax === Infinity ? undefined : budgetMax,
  };

  const asset_flip: PackageResult = {
    type: 'asset_flip',
    name_en: 'Asset Flip',
    name_ar: 'قلب الأصل',
    tagline_en: 'Transform the property. Unlock elite-tier income.',
    tagline_ar: 'تحويل كامل للوصول لأعلى دخل.',
    services: assetFlipServices,
    total_cost_min: assetFlipCost.min,
    total_cost_max: assetFlipCost.max,
    total_score_gain: totalScoreGain(assetFlipServices),
    fits_budget: assetFlipCost.max <= budgetMax,
    user_budget_max: budgetMax === Infinity ? undefined : budgetMax,
  };

  // Custom: full service catalog
  const allServices = getActiveServices().filter((s) =>
    s.applicable_states.includes(ruleResult.scoreResult.stageLabel === 'ltr' ? 'FURNISHED' : (ruleResult.missingServices[0]?.applicable_states[0] ?? 'FURNISHED'))
  );

  // For custom, use all active services and let the UI filter by state
  const fullCatalog = getActiveServices();
  const missingIds = new Set(missingServices.map((s) => s.id));
  const isNeeded: Record<string, boolean> = {};
  for (const s of fullCatalog) {
    isNeeded[s.id] = missingIds.has(s.id);
  }

  const custom: CustomPackageResult = {
    type: 'custom',
    name_en: 'Custom',
    name_ar: 'مخصص',
    tagline_en: 'Pick the upgrades that match your situation. Costs and income update as you toggle.',
    tagline_ar: 'اختر الترقيات المناسبة لحالتك. التكاليف والدخل يتحدثان مع كل بند.',
    all_services: fullCatalog,
    enabled_service_ids: sweetSpotServices.map((s) => s.id),
    is_needed: isNeeded,
  };

  return { quick_start, sweet_spot, asset_flip, custom };
}

/** Compute cost totals for a custom selection of services. */
export function computeCustomTotals(services: Service[], enabledIds: string[]): {
  total_cost_min: number;
  total_cost_max: number;
  total_score_gain: number;
} {
  const enabled = services.filter((s) => enabledIds.includes(s.id));
  const cost = sumCosts(enabled);
  return {
    total_cost_min: cost.min,
    total_cost_max: cost.max,
    total_score_gain: totalScoreGain(enabled),
  };
}

/**
 * Derive a revenue multiplier from the total score contribution of enabled services.
 * Maps 0 score → 1.0× and max score (~50 pts) → 1.4×.
 */
export function planMultiplier(enabledServices: Service[]): number {
  const totalScore = totalScoreGain(enabledServices);
  const MAX_SCORE_CONTRIBUTION = 50;
  const ratio = Math.min(1, totalScore / MAX_SCORE_CONTRIBUTION);
  return 1.0 + ratio * 0.4;
}
