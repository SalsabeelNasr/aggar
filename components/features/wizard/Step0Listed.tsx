'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type {
  FurnishedBuildingSecurity,
  FurnishedLeadQualification,
  FurnishedStrInsuranceCoverage,
  FurnishedTourismLicenseStatus,
  ListingStatus,
  PropertyStateFlag,
} from '@/models';
import { Building2, TrendingDown, TrendingUp, Wand2 } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

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
    ar: 'لا، ليس مُعلنًا بعد',
    hintEn: 'We’ll run the full evaluation.',
    hintAr: 'سنقوم بالتقييم الكامل.',
  },
  {
    id: 'listed_doing_well',
    icon: TrendingUp,
    en: "Yes, and it's doing well",
    ar: 'نعم، الأداء ممتاز',
    hintEn: 'We’ll focus on optimization and management.',
    hintAr: 'سنركز على التحسين والتشغيل.',
    impliedStateFlag: 'FURNISHED',
  },
  {
    id: 'listed_underperform',
    icon: TrendingDown,
    en: "Yes, but it's not getting enough bookings",
    ar: 'نعم، لكن الحجوزات ضعيفة',
    hintEn: 'We’ll diagnose performance and suggest fixes.',
    hintAr: 'سنشخص سبب الضعف ونقترح حلولًا.',
    impliedStateFlag: 'FURNISHED',
  },
  {
    id: 'listed_barely_any_bookings',
    icon: Wand2,
    en: 'Yes, barely any bookings',
    ar: 'نعم، بالكاد توجد حجوزات',
    hintEn: 'We’ll run a deeper performance audit.',
    hintAr: 'سنقوم بتدقيق أعمق للأداء.',
    impliedStateFlag: 'FURNISHED',
  },
];

export function Step0Listed() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const listingErr = useWizardFieldError('listingStatus');
  const isAr = locale === 'ar';
  const flq = data.furnishedLeadQualification;

  const selected = data.listingStatus;
  const patchFlq = (patch: Partial<FurnishedLeadQualification>) => {
    updateData({
      furnishedLeadQualification: { ...data.furnishedLeadQualification, ...patch },
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['listingStatus', 'buildingSecurity', 'tourismLicenseStatus', 'strInsuranceCoverage']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar'
            ? 'هل عقارك مُعلن بالفعل على Airbnb أو Booking.com؟'
            : 'Is your property already listed on any platform?'}
        </h2>
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-4 rounded-xl p-1 -m-1',
          listingErr.invalid && 'ring-2 ring-red-500 ring-offset-2'
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
                'flex items-start gap-4 p-5 rounded-2xl border-2 text-start transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30',
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-xl border shrink-0',
                  isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-secondary-50 text-secondary-700 border-secondary-200'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className={cn('font-heading font-bold text-lg', isSelected ? 'text-primary-900' : 'text-secondary-900')}>
                  {locale === 'ar' ? opt.ar : opt.en}
                </div>
                <div className="text-secondary-600 text-sm mt-1">
                  {locale === 'ar' ? opt.hintAr : opt.hintEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-8 bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'الأمان والامتثال' : 'Safety & compliance'}
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isAr ? 'أمان المبنى' : 'Building security'}
            </label>
            <select
              className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
              value={flq?.buildingSecurity ?? ''}
              onChange={(e) =>
                patchFlq({ buildingSecurity: (e.target.value || undefined) as FurnishedBuildingSecurity | undefined })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="compound_24_7">{isAr ? 'كمبوند بحماية 24/7' : '24/7 gated / compound security'}</option>
              <option value="bawab">{isAr ? 'عمارة مع بوّاب' : 'Building with doorman (bawab)'}</option>
              <option value="unsecured_street">{isAr ? 'وصول من الشارع بدون حراسة ثابتة' : 'Street-level / unsecured access'}</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isAr ? 'ترخيص سياحي/تجاري للوحدة؟' : 'Commercial / tourism license for this unit?'}
            </label>
            <select
              className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
              value={flq?.tourismLicenseStatus ?? ''}
              onChange={(e) =>
                patchFlq({ tourismLicenseStatus: (e.target.value || undefined) as FurnishedTourismLicenseStatus | undefined })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="yes">{isAr ? 'نعم' : 'Yes'}</option>
              <option value="no">{isAr ? 'لا' : 'No'}</option>
              <option value="need_help">{isAr ? 'أحتاج مساعدة للحصول عليه' : 'I need help getting one'}</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isAr ? 'هل يغطي التأمين أضرار الإيجار قصير الأمد؟' : 'Does insurance cover short-term rental damage?'}
            </label>
            <select
              className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
              value={flq?.strInsuranceCoverage ?? ''}
              onChange={(e) =>
                patchFlq({ strInsuranceCoverage: (e.target.value || undefined) as FurnishedStrInsuranceCoverage | undefined })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="yes">{isAr ? 'نعم' : 'Yes'}</option>
              <option value="no">{isAr ? 'لا' : 'No'}</option>
              <option value="unknown">{isAr ? 'لا أعرف' : "I don't know"}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

