import type { WizardData, Region, LocalizedString } from '@/models';
import type { RuleEngineResult } from '@/lib/engines/ruleEngine';
import type { PackageSet, PackageType } from '@/lib/engines/packageBuilder';
import type { RevenueResult } from '@/lib/engines/revenueEngine';

/** FOMO-forward “competition snapshot” derived from mock MARKET_DATA + listing signals. */
export interface CompetitionSnapshot {
  /** e.g. 40 → “top 40%” band (modeled). */
  topPercentile: number;
  percentileHeadline: LocalizedString;
  revenueGapEgp: number | null;
  revenueGapLine: LocalizedString;
  amenityAhaLine: LocalizedString;
  designBenchmarkLine: LocalizedString;
  responseDeltaLine: LocalizedString;
  footnote: LocalizedString;
  modeledGrossMonthlyTopEgp: number;
  modeledGrossMonthlyAvgEgp: number;
  modeledTypicalMonthlyUsd: number;
  modeledTop10MonthlyUsd: number;
}

export interface NeighboursBenchmarks {
  /** Typical monthly earnings benchmark for the region (guide, USD). */
  typicalMonthlyUsd: number | null;
  /** Top 10% monthly earnings benchmark for the region (guide, USD). */
  top10MonthlyUsd: number | null;
  /** Short peak/seasonality note to set expectation. */
  peakSeasonNote: { en: string; ar: string };
  competitionSnapshot: CompetitionSnapshot;
}

export interface PropertyAnalysisItem {
  /** Short label shown above the insight body (e.g. “Premium Security Tier”). */
  title?: { en: string; ar: string };
  body: { en: string; ar: string };
}

export interface ReportCardInsights {
  neighbours: NeighboursBenchmarks;
  /** 1–2 sentences mapping the user “stage” to next priorities (guide). */
  readinessNarrative: { en: string; ar: string };
  /**
   * Rules-engine insights + optional legacy fill-ins (max 5).
   * Prefer this for Results UI; see `propertyAnalysisBullets` for plain-text fallback.
   */
  propertyAnalysisItems: PropertyAnalysisItem[];
  /** Ordered bullets (3–5) — title+body joined where a title exists; backward compatible. */
  propertyAnalysisBullets: Array<{ en: string; ar: string }>;
}

export interface EvaluationReport {
  version: 2;
  createdAtISO: string;
  /** Snapshot of what the user submitted (stepper values). */
  wizardData: WizardData;

  /** Core evaluation outputs (rules + score). */
  ruleResult: RuleEngineResult;

  /** Packages built from ruleResult + budget. */
  packageSet: PackageSet;

  /** Region metadata used by the Results UI. */
  region: Region;
  /** Market baselines (area context) used by the Results UI. */
  areaMarketBaselines: { nightlyRateEgp: number; occupancyPct: number };

  /**
   * Revenue projections for each selectable package tab.
   * - `custom` here is computed using the report’s default custom enabled services.
   */
  revenueByPackage: Record<PackageType, RevenueResult>;

  /** Break-even & year-1 projections for each package tab. */
  planFinancialsByPackage: Record<
    PackageType,
    { breakEvenMonths: { min: number; max: number } | null; year1ProjectedNet: { min: number; max: number } | null }
  >;

  /** Pre-computed card copy/benchmarks to keep Results UI “dumb”. */
  cardInsights: ReportCardInsights;
}

