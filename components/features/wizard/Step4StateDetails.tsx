'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type {
  ACCoverage,
  EssentialTechId,
  FurnishedBeddingTier,
  FurnishedLuxeSmartHomeId,
  FurnishedUnitLuxe,
  FurnishedWaterHeating,
  FurnishingAesthetic,
  FurnishingBudgetBand,
  FurnishingInstallDeadline,
  FurnishingPaymentPreference,
  FurnishingScopeId,
  GuestPolicyAudienceId,
  InternetSpeed,
  PropertyStateFlag,
  UnfinishedBudgetPerSqm,
  UnfinishedFinancingPreference,
  UnfinishedFinishingLevel,
  UnfinishedInfrastructureId,
  UnfinishedSmartHome,
  WizardData,
} from '@/models';
import { cn } from '@/lib/utils';
import { getStateFieldApplicability } from '@/lib/wizard/stateFieldApplicability';
import { AccessComplianceCard } from '@/components/features/wizard/AccessComplianceCard';
import { DesignStyleCarousel } from '@/components/features/wizard/DesignStyleCarousel';
import { AcInternetFields } from '@/components/features/wizard/state-details/AcInternetFields';
import { EssentialTechFields } from '@/components/features/wizard/state-details/EssentialTechFields';
import { PetFriendlyToggle } from '@/components/features/wizard/state-details/PetFriendlyToggle';
import {
  WizardDetailCard,
  WizardDetailChipGrid,
  WizardDetailHeading,
  WizardDetailLead,
  WizardDetailRadioList,
  WizardDetailSelect,
  wizardDetailSelectClassName,
} from '@/components/features/wizard/state-details/wizardDetailUi';
import { WizardStepErrorBanner } from '@/components/features/wizard/WizardValidationContext';

const STEP4_ERROR_KEYS = [
  'unfinishedFinishingLevel',
  'unfinishedInfrastructure',
  'unfinishedSmartHome',
  'unfinishedBudgetPerSqm',
  'unfinishedFinancingPreference',
  'furnishingScope',
  'furnishingAesthetic',
  'petFriendly',
  'furnishingInstallDeadline',
  'furnishingBudgetBand',
  'furnishingPaymentPreference',
  'waterHeating',
  'acCoverage',
  'internetSpeed',
  'beddingTier',
  'guestPolicyAudiences',
] as const;

const VALID_FURNISHING_AESTHETICS = new Set<FurnishingAesthetic>([
  'boho',
  'hotel_like',
  'coastal',
  'industrial',
  'fun',
  'modern_minimalist',
  'classic',
]);

const SHELL_INFRA_OPTS = [
  {
    id: 'electricity_meter' as const,
    en: 'Primary electricity meter installed',
    ar: 'عداد كهرباء رئيسي مركّب',
  },
  { id: 'water_meter' as const, en: 'Water meter installed', ar: 'عداد مياه مركّب' },
  { id: 'natural_gas' as const, en: 'Natural gas connected', ar: 'الغاز الطبيعي متصل' },
  {
    id: 'fiber_ready' as const,
    en: 'Fiber / high-speed internet ready',
    ar: 'فايبر / إنترنت عالي السرعة جاهز',
  },
] satisfies { id: UnfinishedInfrastructureId; en: string; ar: string }[];

const UNFINISHED_BUDGET_OPTS = [
  {
    id: 'economy' as const,
    en: 'Economy: 2,500 – 4,000 EGP / sqm',
    ar: 'اقتصادي: 2,500 – 4,000 ج.م / م²',
  },
  {
    id: 'premium' as const,
    en: 'Premium: 4,000 – 7,000 EGP / sqm',
    ar: 'مميز: 4,000 – 7,000 ج.م / م²',
  },
  { id: 'luxury_custom' as const, en: 'Luxury / custom: 7,000+ EGP / sqm', ar: 'فاخر/مخصص: 7,000+ ج.م / م²' },
] satisfies { id: UnfinishedBudgetPerSqm; en: string; ar: string }[];

