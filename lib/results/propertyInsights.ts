import type { WizardData } from '@/models';
import type { ServiceRule } from '@/lib/data/rules';
import { resolveFieldPath } from '@/lib/data/helpers';
import { ALL_FURNISHED_PHOTO_CHECKLIST_IDS } from '@/lib/results/furnishedPhotoProofDiy';

export type PropertyInsightOperator = ServiceRule['operator'];

export interface PropertyInsightCondition {
  field_path: string;
  operator: PropertyInsightOperator;
  value: string | number | boolean | string[];
  logic_group: string;
}

export interface LocalizedInsightText {
  en: string;
  ar: string;
}

export interface PropertyInsightRule {
  id: string;
  /** Lower = higher priority (shown first). */
  priority: number;
  /** Same semantics as service rules: AND within a logic_group, OR across groups. */
  conditions?: PropertyInsightCondition[];
  /** Extra checks (ratios, proxies). Runs only if conditions pass (or if there are no conditions). */
  predicate?: (data: WizardData, ctx: PropertyInsightContext) => boolean;
  title: LocalizedInsightText;
  body: LocalizedInsightText;
  /**
   * When true, `{{weeklyVacancyEgp}}` in body en/ar is replaced with formatted EGP (or stripped if missing).
   */
  usesWeeklyVacancyTemplate?: boolean;
}

export interface PropertyInsightContext {
  weeklyVacancyCostEgp?: number;
}

const HIGH_FLOOR_MIN = 4;
const PHOTO_CHECKLIST_WEAK_MAX = 2; // fewer than 3 of 6 checked => weak
const PAIN_IDS_HIGH_MIN = 2;
const HASSLE_HIGH_MIN = 7;

function evaluateOperator(
  fieldValue: unknown,
  operator: PropertyInsightOperator,
  ruleValue: ServiceRule['value']
): boolean {
  switch (operator) {
    case 'eq':
      return fieldValue === ruleValue;
    case 'neq':
      return fieldValue !== ruleValue;
    case 'in':
      if (Array.isArray(ruleValue)) {
        return ruleValue.includes(fieldValue as string);
      }
      return false;
    case 'not_in':
      if (Array.isArray(ruleValue)) {
        return !ruleValue.includes(fieldValue as string);
      }
      return true;
    case 'lt':
      return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue < ruleValue;
    case 'lte':
      return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue <= ruleValue;
    case 'gt':
      return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue > ruleValue;
    case 'gte':
      return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue >= ruleValue;
    case 'is_empty':
      return fieldValue == null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
    case 'is_not_empty':
      return fieldValue != null && fieldValue !== '' && !(Array.isArray(fieldValue) && fieldValue.length === 0);
    default:
      return false;
  }
}

function conditionsMatch(conditions: PropertyInsightCondition[] | undefined, data: WizardData): boolean {
  if (!conditions?.length) return true;

  const groups = new Map<string, PropertyInsightCondition[]>();
  for (const rule of conditions) {
    const existing = groups.get(rule.logic_group) ?? [];
    existing.push(rule);
    groups.set(rule.logic_group, existing);
  }

  for (const groupRules of Array.from(groups.values())) {
    const groupPasses = groupRules.every((rule: PropertyInsightCondition) => {
      const fieldValue = resolveFieldPath(data as unknown as Record<string, unknown>, rule.field_path);
      return evaluateOperator(fieldValue, rule.operator, rule.value);
    });
    if (groupPasses) return true;
  }
  return false;
}

function formatEgp(n: number): string {
  return new Intl.NumberFormat('en-EG', { numberingSystem: 'latn', maximumFractionDigits: 0 }).format(n);
}

