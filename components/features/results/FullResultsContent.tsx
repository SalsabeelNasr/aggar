'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import { evaluateRules } from '@/lib/engines/ruleEngine';
import { buildPackages, computeCustomTotals, computePlanFinancials, type PackageType } from '@/lib/engines/packageBuilder';
import type { ManagementMode, WizardData } from '@/models';
import { getRegionById } from '@/services/mockApi';
import {
  CONSULTANT_MOCK,
  filterConsultantsByPartnerCategory,
  rankConsultantsForProperty,
  type ConsultantCard,
  type PartnerCategoryId,
} from '@/lib/results/resultsStatic';
import { PackageComparisonCards } from './PackageComparisonCards';
import { PackageDetailPanel } from './PackageDetailPanel';
import { CustomPackageBuilder } from './CustomPackageBuilder';
import { DiyUpgradesSection } from './DiyUpgradesSection';
import { QuoteOrDiyLeadSection } from './QuoteOrDiyLeadSection';
import {
  diyChecklistItemsForMissingFurnishedPhotos,
  FURNISHED_LISTING_PHOTO_COMPANION_DIY,
} from '@/lib/results/furnishedPhotoProofDiy';
import { formatMoney } from './utils';
import { SpecialistHelpSection } from './SpecialistHelpSection';

/** Radial readiness chart. */
function ScoreRadial({ score, className }: { score: number; className?: string }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const cx = 60;
  const cy = 60;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" className={cn('shrink-0', className)} aria-hidden>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={7} className="text-secondary-200" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="text-primary-600 transition-all duration-700 ease-out"
      />
    </svg>
  );
}

function decree209Label(
  data: WizardData,
  locale: 'en' | 'ar'
): { level: 'low' | 'moderate' | 'high' | 'critical'; text: string } {
  const floor = data.regulatory?.floorNumber ?? 0;
  const lift = data.regulatory?.hasLift;
  if (lift === false && floor >= 5) {
    return {
      level: 'critical',
      text: locale === 'ar' ? 'امتثال ٢٠٩: خطر حرج (بدون مصعد، أدوار مرتفعة)' : 'Decree 209: critical risk (no lift, high floor)',
    };
  }
  if (lift === false && floor >= 2) {
    return { level: 'high', text: locale === 'ar' ? 'امتثال ٢٠٩: مخاطر عالية' : 'Decree 209: high compliance risk' };
  }
  if (data.regulatory?.inGatedCompound) {
    return { level: 'low', text: locale === 'ar' ? 'امتثال ٢٠٩: منطقة مجمعات مسجلة عادة' : 'Decree 209: typical gated-track eligibility' };
  }
  return { level: 'moderate', text: locale === 'ar' ? 'امتثال ٢٠٩: راجع المبنى والدور' : 'Decree 209: verify building & floor rules' };
}

