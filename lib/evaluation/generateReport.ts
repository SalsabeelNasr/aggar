import type { WizardData, PropertyStateFlag, InternetSpeed, ACCoverage, ListingStatus } from '@/models';
import { getRegionById } from '@/services/mockApi';
import { evaluateRules } from '@/lib/engines/ruleEngine';
import {
  buildPackages,
  computeCustomTotals,
  computePlanFinancials,
  type PackageType,
} from '@/lib/engines/packageBuilder';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import {
  computeWeeklyVacancyOpportunityEgp,
  evaluatePropertyInsights,
} from '@/lib/results/propertyInsights';
import type { EvaluationReport, PropertyAnalysisItem } from './types';
import { buildCompetitionSnapshot } from './competitionSnapshot';

function localized(en: string, ar: string) {
  return { en, ar };
}

function isListedUnderperform(status: ListingStatus | undefined) {
  return status === 'listed_underperform' || status === 'listed_barely_any_bookings';
}

function readinessNarrative(data: WizardData): EvaluationReport['cardInsights']['readinessNarrative'] {
  const state: PropertyStateFlag = data.stateFlag ?? 'FINISHED_EMPTY';
  const underperform = isListedUnderperform(data.listingStatus);
  if (state === 'SHELL') {
    return localized(
      'You are in the shell stage: build for STR first. Get bathroom/bedroom/kitchen fundamentals right before decor.',
      'إنت لسه في مرحلة الطوب: ابدأ صح وأسس الشقة للإيجار القصير. ظبط أساسيات الحمام وأوض النوم والمطبخ قبل ما تفكر في الديكور.'
    );
  }
  if (state === 'FINISHED_EMPTY') {
    return localized(
      'You are finished but empty: furnishing for ROI is the fastest lever. Sleep quality + blackout + lighting beat extra decor.',
      'الشقة متشطبة بس فاضية: الفرش الاستثماري هو أسرع طريق للربح. جودة النوم، ستائر البلاك آوت، والإضاءة أهم بكتير من أي ديكورات زيادة.'
    );
  }
  if (state === 'FURNISHED' && underperform) {
    return localized(
      'You are furnished but underperforming: fix presentation first. Photos + bilingual listing + response time usually unlock results.',
      'الشقة مفروشة بس الأرباح قليلة: محتاج تظبط طريقة العرض. صور احترافية، إعلان بلغتين، وسرعة رد هي اللي هتغير النتايج.'
    );
  }
  return localized(
    'You are close to market-ready. Focus on the few highest-impact upgrades in the right order to reach top-tier performance.',
    'إنت قريب جداً من الجاهزية الكاملة. ركز بس على شوية تحسينات ذكية بالترتيب الصح عشان توصل لأعلى أرباح في منطقتك.'
  );
}

