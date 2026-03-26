'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/data/services';
import { serviceNameLocalized, serviceDescriptionLocalized } from '@/lib/data/services';
import { formatMoney } from './utils';

interface PackageDetailPanelProps {
  services: Service[];
  totalCostMin: number;
  totalCostMax: number;
  totalScoreGain: number;
  locale: string;
  lo: 'en' | 'ar';
}

export function PackageDetailPanel({
  services,
  totalCostMin,
  totalCostMax,
  totalScoreGain,
  locale,
  lo,
}: PackageDetailPanelProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-secondary-200 bg-secondary-50/40 p-6 text-center">
        <p className="text-sm text-secondary-600">
          {lo === 'ar' ? 'لا توجد خدمات مطلوبة لهذا المستوى.' : 'No services needed at this tier.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-xl border border-secondary-200 bg-secondary-50/40 px-4 py-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-secondary-500">
            {lo === 'ar' ? 'إجمالي التكلفة' : 'Total cost'}
          </span>
          <p className="text-lg font-semibold tabular-nums text-secondary-900">
            {formatMoney(totalCostMin, locale)} – {formatMoney(totalCostMax, locale)}{' '}
            <span className="text-sm font-normal text-secondary-500">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
          </p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-secondary-500">
            {lo === 'ar' ? 'تحسين النقاط' : 'Score gain'}
          </span>
          <p className="text-lg font-semibold text-primary-700">+{totalScoreGain} {lo === 'ar' ? 'نقطة' : 'pts'}</p>
        </div>
      </div>

      {/* Service list */}
      <div className="space-y-2">
        {services.map((s) => {
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
                {s.score_contribution > 0 && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    +{s.score_contribution} {lo === 'ar' ? 'نقطة' : 'pts'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
