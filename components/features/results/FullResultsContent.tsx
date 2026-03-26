'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ImageOff, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import { evaluateRules } from '@/lib/engines/ruleEngine';
import { buildPackages, computeCustomTotals, type PackageType } from '@/lib/engines/packageBuilder';
import type { ManagementMode, WizardData } from '@/models';
import { getRegionById } from '@/services/mockApi';
import {
  CONSULTANT_MOCK,
  PARTNER_CATEGORY_KEYS,
  filterConsultantsByPartnerCategory,
  rankConsultantsForProperty,
  type ConsultantCard,
  type PartnerCategoryId,
} from '@/lib/results/resultsStatic';
import { getRegionStrategy2026 } from '@/lib/results/regionStrategy2026';
import { PackageComparisonCards } from './PackageComparisonCards';
import { PackageDetailPanel } from './PackageDetailPanel';
import { CustomPackageBuilder } from './CustomPackageBuilder';
import { DiyGuideCta } from './DiyGuideCta';
import { DiyUpgradesSection } from './DiyUpgradesSection';
import {
  diyChecklistItemsForMissingFurnishedPhotos,
  FURNISHED_LISTING_PHOTO_COMPANION_DIY,
} from '@/lib/results/furnishedPhotoProofDiy';
import { formatMoney } from './utils';
import { ConsultantsCarousel } from './ConsultantsCarousel';

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
  const tPlan = useTranslations('ResultsPlan');

  const { data } = useEvaluationStore();
  const mgmtMode: ManagementMode = data.mode ?? 'MANAGED';

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
  const strategy2026 = React.useMemo(() => getRegionStrategy2026(data.regionId), [data.regionId]);
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="border-b border-secondary-200 bg-white shadow-xs">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          {mgmtMode === 'DIY_FULL' && (
            <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50/80 p-4 text-sm text-secondary-800 shadow-xs">
              {lo === 'ar'
                ? 'وضع DIY كامل — ركّز على الدليل المجاني واحجز مستشاراً عند الحاجة.'
                : 'Full DIY mode — focus on the free guide below and book a consultant when you need help.'}
            </div>
          )}

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
              </div>

              <div className="flex min-w-0 flex-col gap-4 md:col-span-4 lg:gap-5">
                {/* Area stats card */}
                <Card className="flex w-full flex-col border border-primary-200/60 bg-gradient-to-br from-white to-primary-50/40 shadow-xs">
                  <CardContent className="p-3 sm:p-3.5 md:py-2.5 md:pe-4 md:ps-4">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                        <span className="min-w-0 text-sm font-semibold text-secondary-900">{regionName}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 border-t border-secondary-200/80 pt-2.5 text-sm md:flex-row md:items-baseline md:gap-x-6">
                        <div className="flex min-w-0 items-baseline justify-between gap-3 md:justify-start md:gap-4">
                          <span className="shrink-0 text-secondary-600">{lo === 'ar' ? 'متوسط السعر الليلي' : 'Average daily rate'}</span>
                          <span className="shrink-0 text-end font-semibold tabular-nums text-secondary-900 whitespace-nowrap">
                            {formatMoney(areaMarketBaselines.nightlyRateEgp, locale)}
                            <span className="ms-1 text-xs font-normal text-secondary-500">{lo === 'ar' ? 'ج.م/ليلة' : 'EGP/night'}</span>
                          </span>
                        </div>
                        <div className="flex min-w-0 items-baseline justify-between gap-3 sm:justify-start sm:gap-4">
                          <span className="shrink-0 text-secondary-600">{lo === 'ar' ? 'متوسط الإشغال' : 'Avg occupancy'}</span>
                          <span className="shrink-0 font-semibold tabular-nums text-secondary-900 whitespace-nowrap">{areaMarketBaselines.occupancyPct}%</span>
                        </div>
                      </div>
                    </div>
                    {strategy2026 && (
                      <div className="mt-3 border-t border-secondary-200/80 pt-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-primary-800">{lo === 'ar' ? 'استراتيجية ٢٠٢٦' : '2026 strategy'}</p>
                        <dl className="mt-2 space-y-1.5 text-sm">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">{lo === 'ar' ? 'الاستراتيجية' : 'Strategy'}</dt>
                            <dd className="max-w-[min(100%,18rem)] text-end font-medium text-secondary-900">{strategy2026.strategy[lo]}</dd>
                          </div>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">{lo === 'ar' ? 'هدف الإشغال' : 'Occupancy target'}</dt>
                            <dd className="text-end font-semibold tabular-nums text-secondary-900">{strategy2026.occupancyTarget[lo]}</dd>
                          </div>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">{lo === 'ar' ? 'ذروة الإيراد' : 'Revenue peak'}</dt>
                            <dd className="max-w-[min(100%,20rem)] text-end font-medium text-secondary-900">{strategy2026.revenuePeak[lo]}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Image analysis card */}
                <Card className="w-full border-secondary-200 shadow-xs">
                  <CardHeader className="p-4 pb-1.5 pt-3">
                    <CardTitle className="text-sm font-medium text-secondary-600">{lo === 'ar' ? 'تحليل الصور' : 'Image analysis'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 px-4 pb-3 pt-0 text-sm">
                    {!hasUploadedPhotos ? (
                      <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-secondary-200 bg-secondary-50/50 px-3 py-2">
                        <ImageOff className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" aria-hidden />
                        <p className="text-start text-sm leading-snug text-secondary-600">
                          {lo === 'ar'
                            ? 'لم ترفع أي صور — ارفع صور الغرف لنقيّم الإضاءة والفرش والانطباع الظاهر.'
                            : "You didn't upload photos — add room photos so we can assess lighting, staging, and visual appeal."}
                        </p>
                      </div>
                    ) : (
                      <>
                        {strengths.length > 0 && (
                          <ul className="space-y-2 text-secondary-800">
                            {strengths.map((t, i) => (<li key={`s-${i}`} className="leading-snug"><span className="text-primary-600">· </span>{t}</li>))}
                          </ul>
                        )}
                        {issues.length > 0 && (
                          <ul className="space-y-2 text-secondary-800">
                            {issues.map((t, i) => (<li key={`i-${i}`} className="leading-snug"><span className="text-amber-600">· </span>{t}</li>))}
                          </ul>
                        )}
                        {strengths.length === 0 && issues.length === 0 && (
                          <p className="text-secondary-600">{lo === 'ar' ? 'جارٍ تحليل الصور أو لم تُستخرج نقاط بعد.' : 'Photo insights are not available yet.'}</p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {selectedPainPoints.length > 0 && (
                  <Card className="w-full border-primary-200 bg-primary-50/50 shadow-xs">
                    <CardHeader className="p-4 pb-1.5 pt-3">
                      <CardTitle className="text-sm font-medium text-secondary-700">
                        {lo === 'ar' ? 'توصية نمط الإدارة' : 'Management recommendation'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 pt-0 text-sm text-secondary-800">
                      <p>
                        {mgmtMode === 'MANAGED'
                          ? lo === 'ar'
                            ? 'سنركّز على هذه النقاط في خطتك ومع المشرف المخصص لك.'
                            : 'We will prioritize these pain points in your plan and onboarding.'
                          : lo === 'ar'
                            ? 'بناءً على ما اخترته، التعاون في الإدارة أو DIY الكامل يعالجان أغلب هذه النقاط.'
                            : 'From what you selected, co-management or full DIY usually addresses these pain points.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* ── What your property needs ─────────────────────────────── */}
            <div className="rounded-xl border border-secondary-200 bg-white p-4 md:p-5">
              <h2 className="font-heading text-base font-semibold text-secondary-900 mb-2">
                {lo === 'ar' ? 'ما يحتاجه عقارك' : 'What your property needs'}
              </h2>
              <p className="text-sm text-secondary-600">
                {lo === 'ar'
                  ? `حددنا ${ruleResult.missingServices.length} خدمة يمكنها تحسين نقاطك من ${scoring.finalScore} إلى ${ruleResult.maxPossibleScore} نقطة.`
                  : `We identified ${ruleResult.missingServices.length} services that can improve your score from ${scoring.finalScore} to ${ruleResult.maxPossibleScore} points.`}
              </p>
            </div>

            {/* ── Income bar ───────────────────────────────────────────── */}
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-secondary-200 bg-white">
              <div className="border-b border-secondary-100 px-4 py-4 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-secondary-500">{lo === 'ar' ? 'الدخل الشهري (صافي) · اليوم' : 'Monthly net income · Today'}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-secondary-900 md:text-3xl">
                      {formatMoney(revenue.current.netMonthlyEgp, locale)}
                      <span className="ms-1 text-base font-normal text-secondary-500">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </p>
                  </div>
                  <div className={cn(lo === 'ar' ? 'text-start md:text-end' : 'md:text-end')}>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary-700">{tPlan('potentiallyWillBe')}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-primary-800 md:text-3xl">
                      {formatMoney(revenue.optimized.netMonthlyEgp, locale)}
                      <span className="ms-1 text-base font-normal text-secondary-500">{lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}</span>
                    </p>
                  </div>
                </div>
                {revenue.seasonalityFlag && (
                  <p className="mt-4 max-w-md rounded-lg border border-amber-100 bg-amber-50/80 p-2 text-xs text-amber-900">
                    {lo === 'ar' ? 'سوق موسمي — لا تعامل الدخل كشهري ثابت.' : 'Seasonal market — avoid assuming flat monthly income year-round.'}
                  </p>
                )}
              </div>

              {/* ── Package tabs + detail ──────────────────────────────── */}
              {mgmtMode !== 'DIY_FULL' && (
                <div className="space-y-6 px-4 py-5 md:px-6 md:py-6">
                  <PackageComparisonCards
                    packages={packageSet}
                    selectedPackage={selectedPackage}
                    onSelect={setSelectedPackage}
                    locale={locale}
                    lo={lo}
                  />

                  {selectedPackage === 'custom' ? (
                    <CustomPackageBuilder
                      allServices={packageSet.custom.all_services}
                      enabledServiceIds={customEnabledIds}
                      isNeeded={packageSet.custom.is_needed}
                      onToggle={handleToggleCustomService}
                      locale={locale}
                      lo={lo}
                    />
                  ) : (
                    <PackageDetailPanel
                      services={packageSet[selectedPackage].services}
                      totalCostMin={currentPkgTotals.total_cost_min}
                      totalCostMax={currentPkgTotals.total_cost_max}
                      totalScoreGain={currentPkgTotals.total_score_gain}
                      locale={locale}
                      lo={lo}
                    />
                  )}

                  <DiyUpgradesSection
                    lo={lo}
                    photoProofItems={furnishedPhotoDiy.photoProofItems}
                    photoCompanionItems={furnishedPhotoDiy.showCompanions ? FURNISHED_LISTING_PHOTO_COMPANION_DIY : []}
                  />

                  <p className="pt-6 font-heading text-lg font-semibold text-secondary-900">
                    {lo === 'ar' ? 'مهتم تبني هذا؟ تواصل معنا' : 'Interested in building this? Contact us'}
                  </p>
                  <div className={cn('flex pt-4', lo === 'ar' ? 'justify-start' : 'justify-end')}>
                    <Button type="button" disabled className="shadow-xs">
                      {lo === 'ar' ? 'طلب عرض سعر' : 'Request a quote'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── DIY Guide CTA ────────────────────────────────────────── */}
            <DiyGuideCta lo={lo} />
          </section>

          {showLtrSection && (
            <Card className="mb-10 border-amber-200 bg-amber-50/50 shadow-xs">
              <CardContent className="space-y-3 p-5 text-sm text-amber-950">
                <p className="font-semibold">{lo === 'ar' ? 'إيجار طويل الأمد' : 'Long-term rental'}</p>
                <p>{lo === 'ar' ? 'قد يكون أوضح استقراراً في وضعك.' : 'May be more stable for your situation.'}</p>
              </CardContent>
            </Card>
          )}

          {/* ── Consultants ────────────────────────────────────────────── */}
          <div id="consultants" className="scroll-mt-8 space-y-6">
            <section className="space-y-1" aria-labelledby="consultants-help-heading">
              <h2 id="consultants-help-heading" className="font-heading text-lg font-semibold text-secondary-900">
                {lo === 'ar' ? 'تحتاج مساعدة؟ تحدث مع مختص' : 'Need help? Talk to a specialist'}
              </h2>
            </section>

            <section id="consultants-carousel" className="space-y-3 scroll-mt-8" aria-labelledby="consultants-help-heading">
              <div className="flex flex-wrap gap-2" role="group" aria-label={lo === 'ar' ? 'تصفية حسب التخصص' : 'Filter by specialty'}>
                <Button type="button" size="sm" variant={specialistFilter === null ? 'primary' : 'outline'} className="rounded-full shadow-xs" onClick={() => setSpecialistFilter(null)}>
                  {lo === 'ar' ? 'الكل' : 'All'}
                </Button>
                {PARTNER_CATEGORY_KEYS.map((c) => (
                  <Button key={c.id} type="button" size="sm" variant={specialistFilter === c.id ? 'primary' : 'outline'} className="rounded-full shadow-xs" onClick={() => setSpecialistFilter((prev) => (prev === c.id ? null : c.id))}>
                    {c.name[lo]}
                  </Button>
                ))}
              </div>
              {specialistFilter !== null && filteredConsultants.length === 0 && (
                <p className="text-sm text-secondary-600">{lo === 'ar' ? 'لا يوجد مختصون في هذا التصنيف حالياً.' : 'No specialists in this category yet.'}</p>
              )}
              <ConsultantsCarousel consultants={filteredConsultants} lo={lo} onBook={setBookConsultant} />
            </section>
          </div>
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