function legacyPropertyAnalysisBullets(
  data: WizardData,
  scoreReasons: string[]
): EvaluationReport['cardInsights']['propertyAnalysisBullets'] {
  const bullets: Array<{ en: string; ar: string }> = [];
  const state: PropertyStateFlag = data.stateFlag ?? 'FINISHED_EMPTY';
  const underperform = isListedUnderperform(data.listingStatus);
  const hasPhotos = (data.photoUpload?.files ?? []).some((f) => Boolean(f.url));

  // Stage-driven first principle (guide: order matters)
  if (state === 'SHELL') {
    bullets.push(localized(
      'Shell stage: prioritize bathrooms first, then bedrooms, then kitchen; living room comes last for reviews.',
      'مرحلة الطوب: ابدأ بالحمامات، وبعدها أوض النوم، والمطبخ؛ الصالة بتيجي في الآخر خالص في التقييمات.'
    ));
  } else if (state === 'FINISHED_EMPTY') {
    bullets.push(localized(
      'Finished-empty: invest first in mattress + hotel-white linen + blackout curtains; poor sleep shows up in reviews.',
      'شقة متشطبة وفاضية: استثمر أول حاجة في مرتبة مريحة، ملايات بيضا فندقية، وستائر بلاك آوت؛ الضيف مبيسامحش في ليلة نوم وحشة.'
    ));
  } else if (state === 'FURNISHED' && underperform) {
    bullets.push(localized(
      'Underperforming: re-photograph before changing anything else — your photos are your storefront.',
      'الأداء ضعيف: صور الشقة تاني قبل ما تغير أي حاجة؛ صورك هي واجهة محلك والسبب الأول للحجز.'
    ));
  }

  // Photos
  if (!hasPhotos) {
    bullets.push(localized(
      'No photos uploaded yet: add room photos (or plan professional photography) to make recommendations accurate and boost conversion.',
      'لسه مفيش صور: ارفع صور للأوض عشان نقدر نديك نصايح أدق ونساعدك تزود حجوزاتك.'
    ));
  } else if ((data.photoUpload?.aiSummary?.qualityTier ?? 'medium') === 'low') {
    bullets.push(localized(
      'Photo quality looks low: improve lighting and declutter key frames; this is often a faster win than buying new items.',
      'جودة الصور ضعيفة: حسّن الإضاءة ونضف الكادر قبل ما تصور؛ دي أسرع طريقة تحسن بيها شكل شقتك من غير ما تصرف كتير.'
    ));
  } else if (data.photoUpload?.aiSummary?.visibleIssues?.length) {
    const issue = data.photoUpload.aiSummary.visibleIssues[0];
    bullets.push(localized(
      `Image insight: fix “${issue}” first — it’s a visible trust signal in listings.`,
      `ملاحظة من الصور: صلح مشكلة "${issue}" أول حاجة؛ دي بتدي انطباع فوري للضيوف عن جودة المكان.`
    ));
  }

  // Wi-Fi
  const internet: InternetSpeed | undefined = data.internetSpeed;
  if (internet && internet !== 'fiber_100_plus' && internet !== 'mesh_200_plus') {
    bullets.push(localized(
      `Wi‑Fi is "${internet}": add mesh coverage and frame a speed test screenshot to reduce pre-booking doubts.`,
      `النت حالياً "${internet}": محتاج تقوي التغطية بـ Mesh وتحط صورة لاختبار السرعة عشان تطمن الضيوف.`
    ));
  }

  // AC
  const ac: ACCoverage | undefined = data.acCoverage;
  if (ac === 'none_or_broken' || ac === 'one_old_unit') {
    bullets.push(localized(
      'AC coverage is weak: in Egypt, cooling is a top review driver — prioritize reliable units in bedrooms first.',
      'التكييف ضعيف: في صيف مصر، التبريد هو أهم حاجة للضيف؛ ركز إنك تركب تكييفات كويسة في أوض النوم الأول.'
    ));
  }

  // Entry & access
  const access = data.regulatory?.guestAccessSolution;
  if (access === 'none') {
    bullets.push(localized(
      'Guest access isn’t solved yet: smart lock or lockbox enables self check-in and reduces operational friction.',
      'طريقة الدخول لسه مش واضحة: القفل الذكي أو صندوق المفاتيح هيسهل عليك وعلى الضيف جداً ويقلل وجع الدماغ.'
    ));
  }

  // Compliance risk
  if (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5) {
    bullets.push(localized(
      'Decree 209 risk: no lift on a high floor can block licensing — verify eligibility before investing heavily.',
      'مخاطر قرار ٢٠٩: مفيش أسانسير في دور عالي ممكن يعطل الترخيص؛ اتأكد من النقطة دي قبل ما تصرف مبالغ كبيرة.'
    ));
  }

  // Keep it tight: 3–5 bullets max. Prefer stage + 2–4 most relevant.
  const prioritized = bullets.slice(0, 5);
  if (prioritized.length < 3 && scoreReasons.length) {
    prioritized.push(localized(
      `Readiness driver: ${scoreReasons[0]}`,
      `عامل مؤثر: ${scoreReasons[0]}`
    ));
  }
  return prioritized.slice(0, 5);
}

