import type { LocalizedString, WizardData } from '@/models';
import type { RevenueResult } from '@/lib/engines/revenueEngine';

/** Tabs shown in results: three fixed bundles + Custom builder. */
export type UserFacingPackageType = 'quick_start' | 'sweet_spot' | 'asset_flip' | 'custom';
/** Includes `performance_audit` for internal catalog / defaults (not its own tab). */
export type PackageType = UserFacingPackageType | 'performance_audit';
export type ServiceTier = 'tier1_vendor' | 'tier2_addon' | 'tier3_diy';

export interface ServiceLine {
  id: string;
  name: LocalizedString;
  tier: ServiceTier;
  costRangeEgp: { min: number; max: number } | { per: 'sqm'; min: number; max: number } | { percentOfRevenue: true; minPct: number; maxPct: number };
  impactLabel: LocalizedString;
  defaultEnabled: boolean;
}

export interface PackageDefinition {
  type: PackageType;
  name: LocalizedString;
  tagline: LocalizedString;
  investmentRangeEgp: { min: number; max: number };
  services: ServiceLine[];
}

export interface PackageAssignment {
  recommended: UserFacingPackageType;
  all: Record<PackageType, PackageDefinition>;
  /** When `recommended` is `custom`, seed toggles from the former Performance Audit bundle. */
  customRecommendedServiceIds: string[];
}

export interface PackagePlanTotals {
  selectedServicesTotalEgp: { min: number; max: number };
  breakEvenMonths: { min: number; max: number } | null;
  /** Net profit in year 1 after one-time selected spend (spec: live totals). */
  year1ProjectedNetEgp: { min: number; max: number } | null;
}

/** Photo-related services: toggling off reduces modeled booking/inquiry lift (~15%). */
const PHOTO_SERVICE_IDS = new Set(['pro_photography', 'rephotography']);

export function optimizedNetWithServiceToggles(baseOptimizedNet: number, pkg: PackageDefinition, enabledServiceIds: string[]): number {
  const hasPhoto = pkg.services.some((s) => PHOTO_SERVICE_IDS.has(s.id) && enabledServiceIds.includes(s.id));
  if (hasPhoto) return baseOptimizedNet;
  const needsPhoto = pkg.services.some((s) => PHOTO_SERVICE_IDS.has(s.id));
  if (!needsPhoto) return baseOptimizedNet;
  return Math.max(0, Math.round(baseOptimizedNet * 0.85));
}

function sumRanges(lines: ServiceLine[]) {
  let min = 0;
  let max = 0;
  for (const l of lines) {
    if ('percentOfRevenue' in l.costRangeEgp) continue;
    if ('per' in l.costRangeEgp) continue;
    min += l.costRangeEgp.min;
    max += l.costRangeEgp.max;
  }
  return { min, max };
}

/** First-seen wins (order: Quick Start → Sweet Spot → Asset Flip → Audit) for stable pricing when ids repeat. */
function mergeUnionServiceLines(...packages: Array<{ services: ServiceLine[] }>): ServiceLine[] {
  const byId = new Map<string, ServiceLine>();
  for (const p of packages) {
    for (const s of p.services) {
      if (!byId.has(s.id)) {
        byId.set(s.id, { ...s, defaultEnabled: false });
      }
    }
  }
  const tierOrder: Record<ServiceTier, number> = { tier1_vendor: 0, tier2_addon: 1, tier3_diy: 2 };
  return Array.from(byId.values()).sort((a, b) => {
    const t = tierOrder[a.tier] - tierOrder[b.tier];
    if (t !== 0) return t;
    return a.name.en.localeCompare(b.name.en);
  });
}

function localized(en: string, ar: string): LocalizedString {
  return { en, ar };
}

