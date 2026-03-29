'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { ListingStatus, PropertyStateFlag } from '@/models';
import { Building2, TrendingDown, TrendingUp, Wand2 } from 'lucide-react';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

const options: Array<{
  id: ListingStatus;
  icon: React.ComponentType<{ className?: string }>;
  en: string;
  ar: string;
  hintEn: string;
  hintAr: string;
  impliedStateFlag?: PropertyStateFlag;
}> = [
  {
    id: 'not_listed',
    icon: Building2,
    en: 'No, not listed yet',
    ar: 'لا، لسه مابدأتش',
    hintEn: 'We’ll run the full evaluation.',
    hintAr: 'هنعمل تقييم كامل لكل تفاصيل العقار.',
  },
  {
    id: 'listed_doing_well',
    icon: TrendingUp,
    en: "Yes, and it's doing well",
    ar: 'أيوه، وشغال كويس جداً',
    hintEn: 'We’ll focus on optimization and management.',
    hintAr: 'هنركز إزاي نعلي أرباحك أكتر ونريحك من الإدارة.',
    impliedStateFlag: 'FURNISHED',
  },
  {
    id: 'listed_underperform',
    icon: TrendingDown,
    en: "Yes, but it's not getting enough bookings",
    ar: 'أيوه، بس الحجوزات قليلة',
    hintEn: 'We’ll diagnose performance and suggest fixes.',
    hintAr: 'هنشوف إيه اللي معطل الحجوزات ونقترح حلول فورية.',
    impliedStateFlag: 'FURNISHED',
  },
  {
    id: 'listed_barely_any_bookings',
    icon: Wand2,
    en: 'Yes, barely any bookings',
    ar: 'أيوه، بس مفيش حجوزات تقريباً',
    hintEn: 'We’ll run a deeper performance audit.',
    hintAr: 'هنعمل مراجعة عميقة للأداء ونعرف السبب فين.',
    impliedStateFlag: 'FURNISHED',
  },
];

export function Step0Listed() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const listingErr = useWizardFieldError('listingStatus');
  const isAr = locale === 'ar';

  const selected = data.listingStatus;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar'
            ? 'هل عقارك مُعلن بالفعل على Airbnb أو Booking.com؟'
            : 'Is your property already listed on any platform?'}
        </h2>
      </div>

      <div
        data-wizard-field="listingStatus"
        className={cn(
          'grid grid-cols-1 gap-4 rounded-xl p-1',
          listingErr.invalid && 'border-2 border-red-500'
        )}
      >
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              onClick={() => {
                updateData({
                  listingStatus: opt.id,
                  ...(opt.impliedStateFlag ? { stateFlag: opt.impliedStateFlag } : {}),
                });
              }}
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-start group',
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg mr-4 ml-4 transition-colors shrink-0',
                  isSelected ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3
                  className={cn(
                    'font-heading font-bold text-lg',
                    isSelected ? 'text-primary-900' : 'text-secondary-900'
                  )}
                >
                  {locale === 'ar' ? opt.ar : opt.en}
                </h3>
                <p className="text-secondary-500 text-sm mt-1">
                  {locale === 'ar' ? opt.hintAr : opt.hintEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <WizardInlineFieldError message={listingErr.error} />
    </div>
  );
}

