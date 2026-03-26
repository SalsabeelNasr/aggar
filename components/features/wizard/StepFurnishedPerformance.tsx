'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type {
  FurnishedGuestResponseTime,
  FurnishedLeadQualification,
  FurnishedOccupancyBand,
  FurnishedPricingStrategy,
  ListingStatus,
  ManagementMode,
} from '@/models';
import { isFurnishedPerformanceSectionVisible } from '@/lib/wizard/furnishedPerformanceVisibility';
import { cn } from '@/lib/utils';
import { WizardStepErrorBanner } from '@/components/features/wizard/WizardValidationContext';

const PERF_STEP_ERROR_KEYS = [
  'listingStack',
  'cleaningSupport',
  'guestResponseTime',
  'monthlyRevenueEgp',
  'occupancyBand',
  'pricingStrategy',
] as const;

function listingHint(status: ListingStatus | undefined, isAr: boolean): string {
  switch (status) {
    case 'not_listed':
      return isAr ? 'لم يُنشر بعد — نركز على التوقعات.' : 'Not listed yet — we’ll focus on your expectations.';
    case 'listed_doing_well':
      return isAr ? 'أداء جيد — نركز على تحسين الهامش والتشغيل.' : 'Doing well — we’ll focus on margin and operations.';
    case 'listed_underperform':
      return isAr ? 'حجوزات أقل من المتوقع — سنعمّق الأرقام.' : 'Underperforming — we’ll dig into the numbers.';
    case 'listed_barely_any_bookings':
      return isAr ? 'بالكاد حجوزات — نريد فهم الفجوة.' : 'Barely any bookings — we need to understand the gap.';
    default:
      return isAr ? 'أكمل الأسئلة التالية لتحسين التوصية.' : 'Complete the questions below to sharpen your plan.';
  }
}

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full space-y-8">
      <WizardStepErrorBanner fieldKeys={[...PERF_STEP_ERROR_KEYS]} />
      {vis('listingContext') && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-secondary-900">
              {isAr ? 'الأداء والتشغيل' : 'Performance'}
            </h2>
            <p className="text-secondary-600 text-sm mt-3 max-w-xl mx-auto">{listingHint(listed, isAr)}</p>
          </div>

        </>
      )}

      {vis('listingStack') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'البرمجيات الحالية' : 'Current software'}
          </div>
          <label className="font-semibold text-secondary-900 text-sm block mb-2">
            {isAr
              ? 'هل تستخدم مدير قنوات (مثل Guesty أو Smoobu أو Hostaway) أم تدير يدويًا عبر تطبيق Airbnb؟'
              : 'Do you currently use a Channel Manager (e.g., Guesty, Smoobu, Hostaway), or are you managing manually via the Airbnb app?'}
          </label>
          <select
            className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
            value={flq?.listingStack ?? ''}
            onChange={(e) =>
              patchFlq({
                listingStack: e.target.value ? (e.target.value as FurnishedLeadQualification['listingStack']) : undefined,
              })
            }
          >
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            <option value="channel_manager">{isAr ? 'مدير قنوات' : 'Channel manager'}</option>
            <option value="manual_ota">{isAr ? 'يدوي عبر تطبيق OTA (مثل Airbnb)' : 'Manually via OTA app'}</option>
            <option value="other">{isAr ? 'أخرى / مختلط' : 'Other / mixed'}</option>
          </select>
        </div>
      )}

      {vis('cleaningSupport') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'الدعم على الأرض' : 'On-Ground Support'}
          </div>
          <label className="font-semibold text-secondary-900 text-sm block mb-2">
            {isAr
              ? 'هل لديك عامل نظافة موثوق به، أم تحتاج الوصول إلى قائمة تنظيف احترافية لدينا؟'
              : 'Do you have a dedicated cleaner you trust, or do you need to tap into our professional cleaning roster?'}
          </label>
          <select
            className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
            value={flq?.cleaningSupport ?? ''}
            onChange={(e) =>
              patchFlq({
                cleaningSupport: e.target.value ? (e.target.value as FurnishedLeadQualification['cleaningSupport']) : undefined,
              })
            }
          >
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            <option value="trusted_cleaner">{isAr ? 'لديّ منظّف موثوق' : 'I have a trusted cleaner'}</option>
            <option value="need_roster">{isAr ? 'أحتاج قائمة/فريق تنظيف' : 'I need your professional roster'}</option>
            <option value="unsure">{isAr ? 'غير متأكد بعد' : 'Not sure yet'}</option>
          </select>
        </div>
      )}

      {vis('responseTime') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="font-heading font-bold text-secondary-900 block mb-2">
            {isAr ? 'وقت الاستجابة' : 'Response time'}
          </label>
          <p className="text-secondary-600 text-sm mb-2">
            {isAr
              ? 'ما متوسط وقت ردّك على استفسار ضيف؟'
              : 'What is your average response time to a guest inquiry?'}
          </p>
          <select
            className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
            value={flq?.guestResponseTime ?? ''}
            onChange={(e) =>
              patchFlq({ guestResponseTime: (e.target.value || undefined) as FurnishedGuestResponseTime | undefined })
            }
          >
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            <option value="under_5_min">{isAr ? 'أقل من 15 دقيقة' : 'Under 15 minutes'}</option>
            <option value="about_1_hour">{isAr ? 'حوالي ساعة' : 'About 1 hour'}</option>
            <option value="several_hours">{isAr ? '4+ ساعات' : '4+ hours'}</option>
            <option value="often_miss">{isAr ? 'متقطع / أغالبًا أتأخر' : 'Inconsistent / often slow to reply'}</option>
          </select>
        </div>
      )}

      {vis('revenueDemand') && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="font-heading font-bold text-secondary-900">
            {isAr ? 'الفجوة المالية' : 'Revenue gap'}
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isNotListed
                ? isAr
                  ? 'إيراد شهري مستهدف (ج.م) عند التشغيل'
                  : 'Target monthly revenue (EGP) when you go live'
                : isAr
                  ? 'متوسط الإيراد الشهري الحالي (ج.م)'
                  : 'Average current monthly revenue (EGP)'}
            </label>
            <input
              type="number"
              min={0}
              className="border-2 border-secondary-200 rounded-lg p-3 w-full focus:border-primary-500 outline-none"
              placeholder={isAr ? 'مثال: 25000' : 'e.g. 25000'}
              value={flq?.monthlyRevenueEgp ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                patchFlq({ monthlyRevenueEgp: v === '' ? undefined : Number(v) });
              }}
            />
          </div>
          <div>
            <label className="font-semibold text-secondary-900 text-sm block mb-2">
              {isNotListed
                ? isAr
                  ? 'نطاق الإشغال المتوقع بعد الإطلاق'
                  : 'Expected occupancy band once live'
                : isAr
                  ? 'معدل الإشغال الحالي'
                  : 'Current occupancy band'}
            </label>
            <select
              className="border-2 border-secondary-200 rounded-lg p-3 bg-white w-full"
              value={flq?.occupancyBand ?? ''}
              onChange={(e) =>
                patchFlq({ occupancyBand: (e.target.value || undefined) as FurnishedOccupancyBand | undefined })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="under_30">{isAr ? 'أقل من 30% (ضعيف)' : 'Under 30% (struggling)'}</option>
              <option value="between_30_60">{isAr ? '30% – 60% (متوسط)' : '30% – 60% (average)'}</option>
              <option value="over_60">
                {isAr ? '60%+ (مرتفع — ربما السعر منخفض؟)' : '60%+ (high — maybe underpriced?)'}
              </option>
            </select>
          </div>
          <div>
            <div className="font-semibold text-secondary-900 text-sm mb-2">{isAr ? 'استراتيجية التسعير' : 'Pricing strategy'}</div>
            <div className="flex flex-col gap-2">
              {(
                [
                  { id: 'flat_rate' as const, en: 'Flat rate year-round', ar: 'سعر ثابت طوال العام' },
                  {
                    id: 'manual_seasonal' as const,
                    en: 'I change prices manually (weekends/holidays)',
                    ar: 'أغيّر الأسعار يدويًا (عطل/عطلات)',
                  },
                  {
                    id: 'dynamic_tool' as const,
                    en: 'Dynamic pricing tool (e.g. PriceLabs, Wheelhouse)',
                    ar: 'أداة تسعير ديناميكي (مثل PriceLabs أو Wheelhouse)',
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
          </div>
        </div>
      )}

    </div>
  );
}
