'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { PackageResult, CustomPackageResult, PackageType } from '@/lib/engines/packageBuilder';
import { formatMoney } from './utils';

interface PackageComparisonCardsProps {
  packages: {
    quick_start: PackageResult;
    sweet_spot: PackageResult;
    asset_flip: PackageResult;
    custom: CustomPackageResult;
  };
  selectedPackage: PackageType;
  onSelect: (type: PackageType) => void;
  locale: string;
  lo: 'en' | 'ar';
}

const PACKAGE_ORDER: PackageType[] = ['quick_start', 'sweet_spot', 'asset_flip', 'custom'];

export function PackageComparisonCards({ packages, selectedPackage, onSelect, locale, lo }: PackageComparisonCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {PACKAGE_ORDER.map((type) => {
        const isCustom = type === 'custom';
        const pkg = isCustom ? packages.custom : packages[type as keyof Omit<typeof packages, 'custom'>];
        const isSelected = selectedPackage === type;

        const name = pkg.name_en;
        const nameAr = pkg.name_ar;
        const fitsBudget = !isCustom && (pkg as PackageResult).fits_budget;
        const costMin = isCustom ? 0 : (pkg as PackageResult).total_cost_min;
        const costMax = isCustom ? 0 : (pkg as PackageResult).total_cost_max;
        const scoreGain = isCustom ? 0 : (pkg as PackageResult).total_score_gain;
        const serviceCount = isCustom
          ? (pkg as CustomPackageResult).all_services.length
          : (pkg as PackageResult).services.length;
        const budgetMax = !isCustom ? (pkg as PackageResult).user_budget_max : undefined;

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              'relative flex h-auto min-h-[7rem] w-full flex-col items-stretch justify-between overflow-hidden rounded-xl border-2 p-3 text-start text-sm transition-all duration-200',
              isSelected
                ? 'border-primary-600 bg-primary-50 shadow-sm'
                : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
            )}
          >
            {/* Budget fit badge */}
            {!isCustom && fitsBudget && (
              <span className="absolute end-2 top-2 rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                {lo === 'ar' ? 'يناسب ميزانيتك' : 'Fits budget'}
              </span>
            )}

            <div>
              <p className={cn('font-heading font-bold text-sm leading-snug', isSelected ? 'text-primary-900' : 'text-secondary-900')}>
                {lo === 'ar' ? nameAr : name}
              </p>

              {!isCustom && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-secondary-600">
                    {formatMoney(costMin, locale)} – {formatMoney(costMax, locale)}
                    <span className="ms-1 text-secondary-400">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </p>
                  {budgetMax != null && budgetMax < Infinity && (
                    <p className="text-[10px] text-secondary-500">
                      {lo === 'ar' ? 'ميزانيتك:' : 'Your budget:'}{' '}
                      {formatMoney(budgetMax, locale)} {lo === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-secondary-500">
              <span>{serviceCount} {lo === 'ar' ? 'خدمة' : 'services'}</span>
              {!isCustom && scoreGain > 0 && (
                <span className="text-primary-700 font-medium">+{scoreGain} {lo === 'ar' ? 'نقطة' : 'pts'}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
