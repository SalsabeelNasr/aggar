import type { WizardData } from '@/models';
import { getRegionById } from '@/services/mockApi';
import { evaluateRules } from '@/lib/engines/ruleEngine';
import {
  buildPackages,
  computeCustomTotals,
  computePlanFinancials,
  type PackageType,
} from '@/lib/engines/packageBuilder';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import type { EvaluationReport } from './types';

function servicesForPackage(
  reportPackageSet: EvaluationReport['packageSet'],
  type: PackageType
): { services: EvaluationReport['packageSet']['quick_start']['services'] } {
  if (type === 'custom') {
    const enabledIds = reportPackageSet.custom.enabled_service_ids;
    return { services: reportPackageSet.custom.all_services.filter((s) => enabledIds.includes(s.id)) };
  }
  return { services: reportPackageSet[type].services };
}

export function generateReport(data: WizardData): EvaluationReport {
  const ruleResult = evaluateRules(data);
  const packageSet = buildPackages(ruleResult, data.budgetBand);

  const region = getRegionById(data.regionId);
  const areaMarketBaselines = regionalMarketBaselines(data.regionId);

  const revenueByPackage = {} as Record<PackageType, ReturnType<typeof projectRevenue>>;
  const planFinancialsByPackage = {} as EvaluationReport['planFinancialsByPackage'];

  const allTypes: PackageType[] = ['quick_start', 'sweet_spot', 'asset_flip', 'custom'];
  for (const type of allTypes) {
    const selected = servicesForPackage(packageSet, type).services;
    const revenue = projectRevenue(data, { services: selected });
    revenueByPackage[type] = revenue;

    const costTotals =
      type === 'custom'
        ? computeCustomTotals(packageSet.custom.all_services, packageSet.custom.enabled_service_ids)
        : { total_cost_min: packageSet[type].total_cost_min, total_cost_max: packageSet[type].total_cost_max };

    const plan = computePlanFinancials(
      { total_cost_min: costTotals.total_cost_min, total_cost_max: costTotals.total_cost_max },
      revenue.current.netMonthlyEgp,
      revenue.optimized.netMonthlyEgp
    );
    planFinancialsByPackage[type] = plan;
  }

  return {
    version: 1,
    createdAtISO: new Date().toISOString(),
    wizardData: data,
    ruleResult,
    packageSet,
    region,
    areaMarketBaselines,
    revenueByPackage,
    planFinancialsByPackage,
  };
}