function applyTemplate(text: string, weeklyEgp: number | undefined): string {
  if (!text.includes('{{weeklyVacancyEgp}}')) return text;
  if (weeklyEgp == null || !Number.isFinite(weeklyEgp)) {
    return text
      .replace(/\s*~\s*EGP\s*\{\{weeklyVacancyEgp\}\}\s*/gi, ' ')
      .replace(/\{\{weeklyVacancyEgp\}\}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  return text.replace(/\{\{weeklyVacancyEgp\}\}/g, formatEgp(weeklyEgp));
}

export interface PropertyInsightResult {
  id: string;
  title: LocalizedInsightText;
  body: LocalizedInsightText;
}

function isListedStatus(status: WizardData['listingStatus']): boolean {
  return (
    status === 'listed_doing_well' ||
    status === 'listed_underperform' ||
    status === 'listed_barely_any_bookings'
  );
}

function hasUsablePhotoUpload(data: WizardData): boolean {
  return (data.photoUpload?.files ?? []).some((f) => Boolean(f.url));
}

function photoMarketingWeak(data: WizardData): boolean {
  if (!isListedStatus(data.listingStatus)) return false;
  if (!hasUsablePhotoUpload(data)) return true;
  if (data.photoUpload?.aiSummary?.qualityTier === 'low') return true;
  if (data.stateFlag === 'FURNISHED') {
    const have = new Set(data.furnishedPhotoChecklist ?? []);
    const count = ALL_FURNISHED_PHOTO_CHECKLIST_IDS.filter((id) => have.has(id)).length;
    if (count <= PHOTO_CHECKLIST_WEAK_MAX) return true;
  }
  return false;
}

function shellLowBudget(data: WizardData): boolean {
  if (data.stateFlag !== 'SHELL') return false;
  const band = data.budgetBand;
  const lowBand = band === 'under_50k' || band === '50_150k';
  const economyShell = data.unfinishedBudgetPerSqm === 'economy';
  return lowBand || economyShell;
}

function yieldEfficiencySleepBedrooms(data: WizardData): boolean {
  const beds = data.bedrooms;
  const sleep = data.sleepCapacity;
  if (typeof beds !== 'number' || typeof sleep !== 'number' || beds < 1) return false;
  return sleep / beds >= 1.75;
}

function furnishedLowOccupancy(data: WizardData): boolean {
  const band = data.furnishedLeadQualification?.occupancyBand;
  return band === 'under_30' || band === 'between_30_60';
}

function highOperationalPain(data: WizardData): boolean {
  const pains = data.furnishedLeadQualification?.operationalPainIds ?? [];
  const hassle = data.hassleLevel;
  return pains.length >= PAIN_IDS_HIGH_MIN || (typeof hassle === 'number' && hassle >= HASSLE_HIGH_MIN);
}

/** Declarative + predicate rules (product copy). */
export const PROPERTY_INSIGHT_RULES: PropertyInsightRule[] = [
  {
    id: 'premium_security_tier',
    priority: 10,
    conditions: [
      {
        field_path: 'regulatory.inGatedCompound',
        operator: 'eq',
        value: true,
        logic_group: 'main',
      },
      {
        field_path: 'regulatory.hasLift',
        operator: 'eq',
        value: true,
        logic_group: 'main',
      },
      {
        field_path: 'regulatory.floorNumber',
        operator: 'gte',
        value: HIGH_FLOOR_MIN,
        logic_group: 'main',
      },
    ],
    title: {
      en: 'Premium Security Tier',
      ar: 'مستوى أمان متميز',
    },
    body: {
      en: 'Your asset qualifies for the "Elite Security" filter, attracting high-net-worth expats and embassy staff.',
      ar: 'عقارك مؤهل لفلتر "الأمان النخبوي"، مما يجذب المغتربين ذوي الدخل المرتفع وموظفي السفارات.',
    },
  },
  {
    id: 'yield_efficiency',
    priority: 20,
    predicate: (data) => yieldEfficiencySleepBedrooms(data),
    title: {
      en: 'Yield efficiency',
      ar: 'كفاءة العائد الاستثماري',
    },
    body: {
      en: 'Your high density-to-space ratio suggests a high ROI-per-sqm, provided you invest in high-durability textiles.',
      ar: 'توزيع المساحة لاستيعاب عدد ضيوف أكبر يرفع العائد المتوقع للمتر المربع، بشرط اختيار أثاث ومفروشات "حمالة أسية" وتتحمل الاستهلاك المتكرر.',
    },
  },
  {
    id: 'shell_low_budget_feasibility',
    priority: 30,
    predicate: (data) => shellLowBudget(data),
    title: {
      en: 'Feasibility warning',
      ar: 'تنبيه حول الجدوى',
    },
    body: {
      en: 'Your budget-to-sqm profile suggests a "Standard" finish. We recommend focusing on "Smart Basics" over luxury materials to avoid mid-project stalls.',
      ar: 'ميزانيتك للمتر المربع تناسب تشطيباً "عملياً". ننصح بالتركيز على "الأساسيات الذكية" بدلاً من المواد الفاخرة لتجنب تعثر المشروع.',
    },
  },
  {
    id: 'tech_gap_adsl',
    priority: 25,
    conditions: [
      { field_path: 'stateFlag', operator: 'eq', value: 'FURNISHED', logic_group: 'main' },
      { field_path: 'internetSpeed', operator: 'eq', value: 'none_or_adsl', logic_group: 'main' },
    ],
    predicate: (data) => furnishedLowOccupancy(data),
    title: {
      en: 'The tech gap',
      ar: 'فجوة تقنية',
    },
    body: {
      en: 'Your low performance is likely tied to connectivity. Upgrading to Fiber + Mesh is your fastest path to a 15% occupancy jump.',
      ar: 'الأداء المنخفض غالباً ما يرتبط بجودة الإنترنت. الترقية إلى ألياف ضوئية (Fiber) وشبكة Mesh هي أسرع طريق لزيادة الإشغال بنسبة 15%.',
    },
  },
  {
    id: 'marketing_photo_leak',
    priority: 15,
    predicate: (data) => photoMarketingWeak(data),
    title: {
      en: 'Marketing leak',
      ar: 'هدر تسويقي',
    },
    body: {
      en: 'You are likely losing 30% of clicks at the "Search Result" stage. A professional "Lifestyle" shoot is your #1 priority.',
      ar: 'من المحتمل أنك تفقد 30% من النقرات في مرحلة "نتائج البحث". التصوير الاحترافي هو أولويتك القصوى حالياً.',
    },
  },
  {
    id: 'operational_friction_bawab',
    priority: 35,
    conditions: [
      { field_path: 'stateFlag', operator: 'eq', value: 'FURNISHED', logic_group: 'main' },
      { field_path: 'regulatory.guestAccessSolution', operator: 'eq', value: 'bawab_concierge', logic_group: 'main' },
    ],
    predicate: (data) => highOperationalPain(data),
    title: {
      en: 'Operational friction',
      ar: 'تحديات تشغيلية',
    },
    body: {
      en: 'Your management style is causing "Host Burnout." Switching to a Smart Lock + automated messaging will reclaim 10 hours of your week.',
      ar: 'أسلوب الإدارة الحالي قد يسبب لك "إرهاق المضيف". الانتقال إلى القفل الذكي والرسائل المؤتمتة سيوفر لك 10 ساعات أسبوعياً.',
    },
  },
  {
    id: 'time_decay_fast_install',
    priority: 12,
    conditions: [
      { field_path: 'stateFlag', operator: 'eq', value: 'FINISHED_EMPTY', logic_group: 'main' },
      { field_path: 'furnishingInstallDeadline', operator: 'eq', value: 'under_3_weeks', logic_group: 'main' },
    ],
    usesWeeklyVacancyTemplate: true,
    title: {
      en: 'Time-decay risk',
      ar: 'مخاطر ضياع الوقت',
    },
    body: {
      en: 'Every week this unit stays empty costs you ~EGP {{weeklyVacancyEgp}}. We recommend a "Pre-Configured" furniture package for immediate launch.',
      ar: 'كل أسبوع تظل فيه الوحدة شاغرة يكلفك حوالي {{weeklyVacancyEgp}} ج.م. ننصح بباقة أثاث "جاهزة" للإطلاق الفوري.',
    },
  },
];

export function computeWeeklyVacancyOpportunityEgp(nightlyRateEgp: number, marketOccupancyPct: number): number {
  const n = nightlyRateEgp * 7 * (marketOccupancyPct / 100);
  return Math.max(0, Math.round(n));
}

/**
 * Returns matched insights sorted by priority (asc), capped at `maxItems`.
 */
export function evaluatePropertyInsights(
  data: WizardData,
  ctx: PropertyInsightContext = {},
  maxItems = 5
): PropertyInsightResult[] {
  const sorted = [...PROPERTY_INSIGHT_RULES].sort((a, b) => a.priority - b.priority);
  const out: PropertyInsightResult[] = [];

  for (const rule of sorted) {
    if (!conditionsMatch(rule.conditions, data)) continue;
    if (rule.predicate && !rule.predicate(data, ctx)) continue;

    const title = { ...rule.title };
    let bodyEn = rule.body.en;
    let bodyAr = rule.body.ar;
    if (rule.usesWeeklyVacancyTemplate) {
      bodyEn = applyTemplate(bodyEn, ctx.weeklyVacancyCostEgp);
      bodyAr = applyTemplate(bodyAr, ctx.weeklyVacancyCostEgp);
    }

    out.push({
      id: rule.id,
      title,
      body: { en: bodyEn, ar: bodyAr },
    });
    if (out.length >= maxItems) break;
  }

  return out;
}
