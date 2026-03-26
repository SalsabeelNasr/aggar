'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ChevronLeft, ImageOff, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scoreWizardData } from '@/lib/engines/scoringEngine';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import {
  assignPackages,
  computeSelectedTotals,
  optimizedNetWithServiceToggles,
  type UserFacingPackageType,
  type ServiceLine,
} from '@/lib/engines/packageEngine';
import type { ManagementMode, WizardData } from '@/models';
import { getRegionById } from '@/services/mockApi';
import {
  CONSULTANT_MOCK,
  PARTNER_CATEGORY_KEYS,
  SCORE_IMPROVEMENT_ROWS,
  filterConsultantsByPartnerCategory,
  rankConsultantsForProperty,
  type ConsultantCard,
  type PartnerCategoryId,
} from '@/lib/results/resultsStatic';
import { getRegionStrategy2026 } from '@/lib/results/regionStrategy2026';
import { IMPROVEMENT_IDS_BY_PACKAGE } from '@/lib/results/packageImprovements';
import { PathRecommendationsSection } from './PathRecommendationsSection';
import { FixedBundlePanel } from './FixedBundlePanel';
import { DiyUpgradesSection } from './DiyUpgradesSection';
import {
  diyChecklistItemsForMissingFurnishedPhotos,
  FURNISHED_LISTING_PHOTO_COMPANION_DIY,
} from '@/lib/results/furnishedPhotoProofDiy';
import { formatMoney } from './utils';
import { ConsultantsCarousel } from './ConsultantsCarousel';

const TAB_PACKAGE_ORDER = ['quick_start', 'sweet_spot', 'asset_flip', 'custom'] as const satisfies readonly UserFacingPackageType[];

/** Radial readiness chart (Untitled-style clean ring). */
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
      text:
        locale === 'ar'
          ? 'امتثال ٢٠٩: خطر حرج (بدون مصعد، أدوار مرتفعة)'
          : 'Decree 209: critical risk (no lift, high floor)',
    };
  }
  if (lift === false && floor >= 2) {
    return {
      level: 'high',
      text: locale === 'ar' ? 'امتثال ٢٠٩: مخاطر عالية' : 'Decree 209: high compliance risk',
    };
  }
  if (data.regulatory?.inGatedCompound) {
    return {
      level: 'low',
      text:
        locale === 'ar'
          ? 'امتثال ٢٠٩: منطقة مجمعات مسجلة عادة'
          : 'Decree 209: typical gated-track eligibility',
    };
  }
  return {
    level: 'moderate',
    text: locale === 'ar' ? 'امتثال ٢٠٩: راجع المبنى والدور' : 'Decree 209: verify building & floor rules',
  };
}

