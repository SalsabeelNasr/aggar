import type { Service } from './services';
import type { ServiceRule } from './rules';
import { MOCK_SERVICES } from './servicesMock';
import { MOCK_RULES } from './rulesMock';

/**
 * Data access layer — thin wrapper over mock data.
 * Swap the body of each function to Supabase queries when migrating.
 */

export function getActiveServices(): Service[] {
  return MOCK_SERVICES.filter((s) => s.is_active);
}

export function getAllRules(): ServiceRule[] {
  return MOCK_RULES;
}

export function getRulesForService(serviceId: string): ServiceRule[] {
  return MOCK_RULES.filter((r) => r.service_id === serviceId);
}
