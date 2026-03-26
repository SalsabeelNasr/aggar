import type { PropertyStateFlag } from '@/models';

export interface StateFieldApplicability {
  showAcInternetDetails: boolean;
  showEssentialTechDetails: boolean;
  showAccessComplianceDetails: boolean;
  applyAcInternetToScore: boolean;
}

/**
 * Single source of truth for state-specific field semantics.
 *
 * - SHELL: no operational/infrastructure readiness fields yet.
 * - FINISHED_EMPTY: capture only furnishing needs (no AC/internet or STR ops fields).
 * - FURNISHED: all readiness fields apply.
 */
export function getStateFieldApplicability(
  stateFlag: PropertyStateFlag | undefined
): StateFieldApplicability {
  switch (stateFlag) {
    case 'SHELL':
      return {
        showAcInternetDetails: false,
        showEssentialTechDetails: false,
        showAccessComplianceDetails: false,
        applyAcInternetToScore: false,
      };
    case 'FINISHED_EMPTY':
      return {
        showAcInternetDetails: false,
        showEssentialTechDetails: false,
        showAccessComplianceDetails: false,
        applyAcInternetToScore: false,
      };
    case 'FURNISHED':
    default:
      return {
        showAcInternetDetails: true,
        showEssentialTechDetails: true,
        showAccessComplianceDetails: true,
        applyAcInternetToScore: true,
      };
  }
}
