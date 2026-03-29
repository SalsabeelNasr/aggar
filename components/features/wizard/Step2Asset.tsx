'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { OutdoorSpaceId, PropertyType } from '@/models';
import { cn } from '@/lib/utils';
import { YesNoSwitchRow } from '@/components/features/wizard/state-details/YesNoSwitch';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';
import { Home, Building, Blocks, Tent } from 'lucide-react';

function toggleId<T extends string>(list: T[] | undefined, id: T): T[] {
  const next = new Set(list ?? []);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return Array.from(next);
}

const types: { id: PropertyType; icon: any; ar: string; en: string }[] = [
  { id: 'apartment', icon: Building, ar: 'شقة', en: 'Apartment' },
  { id: 'villa', icon: Home, ar: 'فيلا', en: 'Villa' },
  { id: 'chalet', icon: Tent, ar: 'شاليه', en: 'Chalet' },
  { id: 'studio', icon: Blocks, ar: 'ستوديو', en: 'Studio' },
];

export function Step2Asset() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const isAr = locale === 'ar';
  const ptErr = useWizardFieldError('propertyType');
  const brErr = useWizardFieldError('bedrooms');
  const bathErr = useWizardFieldError('bathrooms');
  const sleepErr = useWizardFieldError('sleepCapacity');
  const sqmErr = useWizardFieldError('propertySizeSqm');
  const gatedErr = useWizardFieldError('inGatedCompound');
  const liftErr = useWizardFieldError('hasLift');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'إيه نوع عقارك؟' : 'What type of property is it?'}
        </h2>
      </div>

      <div
        data-wizard-field="propertyType"
        className={cn(
          'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 rounded-xl p-1',
          ptErr.invalid && 'border-2 border-red-500'
        )}
      >
        {types.map((type) => {
          const isSelected = data.propertyType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => updateData({ propertyType: type.id })}
              className={cn(
                'flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm text-primary-900' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50 text-secondary-900'
              )}
            >
              <type.icon className={cn("w-8 h-8 mb-4", isSelected ? "text-primary-600" : "text-secondary-400")} />
              <span className="font-heading font-bold">{locale === 'ar' ? type.ar : type.en}</span>
            </button>
          );
        })}
      </div>
      <WizardInlineFieldError message={ptErr.error} />

      <div className="mt-6 bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-secondary-900">{locale === 'ar' ? 'عدد غرف النوم' : 'Bedrooms'}</label>
            <input
              type="number"
              min="0"
              max="10"
              data-wizard-field="bedrooms"
              className={cn(
                'border-2 rounded-lg p-3 outline-none transition-colors',
                brErr.invalid ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'
              )}
              aria-invalid={brErr.invalid || undefined}
              value={data.bedrooms}
              onChange={(e) => updateData({ bedrooms: Number(e.target.value) })}
            />
            <WizardInlineFieldError message={brErr.error} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-secondary-900">{locale === 'ar' ? 'عدد الحمامات' : 'Bathrooms'}</label>
            <input
              type="number"
              min="1"
              max="10"
              data-wizard-field="bathrooms"
              className={cn(
                'border-2 rounded-lg p-3 outline-none transition-colors',
                bathErr.invalid ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'
              )}
              aria-invalid={bathErr.invalid || undefined}
              value={data.bathrooms}
              onChange={(e) => updateData({ bathrooms: Number(e.target.value) })}
            />
            <WizardInlineFieldError message={bathErr.error} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-secondary-900">
              {locale === 'ar' ? 'بيشيل كام ضيف؟ (السعة)' : 'Sleep Capacity'}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              data-wizard-field="sleepCapacity"
              className={cn(
                'border-2 rounded-lg p-3 outline-none transition-colors',
                sleepErr.invalid ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'
              )}
              aria-invalid={sleepErr.invalid || undefined}
              value={data.sleepCapacity}
              onChange={(e) => updateData({ sleepCapacity: Number(e.target.value) })}
            />
            <WizardInlineFieldError message={sleepErr.error} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full">
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-secondary-900 font-heading">
              {isAr ? 'مساحة العقار (متر مربع)' : 'Property size (sqm)'}
            </label>
            <input
              type="number"
              min={10}
              max={2000}
              data-wizard-field="propertySizeSqm"
              value={data.propertySizeSqm ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : Number(e.target.value);
                updateData({ propertySizeSqm: val });
              }}
              placeholder={isAr ? 'مثلاً: 120' : 'e.g. 120'}
              className={cn(
                'w-full border-2 rounded-lg p-3 outline-none transition-colors',
                sqmErr.invalid ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'
              )}
              aria-invalid={sqmErr.invalid || undefined}
            />
            <WizardInlineFieldError message={sqmErr.error} />
          </div>
        </div>

        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
              {locale === 'ar' ? 'هل العقار جوه كمبوند؟' : 'Is the property in a gated compound?'}
            </div>
            <div
              data-wizard-field="inGatedCompound"
              className={cn(
                'shrink-0 rounded-xl p-1',
                gatedErr.invalid && 'border-2 border-red-500'
              )}
            >
              <YesNoSwitchRow
                isAr={isAr}
                yesSelected={data.regulatory?.inGatedCompound === true}
                onToggle={() =>
                  updateData({
                    regulatory: {
                      ...data.regulatory,
                      inGatedCompound: !(data.regulatory?.inGatedCompound === true),
                    },
                  })
                }
                ariaLabel={isAr ? 'تبديل: عقار داخل كمبوند' : 'Toggle: gated compound'}
              />
            </div>
          </div>
          <WizardInlineFieldError message={gatedErr.error} />
        </div>

        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
              {locale === 'ar' ? 'هل فيه أسانسير؟' : 'Does the building have a lift?'}
            </div>
            <div
              data-wizard-field="hasLift"
              className={cn(
                'shrink-0 rounded-xl p-1',
                liftErr.invalid && 'border-2 border-red-500'
              )}
            >
              <YesNoSwitchRow
                isAr={isAr}
                yesSelected={data.regulatory?.hasLift === true}
                onToggle={() =>
                  updateData({
                    regulatory: {
                      ...data.regulatory,
                      hasLift: !(data.regulatory?.hasLift === true),
                    },
                  })
                }
                ariaLabel={isAr ? 'تبديل: يوجد مصعد' : 'Toggle: building has lift'}
              />
            </div>
          </div>
          <WizardInlineFieldError message={liftErr.error} />
        </div>

        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-secondary-900 font-heading">
              {locale === 'ar' ? 'الدور الكام؟' : 'Floor'}
            </label>
            <input
              type="number"
              min="0"
              className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
              value={data.regulatory?.floorNumber ?? ''}
              onChange={(e) =>
                updateData({
                  regulatory: {
                    ...data.regulatory,
                    floorNumber: e.target.value === '' ? undefined : Number(e.target.value),
                  },
                })
              }
            />
          </div>

          <div className="mt-6 pt-6 border-t border-secondary-200">
            <div className="font-heading font-bold text-secondary-900 mb-3">
              {isAr ? 'المساحات الخارجية' : 'Outdoor space'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { id: 'balcony' as const, en: 'Balcony', ar: 'بلكونة' },
                { id: 'terrace' as const, en: 'تراس', ar: 'تراس' },
                { id: 'garden' as const, en: 'Garden', ar: 'جنينة' },
              ] satisfies { id: OutdoorSpaceId; en: string; ar: string }[]
            ).map((opt) => {
              const selected = (data.outdoorSpace ?? []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateData({ outdoorSpace: toggleId(data.outdoorSpace, opt.id) })}
                  className={cn(
                    'px-3 py-2 rounded-xl border text-sm font-semibold',
                    selected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-secondary-50 border-secondary-200 text-secondary-800 hover:border-primary-300'
                  )}
                >
                  {isAr ? opt.ar : opt.en}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