const UNFINISHED_FINANCING_OPTS = [
  {
    id: 'lump_sum' as const,
    en: 'Lump sum (cash discount preferred)',
    ar: 'دفعة واحدة (يفضّل خصم نقدي)',
  },
  {
    id: 'installment_12_24' as const,
    en: 'Installment plan (12–24 months, e.g. valU / contact consumer finance)',
    ar: 'تقسيط (12–24 شهرًا، تمويل استهلاكي مثل valU / contact)',
  },
  {
    id: 'bank_loan_3_5y' as const,
    en: 'Long-term bank loan (3–5 years refurbishment loan)',
    ar: 'قرض بنكي طويل (3–5 سنوات لتشطيب/تجديد)',
  },
] satisfies { id: UnfinishedFinancingPreference; en: string; ar: string }[];

const FURNISHING_SCOPE_OPTS = [
  {
    id: 'furniture' as const,
    en: 'Furniture (sofas, beds, tables)',
    ar: 'أثاث (كنب، سراير، طاولات)',
  },
  {
    id: 'appliances' as const,
    en: 'Appliances (ACs, kitchen kit, smart locks)',
    ar: 'أجهزة (تكييف، مطبخ، أقفال ذكية)',
  },
  {
    id: 'styling_decor' as const,
    en: 'Styling / decor (curtains, lighting, art, rugs, plants)',
    ar: 'ستايل وديكور (ستائر، إضاءة، فن، سجاد، نباتات)',
  },
] satisfies { id: FurnishingScopeId; en: string; ar: string }[];

const FURNISHING_SCOPE_IDS = new Set<string>(FURNISHING_SCOPE_OPTS.map((o) => o.id));
const LEGACY_FURNISHING_SCOPE_IDS = new Set([
  'full_turnkey',
  'loose_furniture_only',
  'appliances_only',
  'styling_decor_only',
]);

function normalizeFurnishingScope(raw: unknown): FurnishingScopeId[] | undefined {
  const items: string[] = Array.isArray(raw) ? raw.map(String) : raw != null && raw !== '' ? [String(raw)] : [];
  if (items.length === 0) return undefined;
  const out = new Set<FurnishingScopeId>();
  for (const item of items) {
    if (item === 'full_turnkey') {
      out.add('furniture');
      out.add('appliances');
      out.add('styling_decor');
    } else if (item === 'loose_furniture_only') out.add('furniture');
    else if (item === 'appliances_only') out.add('appliances');
    else if (item === 'styling_decor_only') out.add('styling_decor');
    else if (FURNISHING_SCOPE_IDS.has(item)) out.add(item as FurnishingScopeId);
  }
  return out.size > 0 ? Array.from(out) : undefined;
}

function furnishingScopeNeedsMigration(raw: unknown): boolean {
  if (raw == null || raw === '') return false;
  if (typeof raw === 'string') {
    if (LEGACY_FURNISHING_SCOPE_IDS.has(raw)) return true;
    if (FURNISHING_SCOPE_IDS.has(raw)) return true;
    return true;
  }
  if (Array.isArray(raw)) {
    if (raw.length === 0) return false;
    return raw.some((x) => LEGACY_FURNISHING_SCOPE_IDS.has(String(x)) || !FURNISHING_SCOPE_IDS.has(String(x)));
  }
  return true;
}

const FURNISHING_BUDGET_OPTS = [
  {
    id: 'budget_250_450k' as const,
    en: 'Budget: EGP 250k – 450k',
    ar: 'اقتصادي: 250 – 450 ألف ج.م',
  },
  {
    id: 'premium_500_850k' as const,
    en: 'Premium: EGP 500k – 850k',
    ar: 'مميز: 500 – 850 ألف ج.م',
  },
  { id: 'luxury_1m_plus' as const, en: 'Luxury: EGP 1M+', ar: 'فاخر: مليون ج.م فأكثر' },
] satisfies { id: FurnishingBudgetBand; en: string; ar: string }[];

