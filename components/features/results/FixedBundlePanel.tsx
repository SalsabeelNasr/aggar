'use client';

import * as React from 'react';
import type { PackageDefinition, ServiceLine } from '@/lib/engines/packageEngine';
import { improvementToServiceId, SERVICE_CONVERSATION } from '@/lib/results/pathRecommendationCopy';
import type { ScoreImprovementRow } from '@/lib/results/resultsStatic';
import { formatMoney } from './utils';

type Lo = 'en' | 'ar';

function formatServiceFee(s: ServiceLine, locale: string, lo: Lo): string {
  if ('percentOfRevenue' in s.costRangeEgp) {
    return lo === 'ar'
      ? `${s.costRangeEgp.minPct}–${s.costRangeEgp.maxPct}% من الإيراد`
      : `${s.costRangeEgp.minPct}–${s.costRangeEgp.maxPct}% of revenue`;
  }
  if ('per' in s.costRangeEgp) {
    return lo === 'ar'
      ? `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)} ج.م/م²`
      : `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)} EGP/sqm`;
  }
  return `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)} ${lo === 'ar' ? 'ج.م' : 'EGP'}`;
}

function scoreGainLine(
  serviceId: string,
  pkg: PackageDefinition,
  rows: ScoreImprovementRow[],
  lo: Lo
): string | null {
  for (const row of rows) {
    if (improvementToServiceId(row.id, pkg) === serviceId) {
      return row.scoreGain[lo];
    }
  }
  return null;
}

export interface FixedBundlePanelProps {
  lo: Lo;
  locale: string;
  pkg: PackageDefinition;
  services: ServiceLine[];
  improvementRows: ScoreImprovementRow[];
  labels: {
    columnService: string;
    columnFee: string;
    columnWhy: string;
    subtotal: string;
  };
  subtotalMin: number;
  subtotalMax: number;
}

export function FixedBundlePanel({
  lo,
  locale,
  pkg,
  services,
  improvementRows,
  labels,
  subtotalMin,
  subtotalMax,
}: FixedBundlePanelProps) {
  const sorted = React.useMemo(() => {
    const tierOrder = { tier1_vendor: 0, tier2_addon: 1, tier3_diy: 2 } as const;
    return [...services].sort((a, b) => {
      const t = tierOrder[a.tier] - tierOrder[b.tier];
      if (t !== 0) return t;
      return a.name.en.localeCompare(b.name.en);
    });
  }, [services]);

  return (
    <div>
        <div className="mb-3 hidden gap-4 border-b border-secondary-200 pb-2 text-xs font-semibold uppercase tracking-wide text-secondary-500 sm:grid sm:grid-cols-[minmax(0,1fr)_9.5rem_minmax(0,12rem)]">
          <span>{labels.columnService}</span>
          <span className="text-end">{labels.columnFee}</span>
          <span className="hidden lg:block">{labels.columnWhy}</span>
        </div>
        <ul className="divide-y divide-secondary-100">
          {sorted.map((s) => {
            const conv = SERVICE_CONVERSATION[s.id];
            const scoreLine = scoreGainLine(s.id, pkg, improvementRows, lo);
            return (
              <li key={s.id} className="py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_9.5rem_minmax(0,12rem)] sm:items-start sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-secondary-900">{s.name[lo]}</p>
                  {conv && <p className="mt-1 text-sm leading-relaxed text-secondary-600">{conv[lo]}</p>}
                </div>
                <p className="mt-2 shrink-0 text-sm font-semibold tabular-nums text-secondary-900 sm:mt-0 sm:text-end">
                  {formatServiceFee(s, locale, lo)}
                </p>
                <div className="mt-2 min-w-0 sm:mt-0">
                  <p className="text-xs font-medium text-primary-800 lg:hidden">{labels.columnWhy}</p>
                  <p className="text-sm text-secondary-700">
                    {scoreLine ? (
                      <>
                        <span className="font-medium text-secondary-900">{s.impactLabel[lo]}</span>
                        <span className="mx-1 text-secondary-400">·</span>
                        <span className="text-secondary-600">
                          {lo === 'ar' ? 'النقاط: ' : 'Score: '}
                          {scoreLine}
                        </span>
                      </>
                    ) : (
                      s.impactLabel[lo]
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-col gap-1 border-t border-secondary-200 pt-4 sm:flex-row sm:items-baseline sm:justify-between">
          <span className="text-sm font-semibold text-secondary-800">{labels.subtotal}</span>
          <span className="text-base font-semibold tabular-nums text-secondary-900">
            {formatMoney(subtotalMin, locale)}–{formatMoney(subtotalMax, locale)} {lo === 'ar' ? 'ج.م' : 'EGP'}
          </span>
        </div>
    </div>
  );
}
