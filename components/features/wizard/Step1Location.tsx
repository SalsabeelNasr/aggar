'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { getRegions } from '@/services/mockApi';
import { Region, RegionId } from '@/models';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

export function Step1Location() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const [regions, setRegions] = React.useState<Region[]>([]);
  const cardRegionIds: RegionId[] = ['new_cairo', 'sheikh_zayed', 'north_coast', 'el_gouna'];

  React.useEffect(() => {
    getRegions().then(setRegions);
  }, []);

  /** `other` is not selectable — results need a concrete regional baseline. */
  React.useEffect(() => {
    if (data.regionId === 'other') {
      updateData({ regionId: undefined });
    }
  }, [data.regionId, updateData]);

  const selectedRegion = regions.find((r) => r.id === data.regionId);
  const cardRegions = regions.filter((r) => cardRegionIds.includes(r.id as RegionId));
  const dropdownRegions = regions.filter(
    (r) => !cardRegionIds.includes(r.id as RegionId) && r.id !== 'other'
  );
  const regionErr = useWizardFieldError('regionId');
  const addressErr = useWizardFieldError('address');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'عقارك موجود فين؟' : 'Where is your property located?'}
        </h2>
      </div>

      <div
        data-wizard-field="regionId"
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl p-1',
          regionErr.invalid && 'border-2 border-red-500'
        )}
      >
        {cardRegions.map((region) => {
          const isSelected = data.regionId === region.id;
          return (
            <button
              key={region.id}
              onClick={() => updateData({ regionId: region.id })}
              className={cn(
                'flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm text-primary-900' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50 text-secondary-900'
              )}
            >
              <MapPin className={cn("w-8 h-8 mb-4", isSelected ? "text-primary-600" : "text-secondary-400")} />
              <span className="font-heading font-bold whitespace-nowrap">{region.name[locale as 'en'|'ar']}</span>
            </button>
          );
        })}
      </div>
      <WizardInlineFieldError message={regionErr.error} />

      <div className="mt-5 bg-white border border-secondary-200 rounded-2xl p-4 shadow-sm">
        <label className="font-bold text-secondary-900 font-heading block mb-2">
          {locale === 'ar' ? 'مناطق تانية بندعمها' : 'Other supported locations'}
        </label>
        <select
          data-wizard-field="regionId"
          className={cn(
            'w-full border-2 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors bg-white',
            regionErr.invalid ? 'border-red-500' : 'border-secondary-200'
          )}
          aria-invalid={regionErr.invalid || undefined}
          value={dropdownRegions.some((r) => r.id === data.regionId) ? data.regionId : ''}
          onChange={(e) => {
            const selectedId = e.target.value as RegionId;
            if (!selectedId) return;
            updateData({ regionId: selectedId });
          }}
        >
          <option value="">{locale === 'ar' ? 'اختار منطقة تانية' : 'Select another location'}</option>
          {dropdownRegions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name[locale as 'en' | 'ar']}
            </option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-primary-900 font-medium text-center text-sm md:text-base">
            💡 {selectedRegion.marketFact[locale as 'en'|'ar']}
          </p>
        </div>
      )}

      <div className="mt-8 bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading">
            {locale === 'ar' ? 'العنوان أو اسم الكمبوند' : 'Address or compound name'}
          </label>
          <input
            type="text"
            data-wizard-field="address"
            className={cn(
              'border-2 rounded-lg p-3 outline-none transition-colors',
              addressErr.invalid ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'
            )}
            aria-invalid={addressErr.invalid || undefined}
            placeholder={locale === 'ar' ? 'مثلاً: ميفيدا، التجمع الخامس' : 'e.g., Mivida, Fifth Settlement'}
            value={data.address ?? ''}
            onChange={(e) => updateData({ address: e.target.value })}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          <WizardInlineFieldError message={addressErr.error} />
        </div>
      </div>
    </div>
  );
}
