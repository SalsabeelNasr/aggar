import type {
  RegionId,
  WizardData,
  PropertyStateFlag,
  ACCoverage,
  InternetSpeed,
} from '@/models';
import { getStateFieldApplicability } from '@/lib/wizard/stateFieldApplicability';

export type StageLabel = 'stage_3' | 'stage_2' | 'stage_1' | 'ltr';

export interface ScoreBreakdown {
  L: number; // 1..10
  R: number; // 1..10
  C: number; // 1..10
  O: number; // 1..10
}

export interface ScoreResult {
  finalScore: number; // 0..100
  stageLabel: StageLabel;
  ltrFlag: boolean;
  seasonalityFlag: boolean;
  breakdown: ScoreBreakdown;
  reasons: string[];
}

const REGION_L_SCORE: Record<RegionId, number> = {
  zamalek: 9.5,
  el_gouna: 9.2,
  north_coast: 8.8,
  new_cairo: 8.5,
  hurghada: 8.0,
  sharm: 7.8,
  sheikh_zayed: 7.5,
  maadi: 7.2,
  dahab: 7.0,
  luxor_aswan: 5.5,
  nasr_city_6th_october: 4.0,
  industrial_informal: 2.0,
  other: 6.0,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mid(min: number, max: number) {
  return (min + max) / 2;
}

function baseCScore(stateFlag: PropertyStateFlag | undefined): number {
  switch (stateFlag) {
    case 'SHELL':
      return mid(1, 2);
    case 'FINISHED_EMPTY':
      return mid(5, 6);
    case 'FURNISHED':
      return mid(2, 4);
    default:
      return mid(5, 6);
  }
}

function acModifier(acCoverage: ACCoverage | undefined): number {
  switch (acCoverage) {
    case 'none_or_broken':
      return -0.8;
    case 'one_old_unit':
      return -0.4;
    case 'adequate_functional':
      return 0;
    case 'efficient_full_coverage':
      return 0.4;
    default:
      return 0;
  }
}

function internetModifier(internetSpeed: InternetSpeed | undefined): number {
  switch (internetSpeed) {
    case 'none_or_adsl':
      return -0.5;
    case 'basic_under_50':
      return -0.2;
    case 'fiber_100_plus':
      return 0;
    case 'mesh_200_plus':
      return 0.3;
    default:
      return 0;
  }
}

function aiModifier(aiSignals: string[] | undefined): number {
  const set = new Set(aiSignals ?? []);
  let mod = 0;

  if (set.has('natural_light')) mod += 0.5;
  if (set.has('view_potential') || set.has('balcony_view')) mod += 0.5;
  if (set.has('modern_kitchen_bath')) mod += 0.4;

  if (set.has('clutter') || set.has('empty_feel')) mod -= 0.4;
  if (set.has('dated_furniture')) mod -= 0.5;
  if (set.has('unfinished_surfaces')) mod -= 0.8;

  return mod;
}

function calculateL(data: WizardData): number {
  const regionId = data.regionId ?? 'other';
  let L = REGION_L_SCORE[regionId];

  if (data.regulatory?.inGatedCompound) L += 0.4;

  // View/landmark modifiers can be added once we capture them in the wizard.
  return clamp(L, 1, 10);
}

function calculateR(data: WizardData): number {
  // We don’t have Decree 209 / civil defense inputs yet; infer a conservative score.
  if (data.regulatory?.inGatedCompound) return 8.5;
  return 6.0;
}

function calculateC(data: WizardData): number {
  const base = baseCScore(data.stateFlag);
  const applicability = getStateFieldApplicability(data.stateFlag);
  const acInternetMod = applicability.applyAcInternetToScore
    ? acModifier(data.acCoverage) + internetModifier(data.internetSpeed)
    : 0;
  const mod = aiModifier(data.photoUpload?.aiSignals) + acInternetMod;
  return clamp(base + mod, 1, 10);
}

function calculateO(data: WizardData): number {
  const bedrooms = data.bedrooms ?? 2;
  let O = 7;
  const applicability = getStateFieldApplicability(data.stateFlag);

  if (bedrooms === 2) O = 9;
  else if (bedrooms === 3) O = 8;
  else if (bedrooms === 1) O = 7;
  else if (bedrooms >= 4) O = 4;

  if (applicability.applyAcInternetToScore) {
    O += internetModifier(data.internetSpeed);
    O += acModifier(data.acCoverage);
  }

  return clamp(O, 1, 10);
}

function stageFromScore(score: number): StageLabel {
  if (score >= 75) return 'stage_3';
  if (score >= 45) return 'stage_2';
  if (score >= 25) return 'stage_1';
  return 'ltr';
}

export function scoreWizardData(data: WizardData): ScoreResult {
  const reasons: string[] = [];
  const seasonalityFlag = data.regionId === 'north_coast';
  const stateFlag = data.stateFlag;

  const L = calculateL(data);
  const R = calculateR(data);
  const C = calculateC(data);
  const O = calculateO(data);

  const weighted = L * 0.4 + R * 0.2 + C * 0.2 + O * 0.2;
  let finalScore = clamp(Math.round(weighted * 10), 0, 100);

  // Mock-data-friendly guardrail: a SHELL property is not market-ready yet,
  // even if the region is strong. Keep it in an early-stage band.
  if (stateFlag === 'SHELL') {
    finalScore = Math.min(finalScore, 40);
    reasons.push('Shell stage: market readiness is capped until core build is complete.');
  }

  // LTR hard triggers (subset we can detect with current inputs)
  let ltrFlag = false;
  const regionId = data.regionId ?? 'other';
  if (regionId === 'industrial_informal') {
    ltrFlag = true;
    reasons.push('Region is ineligible / very low STR demand.');
  }
  if (regionId === 'nasr_city_6th_october') {
    // Soft trigger: allow score to drive, but keep this as a reason.
    reasons.push('Region is typically low ADR and price-sensitive for STR.');
  }
  if (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5) {
    ltrFlag = true;
    reasons.push('No lift on upper floor (Decree 209 compliance risk).');
  }

  const stageLabel = ltrFlag ? 'ltr' : stageFromScore(finalScore);

  return {
    finalScore,
    stageLabel,
    ltrFlag,
    seasonalityFlag,
    breakdown: { L, R, C, O },
    reasons,
  };
}

