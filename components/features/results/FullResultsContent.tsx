'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManagementMode, WizardData } from '@/models';
import type { PackageType } from '@/lib/engines/packageBuilder';
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
import { PropertyAnalysisCard } from './PropertyAnalysisCard';
import { YourNeighboursPerformanceCard } from './YourNeighboursPerformanceCard';
import { ResultsPhotoCarousel } from './ResultsPhotoCarousel';
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

  const report = useEvaluationStore((s) => s.report);
  const data = report?.wizardData;
  const mgmtMode: ManagementMode = 'MANAGED';

  if (!report || !data) return null;

  const [selectedPackage, setSelectedPackage] = React.useState<PackageType>('sweet_spot');
  const [customEnabledIds, setCustomEnabledIds] = React.useState<string[]>(() => report.packageSet.custom.enabled_service_ids);

  // Sync custom defaults when packageSet changes
  React.useEffect(() => {
    setCustomEnabledIds(report.packageSet.custom.enabled_service_ids);
  }, [report.packageSet.custom.enabled_service_ids]);

  const handleToggleCustomService = React.useCallback((id: string) => {
    setCustomEnabledIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  // ── Region & UI data ─────────────────────────────────────────────────
  const regionName = report.region.name[lo];
  const areaMarketBaselines = report.areaMarketBaselines;
  const isNewCairo = data.regionId === 'new_cairo';

  const scoring = report.ruleResult.scoreResult;
  const licensingFirst =
    scoring.ltrFlag || (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5);
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

  const packageSet = report.packageSet;
  const revenueForSelected =
    selectedPackage === 'custom' ? report.revenueByPackage.custom : report.revenueByPackage[selectedPackage];
  const planForSelected =
    selectedPackage === 'custom' ? report.planFinancialsByPackage.custom : report.planFinancialsByPackage[selectedPackage];

  const customTotals = React.useMemo(() => {
    const enabled = packageSet.custom.all_services.filter((s) => customEnabledIds.includes(s.id));
    let total_cost_min = 0;
    let total_cost_max = 0;
    let total_score_gain = 0;
    for (const s of enabled) {
      total_score_gain += s.score_contribution;
      if (s.cost_unit === 'fixed') {
        total_cost_min += s.cost_min_egp;
        total_cost_max += s.cost_max_egp;
      }
    }
    return { total_cost_min, total_cost_max, total_score_gain };
  }, [packageSet.custom.all_services, customEnabledIds]);

  // Current selected package totals for display
  const currentPkgTotals = selectedPackage === 'custom'
    ? customTotals
    : {
        total_cost_min: packageSet[selectedPackage].total_cost_min,
        total_cost_max: packageSet[selectedPackage].total_cost_max,
        total_score_gain: packageSet[selectedPackage].total_score_gain,
      };

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
          </header>

          {/* ── Score + Area Stats + Image Analysis ──────────────────────── */}
          <section className="mb-10 space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-start md:gap-5 lg:gap-6">
              <div className="flex min-w-0 flex-col gap-4 md:col-span-1 lg:gap-5">
                <Card className="flex w-full min-w-0 flex-col border-secondary-200 shadow-xs">
                  <CardHeader className="p-4 pb-1 pt-3 text-center">
                    <CardTitle className="font-heading text-base font-semibold text-secondary-900">
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
                      <p className="mt-2 text-center text-xs text-secondary-600 max-w-[220px]">
                        {report.cardInsights?.readinessNarrative?.[lo] ?? ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <ResultsPhotoCarousel photos={data.photoUpload.files} />
              </div>

              <div className="flex min-w-0 flex-col gap-4 md:col-span-4 lg:gap-5">
                <YourNeighboursPerformanceCard
                  lo={lo}
                  locale={locale}
                  regionName={regionName}
                  nightlyRateEgp={areaMarketBaselines.nightlyRateEgp}
                  occupancyPct={areaMarketBaselines.occupancyPct}
                  typicalMonthlyUsd={report.cardInsights?.neighbours?.typicalMonthlyUsd ?? null}
                  top10MonthlyUsd={report.cardInsights?.neighbours?.top10MonthlyUsd ?? null}
                  peakSeasonNote={report.cardInsights?.neighbours?.peakSeasonNote ?? { en: '', ar: '' }}
                />
                <PropertyAnalysisCard
                  lo={lo}
                  bullets={report.cardInsights?.propertyAnalysisBullets ?? []}
                />
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
                      currentNetMonthlyEgp={revenueForSelected.current.netMonthlyEgp}
                      netMonthlyEgp={revenueForSelected.optimized.netMonthlyEgp}
                      breakEvenMonths={planForSelected.breakEvenMonths}
                      year1ProjectedNetEgp={planForSelected.year1ProjectedNet}
                      locale={locale}
                      lo={lo}
                    />
                  ) : (
                    <PackageDetailPanel
                      services={packageSet[selectedPackage].services}
                      sectionSubtitle={lo === 'ar' ? packageSet[selectedPackage].tagline_ar : packageSet[selectedPackage].tagline_en}
                      currentNetMonthlyEgp={revenueForSelected.current.netMonthlyEgp}
                      netMonthlyEgp={revenueForSelected.optimized.netMonthlyEgp}
                      totalCostMin={packageSet[selectedPackage].total_cost_min}
                      totalCostMax={packageSet[selectedPackage].total_cost_max}
                      breakEvenMonths={planForSelected.breakEvenMonths}
                      year1ProjectedNetEgp={planForSelected.year1ProjectedNet}
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
                    optimizedMonthlyText={formatMoney(revenueForSelected.optimized.netMonthlyEgp, locale)}
                    currentMonthlyText={formatMoney(revenueForSelected.current.netMonthlyEgp, locale)}
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
