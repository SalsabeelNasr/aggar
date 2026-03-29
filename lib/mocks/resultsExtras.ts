import { CONSULTANT_MOCK, DIY_CHECKLIST_ITEMS } from '@/lib/results/resultsStatic';
import { FURNISHED_LISTING_PHOTO_COMPANION_DIY } from '@/lib/results/furnishedPhotoProofDiy';
import type { ReportResultsExtras } from '@/lib/evaluation/types';

export function buildResultsExtrasMock(): ReportResultsExtras {
  return {
    consultants: CONSULTANT_MOCK,
    diyChecklist: DIY_CHECKLIST_ITEMS,
    furnishedListingPhotoCompanionDiy: FURNISHED_LISTING_PHOTO_COMPANION_DIY,
  };
}
