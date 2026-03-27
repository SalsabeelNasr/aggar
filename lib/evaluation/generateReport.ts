import type { RegionId, WizardData, PropertyStateFlag, InternetSpeed, ACCoverage, ListingStatus } from '@/models';
import { getRegionById } from '@/services/mockApi';
import { evaluateRules } from '@/lib/engines/ruleEngine';
import {
  buildPackages,
  computeCustomTotals,
  computePlanFinancials,
  type PackageType,
} from '@/lib/engines/packageBuilder';
import { projectRevenue, regionalMarketBaselines } from '@/lib/engines/revenueEngine';
import type { EvaluationReport } from './types';

function localized(en: string, ar: string) {
  return { en, ar };
}

function neighboursBenchmarks(regionId: RegionId | undefined): EvaluationReport['cardInsights']['neighbours'] {
  const id = regionId ?? 'other';
  switch (id) {
    case 'zamalek':
      return { typicalMonthlyUsd: 744, top10MonthlyUsd: 2130, peakSeasonNote: localized('Peak: Dec–Feb', 'الذروة: ديسمبر–فبراير') };
    case 'new_cairo':
      return { typicalMonthlyUsd: 465, top10MonthlyUsd: 1500, peakSeasonNote: localized('Year-round corporate demand', 'طلب ثابت (شركات) طوال العام') };
    case 'hurghada':
      return { typicalMonthlyUsd: 940, top10MonthlyUsd: 2000, peakSeasonNote: localized('Peak: Oct–Apr', 'الذروة: أكتوبر–أبريل') };
    case 'el_gouna':
      return { typicalMonthlyUsd: 2000, top10MonthlyUsd: 3000, peakSeasonNote: localized('Peak: Oct–Apr (winter sun)', 'الذروة: أكتوبر–أبريل') };
    case 'north_coast':
      return { typicalMonthlyUsd: null, top10MonthlyUsd: 3000, peakSeasonNote: localized('Peak: Jun–Aug · off-season is low', 'الذروة: يونيو–أغسطس · خارج الموسم منخفض') };
    case 'dahab':
      return { typicalMonthlyUsd: 800, top10MonthlyUsd: 1500, peakSeasonNote: localized('Steady year-round when design is strong', 'يميل للاستقرار إذا كان التصميم قويًا') };
    case 'maadi':
      return { typicalMonthlyUsd: 569, top10MonthlyUsd: 1827, peakSeasonNote: localized('Urban demand · strongest Oct–Jan', 'طلب حضري · الأقوى أكتوبر–يناير') };
    case 'sharm':
      return { typicalMonthlyUsd: 569, top10MonthlyUsd: 1827, peakSeasonNote: localized('Tourism market · watch holidays', 'سوق سياحي · راقب المواسم') };
    case 'luxor_aswan':
      return { typicalMonthlyUsd: 569, top10MonthlyUsd: 1827, peakSeasonNote: localized('Seasonal cultural demand', 'طلب موسمي مرتبط بالسياحة الثقافية') };
    case 'sheikh_zayed':
    case 'nasr_city_6th_october':
    case 'industrial_informal':
    case 'other':
    default:
      return { typicalMonthlyUsd: 569, top10MonthlyUsd: 1827, peakSeasonNote: localized('Benchmarked to Cairo averages', 'مقارن بمتوسطات القاهرة') };
  }
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
      'أنت في مرحلة الشِّل: ابني بعقلية STR أولاً. ركّز على الأساسيات (الحمام/غرفة النوم/المطبخ) قبل الديكور.'
    );
  }
  if (state === 'FINISHED_EMPTY') {
    return localized(
      'You are finished but empty: furnishing for ROI is the fastest lever. Sleep quality + blackout + lighting beat extra decor.',
      'أنت مُشطب لكن بدون فرش: الفرش بعائد استثماري هو أسرع رافعة. جودة النوم + بلاك آوت + الإضاءة أهم من الزينة.'
    );
  }
  if (state === 'FURNISHED' && underperform) {
    return localized(
      'You are furnished but underperforming: fix presentation first. Photos + bilingual listing + response time usually unlock results.',
      'أنت مُفروش لكن الأداء ضعيف: أصلح العرض أولاً. الصور + الإعلان ثنائي اللغة + سرعة الرد غالباً يفتحون النتائج.'
    );
  }
  return localized(
    'You are close to market-ready. Focus on the few highest-impact upgrades in the right order to reach top-tier performance.',
    'أنت قريب من الجاهزية. ركّز على ترقيات قليلة عالية التأثير وبالترتيب الصحيح للوصول لأداء قوي.'
  );
}

