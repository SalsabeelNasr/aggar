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
  UnfinishedFinishingLevel,
  UnfinishedInfrastructureId,
  UnfinishedSmartHome,
  WizardData,
} from '@/models';
import { cn } from '@/lib/utils';
import { Hammer, PaintRoller, Sofa } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';
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

const states: Array<{
  id: PropertyStateFlag;
  icon: any;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
}> = [
  {
    id: 'SHELL',
    icon: Hammer,
    titleEn: 'Shell',
    titleAr: 'عظم',
    subtitleEn: 'Concrete or brick shell only, no finishes.',
    subtitleAr: 'خرسانة أو طوب فقط، دون أي تشطيب.',
  },
  {
    id: 'FINISHED_EMPTY',
    icon: PaintRoller,
    titleEn: 'Finished (unfurnished)',
    titleAr: 'تشطيب كامل (غير مفروش)',
    subtitleEn: 'Fully finished and unfurnished.',
    subtitleAr: 'مكتملة التشطيب وغير مفروشة.',
  },
  {
    id: 'FURNISHED',
    icon: Sofa,
    titleEn: 'Furnished',
    titleAr: 'مفروش',
    subtitleEn: 'Furnished, ready to move in or needs light updates.',
    subtitleAr: 'مفروشة، جاهزة للسكن أو لتحسينات بسيطة.',
  },
];

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
  { id: 'electricity_meter' as const, en: 'Primary electricity meter installed', ar: 'عداد كهرباء رئيسي مركّب' },
  { id: 'water_meter' as const, en: 'Water meter installed', ar: 'عداد مياه مركّب' },
  { id: 'natural_gas' as const, en: 'Natural gas connected', ar: 'الغاز الطبيعي متصل' },
  { id: 'fiber_ready' as const, en: 'Fiber / high-speed internet ready', ar: 'فايبر / إنترنت عالي السرعة جاهز' },
] satisfies { id: UnfinishedInfrastructureId; en: string; ar: string }[];