const FURNISHING_PAYMENT_OPTS = [
  {
    id: 'cash_package_discount' as const,
    en: 'Cash (package discount)',
    ar: 'نقدًا (خصم على الباقة)',
  },
  {
    id: 'short_installments_card_6_12' as const,
    en: 'Short installments (6–12 months, card)',
    ar: 'تقسيط قصير (6–12 شهرًا - بطاقة)',
  },
  {
    id: 'long_finance_valu_contact_halan' as const,
    en: 'Long-term financing (24–60 mo. via valU / Contact / Halan)',
    ar: 'تمويل طويل (24–60 شهرًا - valU / Contact / Halan)',
  },
  {
    id: 'revenue_share_management' as const,
    en: 'Revenue share (furnishing for mgmt %)',
    ar: 'مشاركة إيرادات (فرش مقابل نسبة تشغيل)',
  },
] satisfies { id: FurnishingPaymentPreference; en: string; ar: string }[];

const FURNISHED_WATER_HEATING_OPTS = [
  {
    id: 'electric_standard' as const,
    en: 'Electric water heaters (standard)',
    ar: 'سخانات كهرباء (قياسي)',
  },
  {
    id: 'central_gas_premium' as const,
    en: 'Central gas heating (premium)',
    ar: 'سخان مركزي غاز (مميز)',
  },
  {
    id: 'pressure_issues_peak' as const,
    en: 'Water pressure issues at peak hours',
    ar: 'مشاكل ضغط مياه في أوقات الذروة',
  },
] satisfies { id: FurnishedWaterHeating; en: string; ar: string }[];

const GUEST_POLICY_OPTS = [
  {
    id: 'mixed_groups_allowed' as const,
    en: 'Mixed groups allowed',
    ar: 'مجموعات مختلطة مسموحة',
  },
  {
    id: 'couples_allowed' as const,
    en: 'Couples allowed',
    ar: 'أزواج مسموحون',
  },
  {
    id: 'families_marriage_cert_only' as const,
    en: 'Families and couples with marriage certificate only',
    ar: 'عائلات وأزواج بشهادة زواج فقط',
  },
  { id: 'egyptians_only' as const, en: 'Egyptians only', ar: 'مصريون فقط' },
  { id: 'non_egyptians_only' as const, en: 'Non-Egyptians only', ar: 'غير مصريين فقط' },
] satisfies { id: GuestPolicyAudienceId; en: string; ar: string }[];

const SMART_HOME_LUXE_OPTS = [
  { id: 'smart_lock_existing' as const, en: 'Smart lock', ar: 'قفل ذكي' },
  {
    id: 'noise_decibel_monitor' as const,
    en: 'Noise monitor (e.g. Minut)',
    ar: 'مراقب ضوضاء (مثل Minut)',
  },
  {
    id: 'smart_thermostat' as const,
    en: 'Smart thermostat (AC)',
    ar: 'ثرموستات ذكية (تكييف)',
  },
  {
    id: 'smoke_co_detectors' as const,
    en: 'Smoke & CO detectors',
    ar: 'كواشف دخان وأول أكسيد الكربون',
  },
] satisfies { id: FurnishedLuxeSmartHomeId; en: string; ar: string }[];

function toggleId<T extends string>(list: T[] | undefined, id: T): T[] {
  const current = new Set(list ?? []);
  if (current.has(id)) current.delete(id);
  else current.add(id);
  return Array.from(current);
}

function mapOpts<T extends { id: string; en: string; ar: string }>(opts: T[], isAr: boolean) {
  return opts.map((o) => ({ id: o.id, label: isAr ? o.ar : o.en }));
}

