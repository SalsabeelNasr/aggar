import type { PackageType } from '@/lib/engines/packageEngine';

/** Score improvement row ids (`SCORE_IMPROVEMENT_ROWS`) relevant to each package. */
export const IMPROVEMENT_IDS_BY_PACKAGE: Record<PackageType, string[]> = {
  quick_start: ['photo', 'lighting'],
  sweet_spot: ['photo', 'lighting', 'linen', 'bath'],
  asset_flip: ['photo', 'lighting', 'linen', 'bath', 'workspace'],
  performance_audit: ['photo', 'lighting', 'workspace'],
  /** Full builder: all themed levers that can map to a line item in the union catalog. */
  custom: ['photo', 'lighting', 'linen', 'bath', 'workspace'],
};
