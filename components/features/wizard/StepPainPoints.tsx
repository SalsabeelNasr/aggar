'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { FurnishedLeadQualification, FurnishedOperationalPainId, ManagementMode } from '@/models';
import { isFurnishedPerformanceSectionVisible } from '@/lib/wizard/furnishedPerformanceVisibility';
import { AccessComplianceCard } from '@/components/features/wizard/AccessComplianceCard';
import { cn } from '@/lib/utils';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

const RENO_AREA_OPTIONS: { id: string; en: string; ar: string }[] = [
  { id: 'kitchen', en: 'Kitchen', ar: 'المطبخ' },
  { id: 'bathrooms', en: 'Bathrooms', ar: 'الحمامات' },
  { id: 'walls_paint', en: 'Walls & paint', ar: 'الحوائط والدهانات' },
  { id: 'electrical', en: 'Electrical', ar: 'الكهرباء' },
  { id: 'ac_units', en: 'AC units', ar: 'التكييفات' },
  { id: 'all', en: 'All of it', ar: 'كل حاجة' },
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
    titleAr: 'العمليات والتشغيل:',
    detailEn: '(Cleaning, Maintenance, Restocking, Key Handover).',
    detailAr: '(تنضيف، صيانة، تموين المستلزمات، تسليم مفاتيح).',
  },
  {
    id: 'pain_management',
    titleEn: 'Management:',
    titleAr: 'الإدارة والمراسلة:',
    detailEn: '(Messaging, Booking, Review Management).',
    detailAr: '(رد على رسايل، حجوزات، ومتابعة تقييمات).',
  },
  {
    id: 'pain_financial',
    titleEn: 'Financial:',
    titleAr: 'الحسابات والتسعير:',
    detailEn: '(Dynamic Pricing, Utility Monitoring, Tax Filing).',
    detailAr: '(تسعير ديناميكي، متابعة فواتير، وضرائب).',
  },
  {
    id: 'pain_compliance',
    titleEn: 'Compliance:',
    titleAr: 'الامتثال والقانون:',
    detailEn: '(Tourism Licensing, Fire Safety Standards).',
    detailAr: '(تراخيص سياحية، ومعايير أمان).',
  },
  {
    id: 'pain_restocking_consumables',
    titleEn: 'Restocking Consumables:',
    titleAr: 'توفير المستلزمات:',
    detailEn:
      'Constantly buying and refilling coffee, toiletries, toilet paper, and cleaning supplies.',
    detailAr:
      'شراء وتوفير القهوة، المناديل، وأدوات النظافة باستمرار.',
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

  const furnishedAreasErr = useWizardFieldError('furnishedAreas');
  const operationalPainErr = useWizardFieldError('operationalPainIds');

  const togglePain = (id: FurnishedOperationalPainId) => {
    const current = new Set(flq?.operationalPainIds ?? []);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    patchFlq({ operationalPainIds: Array.from(current) });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'إيه اللي تعبك في العقار؟' : 'Pain points'}
        </h2>
      </div>

      <AccessComplianceCard />

      <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm">
        <div className="font-heading font-bold text-secondary-900 mb-4">
          {isAr ? 'إيه الأجزاء اللي محتاجة شغل أكتر؟' : 'Which areas need the most work?'}
        </div>
        <div
          data-wizard-field="furnishedAreas"
          className={cn(
            'grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl p-2 -mx-1',
            furnishedAreasErr.invalid && 'border-2 border-red-500'
          )}
        >
          {RENO_AREA_OPTIONS.map((opt) => {
            type RenoId = NonNullable<typeof data.furnishedAreas>[number];
            const selected = (data.furnishedAreas ?? []).includes(opt.id as RenoId);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const current = new Set(data.furnishedAreas ?? []);
                  const id = opt.id as RenoId;
                  if (current.has(id)) current.delete(id);
                  else current.add(id);
                  updateData({ furnishedAreas: Array.from(current) });
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
        <WizardInlineFieldError message={furnishedAreasErr.error} />
      </div>

      {vis('gapAudit') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900 mb-4">
            {isAr
              ? 'إيه أكتر مهام بتسبب لك صداع دلوقتي؟ (ممكن تختار كذا حاجة)'
              : 'Which of these tasks is currently your biggest headache? (Select all that apply)'}
          </div>
          <div
            data-wizard-field="operationalPainIds"
            className={cn(
              'flex flex-col gap-3 rounded-xl p-2 -mx-1',
              operationalPainErr.invalid && 'border-2 border-red-500'
            )}
          >
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
          <WizardInlineFieldError message={operationalPainErr.error} />
        </div>
      )}

    </div>
  );
}
