'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/data/services';
import { serviceNameLocalized, serviceDescriptionLocalized } from '@/lib/data/services';
import { computeCustomTotals } from '@/lib/engines/packageBuilder';
import { formatMoney } from './utils';
import { PackageTopMetrics } from './PackageTopMetrics';

interface CustomPackageBuilderProps {
  allServices: Service[];
  enabledServiceIds: string[];
  isNeeded: Record<string, boolean>;
  onToggle: (id: string) => void;
  locale: string;
  lo: 'en' | 'ar';
  sectionSubtitle: string;
  currentNetMonthlyEgp: number;
  netMonthlyEgp: number;
  breakEvenMonths: { min: number; max: number } | null;
  year1ProjectedNetEgp: { min: number; max: number } | null;
}

export function CustomPackageBuilder({
  allServices,
  enabledServiceIds,
  isNeeded,
  onToggle,
  locale,
  lo,
  sectionSubtitle,
  currentNetMonthlyEgp,
  netMonthlyEgp,
  breakEvenMonths,
  year1ProjectedNetEgp,
}: CustomPackageBuilderProps) {
  const totals = React.useMemo(
    () => computeCustomTotals(allServices, enabledServiceIds),
    [allServices, enabledServiceIds]
  );

  // Group by category
  const grouped = React.useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of allServices) {
      const group = map.get(s.category) ?? [];
      group.push(s);
      map.set(s.category, group);
    }
    return map;
  }, [allServices]);

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    cleaning: { en: 'Cleaning', ar: 'التنضيف' },
    photography: { en: 'Photography & Listing', ar: 'التصوير والإعلان' },
    furniture: { en: 'Furniture & Design', ar: 'الفرش والديكور' },
    renovation: { en: 'Renovation', ar: 'التشطيبات' },
    tech: { en: 'Technology & Access', ar: 'التكنولوجيا والدخول' },
    operations: { en: 'Operations & Pricing', ar: 'التشغيل والتسعير' },
    compliance: { en: 'Compliance', ar: 'التراخيص والامتثال' },
    comfort: { en: 'Guest Comfort', ar: 'راحة الضيف' },
  };

  return (
    <div className="space-y-4">
      <PackageTopMetrics
        sectionSubtitle={sectionSubtitle}
        currentNetMonthlyEgp={currentNetMonthlyEgp}
        servicesCostMin={totals.total_cost_min}
        servicesCostMax={totals.total_cost_max}
        netMonthlyEgp={netMonthlyEgp}
        breakEvenMonths={breakEvenMonths}
        year1ProjectedNetEgp={year1ProjectedNetEgp}
        locale={locale}
        lo={lo}
      />

      {/* Service groups */}
      {Array.from(grouped.entries()).map(([category, services]) => {
        const label = categoryLabels[category] ?? { en: category, ar: category };
        return (
          <div key={category}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary-500">{label[lo]}</h4>
            <div className="space-y-2">
              {services.map((s) => {
                const name = serviceNameLocalized(s);
                const desc = serviceDescriptionLocalized(s);
                const enabled = enabledServiceIds.includes(s.id);
                const needed = isNeeded[s.id];

                const costStr =
                  s.cost_unit === 'percent_of_revenue'
                    ? `${s.cost_pct_min}–${s.cost_pct_max}%`
                    : s.cost_unit === 'per_sqm'
                      ? `${formatMoney(s.cost_min_egp, locale)}–${formatMoney(s.cost_max_egp, locale)} /m²`
                      : `${formatMoney(s.cost_min_egp, locale)}–${formatMoney(s.cost_max_egp, locale)}`;

                return (
                  <div
                    key={s.id}
                    className={cn(
                      'rounded-xl border p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4',
                      enabled ? 'border-primary-200 bg-primary-50/30' : 'border-secondary-200 bg-white'
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-secondary-900">{name[lo]}</p>
                        {needed && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            {lo === 'ar' ? 'مطلوب' : 'Needed'}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-secondary-600 line-clamp-1">{desc[lo]}</p>
                    </div>
                    <p className="mt-2 text-sm font-semibold tabular-nums text-secondary-900 sm:mt-0 sm:text-end">
                      {costStr}
                      {s.cost_unit === 'fixed' && (
                        <span className="ms-1 text-xs font-normal text-secondary-500">
                          {lo === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => onToggle(s.id)}
                      className={cn(
                        'mt-2 shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold shadow-xs transition-colors sm:mt-0',
                        enabled
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-secondary-200 bg-white text-secondary-800 hover:border-primary-300'
                      )}
                    >
                      {enabled ? (lo === 'ar' ? 'مفعّل' : 'On') : (lo === 'ar' ? 'إيقاف' : 'Off')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