function propertyAnalysisBullets(data: WizardData, scoreReasons: string[]): EvaluationReport['cardInsights']['propertyAnalysisBullets'] {
  const bullets: Array<{ en: string; ar: string }> = [];
  const state: PropertyStateFlag = data.stateFlag ?? 'FINISHED_EMPTY';
  const underperform = isListedUnderperform(data.listingStatus);
  const hasPhotos = (data.photoUpload?.files ?? []).some((f) => Boolean(f.url));

  // Stage-driven first principle (guide: order matters)
  if (state === 'SHELL') {
    bullets.push(localized(
      'Shell stage: prioritize bathrooms first, then bedrooms, then kitchen; living room comes last for reviews.',
      'مرحلة الشِّل: ابدأ بالحمامات ثم غرف النوم ثم المطبخ؛ غرفة المعيشة تأتي أخيراً من ناحية التقييمات.'
    ));
  } else if (state === 'FINISHED_EMPTY') {
    bullets.push(localized(
      'Finished-empty: invest first in mattress + hotel-white linen + blackout curtains; poor sleep shows up in reviews.',
      'مُشطب وفاضي: ابدأ بالماتريس + بياضات فندقية بيضاء + ستائر بلاك آوت؛ النوم السيئ يظهر فوراً في التقييمات.'
    ));
  } else if (state === 'FURNISHED' && underperform) {
    bullets.push(localized(
      'Underperforming: re-photograph before changing anything else — your photos are your storefront.',
      'أداء ضعيف: أعد التصوير قبل أي تغيير آخر — الصور هي واجهة إعلانك.'
    ));
  }

  // Photos
  if (!hasPhotos) {
    bullets.push(localized(
      'No photos uploaded yet: add room photos (or plan professional photography) to make recommendations accurate and boost conversion.',
      'لا توجد صور مرفوعة: أضف صور الغرف (أو خطّط لتصوير احترافي) لرفع الدقة وزيادة التحويل.'
    ));
  } else if ((data.photoUpload?.aiSummary?.qualityTier ?? 'medium') === 'low') {
    bullets.push(localized(
      'Photo quality looks low: improve lighting and declutter key frames; this is often a faster win than buying new items.',
      'جودة الصور تبدو منخفضة: حسّن الإضاءة وقلل الفوضى في اللقطات الأساسية؛ غالباً أسرع من شراء قطع جديدة.'
    ));
  } else if (data.photoUpload?.aiSummary?.visibleIssues?.length) {
    const issue = data.photoUpload.aiSummary.visibleIssues[0];
    bullets.push(localized(
      `Image insight: fix “${issue}” first — it’s a visible trust signal in listings.`,
      `ملاحظة من الصور: أصلح “${issue}” أولاً — لأنه إشارة ثقة واضحة في الإعلان.`
    ));
  }

  // Wi-Fi
  const internet: InternetSpeed | undefined = data.internetSpeed;
  if (internet && internet !== 'fiber_100_plus' && internet !== 'mesh_200_plus') {
    bullets.push(localized(
      `Wi‑Fi is "${internet}": add mesh coverage and frame a speed test screenshot to reduce pre-booking doubts.`,
      `الإنترنت "${internet}": أضف Mesh وعلّق نتيجة اختبار السرعة لإزالة الشك قبل الحجز.`
    ));
  }

  // AC
  const ac: ACCoverage | undefined = data.acCoverage;
  if (ac === 'none_or_broken' || ac === 'one_old_unit') {
    bullets.push(localized(
      'AC coverage is weak: in Egypt, cooling is a top review driver — prioritize reliable units in bedrooms first.',
      'التكييف غير كافٍ: في مصر هو من أهم أسباب التقييم — ابدأ بوحدات موثوقة في غرف النوم.'
    ));
  }

  // Entry & access
  const access = data.regulatory?.guestAccessSolution;
  if (access === 'none') {
    bullets.push(localized(
      'Guest access isn’t solved yet: smart lock or lockbox enables self check-in and reduces operational friction.',
      'الدخول للضيوف غير محسوم: قفل ذكي أو صندوق مفاتيح يسهّل الـ self check-in ويقلل الاحتكاك التشغيلي.'
    ));
  }

  // Compliance risk
  if (data.regulatory?.hasLift === false && (data.regulatory?.floorNumber ?? 0) >= 5) {
    bullets.push(localized(
      'Decree 209 risk: no lift on a high floor can block licensing — verify eligibility before investing heavily.',
      'مخاطر قرار 209: عدم وجود مصعد مع دور مرتفع قد يمنع الترخيص — تأكد من الأهلية قبل استثمار كبير.'
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

  const cardInsights: EvaluationReport['cardInsights'] = {
    neighbours: neighboursBenchmarks(data.regionId),
    readinessNarrative: readinessNarrative(data),
    propertyAnalysisBullets: propertyAnalysisBullets(data, ruleResult.scoreResult.reasons),
  };

  return {
    version: 1,
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

