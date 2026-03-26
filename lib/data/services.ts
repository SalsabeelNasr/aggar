import type { LocalizedString } from '@/models';

/**
 * Flat service definition — mirrors future Supabase `services` table.
 * Each service has a cost range, score contribution, and priority level.
 */
export interface Service {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  cost_min_egp: number;
  cost_max_egp: number;
  cost_unit: 'fixed' | 'per_sqm' | 'percent_of_revenue';
  cost_pct_min?: number;
  cost_pct_max?: number;
  score_contribution: number;
  priority: 'must_have' | 'high_impact' | 'nice_to_have';
  category: string;
  applicable_states: string[];
  sort_order: number;
  is_active: boolean;
}

/** Bridge from flat DB columns to the LocalizedString pattern used by the UI. */
export function serviceNameLocalized(s: Service): LocalizedString {
  return { en: s.name_en, ar: s.name_ar };
}

export function serviceDescriptionLocalized(s: Service): LocalizedString {
  return { en: s.description_en, ar: s.description_ar };
}
