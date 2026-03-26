import type { LocalizedString, RegionId } from '@/models';

/** 2026 neighborhood playbook: strategy, occupancy target narrative, revenue peak windows. */
export type RegionStrategy2026 = {
  strategy: LocalizedString;
  occupancyTarget: LocalizedString;
  revenuePeak: LocalizedString;
};

const STRATEGY_BY_REGION: Partial<Record<RegionId, RegionStrategy2026>> = {
  north_coast: {
    strategy: { en: 'High-Season Maxing', ar: 'تعظيم موسم الذروة' },
    occupancyTarget: { en: '90% (Summer)', ar: '90% (صيفي)' },
    revenuePeak: { en: 'July - August', ar: 'يوليو - أغسطس' },
  },
  zamalek: {
    strategy: { en: 'Corporate/Expat Premium', ar: 'قطاع الشركات والمغتربين (مميز)' },
    occupancyTarget: { en: '65% (Year-round)', ar: '65% (طوال العام)' },
    revenuePeak: { en: 'December & April', ar: 'ديسمبر وأبريل' },
  },
  /** Giza / Greater Cairo corridor (GEM peak) — `nasr_city_6th_october` in product regions. */
  nasr_city_6th_october: {
    strategy: { en: 'Tourism Experience', ar: 'تجربة سياحية' },
    occupancyTarget: { en: '60% (Year-round)', ar: '60% (طوال العام)' },
    revenuePeak: { en: 'Oct - May (GEM Peak)', ar: 'أكتوبر - مايو (ذروة المتحف المصري الكبير)' },
  },
  new_cairo: {
    strategy: { en: 'Digital Nomad/Long-stay', ar: 'العمل عن بُعد والإقامات الطويلة' },
    occupancyTarget: { en: '55% (Year-round)', ar: '55% (طوال العام)' },
    revenuePeak: { en: 'November & July', ar: 'نوفمبر ويوليو' },
  },
};

export function getRegionStrategy2026(regionId: RegionId | undefined): RegionStrategy2026 | null {
  if (!regionId) return null;
  return STRATEGY_BY_REGION[regionId] ?? null;
}
