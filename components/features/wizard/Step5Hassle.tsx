'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { ManagementMode } from '@/models';
import { cn } from '@/lib/utils';
import { Building2, Hand, Wrench } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['mode', 'hassleLevel']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'كيف تخطط لإدارة العقار؟' : 'How do you plan to manage the property?'}
        </h2>
      </div>

      <div
        className={cn(
          'flex flex-col gap-4 mt-8 sm:mt-10 rounded-xl p-1 -m-1',
          modeErr.invalid && 'ring-2 ring-red-500 ring-offset-2'
        )}
      >
        {[
          {
            id: 'MANAGED',
            icon: Building2,
            en: 'A management company handles everything',
            ar: 'شركة تشغيل تدير كل شيء',
            descEn: 'Fully passive income. We handle keys, cleaning, and guest ops.',
            descAr: 'دخل شبه سلبي بالكامل. نحن نتولى المفاتيح والنظافة وتشغيل الضيوف.',
          },
          {
            id: 'DIY_ASSISTED',
            icon: Wrench,
            en: 'Co-management: I’ll run it, but I need help with some things',
            ar: 'إدارة مشتركة: سأدير بنفسي لكن أحتاج مساعدة في بعض الأشياء',
            descEn: 'You stay hands-on; we fill gaps with targeted services.',
            descAr: 'أنت تبقى يدك على التشغيل؛ ونحن نسد الفجوات بخدمات موجهة.',
          },
          {
            id: 'DIY_FULL',
            icon: Hand,
            en: 'Full DIY: I’ll do everything myself',
            ar: 'DIY كامل: سأفعل كل شيء بنفسي',
            descEn: 'Deep checklist and optional consult: you own every detail.',
            descAr: 'قائمة تفصيلية واستشارة اختيارية: كل التفاصيل عندك.',
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
    </div>
  );
}
