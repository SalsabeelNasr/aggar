'use client';

import * as React from 'react';
import type { Service } from '@/lib/data/services';
import { serviceNameLocalized, serviceDescriptionLocalized } from '@/lib/data/services';
import { formatMoney } from './utils';
import { PackageTopMetrics } from './PackageTopMetrics';

interface PackageDetailPanelProps {
  services: Service[];
  sectionSubtitle: string;
  currentNetMonthlyEgp: number;
  netMonthlyEgp: number;
  breakEvenMonths: { min: number; max: number } | null;
  year1ProjectedNetEgp: { min: number; max: number } | null;
  totalCostMin: number;
  totalCostMax: number;
  locale: string;
  lo: 'en' | 'ar';
}

export function PackageDetailPanel({
  services,
  sectionSubtitle,
  currentNetMonthlyEgp,
  netMonthlyEgp,
  breakEvenMonths,
  year1ProjectedNetEgp,
  totalCostMin,
  totalCostMax,
  locale,
  lo,
}: PackageDetailPanelProps) {
  return (
    <div className="space-y-3">
      <PackageTopMetrics
        sectionSubtitle={sectionSubtitle}
        currentNetMonthlyEgp={currentNetMonthlyEgp}
        servicesCostMin={totalCostMin}
        servicesCostMax={totalCostMax}
        netMonthlyEgp={netMonthlyEgp}
        breakEvenMonths={breakEvenMonths}
        year1ProjectedNetEgp={year1ProjectedNetEgp}
        locale={locale}
        lo={lo}
      />

      {/* Service list */}
      <div className="space-y-2">
        {services.length === 0 ? (
          <div className="rounded-xl border border-secondary-200 bg-secondary-50/40 p-6 text-center">
            <p className="text-sm text-secondary-600">
              {lo === 'ar' ? 'لا توجد خدمات مطلوبة لهذا المستوى.' : 'No services needed at this tier.'}
            </p>
          </div>
        ) : (
          services.map((s) => {
            const name = serviceNameLocalized(s);
            const desc = serviceDescriptionLocalized(s);
            const costStr =
              s.cost_unit === 'percent_of_revenue'
                ? `${s.cost_pct_min}–${s.cost_pct_max}% ${lo === 'ar' ? 'من الإيراد' : 'of revenue'}`
                : s.cost_unit === 'per_sqm'
                  ? `${formatMoney(s.cost_min_egp, locale)}–${formatMoney(s.cost_max_egp, locale)} ${lo === 'ar' ? '/م²' : '/sqm'}`
                  : `${formatMoney(s.cost_min_egp, locale)}–${formatMoney(s.cost_max_egp, locale)} ${lo === 'ar' ? 'ج.م' : 'EGP'}`;

            return (
              <div
                key={s.id}
                className="rounded-xl border border-secondary-200 bg-white p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-secondary-900">{name[lo]}</p>
                  <p className="mt-1 text-sm text-secondary-600 line-clamp-2">{desc[lo]}</p>
                </div>
                <div className="mt-2 flex items-center gap-3 sm:mt-0 sm:flex-col sm:items-end">
                  <p className="text-sm font-semibold tabular-nums text-secondary-900">{costStr}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