export default function FullResultsContent() {
  const locale = useLocale();
  const lo: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';

  const { data } = useEvaluationStore();
  const mgmtMode: ManagementMode = 'MANAGED';

  // ── Engines ──────────────────────────────────────────────────────────
  const ruleResult = React.useMemo(() => evaluateRules(data), [data]);
  const scoring = ruleResult.scoreResult;
  const packageSet = React.useMemo(() => buildPackages(ruleResult, data.budgetBand), [ruleResult, data.budgetBand]);

  const [selectedPackage, setSelectedPackage] = React.useState<PackageType>('sweet_spot');
  const [customEnabledIds, setCustomEnabledIds] = React.useState<string[]>(() => packageSet.custom.enabled_service_ids);

  // Sync custom defaults when packageSet changes
  React.useEffect(() => {
    setCustomEnabledIds(packageSet.custom.enabled_service_ids);
  }, [packageSet.custom.enabled_service_ids]);

  // Revenue based on selected package's services
  const selectedServices = React.useMemo(() => {
    if (selectedPackage === 'custom') {
      return packageSet.custom.all_services.filter((s) => customEnabledIds.includes(s.id));
    }
    return packageSet[selectedPackage].services;
  }, [selectedPackage, packageSet, customEnabledIds]);

  const revenue = React.useMemo(
    () => projectRevenue(data, { services: selectedServices }),
    [data, selectedServices]
  );

  const customTotals = React.useMemo(
    () => computeCustomTotals(packageSet.custom.all_services, customEnabledIds),
    [packageSet.custom.all_services, customEnabledIds]
  );

  const handleToggleCustomService = React.useCallback((id: string) => {
    setCustomEnabledIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  // ── Region & UI data ─────────────────────────────────────────────────
  const regionMeta = React.useMemo(() => getRegionById(data.regionId), [data.regionId]);
  const regionName = regionMeta.name[lo];
  const areaMarketBaselines = React.useMemo(() => regionalMarketBaselines(data.regionId), [data.regionId]);
  const isNewCairo = data.regionId === 'new_cairo';

  const licensingFirst = scoring.ltrFlag || (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5);
  const [bookConsultant, setBookConsultant] = React.useState<ConsultantCard | null>(null);
  const [specialistFilter, setSpecialistFilter] = React.useState<PartnerCategoryId | null>(null);

  const consultants = React.useMemo(
    () => rankConsultantsForProperty(CONSULTANT_MOCK, data.regionId, data.stateFlag, licensingFirst),
    [data.regionId, data.stateFlag, licensingFirst]
  );
  const filteredConsultants = React.useMemo(
    () => filterConsultantsByPartnerCategory(consultants, specialistFilter),
    [consultants, specialistFilter]
  );

  const decree = decree209Label(data, lo);
  const showLtrSection = scoring.ltrFlag || scoring.finalScore < 25;
  const hasUploadedPhotos = data.photoUpload.files.some((f) => Boolean(f.url));

  const strengths = (data.photoUpload.aiSummary?.visibleStrengths ?? []).slice(0, 3);
  const issues = (data.photoUpload.aiSummary?.visibleIssues ?? scoring.reasons).slice(0, 3);
  const selectedPainPoints = data.furnishedLeadQualification?.operationalPainIds ?? [];

  const furnishedPhotoDiy = React.useMemo(() => {
    if (data.stateFlag !== 'FURNISHED') return { photoProofItems: [], showCompanions: false };
    return {
      photoProofItems: diyChecklistItemsForMissingFurnishedPhotos(data.furnishedPhotoChecklist),
      showCompanions: true,
    };
  }, [data.stateFlag, data.furnishedPhotoChecklist]);

  // Current selected package totals for display
  const currentPkgTotals = selectedPackage === 'custom'
    ? customTotals
    : { total_cost_min: packageSet[selectedPackage].total_cost_min, total_cost_max: packageSet[selectedPackage].total_cost_max, total_score_gain: packageSet[selectedPackage].total_score_gain };

  const planFinancials = React.useMemo(
    () =>
      computePlanFinancials(
        { total_cost_min: currentPkgTotals.total_cost_min, total_cost_max: currentPkgTotals.total_cost_max },
        revenue.current.netMonthlyEgp,
        revenue.optimized.netMonthlyEgp
      ),
    [
      currentPkgTotals.total_cost_min,
      currentPkgTotals.total_cost_max,
      revenue.current.netMonthlyEgp,
      revenue.optimized.netMonthlyEgp,
    ]
  );

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="border-b border-secondary-200 bg-white shadow-xs">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          {/* {mgmtMode === 'DIY_FULL' && (
            <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50/80 p-4 text-sm text-secondary-800 shadow-xs">
              {lo === 'ar'
                ? 'وضع DIY كامل — ركّز على الدليل المجاني واحجز مستشاراً عند الحاجة.'
                : 'Full DIY mode — focus on the free guide below and book a consultant when you need help.'}
            </div>
          )} */}

          <header className="mb-10 space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-secondary-900 md:text-4xl">
              {lo === 'ar' ? 'تقرير جاهزية العقار' : 'Market readiness report'}
            </h1>
            {data.photoUpload.files.filter((f) => f.url).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.photoUpload.files
                  .filter((f) => f.url)
                  .slice(0, 6)
                  .map((f) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f.id} src={f.url} alt="" className="h-14 w-14 rounded-lg border border-secondary-200 object-cover shadow-xs" />
                  ))}
              </div>
            )}
          </header>

          {/* ── Score + Area Stats + Image Analysis ──────────────────────── */}
          <section className="mb-10 space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-start md:gap-5 lg:gap-6">
              <div className="flex min-w-0 flex-col gap-4 md:col-span-1 lg:gap-5">
                <Card className="flex w-full min-w-0 flex-col border-secondary-200 shadow-xs">
                  <CardHeader className="p-4 pb-1 pt-3 text-center">
                    <CardTitle className="text-sm font-medium text-secondary-600">
                      {lo === 'ar' ? 'جاهزية السوق' : 'Market readiness'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center px-4 pb-3 pt-0">
                    <div className="flex w-full flex-col items-center">
                      <div className="relative shrink-0">
                        <ScoreRadial score={scoring.finalScore} />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xl font-semibold tabular-nums text-primary-700">{scoring.finalScore}</p>
                            <p className="text-[11px] font-medium leading-tight text-secondary-500">{lo === 'ar' ? 'من ١٠٠' : '/ 100'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property location card */}
                <Card className="flex w-full flex-col border border-primary-200/60 bg-gradient-to-br from-white to-primary-50/40 shadow-xs">
                  <CardContent className="p-3 sm:p-3.5 md:py-2.5 md:pe-4 md:ps-4">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                        <span className="min-w-0 text-sm font-semibold text-secondary-900">{regionName}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 border-t border-secondary-200/80 pt-2.5 text-sm">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-secondary-600">{lo === 'ar' ? 'متوسط السعر الليلي' : 'Average daily rate'}</span>
                          <span className="font-semibold tabular-nums text-secondary-900">
                            {formatMoney(areaMarketBaselines.nightlyRateEgp, locale)}
                            <span className="ms-1 text-xs font-normal text-secondary-500">{lo === 'ar' ? 'ج.م/ليلة' : 'EGP/night'}</span>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-secondary-600">{lo === 'ar' ? 'متوسط الإشغال' : 'Avg occupancy'}</span>
                          <span className="font-semibold tabular-nums text-secondary-900">{areaMarketBaselines.occupancyPct}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex min-w-0 flex-col gap-4 md:col-span-4 lg:gap-5">
                <Card className="w-full border-primary-200 bg-primary-50/50 shadow-xs">
                    <CardHeader className="p-4 pb-1.5 pt-3">
                      <CardTitle className="font-heading text-base font-semibold text-secondary-900">
                        {lo === 'ar' ? 'توصية نمط الإدارة' : 'Property analysis'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 pt-0 text-sm text-secondary-800">
                      <ul className="mt-2 list-disc space-y-1 ps-5">
                        <li>
                          {selectedPainPoints.length > 0
                            ? mgmtMode === 'MANAGED'
                              ? lo === 'ar'
                                ? 'سنركّز على هذه النقاط في خطتك ومع المشرف المخصص لك.'
                                : 'We will prioritize these pain points in your plan and onboarding.'
                              : lo === 'ar'
                                ? 'بناءً على ما اخترته، التعاون في الإدارة أو DIY الكامل يعالجان أغلب هذه النقاط.'
                                : 'From what you selected, co-management or full DIY usually addresses these pain points.'
                            : lo === 'ar'
                              ? 'لا توجد نقاط تشغيلية حرجة مختارة حالياً؛ سنحافظ على خطة إدارة بسيطة وواضحة.'
                              : 'No critical operational pain points selected yet, so we will keep your management plan simple and focused.'}
                        </li>
                        <li>
                          {!hasUploadedPhotos
                            ? lo === 'ar'
                              ? 'تحليل الصور: لا توجد صور مرفوعة بعد؛ أضف صور الغرف لتحسين دقة التوصيات.'
                              : 'Image analysis: no photos uploaded yet; add room photos to improve recommendation accuracy.'
                            : strengths.length === 0 && issues.length === 0
                              ? lo === 'ar'
                                ? 'تحليل الصور: جارٍ التحليل أو لا توجد ملاحظات مرئية كافية حالياً.'
                                : 'Image analysis: insights are pending or there are no notable visual findings yet.'
                              : lo === 'ar'
                                ? `تحليل الصور: ${strengths.length} نقاط قوة و${issues.length} نقاط تحسين مرصودة.`
                                : `Image analysis: ${strengths.length} strengths and ${issues.length} improvement areas detected.`}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                <Card className="w-full border-secondary-200 bg-white shadow-xs">
                  <CardHeader className="p-4 pb-1.5 pt-3">
                    <CardTitle className="font-heading text-base font-semibold text-secondary-900">
                      {lo === 'ar' ? 'ما يحتاجه عقارك' : 'What your property needs'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 text-sm text-secondary-800">
                    <p className="text-secondary-600">
                      {lo === 'ar'
                        ? `حددنا ${ruleResult.missingServices.length} خدمة يمكنها تحسين نقاطك من ${scoring.finalScore} إلى ${ruleResult.maxPossibleScore} نقطة.`
                        : `We identified ${ruleResult.missingServices.length} services that can improve your score from ${scoring.finalScore} to ${ruleResult.maxPossibleScore} points.`}
                    </p>

                    {revenue.seasonalityFlag && (
                      <p className="mt-4 max-w-md rounded-lg border border-amber-100 bg-amber-50/80 p-2 text-xs text-amber-900">
                        {lo === 'ar' ? 'سوق موسمي — لا تعامل الدخل كشهري ثابت.' : 'Seasonal market — avoid assuming flat monthly income year-round.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ── Income bar ───────────────────────────────────────────── */}
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-secondary-200 bg-white">
              {/* ── Package tabs + detail ──────────────────────────────── */}
              <div className="space-y-6 px-4 py-5 md:px-6 md:py-6">
                  <h2 className="font-heading text-lg font-semibold text-secondary-900">
                    {lo === 'ar' ? 'كيف تحسّن؟' : 'How do you improve?'}
                  </h2>

                  <PackageComparisonCards
                    packages={packageSet}
                    selectedPackage={selectedPackage}
                    onSelect={setSelectedPackage}
                    lo={lo}
                  />

                  {selectedPackage === 'custom' ? (
                    <CustomPackageBuilder
                      allServices={packageSet.custom.all_services}
                      enabledServiceIds={customEnabledIds}
                      isNeeded={packageSet.custom.is_needed}
                      onToggle={handleToggleCustomService}
                      sectionSubtitle={lo === 'ar' ? packageSet.custom.tagline_ar : packageSet.custom.tagline_en}
                      currentNetMonthlyEgp={revenue.current.netMonthlyEgp}
                      netMonthlyEgp={revenue.optimized.netMonthlyEgp}
                      breakEvenMonths={planFinancials.breakEvenMonths}
                      year1ProjectedNetEgp={planFinancials.year1ProjectedNet}
                      locale={locale}
                      lo={lo}
                    />
                  ) : (
                    <PackageDetailPanel
                      services={packageSet[selectedPackage].services}
                      sectionSubtitle={lo === 'ar' ? packageSet[selectedPackage].tagline_ar : packageSet[selectedPackage].tagline_en}
                      currentNetMonthlyEgp={revenue.current.netMonthlyEgp}
                      netMonthlyEgp={revenue.optimized.netMonthlyEgp}
                      totalCostMin={packageSet[selectedPackage].total_cost_min}
                      totalCostMax={packageSet[selectedPackage].total_cost_max}
                      breakEvenMonths={planFinancials.breakEvenMonths}
                      year1ProjectedNetEgp={planFinancials.year1ProjectedNet}
                      locale={locale}
                      lo={lo}
                    />
                  )}

                  <DiyUpgradesSection
                    lo={lo}
                    selectedPackage={selectedPackage}
                    photoProofItems={furnishedPhotoDiy.photoProofItems}
                    photoCompanionItems={furnishedPhotoDiy.showCompanions ? FURNISHED_LISTING_PHOTO_COMPANION_DIY : []}
                  />

                  <div className="pt-2">
                    <div className="border-t border-secondary-200" />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <p className="text-base font-extrabold text-secondary-900">{lo === 'ar' ? 'الإجمالي' : 'Total'}</p>
                      <p className="text-lg font-black tabular-nums text-secondary-900">
                        {formatMoney(currentPkgTotals.total_cost_min, locale)}–{formatMoney(currentPkgTotals.total_cost_max, locale)}{' '}
                        {lo === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                  </div>

                  <h2 className="font-heading text-lg font-semibold text-secondary-900">
                    {lo === 'ar' ? 'مهتم تبني هذا؟' : 'Interested in building this?'}
                  </h2>

                  <QuoteOrDiyLeadSection
                    lo={lo}
                    onRequestQuote={() => {
                      document.getElementById('consultants')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    payAmountText={`${formatMoney(currentPkgTotals.total_cost_min, locale)} - ${formatMoney(
                      currentPkgTotals.total_cost_max,
                      locale
                    )}`}
                    optimizedMonthlyText={formatMoney(revenue.optimized.netMonthlyEgp, locale)}
                    currentMonthlyText={formatMoney(revenue.current.netMonthlyEgp, locale)}
                  />

                  <SpecialistHelpSection
                    lo={lo}
                    specialistFilter={specialistFilter}
                    onSpecialistFilterChange={setSpecialistFilter}
                    filteredConsultants={filteredConsultants}
                    onBook={setBookConsultant}
                  />
                </div>
            </div>

          </section>

          {showLtrSection && (
            <Card className="mb-10 border-amber-200 bg-amber-50/50 shadow-xs">
              <CardContent className="space-y-3 p-5 text-sm text-amber-950">
                <p className="font-semibold">{lo === 'ar' ? 'إيجار طويل الأمد' : 'Long-term rental'}</p>
                <p>{lo === 'ar' ? 'قد يكون أوضح استقراراً في وضعك.' : 'May be more stable for your situation.'}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* ── Consultant booking slide-in ──────────────────────────────── */}
      {bookConsultant && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <button type="button" className="absolute inset-0 bg-secondary-900/40 backdrop-blur-[2px]" aria-label={lo === 'ar' ? 'إغلاق' : 'Close'} onClick={() => setBookConsultant(null)} />
          <div className={cn('relative flex h-full w-full max-w-md flex-col bg-white p-6 shadow-xl animate-in slide-in-from-right duration-200', lo === 'ar' && 'animate-in slide-in-from-left')}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-heading text-xl font-semibold text-secondary-900">{bookConsultant.name[lo]}</p>
                <p className="text-sm text-primary-700">{bookConsultant.title[lo]}</p>
              </div>
              <button type="button" className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100" onClick={() => setBookConsultant(null)}>
                <ChevronLeft className={cn('h-5 w-5', lo === 'ar' && 'rotate-180')} />
              </button>
            </div>
            <p className="mb-4 text-sm text-secondary-600">{lo === 'ar' ? 'اختر موعداً مقترحاً:' : 'Suggested slots:'}</p>
            <div className="mb-6 flex flex-1 flex-col gap-2 overflow-y-auto">
              {['09:00', '11:30', '15:00'].map((t) => (
                <button type="button" key={t} className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-start text-sm font-medium hover:border-primary-400">
                  {t} · {lo === 'ar' ? 'قريباً' : 'Soon'}
                </button>
              ))}
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                const msg = encodeURIComponent(lo === 'ar' ? `طلب حجز مع ${bookConsultant.name.ar}` : `Booking request for ${bookConsultant.name.en}`);
                window.open(`https://wa.me/201000000000?text=${msg}`, '_blank', 'noopener,noreferrer');
                setBookConsultant(null);
              }}
            >
              {lo === 'ar' ? 'تأكيد عبر واتساب' : 'Confirm via WhatsApp'}
            </Button>
            <p className="mt-3 text-center text-xs text-secondary-500">{lo === 'ar' ? 'رقم تجريبي.' : 'Placeholder WhatsApp.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
