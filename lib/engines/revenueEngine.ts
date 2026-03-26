import type { RegionId, WizardData, ManagementMode, PropertyStateFlag } from '@/models';

export interface RevenueScenario {
  grossMonthlyEgp: number;
  netMonthlyEgp: number;
  nightlyRateEgp: number;
  occupancyPct: number;
}

export interface RevenueResult {
  exchangeRateEgpPerUsd: number;
  seasonalityFlag: boolean;
  current: RevenueScenario;
  optimized: RevenueScenario;
  bestInClass: RevenueScenario;
  assumptions: string[];
}

const EXCHANGE_EGP_PER_USD = 47;

const REGION_BASE: Record<
  RegionId,
  { nightlyUsd: number; occupancyPct: number; seasonalityFlag: boolean }
> = {
  el_gouna: { nightlyUsd: 224, occupancyPct: 47, seasonalityFlag: false },
  north_coast: { nightlyUsd: 175, occupancyPct: 65, seasonalityFlag: true },
  zamalek: { nightlyUsd: 92, occupancyPct: 34.8, seasonalityFlag: false },
  hurghada: { nightlyUsd: 58, occupancyPct: 48, seasonalityFlag: false },
  new_cairo: { nightlyUsd: 35, occupancyPct: 77, seasonalityFlag: false },
  sharm: { nightlyUsd: 70, occupancyPct: 45, seasonalityFlag: false },
  sheikh_zayed: { nightlyUsd: 67, occupancyPct: 34.5, seasonalityFlag: false },
  maadi: { nightlyUsd: 67, occupancyPct: 34.5, seasonalityFlag: false },
  dahab: { nightlyUsd: 70, occupancyPct: 45, seasonalityFlag: false },
  luxor_aswan: { nightlyUsd: 55, occupancyPct: 30, seasonalityFlag: true },
  nasr_city_6th_october: { nightlyUsd: 30, occupancyPct: 30, seasonalityFlag: false },
  industrial_informal: { nightlyUsd: 20, occupancyPct: 20, seasonalityFlag: false },
  other: { nightlyUsd: 67, occupancyPct: 34.5, seasonalityFlag: false },
};

const READINESS_MULTIPLIER: Record<PropertyStateFlag, number> = {
  SHELL: 0.0,
  FINISHED_EMPTY: 0.55,
  FURNISHED_RENO: 0.35,
};

const PACKAGE_MULTIPLIER: Record<
  'quick_start' | 'sweet_spot' | 'asset_flip' | 'performance_audit' | 'custom',
  number
> = {
  quick_start: 1.05,
  sweet_spot: 1.2,
  asset_flip: 1.4,
  performance_audit: 1.1,
  custom: 1.1,
};

function aiQualityMultiplier(data: WizardData): number {
  const tier = data.photoUpload?.aiSummary?.qualityTier;
  if (tier === 'high') return 1.08;
  if (tier === 'low') return 0.92;
  return 1.0;
}

function managementFeePct(mode: ManagementMode | undefined): number {
  if (mode === 'MANAGED') return 0.25;
  return 0.0;
}

function netFromGross(gross: number, mode: ManagementMode | undefined): number {
  const platformFee = 0.03;
  const mgmtFee = managementFeePct(mode);
  const utilities = 1000; // placeholder: 700–1,400 EGP typical
  const maintenanceReserve = 0; // not computable until we capture property value
  return Math.max(0, Math.round(gross * (1 - platformFee - mgmtFee) - utilities - maintenanceReserve));
}

function scenarioFor(
  data: WizardData,
  {
    occupancyPct,
    nightlyRateEgp,
  }: { occupancyPct: number; nightlyRateEgp: number }
): RevenueScenario {
  const grossMonthlyEgp = nightlyRateEgp * 30 * (occupancyPct / 100);
  const netMonthlyEgp = netFromGross(grossMonthlyEgp, data.mode);
  return {
    grossMonthlyEgp: Math.round(grossMonthlyEgp),
    netMonthlyEgp,
    nightlyRateEgp: Math.round(nightlyRateEgp),
    occupancyPct: Math.round(occupancyPct),
  };
}

export function projectRevenue(
  data: WizardData,
  opts?: { packageType?: keyof typeof PACKAGE_MULTIPLIER }
): RevenueResult {
  const regionId = data.regionId ?? 'other';
  const region = REGION_BASE[regionId];

  const baseNightlyEgp = region.nightlyUsd * EXCHANGE_EGP_PER_USD;
  const baseOcc = region.occupancyPct;

  const stateFlag = data.stateFlag ?? 'FINISHED_EMPTY';
  const readiness = READINESS_MULTIPLIER[stateFlag];
  const aiMult = aiQualityMultiplier(data);

  const currentNightly = baseNightlyEgp * readiness * aiMult;
  const currentOcc = Math.max(5, baseOcc - (1 - readiness) * 30); // simple conservative curve

  const packageType = opts?.packageType ?? 'sweet_spot';
  const pkgMult = PACKAGE_MULTIPLIER[packageType];

  const optimizedNightly = baseNightlyEgp * pkgMult * aiMult;
  const optimizedOcc = Math.min(85, baseOcc + 8);

  const bestNightly = baseNightlyEgp * 1.35 * aiMult;
  const bestOcc = 79;

  return {
    exchangeRateEgpPerUsd: EXCHANGE_EGP_PER_USD,
    seasonalityFlag: region.seasonalityFlag,
    current: scenarioFor(data, { occupancyPct: currentOcc, nightlyRateEgp: currentNightly }),
    optimized: scenarioFor(data, { occupancyPct: optimizedOcc, nightlyRateEgp: optimizedNightly }),
    bestInClass: scenarioFor(data, { occupancyPct: bestOcc, nightlyRateEgp: bestNightly }),
    assumptions: [
      'Utilities are modeled as a fixed monthly placeholder until property-specific usage is captured.',
      'Maintenance reserve is omitted until property value is captured.',
      'North Coast and other seasonal markets should display peak-window messaging in UI.',
    ],
  };
}

/** Regional ADR & occupancy baselines (not property-adjusted) for area context in UI. */
export function regionalMarketBaselines(regionId: RegionId | undefined): {
  nightlyRateEgp: number;
  occupancyPct: number;
} {
  const id = regionId ?? 'other';
  const r = REGION_BASE[id];
  return {
    nightlyRateEgp: Math.round(r.nightlyUsd * EXCHANGE_EGP_PER_USD),
    occupancyPct: Math.round(r.occupancyPct),
  };
}