export function Step4StateDetails() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const selectedState = data.stateFlag;
  const applicability = getStateFieldApplicability(selectedState);
  const prevStateRef = React.useRef<PropertyStateFlag | undefined>(undefined);

  React.useEffect(() => {
    if (data.stateFlag !== 'FURNISHED_RENO') return;
    const t = data.furnishedUnitLuxe?.beddingTier as string | undefined;
    if (!t || t === 'hotel_style_white' || t === 'colored') return;
    updateData({
      furnishedUnitLuxe: { ...data.furnishedUnitLuxe, beddingTier: undefined } as FurnishedUnitLuxe,
    });
  }, [data.stateFlag, data.furnishedUnitLuxe, updateData]);

  React.useEffect(() => {
    if (!furnishingScopeNeedsMigration(data.furnishingScope)) return;
    updateData({ furnishingScope: normalizeFurnishingScope(data.furnishingScope) });
  }, [data.furnishingScope, updateData]);

  React.useEffect(() => {
    const raw = data.furnishingAesthetic as string | undefined;
    if (!raw || VALID_FURNISHING_AESTHETICS.has(raw as FurnishingAesthetic)) return;
    const legacy: Record<string, FurnishingAesthetic> = {
      bohemian_coastal: 'boho',
      neo_classical_luxury: 'hotel_like',
      modern_minimalist: 'modern_minimalist',
      industrial: 'industrial',
    };
    const mapped = legacy[raw];
    if (mapped) updateData({ furnishingAesthetic: mapped });
  }, [data.furnishingAesthetic, updateData]);

  React.useEffect(() => {
    const cur = data.stateFlag;
    if (prevStateRef.current === undefined) {
      prevStateRef.current = cur;
      return;
    }
    if (prevStateRef.current === cur) return;

    const clear: Partial<WizardData> = {};
    if (cur !== 'SHELL') {
      clear.unfinishedFinishingLevel = undefined;
      clear.unfinishedInfrastructure = undefined;
      clear.unfinishedSmartHome = undefined;
      clear.unfinishedBudgetPerSqm = undefined;
      clear.unfinishedFinancingPreference = undefined;
    }
    if (cur !== 'FINISHED_EMPTY') {
      clear.furnishingScope = undefined;
      clear.furnishingInstallDeadline = undefined;
      clear.furnishingBudgetBand = undefined;
      clear.furnishingPaymentPreference = undefined;
    }
    if (cur !== 'FINISHED_EMPTY' && cur !== 'FURNISHED_RENO') {
      clear.furnishingAesthetic = undefined;
      clear.petFriendly = undefined;
    }
    if (cur === 'FURNISHED_RENO') {
      clear.furnishingAesthetic = undefined;
    }
    if (cur !== 'FURNISHED_RENO') {
      clear.furnishedRenoAreas = undefined;
      clear.furnishedLeadQualification = undefined;
      clear.furnishedUnitLuxe = undefined;
      clear.furnishedPhotoChecklist = undefined;
      clear.guestPolicyAudiences = undefined;
    }
    if (cur === 'SHELL') {
      clear.acCoverage = undefined;
      clear.internetSpeed = undefined;
      clear.essentialTechNeeds = undefined;
      clear.hasPropertyManagerOrCompany = undefined;
      clear.hasDedicatedCleaningTeam = undefined;
      clear.regulatory = { ...data.regulatory, guestAccessSolution: undefined };
    }
    prevStateRef.current = cur;
    if (Object.keys(clear).length > 0) updateData(clear);
  }, [data.regulatory, data.stateFlag, updateData]);

  const setAcCoverage = (acCoverage: ACCoverage) => updateData({ acCoverage });
  const setInternetSpeed = (internetSpeed: InternetSpeed) => updateData({ internetSpeed });
  const setEssentialTech = (id: EssentialTechId) =>
    updateData({ essentialTechNeeds: toggleId(data.essentialTechNeeds, id) });

  const isAr = locale === 'ar';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={[...STEP4_ERROR_KEYS]} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'تفاصيل حالة العقار' : 'State details'}
        </h2>
      </div>

      {selectedState === 'SHELL' && (
        <div className="mb-10 space-y-8">
          <WizardDetailCard>
            <WizardDetailSelect
              id="shell-finishing-level"
              label={isAr ? 'مستوى التشطيب الحالي' : 'Current finishing level'}
              value={data.unfinishedFinishingLevel ?? ''}
              onChange={(e) =>
                updateData({
                  unfinishedFinishingLevel: (e.target.value || undefined) as UnfinishedFinishingLevel | undefined,
                })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="shell_core">
                {isAr ? 'عظم / طوب أحمر — بدون مرافق أو لياسة' : 'Shell & core (red brick): no utilities or plaster'}
              </option>
              <option value="semi_finished">
                {isAr ? 'نصف تشطيب: لياسة، كهرباء أساسية، وسباكة' : 'Semi-finished: plaster, basic electricity & plumbing'}
              </option>
              <option value="needs_renovation">
                {isAr ? 'تشطيب قديم يحتاج إزالة أو تحديث' : 'Needs renovation: strip or update existing finishing'}
              </option>
            </WizardDetailSelect>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'جاهزية البنية التحتية' : 'Infrastructure readiness'}</WizardDetailHeading>
            <WizardDetailChipGrid
              options={mapOpts(SHELL_INFRA_OPTS, isAr)}
              selectedIds={data.unfinishedInfrastructure}
              onToggle={(id) =>
                updateData({
                  unfinishedInfrastructure: toggleId(data.unfinishedInfrastructure, id as UnfinishedInfrastructureId),
                })
              }
            />
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailSelect
              id="shell-smart-home"
              label={isAr ? 'متطلبات المنزل الذكي' : 'Smart home requirements'}
              value={data.unfinishedSmartHome ?? ''}
              onChange={(e) =>
                updateData({
                  unfinishedSmartHome: (e.target.value || undefined) as UnfinishedSmartHome | undefined,
                })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="basic">{isAr ? 'أساسي: تمديدات عادية فقط' : 'Basic: standard wiring only'}</option>
              <option value="smart_ready">
                {isAr ? 'جاهز للذكاء: تمهيد كابلات للإضاءة والتكييف والأمان' : 'Smart-ready: pre-cabling for lighting, AC, security'}
              </option>
              <option value="full_automation">
                {isAr
                  ? 'أتمتة كاملة: مركز متكامل (KNX / Control4 / SmartThings)'
                  : 'Full automation: integrated hub (KNX / Control4 / SmartThings)'}
              </option>
            </WizardDetailSelect>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'ميزانية التشطيب للمتر المربع' : 'Finishing budget per sqm'}</WizardDetailHeading>
            <WizardDetailRadioList
              name="unfinishedBudgetPerSqm"
              options={mapOpts(UNFINISHED_BUDGET_OPTS, isAr)}
              value={data.unfinishedBudgetPerSqm}
              onSelect={(id) => updateData({ unfinishedBudgetPerSqm: id as UnfinishedBudgetPerSqm })}
            />
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'تفضيل التمويل' : 'Financing preference'}</WizardDetailHeading>
            <WizardDetailRadioList
              name="unfinishedFinancingPreference"
              options={mapOpts(UNFINISHED_FINANCING_OPTS, isAr)}
              value={data.unfinishedFinancingPreference}
              onSelect={(id) => updateData({ unfinishedFinancingPreference: id as UnfinishedFinancingPreference })}
            />
          </WizardDetailCard>
        </div>
      )}

      {selectedState === 'FINISHED_EMPTY' && (
        <div className="mb-10 space-y-8">
          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'نطاق الفرش والتشطيب' : 'I still need to add..'}</WizardDetailHeading>
            <WizardDetailChipGrid
              variant="choiceRow"
              options={mapOpts(FURNISHING_SCOPE_OPTS, isAr)}
              selectedIds={data.furnishingScope}
              onToggle={(id) =>
                updateData({
                  furnishingScope: toggleId(data.furnishingScope, id as FurnishingScopeId),
                })
              }
              fullWidth
            />
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'اختر أسلوب التصميم' : 'Choose a design style'}</WizardDetailHeading>
            <DesignStyleCarousel
              value={data.furnishingAesthetic}
              onChange={(id) => updateData({ furnishingAesthetic: id })}
              isAr={isAr}
            />
          </WizardDetailCard>

          <PetFriendlyToggle isAr={isAr} />

          <WizardDetailCard>
            <WizardDetailSelect
              id="furnishing-install-deadline"
              label={isAr ? 'موعد التركيب / التسليم' : 'Installation deadline'}
              value={data.furnishingInstallDeadline ?? ''}
              onChange={(e) =>
                updateData({
                  furnishingInstallDeadline: (e.target.value || undefined) as FurnishingInstallDeadline | undefined,
                })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="under_3_weeks">
                {isAr ? 'سريع: أقل من 3 أسابيع (جاهز-فرش)' : 'Express: under 3 weeks (ready-made focus)'}
              </option>
              <option value="weeks_4_8">{isAr ? 'قياسي: 4 – 8 أسابيع' : 'Standard: 4 – 8 weeks'}</option>
              <option value="months_3_plus">{isAr ? 'مخصص: 3 أشهر فأكثر' : 'Custom: 3+ months'}</option>
            </WizardDetailSelect>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{isAr ? 'ميزانية الفرش (تقريبية)' : 'Furnishing budget range'}</WizardDetailHeading>
            <WizardDetailRadioList
              name="furnishingBudgetBand"
              options={mapOpts(FURNISHING_BUDGET_OPTS, isAr)}
              value={data.furnishingBudgetBand}
              onSelect={(id) => updateData({ furnishingBudgetBand: id as FurnishingBudgetBand })}
            />
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-3">
              {isAr ? 'تفضيل الدفع / التمويل' : 'Payment & financing preference'}
            </WizardDetailHeading>
            <WizardDetailRadioList
              name="furnishingPaymentPreference"
              options={mapOpts(FURNISHING_PAYMENT_OPTS, isAr)}
              value={data.furnishingPaymentPreference}
              onSelect={(id) => updateData({ furnishingPaymentPreference: id as FurnishingPaymentPreference })}
            />
          </WizardDetailCard>
        </div>
      )}

      {selectedState === 'FURNISHED_RENO' && (
        <div className="space-y-6 mb-10">
          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{isAr ? 'المياه والتسخين' : 'Water & heating'}</WizardDetailHeading>
            <WizardDetailLead>
              {isAr ? 'ما واقع ضغط المياه والتسخين للضيوف؟' : 'How do water pressure and hot water perform for guests?'}
            </WizardDetailLead>
            <WizardDetailRadioList
              name="furnishedWaterHeating"
              options={mapOpts(FURNISHED_WATER_HEATING_OPTS, isAr)}
              value={data.furnishedUnitLuxe?.waterHeating}
              onSelect={(id) =>
                updateData({
                  furnishedUnitLuxe: {
                    ...data.furnishedUnitLuxe,
                    waterHeating: id as FurnishedWaterHeating,
                  } as FurnishedUnitLuxe,
                })
              }
            />
          </WizardDetailCard>

          <WizardDetailCard>
            {applicability.showAcInternetDetails && (
              <AcInternetFields
                isAr={isAr}
                acCoverage={data.acCoverage}
                internetSpeed={data.internetSpeed}
                onAcChange={setAcCoverage}
                onInternetChange={setInternetSpeed}
              />
            )}
            {applicability.showEssentialTechDetails && (
              <EssentialTechFields
                isAr={isAr}
                selectedIds={data.essentialTechNeeds}
                onToggle={setEssentialTech}
              />
            )}
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{isAr ? 'المفارش والمناشف' : 'Bedding & towels'}</WizardDetailHeading>
            <WizardDetailLead>{isAr ? 'أسلوب المفروشات للضيوف' : 'Linens style for guests'}</WizardDetailLead>
            <label className="sr-only" htmlFor="furnished-bedding-tier">
              {isAr ? 'نوع المفارش' : 'Bedding style'}
            </label>
            <select
              id="furnished-bedding-tier"
              className={wizardDetailSelectClassName}
              value={data.furnishedUnitLuxe?.beddingTier ?? ''}
              onChange={(e) =>
                updateData({
                  furnishedUnitLuxe: {
                    ...data.furnishedUnitLuxe,
                    beddingTier: (e.target.value || undefined) as FurnishedBeddingTier | undefined,
                  } as FurnishedUnitLuxe,
                })
              }
            >
              <option value="">{isAr ? 'اختر' : 'Select'}</option>
              <option value="hotel_style_white">{isAr ? 'أبيض فندقي' : 'Hotel-style white'}</option>
              <option value="colored">{isAr ? 'ملوّن' : 'Colored'}</option>
            </select>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{isAr ? 'سياسة الضيوف والحيوانات' : 'Guest & pet policy'}</WizardDetailHeading>
            <div className="mb-6">
              <PetFriendlyToggle isAr={isAr} embedded />
            </div>
            <div className="font-heading font-bold text-secondary-900 mb-2 text-sm">
              {isAr ? 'أنواع الضيوف المسموح بها (يمكن اختيار أكثر من خيار)' : 'Guest types allowed (select all that apply)'}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {GUEST_POLICY_OPTS.map((opt) => {
                const selected = (data.guestPolicyAudiences ?? []).includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer text-start transition-colors',
                      selected ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary-600 mt-1"
                      checked={selected}
                      onChange={() =>
                        updateData({
                          guestPolicyAudiences: toggleId(data.guestPolicyAudiences, opt.id),
                        })
                      }
                    />
                    <span className="text-base font-medium text-secondary-900">{isAr ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{isAr ? 'المنزل الذكي والمراقبة' : 'Smart home & monitoring'}</WizardDetailHeading>
            <WizardDetailLead>
              {isAr ? 'ما الموجود حاليًا في الوحدة؟ (يمكن اختيار أكثر من خيار)' : 'What’s already in the unit? (Select all that apply)'}
            </WizardDetailLead>
            <WizardDetailChipGrid
              options={mapOpts(SMART_HOME_LUXE_OPTS, isAr)}
              selectedIds={data.furnishedUnitLuxe?.smartHomeLuxe}
              onToggle={(id) =>
                updateData({
                  furnishedUnitLuxe: {
                    ...data.furnishedUnitLuxe,
                    smartHomeLuxe: toggleId(data.furnishedUnitLuxe?.smartHomeLuxe, id as FurnishedLuxeSmartHomeId),
                  } as FurnishedUnitLuxe,
                })
              }
              columnsClassName="grid grid-cols-1 sm:grid-cols-2 gap-2"
            />
          </WizardDetailCard>
        </div>
      )}

      {selectedState !== 'FURNISHED_RENO' && applicability.showAcInternetDetails && (
        <WizardDetailCard className="mb-10">
          <AcInternetFields
            isAr={isAr}
            acCoverage={data.acCoverage}
            internetSpeed={data.internetSpeed}
            onAcChange={setAcCoverage}
            onInternetChange={setInternetSpeed}
          />
          {applicability.showEssentialTechDetails && (
            <EssentialTechFields
              isAr={isAr}
              selectedIds={data.essentialTechNeeds}
              onToggle={setEssentialTech}
            />
          )}
        </WizardDetailCard>
      )}

      {selectedState !== 'FURNISHED_RENO' && applicability.showAccessComplianceDetails && <AccessComplianceCard />}
    </div>
  );
}
