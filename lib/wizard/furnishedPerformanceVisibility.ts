import type { ManagementMode } from '@/models';

export type FurnishedPerformanceSectionId =
  | 'listingContext'
  | 'gapAudit'
  | 'postGapHint'
  | 'listingStack'
  | 'cleaningSupport'
  | 'responseTime'
  | 'revenueDemand'
  | 'compliance';

const DIY_ASSISTED_SET = new Set<FurnishedPerformanceSectionId>([
  'listingContext',
  'gapAudit',
  'postGapHint',
  'listingStack',
  'cleaningSupport',
  'responseTime',
  'revenueDemand',
]);

const DIY_FULL_SET = new Set<FurnishedPerformanceSectionId>([
  ...Array.from(DIY_ASSISTED_SET),
  'compliance',
]);

/** Gap audit lives on `StepPainPoints`. */
const MANAGED_SET = new Set<FurnishedPerformanceSectionId>(['listingContext', 'gapAudit', 'postGapHint']);

export function getFurnishedPerformanceSections(
  mode: ManagementMode | undefined
): Set<FurnishedPerformanceSectionId> {
  switch (mode) {
    case 'DIY_FULL':
      return DIY_FULL_SET;
    case 'DIY_ASSISTED':
      return DIY_ASSISTED_SET;
    case 'MANAGED':
    default:
      return MANAGED_SET;
  }
}

export function isFurnishedPerformanceSectionVisible(
  mode: ManagementMode | undefined,
  section: FurnishedPerformanceSectionId
): boolean {
  return getFurnishedPerformanceSections(mode).has(section);
}
