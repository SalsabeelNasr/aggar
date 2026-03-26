import type { WizardData } from '@/models';
import type { Service } from '@/lib/data/services';
import type { ServiceRule } from '@/lib/data/rules';
import { getActiveServices, getAllRules } from '@/lib/data/serviceAccess';
import { resolveFieldPath } from '@/lib/data/helpers';
import { scoreWizardData, type ScoreResult } from './scoringEngine';

export interface RuleEngineResult {
  scoreResult: ScoreResult;
  missingServices: Service[];
  presentServices: Service[];
  maxPossibleScore: number;
}

const PRIORITY_ORDER: Record<Service['priority'], number> = {
  must_have: 0,
  high_impact: 1,
  nice_to_have: 2,
};

function evaluateOperator(
  fieldValue: unknown,
  operator: ServiceRule['operator'],
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

function isServiceNeeded(serviceId: string, rules: ServiceRule[], data: WizardData): boolean {
  const serviceRules = rules.filter((r) => r.service_id === serviceId);
  if (serviceRules.length === 0) return false;

  // Group rules by logic_group
  const groups = new Map<string, ServiceRule[]>();
  for (const rule of serviceRules) {
    const existing = groups.get(rule.logic_group) ?? [];
    existing.push(rule);
    groups.set(rule.logic_group, existing);
  }

  // OR across groups (any group passing = service needed)
  const groupEntries = Array.from(groups.values());
  for (const groupRules of groupEntries) {
    // AND within group (all rules in group must pass)
    const groupPasses = groupRules.every((rule: ServiceRule) => {
      const fieldValue = resolveFieldPath(data as unknown as Record<string, unknown>, rule.field_path);
      return evaluateOperator(fieldValue, rule.operator, rule.value);
    });
    if (groupPasses) return true;
  }

  return false;
}

/**
 * Evaluate all rules against wizard data to determine which services are needed.
 * Returns sorted missing services (must_have first, then by score contribution desc).
 */
export function evaluateRules(data: WizardData): RuleEngineResult {
  const scoreResult = scoreWizardData(data);
  const services = getActiveServices();
  const rules = getAllRules();

  const stateFlag = data.stateFlag ?? 'FINISHED_EMPTY';

  const missing: Service[] = [];
  const present: Service[] = [];

  for (const service of services) {
    // Skip services that don't apply to this property state
    if (!service.applicable_states.includes(stateFlag)) {
      continue;
    }

    if (isServiceNeeded(service.id, rules, data)) {
      missing.push(service);
    } else {
      present.push(service);
    }
  }

  // Sort: priority first, then score contribution desc, then sort_order
  missing.sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    const s = b.score_contribution - a.score_contribution;
    if (s !== 0) return s;
    return a.sort_order - b.sort_order;
  });

  const totalMissingScore = missing.reduce((acc, s) => acc + s.score_contribution, 0);
  const maxPossibleScore = Math.min(100, scoreResult.finalScore + totalMissingScore);

  return {
    scoreResult,
    missingServices: missing,
    presentServices: present,
    maxPossibleScore,
  };
}
