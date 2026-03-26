'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { FurnishedLeadQualification, FurnishedOperationalPainId, ManagementMode } from '@/models';
import { isFurnishedPerformanceSectionVisible } from '@/lib/wizard/furnishedPerformanceVisibility';
import { GuestAccessReliabilityChoice } from '@/components/features/wizard/state-details/GuestAccessReliabilityChoice';
import {
  ManagedCleaningTeamField,
  ManagedPropertyManagerField,
} from '@/components/features/wizard/state-details/ManagedOpsFields';
import { cn } from '@/lib/utils';
import { WizardStepErrorBanner } from '@/components/features/wizard/WizardValidationContext';

const PAIN_STEP_ERROR_KEYS = [
  'hasPropertyManagerOrCompany',
  'hasDedicatedCleaningTeam',
  'guestAccessSolution',
  'furnishedRenoAreas',
  'operationalPainIds',
] as const;

const RENO_AREA_OPTIONS: { id: string; en: string; ar: string }[] = [
  { id: 'kitchen', en: 'Kitchen', ar: 'المطبخ' },
  { id: 'bathrooms', en: 'Bathrooms', ar: 'الحمامات' },
  { id: 'walls_paint', en: 'Walls & paint', ar: 'الحوائط والدهان' },
  { id: 'electrical', en: 'Electrical', ar: 'الكهرباء' },
  { id: 'ac_units', en: 'AC units', ar: 'التكييفات' },
  { id: 'all', en: 'All of it', ar: 'كل شيء' },
];

const GAP_OPTIONS: {
  id: FurnishedOperationalPainId;
  titleEn: string;
  titleAr: string;
  detailEn: string;
  detailAr: string;
}[] = [
  {
    id: 'pain_operations',
    titleEn: 'Operations:',
    titleAr: 'العمليات:',
    detailEn: '(Cleaning, Maintenance, Restocking, Key Handover).',
    detailAr: '(التنظيف، الصيانة، إعادة التموين، تسليم المفاتيح).',
  },
  {
    id: 'pain_management',
    titleEn: 'Management:',
    titleAr: 'الإدارة:',
    detailEn: '(Messaging, Booking, Review Management).',
    detailAr: '(المراسلة، الحجوزات، إدارة التقييمات).',
  },
  {
    id: 'pain_financial',
    titleEn: 'Financial:',
    titleAr: 'المالية:',
    detailEn: '(Dynamic Pricing, Utility Monitoring, Tax Filing).',
    detailAr: '(التسعير الديناميكي، مراقبة المرافق والخدمات، الإقرارات الضريبية).',
  },
  {
    id: 'pain_compliance',
    titleEn: 'Compliance:',
    titleAr: 'الامتثال:',
    detailEn: '(Tourism Licensing, Fire Safety Standards).',
    detailAr: '(الترخيص السياحي، معايير السلامة من الحريق).',
  },
  {
    id: 'pain_restocking_consumables',
    titleEn: 'Restocking Consumables:',
    titleAr: 'مستلزمات إعادة التموين:',
    detailEn:
      'Constantly buying and refilling coffee, toiletries, toilet paper, and cleaning supplies.',
    detailAr:
      'شراء وإعادة تعبئة القهوة ومستلزمات النظافة وورق التواليت ومستلزمات التنظيف باستمرار.',
  },
];

/** Furnished only: physical reno pain + operational gap audit (same visibility rules as former performance step). */
export function StepPainPoints() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const isAr = locale === 'ar';
  const flq = data.furnishedLeadQualification;
  const mode: ManagementMode = data.mode ?? 'MANAGED';

  const vis = (section: Parameters<typeof isFurnishedPerformanceSectionVisible>[1]) =>
    isFurnishedPerformanceSectionVisible(mode, section);

  const patchFlq = (patch: Partial<FurnishedLeadQualification>) => {
    updateData({
      furnishedLeadQualification: { ...data.furnishedLeadQualification, ...patch },
    });
  };

  const togglePain = (id: FurnishedOperationalPainId) => {
    const current = new Set(flq?.operationalPainIds ?? []);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    patchFlq({ operationalPainIds: Array.from(current) });
  };

  const pains = flq?.operationalPainIds ?? [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full space-y-8">
      <WizardStepErrorBanner fieldKeys={[...PAIN_STEP_ERROR_KEYS]} />
      <div className="text-center mb-6">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'نقاط الألم' : 'Pain points'}
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        <ManagedPropertyManagerField isAr={isAr} />
        <ManagedCleaningTeamField isAr={isAr} />
        <GuestAccessReliabilityChoice isAr={isAr} />
      </div>

      <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm">
        <div className="font-heading font-bold text-secondary-900 mb-4">
          {isAr ? 'أي أجزاء تحتاج أكبر شغل؟' : 'Which areas need the most work?'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RENO_AREA_OPTIONS.map((opt) => {
            type RenoId = NonNullable<typeof data.furnishedRenoAreas>[number];
            const selected = (data.furnishedRenoAreas ?? []).includes(opt.id as RenoId);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const current = new Set(data.furnishedRenoAreas ?? []);
                  const id = opt.id as RenoId;
                  if (current.has(id)) current.delete(id);
                  else current.add(id);
                  updateData({ furnishedRenoAreas: Array.from(current) });
                }}
                className={cn(
                  'px-3 py-2 rounded-xl border text-sm font-semibold',
                  selected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-secondary-200 text-secondary-800 hover:border-primary-300'
                )}
              >
                {isAr ? opt.ar : opt.en}
              </button>
            );
          })}
        </div>
      </div>

      {vis('gapAudit') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900 mb-4">
            {isAr
              ? 'أي من هذه المهام أكثر ما يزعجك حاليًا؟ (يمكنك اختيار أكثر من واحد)'
              : 'Which of these tasks is currently your biggest headache? (Select all that apply)'}
          </div>
          <div className="flex flex-col gap-3">
            {GAP_OPTIONS.map((opt) => {
              const selected = (flq?.operationalPainIds ?? []).includes(opt.id);
              const title = isAr ? opt.titleAr : opt.titleEn;
              const detail = isAr ? opt.detailAr : opt.detailEn;
              return (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer text-start transition-colors',
                    selected ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300 bg-white'
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-primary-600 mt-1 shrink-0"
                    checked={selected}
                    onChange={() => togglePain(opt.id)}
                  />
                  <span className="text-base text-secondary-900 min-w-0">
                    <span className="font-heading font-bold">{title}</span>{' '}
                    <span className={cn('font-normal', opt.id === 'pain_restocking_consumables' ? 'block mt-1' : '')}>
                      {detail}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {vis('postGapHint') && pains.length > 0 && (
        <div className="rounded-xl border border-primary-200 bg-primary-50/70 px-4 py-3 text-sm text-secondary-800">
          {mode === 'MANAGED'
            ? isAr
              ? 'سنركّز على هذه النقاط في خطتك ومع المشرف المخصص لك. يمكنك العودة لتغيير نمط الإدارة إن احتجت.'
              : 'We’ll prioritize these in your plan and onboarding. You can go back anytime to change how you want to manage the property.'
            : isAr
              ? 'بناءً على ما اخترت، التعاون في الإدارة أو DIY الكامل يعالجان أغلب هذه النقاط. يمكنك الرجوع لخطوة «كيف تخطط لإدارة العقار؟» إن غيّرت رأيك.'
              : 'From what you selected, co-management or full DIY usually addresses these. Use Previous to change how you plan to manage the property if needed.'}
        </div>
      )}
    </div>
  );
}
