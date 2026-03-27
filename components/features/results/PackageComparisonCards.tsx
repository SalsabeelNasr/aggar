'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { PackageResult, CustomPackageResult, PackageType } from '@/lib/engines/packageBuilder';

interface PackageComparisonCardsProps {
  packages: {
    quick_start: PackageResult;
    sweet_spot: PackageResult;
    asset_flip: PackageResult;
    custom: CustomPackageResult;
  };
  selectedPackage: PackageType;
  onSelect: (type: PackageType) => void;
  lo: 'en' | 'ar';
}

const PACKAGE_ORDER: PackageType[] = ['quick_start', 'sweet_spot', 'asset_flip', 'custom'];

export function PackageComparisonCards({ packages, selectedPackage, onSelect, lo }: PackageComparisonCardsProps) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {PACKAGE_ORDER.map((type) => {
        const isCustom = type === 'custom';
        const isRecommended = type === 'sweet_spot';
        const pkg = isCustom ? packages.custom : packages[type as keyof Omit<typeof packages, 'custom'>];
        const isSelected = selectedPackage === type;

        const name = pkg.name_en;
        const nameAr = pkg.name_ar;
        const fitsBudget = !isCustom && (pkg as PackageResult).fits_budget;
        const scoreGain = isCustom ? 0 : (pkg as PackageResult).total_score_gain;

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              'relative flex w-full flex-col items-start gap-0.5 overflow-visible rounded-xl border-2 p-2 pt-5 min-h-[40px] text-start text-sm transition-all duration-200',
              isSelected
                ? 'border-primary-600 bg-primary-50 shadow-sm'
                : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
            )}
          >
            {/* Budget fit badge */}
            {!isCustom && fitsBudget && (
              <span className="absolute start-2 top-2 rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                {lo === 'ar' ? 'يناسب ميزانيتك' : 'Fits budget'}
              </span>
            )}

            <div className="w-full px-1 pb-1">
              <p className={cn('font-heading font-bold text-sm leading-snug', isSelected ? 'text-primary-900' : 'text-secondary-900')}>
                {lo === 'ar' ? nameAr : name}
              </p>
            </div>

            {isRecommended && (
              <span className="absolute end-2 top-0 z-10 -translate-y-1/2 rounded-full bg-primary-700 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                {lo === 'ar' ? 'موصى به' : 'Recommended'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
