'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { ManagementMode } from '@/models';
import { cn } from '@/lib/utils';
import { Building2, Hand, Wrench } from 'lucide-react';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

/** Aligns with access-step gating: higher = more operational burden DIY */
const HASSLE_BY_MODE: Record<ManagementMode, number> = {
  MANAGED: 5,
  DIY_ASSISTED: 6,
  DIY_FULL: 9,
};

export function Step5Hassle() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const modeErr = useWizardFieldError('mode');
  const hassleErr = useWizardFieldError('hassleLevel');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'ناوي تدير العقار إزاي؟' : 'How do you plan to manage the property?'}
        </h2>
      </div>

      <div
        data-wizard-field="mode"
        className={cn(
          'flex flex-col gap-4 mt-8 sm:mt-10 rounded-xl p-1',
          (modeErr.invalid || hassleErr.invalid) && 'border-2 border-red-500'
        )}
      >
        {[
          {
            id: 'MANAGED',
            icon: Building2,
            en: 'A management company handles everything',
            ar: 'شركة إدارة متخصصة تشيل عني كل حاجة',
            descEn: 'Fully passive income. We handle keys, cleaning, and guest ops.',
            descAr: 'دخل سلبي بالكامل. إحنا بنستلم المفاتيح، وبنهتم بالتنضيف، وكل رسايل الضيوف.',
          },
          {
            id: 'DIY_ASSISTED',
            icon: Wrench,
            en: 'Co-management: I’ll run it, but I need help with some things',
            ar: 'إدارة مشتركة: هدير بنفسي بس محتاج مساعدة في حاجات معينة',
            descEn: 'You stay hands-on; we fill gaps with targeted services.',
            descAr: 'إنت بتدير بنفسك، وإحنا بنسد الفجوات بخدماتنا المتخصصة.',
          },
          {
            id: 'DIY_FULL',
            icon: Hand,
            en: 'Full DIY: I’ll do everything myself',
            ar: 'هدير كل حاجة بنفسي بالكامل',
            descEn: 'Deep checklist and optional consult: you own every detail.',
            descAr: 'هنديك قائمة بكل التفاصيل، وإنت اللي بتتحكم في كل صغيرة وكبيرة.',
          },
        ].map((opt) => {
          const isSelected = data.mode === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                updateData({
                  mode: opt.id as ManagementMode,
                  hassleLevel: HASSLE_BY_MODE[opt.id as ManagementMode],
                })
              }
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none text-start group',
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg mr-4 ml-4 transition-colors',
                  isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-600'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={cn(
                    'font-heading font-bold text-lg',
                    isSelected ? 'text-primary-900' : 'text-secondary-900'
                  )}
                >
                  {locale === 'ar' ? opt.ar : opt.en}
                </h3>
                <p className="text-secondary-500 text-sm mt-1">{locale === 'ar' ? opt.descAr : opt.descEn}</p>
              </div>
            </button>
          );
        })}
      </div>
      <WizardInlineFieldError message={modeErr.error} />
      <WizardInlineFieldError message={hassleErr.error} />
    </div>
  );
}
