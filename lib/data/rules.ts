/**
 * Service rule definition — mirrors future Supabase `service_rules` table.
 * Rules within the same `logic_group` are AND-ed; groups for the same service are OR-ed.
 */
export interface ServiceRule {
  id: string;
  service_id: string;
  field_path: string;
  operator: 'eq' | 'neq' | 'in' | 'not_in' | 'lt' | 'lte' | 'gt' | 'gte' | 'is_empty' | 'is_not_empty';
  value: string | number | boolean | string[];
  logic_group: string;
}
