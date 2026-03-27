import type { WizardData, Region } from '@/models';
import type { RuleEngineResult } from '@/lib/engines/ruleEngine';
import type { PackageSet, PackageType } from '@/lib/engines/packageBuilder';
import type { RevenueResult } from '@/lib/engines/revenueEngine';

export interface EvaluationReport {
  version: 1;
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
}

