import type { ManagementMode } from '@/models';

/** Sections that render a bordered card on `StepFurnishedPerformance` (not the standalone heading). */
const PERFORMANCE_STEP_CARD_SECTIONS: FurnishedPerformanceSectionId[] = [
  'listingStack',
  'cleaningSupport',
  'responseTime',
  'revenueDemand',
  'compliance',
];

export type FurnishedPerformanceSectionId =
  | 'listingContext'
  | 'gapAudit'
  | 'listingStack'
  | 'cleaningSupport'
  | 'responseTime'
  | 'revenueDemand'
  | 'compliance';

const DIY_ASSISTED_SET = new Set<FurnishedPerformanceSectionId>([
  'listingContext',
  'gapAudit',
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
const MANAGED_SET = new Set<FurnishedPerformanceSectionId>(['listingContext', 'gapAudit']);

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

/** When false, the Performance wizard step has no cards — hide it from the stepper and skip navigation. */
export function furnishedPerformanceStepHasVisibleCards(mode: ManagementMode | undefined): boolean {
  return PERFORMANCE_STEP_CARD_SECTIONS.some((section) =>
    isFurnishedPerformanceSectionVisible(mode, section)
  );
}