export default function FullResultsContent() {
  const locale = useLocale();
  const lo: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const tPlan = useTranslations('ResultsPlan');

  const { data, updateData } = useEvaluationStore();
  const mgmtMode: ManagementMode = data.mode ?? 'MANAGED';

  const [diyGuideName, setDiyGuideName] = React.useState('');
  const [diyGuidePhone, setDiyGuidePhone] = React.useState('');
  const [diyGuideEmail, setDiyGuideEmail] = React.useState('');
  const [diyGuideErrors, setDiyGuideErrors] = React.useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const scoring = React.useMemo(() => scoreWizardData(data), [data]);
  const packages = React.useMemo(() => assignPackages(data), [data]);

  const [selectedPackage, setSelectedPackage] = React.useState<UserFacingPackageType>(() => assignPackages(data).recommended);
  const [enabledServiceIds, setEnabledServiceIds] = React.useState<string[]>(() => {
    const p = assignPackages(data);
    if (p.recommended === 'custom') return [...p.customRecommendedServiceIds];
    return p.all[p.recommended].services.map((s) => s.id);
  });
  const [bookConsultant, setBookConsultant] = React.useState<ConsultantCard | null>(null);
  const [specialistFilter, setSpecialistFilter] = React.useState<PartnerCategoryId | null>(null);

  const customSeedKey = packages.customRecommendedServiceIds.join('|');
  React.useEffect(() => {
    setSelectedPackage(packages.recommended);
    if (packages.recommended === 'custom') {
      setEnabledServiceIds([...packages.customRecommendedServiceIds]);
    } else {
      setEnabledServiceIds(packages.all[packages.recommended].services.map((s) => s.id));
    }
  }, [packages.recommended, customSeedKey]);

  const handlePackageTabChange = React.useCallback(
    (v: string) => {
      const pt = v as UserFacingPackageType;
      setSelectedPackage(pt);
      if (pt === 'custom') {
        setEnabledServiceIds(
          packages.recommended === 'custom' ? [...packages.customRecommendedServiceIds] : []
        );
      } else {
        setEnabledServiceIds(packages.all[pt].services.map((s) => s.id));
      }
    },
    [packages.all, packages.recommended, packages.customRecommendedServiceIds]
  );

  const revenue = React.useMemo(
    () => projectRevenue(data, { packageType: selectedPackage }),
    [data, selectedPackage]
  );

  const revenueByPackage = React.useMemo(() => {
    const map = {} as Record<UserFacingPackageType, ReturnType<typeof projectRevenue>>;
    for (const t of TAB_PACKAGE_ORDER) {
      map[t] = projectRevenue(data, { packageType: t });
    }
    return map;
  }, [data]);

  const pkg = packages.all[selectedPackage];
  const totals = React.useMemo(
    () => computeSelectedTotals(pkg, enabledServiceIds, revenue),
    [pkg, enabledServiceIds, revenue]
  );

  const adjustedOptimizedNet = React.useMemo(
    () => optimizedNetWithServiceToggles(revenue.optimized.netMonthlyEgp, pkg, enabledServiceIds),
    [revenue.optimized.netMonthlyEgp, pkg, enabledServiceIds]
  );

  const regionMeta = React.useMemo(() => getRegionById(data.regionId), [data.regionId]);
  const regionName = regionMeta.name[lo];

  const areaMarketBaselines = React.useMemo(() => regionalMarketBaselines(data.regionId), [data.regionId]);
  const strategy2026 = React.useMemo(() => getRegionStrategy2026(data.regionId), [data.regionId]);
  const isNewCairo = data.regionId === 'new_cairo';

  const licensingFirst =
    scoring.ltrFlag || (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5);

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

  const contextualImprovements = React.useMemo(() => {
    const ids = new Set(IMPROVEMENT_IDS_BY_PACKAGE[selectedPackage]);
    return SCORE_IMPROVEMENT_ROWS.filter((row) => ids.has(row.id));
  }, [selectedPackage]);

  const resetPlan = React.useCallback(() => {
    if (selectedPackage === 'custom') {
      if (packages.recommended === 'custom') {
        setEnabledServiceIds([...packages.customRecommendedServiceIds]);
      } else {
        setEnabledServiceIds([]);
      }
      return;
    }
    setEnabledServiceIds(packages.all[selectedPackage].services.map((s) => s.id));
  }, [selectedPackage, packages.all, packages.recommended, packages.customRecommendedServiceIds]);

  const hasUploadedPhotos = data.photoUpload.files.some((f) => Boolean(f.url));

  const furnishedPhotoDiy = React.useMemo(() => {
    if (data.stateFlag !== 'FURNISHED_RENO') {
      return { photoProofItems: [], showCompanions: false };
    }
    return {
      photoProofItems: diyChecklistItemsForMissingFurnishedPhotos(data.furnishedPhotoChecklist),
      showCompanions: true,
    };
  }, [data.stateFlag, data.furnishedPhotoChecklist]);
  const strengths = (data.photoUpload.aiSummary?.visibleStrengths ?? []).slice(0, 3);
  const issues = (data.photoUpload.aiSummary?.visibleIssues ?? scoring.reasons).slice(0, 3);

  const tier1Services = pkg.services.filter((s) => s.tier === 'tier1_vendor');
  const tier2Services = pkg.services.filter((s) => s.tier === 'tier2_addon');
  const tier1InPlan = tier1Services.filter((s) => enabledServiceIds.includes(s.id));
  const tier1OutOfPlan = tier1Services.filter((s) => !enabledServiceIds.includes(s.id));
  const tier2InPlan = tier2Services.filter((s) => enabledServiceIds.includes(s.id));
  const tier2OutOfPlan = tier2Services.filter((s) => !enabledServiceIds.includes(s.id));

  const addServiceToPlan = (id: string) => {
    setEnabledServiceIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const hasPhotoOutOfPlan = [...tier1OutOfPlan, ...tier2OutOfPlan].some(
    (s) => s.id === 'pro_photography' || s.id === 'rephotography'
  );

  const compliance209Recommendation = React.useMemo(() => {
    const hasLicensingSvc = pkg.services.some((s) => s.id === 'licensing');
    const licensingOn = enabledServiceIds.includes('licensing');
    const furnished = data.stateFlag === 'FURNISHED_RENO';
    const tourismOk = data.furnishedLeadQualification?.tourismLicenseStatus === 'yes';

    const needsRegulatoryNote = decree.level !== 'low';
    const needsLicensingInPlan = hasLicensingSvc && !licensingOn;
    const needsTourismConfirm = furnished && !tourismOk;

    if (!needsRegulatoryNote && !needsLicensingInPlan && !needsTourismConfirm) return null;

    const lines: string[] = [];
    if (needsRegulatoryNote) lines.push(decree.text);
    if (needsLicensingInPlan) {
      lines.push(
        lo === 'ar'
          ? 'ملاحظة ترخيص STR (قرار ٢٠٩): البند غير مفعّل في خطتك حالياً — فعّله لتقليل المفاجآت أثناء التشغيل.'
          : 'STR licensing (Decree 209): it’s currently off your plan — turn it on to avoid surprises later.'
      );
    }
    if (needsTourismConfirm) {
      lines.push(
        lo === 'ar'
          ? 'تأكيد رخصة السياحة يساعد على تجنّب تعطّل الإطلاق — وإذا تحتاج مساعدة، نقدر نرشدك لخطوات التسجيل.'
          : 'Confirming your tourism licence helps prevent launch delays — if you need help, we can guide you through registration.'
      );
    }

    const urgent = decree.level === 'high' || decree.level === 'critical';

    return { lines, urgent, showAddLicensing: needsLicensingInPlan };
  }, [
    decree.level,
    decree.text,
    pkg,
    enabledServiceIds,
    data.stateFlag,
    data.furnishedLeadQualification?.tourismLicenseStatus,
    lo,
  ]);

  const formatServiceFeeInline = (s: ServiceLine) => {
    if ('percentOfRevenue' in s.costRangeEgp) {
      return lo === 'ar'
        ? `${s.costRangeEgp.minPct}–${s.costRangeEgp.maxPct}%`
        : `${s.costRangeEgp.minPct}–${s.costRangeEgp.maxPct}% rev`;
    }
    if ('per' in s.costRangeEgp) {
      return lo === 'ar'
        ? `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)} /م²`
        : `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)}/sqm`;
    }
    return `${formatMoney(s.costRangeEgp.min, locale)}–${formatMoney(s.costRangeEgp.max, locale)}`;
  };

  const renderServiceRow = (s: ServiceLine, opts?: { lead?: { en: string; ar: string } }) => {
    const enabled = enabledServiceIds.includes(s.id);
    const feeStr = formatServiceFeeInline(s);

    return (
      <div
        key={s.id}
        className="rounded-xl border border-secondary-200 bg-secondary-50/40 p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_9.5rem_auto] sm:items-start sm:gap-4"
      >
        <div className="min-w-0">
          {opts?.lead && (
            <p className="mb-2 text-sm leading-relaxed text-secondary-700">{opts.lead[lo]}</p>
          )}
          <p className="text-sm font-semibold text-secondary-900">{s.name[lo]}</p>
          <p className="mt-1 text-sm text-secondary-600">{s.impactLabel[lo]}</p>
        </div>
        <p className="mt-3 text-sm font-semibold tabular-nums text-secondary-900 sm:mt-0 sm:text-end sm:pt-0.5">
          {feeStr}
          {!('percentOfRevenue' in s.costRangeEgp) && !('per' in s.costRangeEgp) && (
            <span className="ms-1 text-xs font-normal text-secondary-500">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
          )}
        </p>
        <div className="mt-3 shrink-0 sm:mt-0 sm:justify-self-end">
          <button
            type="button"
            onClick={() => {
              setEnabledServiceIds((prev) => (prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]));
            }}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-semibold shadow-xs transition-colors',
              enabled
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-secondary-200 bg-white text-secondary-800 hover:border-primary-300'
            )}
          >
            {enabled
              ? lo === 'ar'
                ? 'مفعّل'
                : 'On'
              : lo === 'ar'
                ? 'إيقاف'
                : 'Off'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="border-b border-secondary-200 bg-white shadow-xs">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          {mgmtMode === 'DIY_FULL' && (
            <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50/80 p-4 text-sm text-secondary-800 shadow-xs">
              {lo === 'ar'
                ? 'وضع DIY كامل — ركّز على قسم «تحسينات تفعلها بنفسك» داخل تبويب الدخل والخطة، واحجز مستشاراً عند الحاجة.'
                : 'Full DIY mode — use the “DIY upgrades” block inside the Income & plan tab, and book a consultant when you need help.'}
            </div>
          )}
          {mgmtMode === 'DIY_ASSISTED' && (
            <div className="mb-8 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-800 shadow-xs">
              {lo === 'ar'
                ? 'المساعدة الذاتية: عند تغيير الخدمات تتحدث التكاليف والصافي.'
                : 'Assisted DIY: costs and net update when you toggle services.'}
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
                    <img
                      key={f.id}
                      src={f.url}
                      alt=""
                      className="h-14 w-14 rounded-lg border border-secondary-200 object-cover shadow-xs"
                    />
                  ))}
              </div>
            )}
          </header>

          {/* Top: readiness (~20%) | area + image (~80%) · full-width monthly net & plan */}
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
                              <p className="text-[11px] font-medium leading-tight text-secondary-500">
                                {lo === 'ar' ? 'من ١٠٠' : '/ 100'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Area stats + Image analysis — 80% width on md+ */}
                <div className="flex min-w-0 flex-col gap-4 md:col-span-4 lg:gap-5">
                <Card className="flex w-full flex-col border border-primary-200/60 bg-gradient-to-br from-white to-primary-50/40 shadow-xs">
                  <CardContent className="p-3 sm:p-3.5 md:py-2.5 md:pe-4 md:ps-4">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                        <span className="min-w-0 text-sm font-semibold text-secondary-900">{regionName}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 border-t border-secondary-200/80 pt-2.5 text-sm md:flex-row md:flex-nowrap md:items-baseline md:gap-x-6 lg:gap-x-8 xl:gap-x-10">
                        <div className="flex min-w-0 items-baseline justify-between gap-3 md:justify-start md:gap-4">
                          <span className="shrink-0 text-secondary-600">
                            {lo === 'ar' ? 'متوسط السعر الليلي' : 'Average daily rate'}
                          </span>
                          <span className="shrink-0 text-end font-semibold tabular-nums text-secondary-900 whitespace-nowrap">
                            {formatMoney(areaMarketBaselines.nightlyRateEgp, locale)}
                            <span className="ms-1 text-xs font-normal text-secondary-500">
                              {lo === 'ar' ? 'ج.م/ليلة' : 'EGP/night'}
                            </span>
                          </span>
                        </div>
                        <div
                          className={cn(
                            'flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-baseline sm:gap-x-4 md:gap-x-6 lg:gap-x-8',
                            isNewCairo && strategy2026 && 'xl:gap-x-10'
                          )}
                        >
                          <div className="flex min-w-0 items-baseline justify-between gap-3 sm:justify-start sm:gap-4">
                            <span className="shrink-0 text-secondary-600">
                              {lo === 'ar' ? 'متوسط الإشغال' : 'Avg occupancy'}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums text-secondary-900 whitespace-nowrap">
                              {areaMarketBaselines.occupancyPct}%
                            </span>
                          </div>
                          {isNewCairo && strategy2026 && (
                            <div className="flex min-w-0 items-baseline justify-between gap-3 border-t border-secondary-200/80 pt-1.5 sm:border-t-0 sm:border-s sm:border-secondary-200/80 sm:ps-4 sm:pt-0 md:ps-5">
                              <span className="shrink-0 text-secondary-600">
                                {lo === 'ar' ? 'ذروة الإيراد' : 'Revenue peak'}
                              </span>
                              <span className="shrink-0 text-end font-semibold text-secondary-900 sm:whitespace-nowrap">
                                {strategy2026.revenuePeak[lo]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {strategy2026 && !isNewCairo && (
                      <div className="mt-3 border-t border-secondary-200/80 pt-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-primary-800">
                          {lo === 'ar' ? 'استراتيجية ٢٠٢٦' : '2026 strategy'}
                        </p>
                        <dl className="mt-2 space-y-1.5 text-sm">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">{lo === 'ar' ? 'الاستراتيجية' : 'Strategy'}</dt>
                            <dd className="max-w-[min(100%,18rem)] text-end font-medium text-secondary-900">
                              {strategy2026.strategy[lo]}
                            </dd>
                          </div>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">
                              {lo === 'ar' ? 'هدف الإشغال' : 'Occupancy target'}
                            </dt>
                            <dd className="text-end font-semibold tabular-nums text-secondary-900">
                              {strategy2026.occupancyTarget[lo]}
                            </dd>
                          </div>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <dt className="text-secondary-600">{lo === 'ar' ? 'ذروة الإيراد' : 'Revenue peak'}</dt>
                            <dd className="max-w-[min(100%,20rem)] text-end font-medium text-secondary-900">
                              {strategy2026.revenuePeak[lo]}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="w-full border-secondary-200 shadow-xs">
                  <CardHeader className={cn(!hasUploadedPhotos ? 'p-4 pb-1 pt-3' : 'p-4 pb-1.5 pt-3')}>
                    <CardTitle className="text-sm font-medium text-secondary-600">
                      {lo === 'ar' ? 'تحليل الصور' : 'Image analysis'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={cn('text-sm', !hasUploadedPhotos ? 'space-y-0 px-4 pb-3 pt-0' : 'space-y-2 px-4 pb-3 pt-0')}>
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
                            {strengths.map((t, i) => (
                              <li key={`s-${i}`} className="leading-snug">
                                <span className="text-primary-600">· </span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                        {issues.length > 0 && (
                          <ul className="space-y-2 text-secondary-800">
                            {issues.map((t, i) => (
                              <li key={`i-${i}`} className="leading-snug">
                                <span className="text-amber-600">· </span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                        {strengths.length === 0 && issues.length === 0 && (
                          <p className="text-secondary-600">
                            {lo === 'ar'
                              ? 'جارٍ تحليل الصور أو لم تُستخرج نقاط بعد — جرّب صوراً أوضح لكل مساحة.'
                              : 'Photo insights are not available yet — try clearer shots of each space.'}
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                </div>
            </div>

            {/* Income & plan: flat layout so tabs stay visually primary */}
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-secondary-200 bg-white">
              {/* Today’s net + modeled potential for selected path */}
              <div className="border-b border-secondary-100 px-4 py-4 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-secondary-500">
                      {lo === 'ar' ? 'الدخل الشهري (صافي) · اليوم' : 'Monthly net income · Today'}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-secondary-900 md:text-3xl">
                      {formatMoney(revenue.current.netMonthlyEgp, locale)}
                      <span className="ms-1 text-base font-normal text-secondary-500">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </p>
                  </div>
                  <div className={cn(lo === 'ar' ? 'text-start md:text-end' : 'md:text-end')}>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary-700">
                      {tPlan('potentiallyWillBe')}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-primary-800 md:text-3xl">
                      {formatMoney(adjustedOptimizedNet, locale)}
                      <span className="ms-1 text-base font-normal text-secondary-500">
                        {lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}
                      </span>
                    </p>
                  </div>
                </div>
                {(revenue.seasonalityFlag || data.regionId === 'north_coast') && (
                  <p className="mt-4 max-w-md rounded-lg border border-amber-100 bg-amber-50/80 p-2 text-xs text-amber-900">
                    {lo === 'ar'
                      ? 'سوق موسمي — لا تعامل الدخل كشهري ثابت.'
                      : 'Seasonal market — avoid assuming flat monthly income year-round.'}
                  </p>
                )}
              </div>

              {mgmtMode !== 'DIY_FULL' && (
                <>
                  <div className="border-b border-secondary-100 px-4 py-4 md:px-6">
                    <h2 className="font-heading text-base font-semibold text-secondary-900 md:text-lg">
                      {tPlan('potentiallyWillBe')}
                    </h2>
                    <Tabs
                      defaultValue={packages.recommended}
                      value={selectedPackage}
                      onValueChange={handlePackageTabChange}
                      className="mt-3 w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                        {TAB_PACKAGE_ORDER.map((pt) => {
                          const p = packages.all[pt];
                          const isRec = packages.recommended === pt;
                          return (
                            <TabsTrigger
                              key={pt}
                              value={pt}
                              className="relative flex h-auto min-h-[3.25rem] w-full flex-col items-stretch justify-center overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50/40 px-3 py-2.5 text-start text-sm transition-colors hover:bg-secondary-50 data-[state=active]:border-primary-600 data-[state=active]:bg-primary-50 data-[state=active]:shadow-none md:min-h-[3.5rem] md:px-3.5 md:py-3"
                            >
                              {isRec && (
                                <span className="absolute end-2 top-2 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  {lo === 'ar' ? 'موصى به' : 'Recommended'}
                                </span>
                              )}
                              <span
                                className={cn(
                                  'font-semibold leading-snug text-secondary-900',
                                  isRec && 'pe-12 sm:pe-11'
                                )}
                              >
                                {p.name[lo]}
                              </span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>

                    <section className="mt-5 border-t border-secondary-100 pt-4">
                      <div className={cn('mb-6', lo === 'ar' && 'text-end')}>
                        <h2 className="text-lg font-semibold text-[#101828]">
                          {selectedPackage === 'custom'
                            ? tPlan('introCustomTitle')
                            : tPlan(`intro.${selectedPackage}.title`)}
                        </h2>
                        <p className="text-sm text-[#475467]">
                          {selectedPackage === 'custom'
                            ? tPlan('introCustomBody')
                            : tPlan(`intro.${selectedPackage}.body`)}
                        </p>
                      </div>

                      <div
                        className={cn(
                          'flex flex-wrap items-end gap-x-8 gap-y-6 md:flex-nowrap md:gap-x-6',
                          lo === 'ar' && 'justify-end'
                        )}
                      >
                        <div className="shrink-0 tabular-nums">
                          <span className="text-4xl font-bold tracking-tight text-[#101828]">
                            {formatMoney(adjustedOptimizedNet, locale)}
                          </span>
                          <span className="ms-1 text-sm font-medium text-[#475467] uppercase">
                            {lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}
                          </span>
                        </div>
                        <div className="hidden h-10 w-px shrink-0 bg-[#EAECF0] md:block" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-x-8 gap-y-4">
                          <div>
                            <p className="mb-1 text-xs font-medium text-[#475467] uppercase tracking-wider">
                              {lo === 'ar' ? 'الخدمات (تقدير)' : 'Services (est.)'}
                            </p>
                            <p className="text-lg font-semibold tabular-nums text-[#101828]">
                              {formatMoney(totals.selectedServicesTotalEgp.min, locale)} -{' '}
                              {formatMoney(totals.selectedServicesTotalEgp.max, locale)}{' '}
                              <span className="text-sm font-medium text-[#475467] uppercase">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-medium text-[#475467] uppercase tracking-wider">
                              {lo === 'ar' ? 'صافي / شهر' : 'Net / mo'}
                            </p>
                            <p className="text-lg font-semibold tabular-nums text-[#101828]">
                              {formatMoney(adjustedOptimizedNet, locale)}
                              <span className="ms-1 text-sm font-medium text-[#475467] uppercase">
                                {lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-medium text-[#475467] uppercase tracking-wider">
                              {lo === 'ar' ? 'استرداد' : 'Break-even'}
                            </p>
                            <p className="text-lg font-semibold tabular-nums text-[#101828]">
                              {totals.breakEvenMonths
                                ? `${totals.breakEvenMonths.min} - ${totals.breakEvenMonths.max}`
                                : lo === 'ar'
                                  ? 'غير متاح'
                                  : 'N/A'}{' '}
                              <span className="text-sm font-normal text-[#667085]">{lo === 'ar' ? 'شهر' : 'mo'}</span>
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-medium text-[#475467] uppercase tracking-wider">
                              {lo === 'ar' ? 'صافي سنة ١' : 'Year 1 net'}
                            </p>
                            <p className="text-lg font-semibold tabular-nums text-[#101828]">
                              {totals.year1ProjectedNetEgp
                                ? `${formatMoney(totals.year1ProjectedNetEgp.min, locale)} - ${formatMoney(totals.year1ProjectedNetEgp.max, locale)}`
                                : lo === 'ar'
                                  ? 'غير متاح'
                                  : 'N/A'}{' '}
                              <span className="text-sm font-medium text-[#475467] uppercase">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </p>
                          </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8 px-4 py-5 md:px-6 md:py-6">
                          {selectedPackage === 'custom' ? (
                            <>
                              <div className="space-y-2 rounded-xl border border-secondary-200/80 bg-secondary-50/40 p-4 md:p-5">
                                <h3 className="font-heading text-base font-semibold text-secondary-900">
                                  {tPlan('introCustomTitle')}
                                </h3>
                                <p className="text-sm leading-relaxed text-secondary-700">{tPlan('introCustomBody')}</p>
                              </div>
                              <PathRecommendationsSection
                                lo={lo}
                                locale={locale}
                                compliance209Recommendation={compliance209Recommendation}
                                contextualImprovements={contextualImprovements}
                                pkg={pkg}
                                enabledServiceIds={enabledServiceIds}
                                setEnabledServiceIds={setEnabledServiceIds}
                                tier1InPlan={tier1InPlan}
                                tier2InPlan={tier2InPlan}
                                tier1OutOfPlan={tier1OutOfPlan}
                                tier2OutOfPlan={tier2OutOfPlan}
                                hasPhotoOutOfPlan={hasPhotoOutOfPlan}
                                adjustedOptimizedNet={adjustedOptimizedNet}
                                revenueOptimizedNet={revenue.optimized.netMonthlyEgp}
                                resetPlan={resetPlan}
                                addServiceToPlan={addServiceToPlan}
                                renderServiceRow={renderServiceRow}
                                introSize="minimal"
                              />
                            </>
                          ) : (
                            <>
                              <FixedBundlePanel
                                lo={lo}
                                locale={locale}
                                pkg={pkg}
                                services={pkg.services}
                                improvementRows={contextualImprovements}
                                labels={{
                                  columnService: tPlan('columns.service'),
                                  columnFee: tPlan('columns.fee'),
                                  columnWhy: tPlan('columns.why'),
                                  subtotal: tPlan('columns.subtotal'),
                                }}
                                subtotalMin={totals.selectedServicesTotalEgp.min}
                                subtotalMax={totals.selectedServicesTotalEgp.max}
                              />
                            </>
                          )}

                          <DiyUpgradesSection
                            lo={lo}
                            photoProofItems={furnishedPhotoDiy.photoProofItems}
                            photoCompanionItems={
                              furnishedPhotoDiy.showCompanions ? FURNISHED_LISTING_PHOTO_COMPANION_DIY : []
                            }
                          />

                          {compliance209Recommendation && (
                            <div
                              className={cn(
                                'mt-8 rounded-xl border p-4 shadow-xs md:p-5',
                                compliance209Recommendation.urgent
                                  ? 'border-amber-200 bg-amber-50/90'
                                  : 'border-sky-200/80 bg-sky-50/50'
                              )}
                            >
                              <h4 className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
                                {lo === 'ar' ? 'تنبيه سريع قبل الإطلاق (قرار ٢٠٩)' : 'Quick pre-launch check (Decree 209)'}
                              </h4>
                              <div className="mt-3 space-y-2 text-sm leading-relaxed text-secondary-800">
                                {compliance209Recommendation.lines.map((line, i) => (
                                  <p key={i}>{line}</p>
                                ))}
                              </div>
                              {compliance209Recommendation.showAddLicensing && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-4 shadow-xs"
                                  onClick={() => addServiceToPlan('licensing')}
                                >
                                  {lo === 'ar' ? '+ فعّل ترخيص STR (قرار ٢٠٩)' : '+ Add STR licensing (Decree 209)'}
                                </Button>
                              )}
                            </div>
                          )}

                          <p className="pt-6 font-heading text-lg font-semibold text-secondary-900">
                            {lo === 'ar' ? 'مهتم تبني هذا؟ تواصل معنا' : 'Interested in building this? Contact us'}
                          </p>
                          <div
                            className={cn(
                              'flex pt-4',
                              lo === 'ar' ? 'justify-start' : 'justify-end'
                            )}
                          >
                            <Button type="button" disabled className="shadow-xs">
                              {lo === 'ar' ? 'طلب عرض سعر' : 'Request a quote'}
                            </Button>
                          </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {showLtrSection && (
            <Card className="mb-10 border-amber-200 bg-amber-50/50 shadow-xs">
              <CardContent className="space-y-3 p-5 text-sm text-amber-950">
                <p className="font-semibold">{lo === 'ar' ? 'إيجار طويل الأمد' : 'Long-term rental'}</p>
                <p>
                  {lo === 'ar'
                    ? 'قد يكون أوضح استقراراً في وضعك — قارن مع مسارات STR في لوحة الدخل والخطة.'
                    : 'May be more stable for your situation — compare STR paths in the income & plan panel.'}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-10 overflow-hidden border-0 bg-gradient-to-r from-primary-900 via-[#2C2D73] to-primary-700 text-white shadow-sm">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-semibold tracking-tight">
                    {lo === 'ar' ? 'عايز تعملها بنفسك؟' : 'Want to do it yourself?'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/85">
                    {lo === 'ar'
                      ? 'خُد دليلنا “DIY Superhost” — 15+ حيلة للتصوير، نصوص جاهزة للرسائل، وشيكات سريعة للبياضات.'
                      : 'Get our “DIY Superhost Guide” — 15+ photography hacks, ready-to-send guest scripts, and linen checklists.'}
                  </p>
                </div>

                <form
                  className={cn('flex w-full flex-col gap-2 md:max-w-md md:flex-row md:items-stretch', lo === 'ar' && 'md:flex-row-reverse')}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = diyGuideName.trim();
                    const email = diyGuideEmail.trim();
                    const phoneRaw = diyGuidePhone.trim();

                    const nextErrors: { name?: string; phone?: string; email?: string } = {};
                    if (name.length < 2) nextErrors.name = lo === 'ar' ? 'اكتب الاسم بالكامل.' : 'Enter your full name.';

                    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    if (!emailOk) nextErrors.email = lo === 'ar' ? 'اكتب بريد صحيح.' : 'Enter a valid email.';

                    // Egypt default (+20). Accept: 01XXXXXXXXX, 1XXXXXXXXX, +201XXXXXXXXX, 201XXXXXXXXX
                    const digits = phoneRaw.replace(/[^\d+]/g, '');
                    const normalizedDigits = digits.startsWith('+') ? digits.slice(1) : digits;
                    const egLocal = normalizedDigits.startsWith('0') ? normalizedDigits.slice(1) : normalizedDigits;
                    const egNational = egLocal.startsWith('20') ? egLocal.slice(2) : egLocal;
                    const egOk = /^1\d{9}$/.test(egNational);
                    if (!egOk) {
                      nextErrors.phone =
                        lo === 'ar'
                          ? 'اكتب رقم موبايل مصري صحيح (مثال: 010xxxxxxxx).'
                          : 'Enter a valid Egypt mobile (e.g. 010xxxxxxxx).';
                    }

                    if (Object.keys(nextErrors).length > 0) {
                      setDiyGuideErrors(nextErrors);
                      return;
                    }

                    setDiyGuideErrors({});
                    const e164 = `+20${egNational}`;
                    const msg = encodeURIComponent(
                      lo === 'ar'
                        ? `أريد دليل DIY Superhost.\nالاسم: ${name}\nالموبايل: ${e164}\nالبريد: ${email}`
                        : `I want the DIY Superhost Guide.\nName: ${name}\nPhone: ${e164}\nEmail: ${email}`
                    );
                    window.open(`https://wa.me/201140988255?text=${msg}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2', lo === 'ar' && 'sm:grid-cols-2')}>
                      <div className="min-w-0">
                        <label className="sr-only" htmlFor="diy-guide-name">
                          {lo === 'ar' ? 'الاسم' : 'Name'}
                        </label>
                        <input
                          id="diy-guide-name"
                          name="name"
                          autoComplete="name"
                          value={diyGuideName}
                          onChange={(e) => {
                            setDiyGuideName(e.target.value);
                            if (diyGuideErrors.name) setDiyGuideErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder={lo === 'ar' ? 'الاسم' : 'Name'}
                          className={cn(
                            'h-11 w-full rounded-lg border px-4 text-sm font-medium shadow-xs outline-none transition-colors',
                            'border-white/15 bg-white/10 text-white placeholder:text-white/60',
                            'focus:border-white/30 focus:ring-2 focus:ring-white/25',
                            diyGuideErrors.name && 'border-amber-300/70 focus:border-amber-200'
                          )}
                        />
                        {diyGuideErrors.name && (
                          <p className="mt-1 text-xs font-medium text-amber-100">{diyGuideErrors.name}</p>
                        )}
                      </div>
                      <div className="min-w-0">
                        <label className="sr-only" htmlFor="diy-guide-phone">
                          {lo === 'ar' ? 'الموبايل' : 'Phone'}
                        </label>
                        <div
                          className={cn(
                            'flex h-11 w-full overflow-hidden rounded-lg border shadow-xs transition-colors',
                            'border-white/15 bg-white/10',
                            'focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/25',
                            diyGuideErrors.phone && 'border-amber-300/70 focus-within:border-amber-200'
                          )}
                        >
                          <div className="flex shrink-0 items-center gap-2 border-e border-white/10 px-3 text-sm font-semibold text-white/90">
                            <span aria-hidden>🇪🇬</span>
                            <span className="tabular-nums">+20</span>
                          </div>
                          <input
                            id="diy-guide-phone"
                            name="phone"
                            inputMode="tel"
                            autoComplete="tel"
                            value={diyGuidePhone}
                            onChange={(e) => {
                              setDiyGuidePhone(e.target.value);
                              if (diyGuideErrors.phone) setDiyGuideErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            placeholder={lo === 'ar' ? '10xxxxxxxx أو 01xxxxxxxxx' : '10xxxxxxxx or 01xxxxxxxxx'}
                            className="h-full w-full bg-transparent px-3 text-sm font-medium text-white placeholder:text-white/60 outline-none"
                          />
                        </div>
                        {diyGuideErrors.phone && (
                          <p className="mt-1 text-xs font-medium text-amber-100">{diyGuideErrors.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label className="sr-only" htmlFor="diy-guide-email">
                        {lo === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        id="diy-guide-email"
                        name="email"
                        inputMode="email"
                        autoComplete="email"
                        value={diyGuideEmail}
                        onChange={(e) => {
                          setDiyGuideEmail(e.target.value);
                          if (diyGuideErrors.email) setDiyGuideErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder={lo === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        className={cn(
                          'h-11 w-full rounded-lg border px-4 text-sm font-medium shadow-xs outline-none transition-colors',
                          'border-white/15 bg-white/10 text-white placeholder:text-white/60',
                          'focus:border-white/30 focus:ring-2 focus:ring-white/25',
                          diyGuideErrors.email && 'border-amber-300/70 focus:border-amber-200'
                        )}
                      />
                      {diyGuideErrors.email && (
                        <p className="mt-1 text-xs font-medium text-amber-100">{diyGuideErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="h-11 shrink-0 bg-white text-primary-800 hover:bg-white/90">
                    {lo === 'ar' ? 'إرسال الدليل' : 'Send guide'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <div id="consultants" className="scroll-mt-8 space-y-6">
            <section className="space-y-1" aria-labelledby="consultants-help-heading">
              <h2 id="consultants-help-heading" className="font-heading text-lg font-semibold text-secondary-900">
                {lo === 'ar' ? 'تحتاج مساعدة؟ تحدث مع مختص' : 'Need help? Talk to a specialist'}
              </h2>
            </section>

            {/* Specialist strip — multi-card marquee; pauses on hover / focus */}
            <section id="consultants-carousel" className="space-y-3 scroll-mt-8" aria-labelledby="consultants-help-heading">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={lo === 'ar' ? 'تصفية حسب التخصص' : 'Filter by specialty'}
              >
                <Button
                  type="button"
                  size="sm"
                  variant={specialistFilter === null ? 'primary' : 'outline'}
                  className="rounded-full shadow-xs"
                  aria-pressed={specialistFilter === null}
                  onClick={() => setSpecialistFilter(null)}
                >
                  {lo === 'ar' ? 'الكل' : 'All'}
                </Button>
                {PARTNER_CATEGORY_KEYS.map((c) => (
                  <Button
                    key={c.id}
                    type="button"
                    size="sm"
                    variant={specialistFilter === c.id ? 'primary' : 'outline'}
                    className="rounded-full shadow-xs"
                    aria-pressed={specialistFilter === c.id}
                    onClick={() => setSpecialistFilter((prev) => (prev === c.id ? null : c.id))}
                  >
                    {c.name[lo]}
                  </Button>
                ))}
              </div>
              {specialistFilter !== null && filteredConsultants.length === 0 && (
                <p className="text-sm text-secondary-600">
                  {lo === 'ar'
                    ? 'لا يوجد مختصون في هذا التصنيف حالياً — اختر «الكل» أو تصنيفاً آخر.'
                    : 'No specialists in this category yet — choose All or another chip.'}
                </p>
              )}
              <ConsultantsCarousel consultants={filteredConsultants} lo={lo} onBook={setBookConsultant} />
            </section>
          </div>
        </div>
      </div>

      {bookConsultant && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-secondary-900/40 backdrop-blur-[2px]"
            aria-label={lo === 'ar' ? 'إغلاق' : 'Close'}
            onClick={() => setBookConsultant(null)}
          />
          <div
            className={cn(
              'relative flex h-full w-full max-w-md flex-col bg-white p-6 shadow-xl animate-in slide-in-from-right duration-200',
              lo === 'ar' && 'animate-in slide-in-from-left'
            )}
          >
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
                <button
                  type="button"
                  key={t}
                  className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-start text-sm font-medium hover:border-primary-400"
                >
                  {t} · {lo === 'ar' ? 'قريباً' : 'Soon'}
                </button>
              ))}
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                const msg = encodeURIComponent(
                  lo === 'ar'
                    ? `طلب حجز مع ${bookConsultant.name.ar} — تقييم جاهز.`
                    : `Booking request for ${bookConsultant.name.en} — evaluation attached.`
                );
                window.open(`https://wa.me/201000000000?text=${msg}`, '_blank', 'noopener,noreferrer');
                setBookConsultant(null);
              }}
            >
              {lo === 'ar' ? 'تأكيد عبر واتساب' : 'Confirm via WhatsApp'}
            </Button>
            <p className="mt-3 text-center text-xs text-secondary-500">{lo === 'ar' ? 'رقم تجريبي — غيّره في الإنتاج.' : 'Placeholder WhatsApp — replace in production.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