const FURNISHING_SCOPE_OPTS = [
  { id: 'furniture' as const, en: 'Furniture (sofas, beds, tables)', ar: 'أثاث (كنب، سراير، طاولات)' },
  { id: 'appliances' as const, en: 'Appliances (ACs, kitchen kit, smart locks)', ar: 'أجهزة (تكييف، مطبخ، أقفال ذكية)' },
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

const FURNISHED_WATER_HEATING_OPTS = [
  { id: 'electric_standard' as const, en: 'Electric water heaters (standard)', ar: 'سخانات كهرباء (قياسي)' },
  { id: 'central_gas_premium' as const, en: 'Central gas heating (premium)', ar: 'سخان مركزي غاز (مميز)' },
  { id: 'pressure_issues_peak' as const, en: 'Water pressure issues at peak hours', ar: 'مشاكل ضغط مياه في أوقات الذروة' },
] satisfies { id: FurnishedWaterHeating; en: string; ar: string }[];

const GUEST_POLICY_OPTS = [
  { id: 'mixed_groups_allowed' as const, en: 'Mixed groups allowed', ar: 'مجموعات مختلطة مسموحة' },
  { id: 'couples_allowed' as const, en: 'Couples allowed', ar: 'أزواج مسموحون' },
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
  { id: 'noise_decibel_monitor' as const, en: 'Noise monitor (e.g. Minut)', ar: 'مراقب ضوضاء (مثل Minut)' },
  { id: 'smart_thermostat' as const, en: 'Smart thermostat (AC)', ar: 'ثرموستات ذكية (تكييف)' },
  { id: 'smoke_co_detectors' as const, en: 'Smoke & CO detectors', ar: 'كواشف دخان وأول أكسيد الكربون' },
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

export function Step3State() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const stateErr = useWizardFieldError('stateFlag');
  const availableStates = states;

  const selectedState = data.stateFlag;
  const applicability = getStateFieldApplicability(selectedState);
  const prevStateRef = React.useRef<PropertyStateFlag | undefined>(undefined);

  const allowedIds = React.useMemo(() => new Set(availableStates.map((s) => s.id)), [availableStates]);

  React.useEffect(() => {
    if (selectedState == null) return;
    if (!allowedIds.has(selectedState)) {
      updateData({ stateFlag: 'FURNISHED' });
    }
  }, [allowedIds, selectedState, updateData]);

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
    if (cur !== 'FINISHED_EMPTY' && cur !== 'FURNISHED') {
      clear.furnishingAesthetic = undefined;
      clear.petFriendly = undefined;
    }
    if (cur === 'FURNISHED') {
      clear.furnishingAesthetic = undefined;
    }
    if (cur !== 'FURNISHED') {
      clear.furnishedAreas = undefined;
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
  const setEssentialTech = (id: EssentialTechId) => updateData({ essentialTechNeeds: toggleId(data.essentialTechNeeds, id) });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['stateFlag']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'ما هي حالة العقار الحالية؟' : 'What is the current state?'}
        </h2>
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 mb-10',
          stateErr.invalid && 'ring-2 ring-red-500 ring-offset-2 rounded-2xl p-1 -m-1'
        )}
      >
        {availableStates.map((state) => {
          const isSelected = selectedState === state.id;
          return (
            <button
              key={state.id}
              onClick={() => updateData({ stateFlag: state.id })}
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none text-start cursor-pointer w-full group',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg mr-4 ml-4 transition-colors shrink-0',
                  isSelected ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                )}
              >
                <state.icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3
                  className={cn(
                    'font-heading font-bold text-lg',
                    isSelected ? 'text-primary-900' : 'text-secondary-900'
                  )}
                >
                  {locale === 'ar' ? state.titleAr : state.titleEn}
                </h3>
                <p className="text-secondary-500 text-sm mt-1">
                  {locale === 'ar' ? state.subtitleAr : state.subtitleEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedState === 'SHELL' && (
        <div className="mb-10 space-y-8">
          <WizardDetailCard>
            <WizardDetailSelect
              id="shell-finishing-level"
              label={locale === 'ar' ? 'مستوى التشطيب الحالي' : 'Current finishing level'}
              value={data.unfinishedFinishingLevel ?? ''}
              onChange={(e) =>
                updateData({
                  unfinishedFinishingLevel: (e.target.value || undefined) as UnfinishedFinishingLevel | undefined,
                })
              }
            >
              <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
              <option value="shell_core">
                {locale === 'ar' ? 'عظم / طوب أحمر — بدون مرافق أو لياسة' : 'Shell & core (red brick): no utilities or plaster'}
              </option>
              <option value="semi_finished">
                {locale === 'ar' ? 'نصف تشطيب: لياسة، كهرباء أساسية، وسباكة' : 'Semi-finished: plaster, basic electricity & plumbing'}
              </option>
              <option value="needs_renovation">
                {locale === 'ar' ? 'تشطيب قديم يحتاج إزالة أو تحديث' : 'Needs renovation: strip or update existing finishing'}
              </option>
            </WizardDetailSelect>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading>{locale === 'ar' ? 'جاهزية البنية التحتية' : 'Infrastructure readiness'}</WizardDetailHeading>
            <WizardDetailChipGrid
              options={mapOpts(SHELL_INFRA_OPTS, locale === 'ar')}
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
              label={locale === 'ar' ? 'متطلبات المنزل الذكي' : 'Smart home requirements'}
              value={data.unfinishedSmartHome ?? ''}
              onChange={(e) =>
                updateData({
                  unfinishedSmartHome: (e.target.value || undefined) as UnfinishedSmartHome | undefined,
                })
              }
            >
              <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
              <option value="basic">{locale === 'ar' ? 'أساسي: تمديدات عادية فقط' : 'Basic: standard wiring only'}</option>
              <option value="smart_ready">
                {locale === 'ar'
                  ? 'جاهز للذكاء: تمهيد كابلات للإضاءة والتكييف والأمان'
                  : 'Smart-ready: pre-cabling for lighting, AC, security'}
              </option>
              <option value="full_automation">
                {locale === 'ar'
                  ? 'أتمتة كاملة: مركز متكامل (KNX / Control4 / SmartThings)'
                  : 'Full automation: integrated hub (KNX / Control4 / SmartThings)'}
              </option>
            </WizardDetailSelect>
          </WizardDetailCard>
        </div>
      )}

      {selectedState === 'FINISHED_EMPTY' && (
        <div className="mb-10 space-y-8">
          <WizardDetailCard>
            <WizardDetailHeading>{locale === 'ar' ? 'نطاق الفرش والتشطيب' : 'I still need to add..'}</WizardDetailHeading>
            <WizardDetailChipGrid
              variant="choiceRow"
              options={mapOpts(FURNISHING_SCOPE_OPTS, locale === 'ar')}
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
            <WizardDetailHeading>{locale === 'ar' ? 'اختر أسلوب التصميم' : 'Choose a design style'}</WizardDetailHeading>
            <DesignStyleCarousel
              value={data.furnishingAesthetic}
              onChange={(id) => updateData({ furnishingAesthetic: id })}
              isAr={locale === 'ar'}
            />
          </WizardDetailCard>

          <PetFriendlyToggle isAr={locale === 'ar'} />

          <WizardDetailCard>
            <WizardDetailSelect
              id="furnishing-install-deadline"
              label={locale === 'ar' ? 'موعد التركيب / التسليم' : 'Installation deadline'}
              value={data.furnishingInstallDeadline ?? ''}
              onChange={(e) =>
                updateData({
                  furnishingInstallDeadline: (e.target.value || undefined) as FurnishingInstallDeadline | undefined,
                })
              }
            >
              <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
              <option value="under_3_weeks">
                {locale === 'ar' ? 'سريع: أقل من 3 أسابيع (جاهز-فرش)' : 'Express: under 3 weeks (ready-made focus)'}
              </option>
              <option value="weeks_4_8">{locale === 'ar' ? 'قياسي: 4 – 8 أسابيع' : 'Standard: 4 – 8 weeks'}</option>
              <option value="months_3_plus">{locale === 'ar' ? 'مخصص: 3 أشهر فأكثر' : 'Custom: 3+ months'}</option>
            </WizardDetailSelect>
          </WizardDetailCard>
        </div>
      )}

      {selectedState === 'FURNISHED' && (
        <div className="space-y-6 mb-10">
          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{locale === 'ar' ? 'المياه والتسخين' : 'Water & heating'}</WizardDetailHeading>
            <WizardDetailLead>
              {locale === 'ar' ? 'ما واقع ضغط المياه والتسخين للضيوف؟' : 'How do water pressure and hot water perform for guests?'}
            </WizardDetailLead>
            <WizardDetailRadioList
              name="furnishedWaterHeating"
              options={mapOpts(FURNISHED_WATER_HEATING_OPTS, locale === 'ar')}
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
                isAr={locale === 'ar'}
                acCoverage={data.acCoverage}
                internetSpeed={data.internetSpeed}
                onAcChange={setAcCoverage}
                onInternetChange={setInternetSpeed}
              />
            )}
            {applicability.showEssentialTechDetails && (
              <EssentialTechFields isAr={locale === 'ar'} selectedIds={data.essentialTechNeeds} onToggle={setEssentialTech} />
            )}
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{locale === 'ar' ? 'المفارش والمناشف' : 'Bedding & towels'}</WizardDetailHeading>
            <WizardDetailLead>{locale === 'ar' ? 'أسلوب المفروشات للضيوف' : 'Linens style for guests'}</WizardDetailLead>
            <label className="sr-only" htmlFor="furnished-bedding-tier">
              {locale === 'ar' ? 'نوع المفارش' : 'Bedding style'}
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
              <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
              <option value="hotel_style_white">{locale === 'ar' ? 'أبيض فندقي' : 'Hotel-style white'}</option>
              <option value="colored">{locale === 'ar' ? 'ملوّن' : 'Colored'}</option>
            </select>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{locale === 'ar' ? 'سياسة الضيوف والحيوانات' : 'Guest & pet policy'}</WizardDetailHeading>
            <div className="mb-6">
              <PetFriendlyToggle isAr={locale === 'ar'} embedded />
            </div>
            <div className="font-heading font-bold text-secondary-900 mb-2 text-sm">
              {locale === 'ar' ? 'أنواع الضيوف المسموح بها (يمكن اختيار أكثر من خيار)' : 'Guest types allowed (select all that apply)'}
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
                    <span className="text-base font-medium text-secondary-900">{locale === 'ar' ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
          </WizardDetailCard>

          <WizardDetailCard>
            <WizardDetailHeading className="mb-1">{locale === 'ar' ? 'المنزل الذكي والمراقبة' : 'Smart home & monitoring'}</WizardDetailHeading>
            <WizardDetailLead>
              {locale === 'ar' ? 'ما الموجود حاليًا في الوحدة؟ (يمكن اختيار أكثر من خيار)' : 'What’s already in the unit? (Select all that apply)'}
            </WizardDetailLead>
            <WizardDetailChipGrid
              options={mapOpts(SMART_HOME_LUXE_OPTS, locale === 'ar')}
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

      {selectedState !== 'FURNISHED' && applicability.showAcInternetDetails && (
        <WizardDetailCard className="mb-10">
          <AcInternetFields
            isAr={locale === 'ar'}
            acCoverage={data.acCoverage}
            internetSpeed={data.internetSpeed}
            onAcChange={setAcCoverage}
            onInternetChange={setInternetSpeed}
          />
          {applicability.showEssentialTechDetails && (
            <EssentialTechFields isAr={locale === 'ar'} selectedIds={data.essentialTechNeeds} onToggle={setEssentialTech} />
          )}
        </WizardDetailCard>
      )}

      {selectedState !== 'FURNISHED' && applicability.showAccessComplianceDetails && <AccessComplianceCard />}
    </div>
  );
}