function buildPackages(): Record<PackageType, PackageDefinition> {
  const quickStart: PackageDefinition = {
    type: 'quick_start',
    name: localized('Quick Start', 'بداية سريعة'),
    tagline: localized('Get listed this month. Minimum spend, maximum speed.', 'ابدأ هذا الشهر بأقل تكلفة وأسرع وقت.'),
    investmentRangeEgp: { min: 15000, max: 45000 },
    services: [
      {
        id: 'deep_clean',
        name: localized('Deep clean & sanitization', 'تنظيف عميق وتعقيم'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 700, max: 900 },
        impactLabel: localized('Mandatory for first booking', 'أساسي لأول حجز'),
        defaultEnabled: true,
      },
      {
        id: 'pro_photography',
        name: localized('Professional photography', 'تصوير احترافي'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 5000, max: 16000 },
        impactLabel: localized('+15% booking rate', '+15% معدل الحجز'),
        defaultEnabled: true,
      },
      {
        id: 'linen_starter',
        name: localized('Linen starter pack (1 par)', 'باقة بياضات (طقم واحد)'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 3000, max: 3500 },
        impactLabel: localized('Better reviews', 'تقييمات أفضل'),
        defaultEnabled: true,
      },
      {
        id: 'smart_lock',
        name: localized('Smart lock installation', 'تركيب قفل ذكي'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 7000, max: 38000 },
        impactLabel: localized('Remote access & operability', 'دخول عن بُعد وتشغيل أفضل'),
        defaultEnabled: true,
      },
      {
        id: 'listing_setup',
        name: localized('Bilingual listing setup', 'إعداد إعلان ثنائي اللغة'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 1500, max: 3000 },
        impactLabel: localized('Search visibility', 'ظهور أفضل'),
        defaultEnabled: true,
      },
      {
        id: 'channel_manager_suite',
        name: localized(
          'STR software: calendar sync, pricing & guest inbox',
          'برمجيات STR: مزامنة التقويم والتسعير ورسائل الضيوف'
        ),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 6000, max: 22000 },
        impactLabel: localized(
          'OTA sync · smart rates · one inbox',
          'مزامنة المنصات · تسعير ذكي · رسائل موحّدة'
        ),
        defaultEnabled: true,
      },
      {
        id: 'management',
        name: localized('Property management onboarding', 'تشغيل وإدارة عقار'),
        tier: 'tier1_vendor',
        costRangeEgp: { percentOfRevenue: true, minPct: 15, maxPct: 25 },
        impactLabel: localized('Hands-off income', 'دخل بدون مجهود'),
        defaultEnabled: true,
      },
    ],
  };

  const sweetSpot: PackageDefinition = {
    type: 'sweet_spot',
    name: localized('Sweet Spot', 'المنطقة الذهبية'),
    tagline: localized('Invest in the look. Unlock the top 20% of your neighborhood.', 'استثمار في الشكل لرفع الأداء.'),
    investmentRangeEgp: { min: 80000, max: 200000 },
    services: [
      {
        id: 'styling_consult',
        name: localized('Interior styling consultation', 'استشارة تصميم/فرش'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 3000, max: 8000 },
        impactLabel: localized('Design direction', 'اتجاه واضح للفرش'),
        defaultEnabled: true,
      },
      {
        id: 'furniture_upgrades',
        name: localized('Key furniture upgrades', 'ترقيات أثاث أساسية'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 25000, max: 70000 },
        impactLabel: localized('Instagrammable look', 'شكل جذاب للصور'),
        defaultEnabled: true,
      },
      {
        id: 'lighting',
        name: localized('Lighting upgrade', 'ترقية الإضاءة'),
        tier: 'tier2_addon',
        costRangeEgp: { min: 8000, max: 15000 },
        impactLabel: localized('+5 pts (typical)', '+5 نقاط (عادة)'),
        defaultEnabled: true,
      },
      {
        id: 'bathroom_refresh',
        name: localized('Bathroom refresh (fixtures + non-slip)', 'تجديد حمام (مستلزمات + مانع انزلاق)'),
        tier: 'tier2_addon',
        costRangeEgp: { min: 8000, max: 20000 },
        impactLabel: localized('Compliance + ratings', 'امتثال + تقييمات'),
        defaultEnabled: true,
      },
      {
        id: 'pro_photography',
        name: localized('Professional photography', 'تصوير احترافي'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 8000, max: 20000 },
        impactLabel: localized('Professional listing photos', 'صور احترافية للإعلان'),
        defaultEnabled: true,
      },
      {
        id: 'smart_lock',
        name: localized('Smart lock installation', 'تركيب قفل ذكي'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 7000, max: 38000 },
        impactLabel: localized('Remote access', 'دخول عن بُعد'),
        defaultEnabled: true,
      },
      {
        id: 'channel_manager_suite',
        name: localized(
          'STR software: calendar sync, pricing & guest inbox',
          'برمجيات STR: مزامنة التقويم والتسعير ورسائل الضيوف'
        ),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 6000, max: 22000 },
        impactLabel: localized(
          'OTA sync · smart rates · one inbox',
          'مزامنة المنصات · تسعير ذكي · رسائل موحّدة'
        ),
        defaultEnabled: true,
      },
    ],
  };

  const assetFlip: PackageDefinition = {
    type: 'asset_flip',
    name: localized('Asset Flip', 'قلب الأصل'),
    tagline: localized('Transform the property. Unlock elite-tier income.', 'تحويل كامل للوصول لأعلى دخل.'),
    investmentRangeEgp: { min: 300000, max: 900000 },
    services: [
      {
        id: 'reno_per_sqm',
        name: localized('Full renovation (per sqm)', 'تشطيب/تجديد كامل (لكل متر)'),
        tier: 'tier1_vendor',
        costRangeEgp: { per: 'sqm', min: 8000, max: 10000 },
        impactLabel: localized('Foundation for premium pricing', 'أساس لتسعير أعلى'),
        defaultEnabled: true,
      },
      {
        id: 'kitchen',
        name: localized('Kitchen remodel + appliances', 'مطبخ + أجهزة'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 80000, max: 180000 },
        impactLabel: localized('Compliance + experience', 'امتثال + تجربة أفضل'),
        defaultEnabled: true,
      },
      {
        id: 'bathrooms',
        name: localized('Bathroom renovation ×2', 'تجديد حمامات ×2'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 80000, max: 150000 },
        impactLabel: localized('Compliance + ratings', 'امتثال + تقييمات'),
        defaultEnabled: true,
      },
      {
        id: 'hvac',
        name: localized('HVAC (energy-efficient AC units)', 'تكييفات موفرة للطاقة'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 90000, max: 130000 },
        impactLabel: localized('#1 review driver in Egypt', 'أهم عامل للتقييم في مصر'),
        defaultEnabled: true,
      },
      {
        id: 'smart_lock',
        name: localized('Smart lock installation', 'تركيب قفل ذكي'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 7000, max: 38000 },
        impactLabel: localized('Remote access', 'دخول عن بُعد'),
        defaultEnabled: true,
      },
      {
        id: 'channel_manager_suite',
        name: localized(
          'STR software: calendar sync, pricing & guest inbox',
          'برمجيات STR: مزامنة التقويم والتسعير ورسائل الضيوف'
        ),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 6000, max: 22000 },
        impactLabel: localized(
          'OTA sync · smart rates · one inbox',
          'مزامنة المنصات · تسعير ذكي · رسائل موحّدة'
        ),
        defaultEnabled: true,
      },
      {
        id: 'licensing',
        name: localized('STR licensing (Decree 209)', 'ترخيص STR (قرار 209)'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 3100, max: 3100 },
        impactLabel: localized('Legal compliance', 'امتثال قانوني'),
        defaultEnabled: true,
      },
    ],
  };

  const performanceAudit: PackageDefinition = {
    type: 'performance_audit',
    name: localized('Performance Audit', 'تدقيق الأداء'),
    tagline: localized('Find out why it’s underperforming. Fix the real problem.', 'اعرف سبب الضعف وأصلحه.'),
    investmentRangeEgp: { min: 15000, max: 40000 },
    services: [
      {
        id: 'listing_audit',
        name: localized('Listing audit (photos, copy, pricing)', 'تدقيق الإعلان (صور/نص/تسعير)'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 1500, max: 3000 },
        impactLabel: localized('Diagnose the problem', 'تحديد المشكلة'),
        defaultEnabled: true,
      },
      {
        id: 'rephotography',
        name: localized('Rephotography', 'إعادة تصوير'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 5000, max: 16000 },
        impactLabel: localized('+15–30% click-through', '+15–30% نقرات'),
        defaultEnabled: true,
      },
      {
        id: 'copy_rewrite',
        name: localized('Copy rewrite (bilingual)', 'إعادة كتابة الإعلان'),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 1500, max: 3000 },
        impactLabel: localized('Search ranking', 'ترتيب أفضل'),
        defaultEnabled: true,
      },
      {
        id: 'channel_manager_suite',
        name: localized(
          'STR software: calendar sync, pricing & guest inbox',
          'برمجيات STR: مزامنة التقويم والتسعير ورسائل الضيوف'
        ),
        tier: 'tier1_vendor',
        costRangeEgp: { min: 6000, max: 22000 },
        impactLabel: localized(
          'OTA sync · smart rates · one inbox',
          'مزامنة المنصات · تسعير ذكي · رسائل موحّدة'
        ),
        defaultEnabled: true,
      },
    ],
  };

  const customServices = mergeUnionServiceLines(quickStart, sweetSpot, assetFlip, performanceAudit);
  const customSum = sumRanges(customServices);
  const custom: PackageDefinition = {
    type: 'custom',
    name: localized('Custom', 'مخصص'),
    tagline: localized(
      'Pick the upgrades that match your situation. Costs and modeled income update as you toggle lines.',
      'اختر الترقيات المناسبة لحالتك. التكاليف والدخل النموذجي يتحدثان مع كل بند.'
    ),
    investmentRangeEgp: {
      min: customSum.min > 0 ? customSum.min : 15000,
      max: Math.max(customSum.max, 900000),
    },
    services: customServices,
  };

  return {
    quick_start: quickStart,
    sweet_spot: sweetSpot,
    asset_flip: assetFlip,
    performance_audit: performanceAudit,
    custom,
  };
}

