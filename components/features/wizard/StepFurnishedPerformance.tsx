'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type {
  FurnishedGuestResponseTime,
  FurnishedLeadQualification,
  FurnishedOccupancyBand,
  FurnishedPricingStrategy,
  ManagementMode,
} from '@/models';
import { isFurnishedPerformanceSectionVisible } from '@/lib/wizard/furnishedPerformanceVisibility';
import { cn } from '@/lib/utils';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

export function StepFurnishedPerformance() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const isAr = locale === 'ar';
  const flq = data.furnishedLeadQualification;
  const mode: ManagementMode = data.mode ?? 'MANAGED';
  const listed = data.listingStatus ?? 'not_listed';
  const isNotListed = listed === 'not_listed';

  const vis = (section: Parameters<typeof isFurnishedPerformanceSectionVisible>[1]) =>
    isFurnishedPerformanceSectionVisible(mode, section);

  const patchFlq = (patch: Partial<FurnishedLeadQualification>) => {
    updateData({
      furnishedLeadQualification: { ...data.furnishedLeadQualification, ...patch },
    });
  };

  const listingStackErr = useWizardFieldError('listingStack');
  const cleaningSupportErr = useWizardFieldError('cleaningSupport');
  const guestResponseErr = useWizardFieldError('guestResponseTime');
  const revenueErr = useWizardFieldError('monthlyRevenueEgp');
  const occupancyErr = useWizardFieldError('occupancyBand');
  const pricingErr = useWizardFieldError('pricingStrategy');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full space-y-8">
      {vis('listingContext') && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-secondary-900">
              {isAr ? 'الأداء والتشغيل' : 'Performance'}
            </h2>
          </div>

        </>
      )}

      {vis('listingStack') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'البرمجيات اللي بتستخدمها' : 'Current software'}
          </div>
          <label className="font-semibold text-secondary-900 text-sm block mb-2">
            {isAr
              ? 'هل بتستخدم مدير قنوات (زي Guesty أو Smoobu) ولا بتدير يدوي من تطبيق Airbnb؟'
              : 'Do you currently use a Channel Manager (e.g., Guesty, Smoobu, Hostaway), or are you managing manually via the Airbnb app?'}
          </label>
          <select
            data-wizard-field="listingStack"
            className={cn(
              'border-2 rounded-lg p-3 bg-white w-full',
              listingStackErr.invalid ? 'border-red-500' : 'border-secondary-200'
            )}
            aria-invalid={listingStackErr.invalid || undefined}
            value={flq?.listingStack ?? ''}
            onChange={(e) =>
              patchFlq({
                listingStack: e.target.value ? (e.target.value as FurnishedLeadQualification['listingStack']) : undefined,
              })
            }
          >
            <option value="">{isAr ? 'اختار' : 'Select'}</option>
            <option value="channel_manager">{isAr ? 'مدير قنوات (Channel Manager)' : 'Channel manager'}</option>
            <option value="manual_ota">{isAr ? 'يدوي من تطبيق Airbnb / Booking' : 'Manually via OTA app'}</option>
            <option value="other">{isAr ? 'حاجة تانية / ميكس' : 'Other / mixed'}</option>
          </select>
          <WizardInlineFieldError message={listingStackErr.error} />
        </div>
      )}

      {vis('cleaningSupport') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'الدعم على الأرض' : 'On-Ground Support'}
          </div>
          <label className="font-semibold text-secondary-900 text-sm block mb-2">
            {isAr
              ? 'هل عندك حد ثقة للتنضيف، ولا محتاج نوفر لك فريق تنضيف محترف؟'
              : 'Do you have a dedicated cleaner you trust, or do you need to tap into our professional cleaning roster?'}
          </label>
          <select
            data-wizard-field="cleaningSupport"
            className={cn(
              'border-2 rounded-lg p-3 bg-white w-full',
              cleaningSupportErr.invalid ? 'border-red-500' : 'border-secondary-200'
            )}
            aria-invalid={cleaningSupportErr.invalid || undefined}
            value={flq?.cleaningSupport ?? ''}
            onChange={(e) =>
              patchFlq({
                cleaningSupport: e.target.value ? (e.target.value as FurnishedLeadQualification['cleaningSupport']) : undefined,
              })
            }
          >
            <option value="">{isAr ? 'اختار' : 'Select'}</option>
            <option value="trusted_cleaner">{isAr ? 'عندي حد ثقة' : 'I have a trusted cleaner'}</option>
            <option value="need_roster">{isAr ? 'محتاج فريق تنضيف محترف' : 'I need your professional roster'}</option>
            <option value="unsure">{isAr ? 'لسه مش متأكد' : 'Not sure yet'}</option>
          </select>
          <WizardInlineFieldError message={cleaningSupportErr.error} />
        </div>
      )}

      {vis('responseTime') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="font-heading font-bold text-secondary-900 block mb-2">
            {isAr ? 'سرعة الرد' : 'Response time'}
          </label>
          <p className="text-secondary-600 text-sm mb-2">
            {isAr
              ? 'بتاخد وقت قد إيه تقريباً عشان ترد على استفسارات الضيوف؟'
              : 'What is your average response time to a guest inquiry?'}
          </p>
          <select
            data-wizard-field="guestResponseTime"
            className={cn(
              'border-2 rounded-lg p-3 bg-white w-full',
              guestResponseErr.invalid ? 'border-red-500' : 'border-secondary-200'
            )}
            aria-invalid={guestResponseErr.invalid || undefined}
            value={flq?.guestResponseTime ?? ''}
            onChange={(e) =>
              patchFlq({ guestResponseTime: (e.target.value || undefined) as FurnishedGuestResponseTime | undefined })
            }
          >
            <option value="">{isAr ? 'اختار' : 'Select'}</option>
            <option value="under_5_min">{isAr ? 'أقل من 15 دقيقة' : 'Under 15 minutes'}</option>
            <option value="about_1_hour">{isAr ? 'في حدود ساعة' : 'About 1 hour'}</option>
            <option value="several_hours">{isAr ? 'أكتر من 4 ساعات' : '4+ hours'}</option>
            <option value="often_miss">{isAr ? 'مش منتظم / برد متأخر' : 'Inconsistent / often slow to reply'}</option>
          </select>
          <WizardInlineFieldError message={guestResponseErr.error} />
        </div>
      )}

      {vis('revenueDemand') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'الأرقام المالية' : 'Revenue gap'}
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isNotListed
                ? isAr
                  ? 'إيراد شهري مستهدف (ج.م) لما تبدأ تشغيل'
                  : 'Target monthly revenue (EGP) when you go live'
                : isAr
                  ? 'متوسط إيرادك الشهري الحالي (ج.م)'
                  : 'Average current monthly revenue (EGP)'}
            </label>
            <input
              type="number"
              min={0}
              data-wizard-field="monthlyRevenueEgp"
              className={cn(
                'border-2 rounded-lg p-3 w-full focus:border-primary-500 outline-none',
                revenueErr.invalid ? 'border-red-500' : 'border-secondary-200'
              )}
              aria-invalid={revenueErr.invalid || undefined}
              placeholder={isAr ? 'مثلاً: 25000' : 'e.g. 25000'}
              value={flq?.monthlyRevenueEgp ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                patchFlq({ monthlyRevenueEgp: v === '' ? undefined : Number(v) });
              }}
            />
            <WizardInlineFieldError message={revenueErr.error} />
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isNotListed
                ? isAr
                  ? 'نسبة الإشغال اللي بتطمح ليها'
                  : 'Expected occupancy band once live'
                : isAr
                  ? 'نسبة الإشغال الحالية'
                  : 'Current occupancy band'}
            </label>
            <select
              data-wizard-field="occupancyBand"
              className={cn(
                'border-2 rounded-lg p-3 bg-white w-full',
                occupancyErr.invalid ? 'border-red-500' : 'border-secondary-200'
              )}
              aria-invalid={occupancyErr.invalid || undefined}
              value={flq?.occupancyBand ?? ''}
              onChange={(e) =>
                patchFlq({ occupancyBand: (e.target.value || undefined) as FurnishedOccupancyBand | undefined })
              }
            >
              <option value="">{isAr ? 'اختار' : 'Select'}</option>
              <option value="under_30">{isAr ? 'أقل من 30% (ضعيف)' : 'Under 30% (struggling)'}</option>
              <option value="between_30_60">{isAr ? '30% – 60% (متوسط)' : '30% – 60% (average)'}</option>
              <option value="over_60">
                {isAr ? 'أكتر من 60% (ممتاز)' : '60%+ (high — maybe underpriced?)'}
              </option>
            </select>
            <WizardInlineFieldError message={occupancyErr.error} />
          </div>
          <div>
            <div className="font-semibold text-secondary-900 text-sm mb-2">{isAr ? 'استراتيجية التسعير' : 'Pricing strategy'}</div>
            <div
              data-wizard-field="pricingStrategy"
              className={cn(
                'flex flex-col gap-2 rounded-xl p-2 -mx-1',
                pricingErr.invalid && 'border-2 border-red-500'
              )}
            >
              {(
                [
                  { id: 'flat_rate' as const, en: 'Flat rate year-round', ar: 'سعر ثابت طول السنة' },
                  {
                    id: 'manual_seasonal' as const,
                    en: 'I change prices manually (weekends/holidays)',
                    ar: 'بغير الأسعار يدوي (في الويك إند والأعياد)',
                  },
                  {
                    id: 'dynamic_tool' as const,
                    en: 'Dynamic pricing tool (e.g. PriceLabs, Wheelhouse)',
                    ar: 'بستخدم أداة تسعير ديناميكي (زي PriceLabs)',
                  },
                ] satisfies { id: FurnishedPricingStrategy; en: string; ar: string }[]
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer',
                    flq?.pricingStrategy === opt.id ? 'border-primary-600 bg-primary-50' : 'border-secondary-200'
                  )}
                >
                  <input
                    type="radio"
                    name="pricingStrategy"
                    className="accent-primary-600"
                    checked={flq?.pricingStrategy === opt.id}
                    onChange={() => patchFlq({ pricingStrategy: opt.id })}
                  />
                  <span className="text-base font-medium">{isAr ? opt.ar : opt.en}</span>
                </label>
              ))}
            </div>
            <WizardInlineFieldError message={pricingErr.error} />
          </div>
        </div>
      )}

    </div>
  );
}