function mergeInsightItemsWithLegacy(
  insights: PropertyAnalysisItem[],
  legacy: Array<{ en: string; ar: string }>,
  maxTotal = 5
): PropertyAnalysisItem[] {
  if (insights.length === 0) {
    return legacy.slice(0, maxTotal).map((b) => ({ body: b }));
  }
  const out = [...insights];
  let i = 0;
  while (out.length < maxTotal && i < legacy.length && out.length - insights.length < 2) {
    if (out.length >= 3) break;
    out.push({ body: legacy[i] });
    i++;
  }
  return out;
}

function propertyAnalysisItemsToBullets(items: PropertyAnalysisItem[]): EvaluationReport['cardInsights']['propertyAnalysisBullets'] {
  return items.map((item) => ({
    en: item.title ? `${item.title.en}: ${item.body.en}` : item.body.en,
    ar: item.title ? `${item.title.ar}: ${item.body.ar}` : item.body.ar,
  }));
}

function servicesForPackage(
  reportPackageSet: EvaluationReport['packageSet'],
  type: PackageType
): { services: EvaluationReport['packageSet']['quick_start']['services'] } {
  if (type === 'custom') {
    const enabledIds = reportPackageSet.custom.enabled_service_ids;
    return { services: reportPackageSet.custom.all_services.filter((s) => enabledIds.includes(s.id)) };
  }
  return { services: reportPackageSet[type].services };
}

export function generateReport(data: WizardData): EvaluationReport {
  const ruleResult = evaluateRules(data);
  const packageSet = buildPackages(ruleResult, data.budgetBand);

  const region = getRegionById(data.regionId);
  const areaMarketBaselines = regionalMarketBaselines(data.regionId);

  const revenueByPackage = {} as Record<PackageType, ReturnType<typeof projectRevenue>>;
  const planFinancialsByPackage = {} as EvaluationReport['planFinancialsByPackage'];

  const allTypes: PackageType[] = ['quick_start', 'sweet_spot', 'asset_flip', 'custom'];
  for (const type of allTypes) {
    const selected = servicesForPackage(packageSet, type).services;
    const revenue = projectRevenue(data, { services: selected });
    revenueByPackage[type] = revenue;

    const costTotals =
      type === 'custom'
        ? computeCustomTotals(packageSet.custom.all_services, packageSet.custom.enabled_service_ids)
        : { total_cost_min: packageSet[type].total_cost_min, total_cost_max: packageSet[type].total_cost_max };

    const plan = computePlanFinancials(
      { total_cost_min: costTotals.total_cost_min, total_cost_max: costTotals.total_cost_max },
      revenue.current.netMonthlyEgp,
      revenue.optimized.netMonthlyEgp
    );
    planFinancialsByPackage[type] = plan;
  }

  const weeklyVacancyCostEgp = computeWeeklyVacancyOpportunityEgp(
    areaMarketBaselines.nightlyRateEgp,
    areaMarketBaselines.occupancyPct
  );

  const ruleInsightItems: PropertyAnalysisItem[] = evaluatePropertyInsights(
    data,
    { weeklyVacancyCostEgp },
    5
  ).map((r) => ({ title: r.title, body: r.body }));

  const legacyBullets = legacyPropertyAnalysisBullets(data, ruleResult.scoreResult.reasons);
  const propertyAnalysisItems = mergeInsightItemsWithLegacy(ruleInsightItems, legacyBullets, 5);

  const competitionSnapshot = buildCompetitionSnapshot(data, revenueByPackage.sweet_spot, region.name);
  const cardInsights: EvaluationReport['cardInsights'] = {
    neighbours: {
      typicalMonthlyUsd: data.regionId === 'north_coast' ? null : competitionSnapshot.modeledTypicalMonthlyUsd,
      top10MonthlyUsd: competitionSnapshot.modeledTop10MonthlyUsd,
      peakSeasonNote: competitionSnapshot.footnote,
      competitionSnapshot,
    },
    readinessNarrative: readinessNarrative(data),
    propertyAnalysisItems,
    propertyAnalysisBullets: propertyAnalysisItemsToBullets(propertyAnalysisItems),
  };

  return {
    version: 2,
    createdAtISO: new Date().toISOString(),
    wizardData: data,
    ruleResult,
    packageSet,
    region,
    areaMarketBaselines,
    revenueByPackage,
    planFinancialsByPackage,
    cardInsights,
  };
}