export function assignPackages(data: WizardData): PackageAssignment {
  const all = buildPackages();
  // Product decision: always show Sweet Spot as the recommended offer on Results.
  // (This drives the "Recommended" badge and default selected tab.)
  const recommended: UserFacingPackageType = 'sweet_spot';
  const customRecommendedServiceIds: string[] = [];

  return { recommended, all, customRecommendedServiceIds };
}

export function computeSelectedTotals(
  pkg: PackageDefinition,
  selectedServiceIds: string[] | undefined,
  revenue: RevenueResult
): PackagePlanTotals {
  const selected = new Set(selectedServiceIds ?? pkg.services.filter((s) => s.defaultEnabled).map((s) => s.id));
  const enabled = pkg.services.filter((s) => selected.has(s.id));

  const sum = sumRanges(enabled);

  // Break-even uses incremental net gain vs current scenario
  const delta = Math.max(1, revenue.optimized.netMonthlyEgp - revenue.current.netMonthlyEgp);
  const minMonths = Math.ceil(sum.min / delta);
  const maxMonths = Math.ceil(sum.max / delta);

  const optNet = optimizedNetWithServiceToggles(revenue.optimized.netMonthlyEgp, pkg, Array.from(selected));
  const annualGrossNet = optNet * 12;
  const year1Min = Math.round(annualGrossNet - sum.max);
  const year1Max = Math.round(annualGrossNet - sum.min);

  return {
    selectedServicesTotalEgp: sum,
    breakEvenMonths: { min: minMonths, max: maxMonths },
    year1ProjectedNetEgp:
      sum.min === 0 && sum.max === 0
        ? { min: annualGrossNet, max: annualGrossNet }
        : { min: Math.max(0, year1Min), max: Math.max(0, year1Max) },
  };
}

