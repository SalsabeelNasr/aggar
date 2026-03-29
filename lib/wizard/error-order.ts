/** DOM/visual order for scrolling to the first invalid field per evaluate step index. */
export const WIZARD_ERROR_SCROLL_ORDER: Record<number, readonly string[]> = {
  0: ['propertyType', 'bedrooms', 'bathrooms', 'sleepCapacity', 'inGatedCompound', 'hasLift'],
  1: ['regionId', 'address'],
  2: ['listingStatus'],
  3: [
    'stateFlag',
    'unfinishedFinishingLevel',
    'unfinishedInfrastructure',
    'unfinishedSmartHome',
    'furnishingScope',
    'furnishingAesthetic',
    'petFriendly',
    'furnishingInstallDeadline',
    'waterHeating',
    'acCoverage',
    'internetSpeed',
    'beddingTier',
    'guestPolicyAudiences',
  ],
  4: [
    'propertySizeSqm',
    'budgetBand',
    'unfinishedBudgetPerSqm',
    'unfinishedFinancingPreference',
    'furnishingBudgetBand',
    'furnishingPaymentPreference',
  ],
  5: ['photoUpload', 'furnishedPhotoChecklist'],
  6: ['mode', 'hassleLevel'],
  7: [
    'hasPropertyManagerOrCompany',
    'hasDedicatedCleaningTeam',
    'guestAccessSolution',
    'furnishedAreas',
    'operationalPainIds',
  ],
  8: [
    'listingStack',
    'cleaningSupport',
    'guestResponseTime',
    'monthlyRevenueEgp',
    'occupancyBand',
    'pricingStrategy',
  ],
};

export function firstWizardErrorFieldKey(step: number, errors: Record<string, string>): string | null {
  const order = WIZARD_ERROR_SCROLL_ORDER[step];
  if (!order) return Object.keys(errors)[0] ?? null;
  for (const key of order) {
    if (errors[key]) return key;
  }
  return Object.keys(errors)[0] ?? null;
}
