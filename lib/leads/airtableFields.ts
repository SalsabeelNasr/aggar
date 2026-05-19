import type { PartnerApplicationValues } from '@/lib/validations/partner';
import type { WizardData, WizardLead } from '@/models';

const PARTNER_SERVICE_LABELS: Record<PartnerApplicationValues['primaryService'], string> = {
  ren: 'Renovation & Contracting',
  sty: 'Interior Styling & Furnishing',
  pho: 'Property Photography',
  cle: 'Cleaning',
  man: 'Property Management',
  oth: 'Other',
};

export function partnerFields(locale: 'en' | 'ar', partner: PartnerApplicationValues): Record<string, unknown> {
  return {
    'Company Name': partner.companyName.trim(),
    'Primary Service': PARTNER_SERVICE_LABELS[partner.primaryService] ?? partner.primaryService,
    'Operating Zones': partner.operatingZones.trim(),
    'Portfolio URL': partner.portfolioUrl.trim(),
    Phone: partner.phone.trim(),
    Email: partner.email.trim(),
    Locale: locale,
    'Submitted At': new Date().toISOString(),
  };
}

function wizardSummary(data: WizardData): string {
  const summary = {
    regionId: data.regionId,
    address: data.address,
    listingStatus: data.listingStatus,
    propertyType: data.propertyType,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    sleepCapacity: data.sleepCapacity,
    stateFlag: data.stateFlag,
    mode: data.mode,
    budgetBand: data.budgetBand,
    propertySizeSqm: data.propertySizeSqm,
    hassleLevel: data.hassleLevel,
  };
  return JSON.stringify(summary);
}

export function evaluationLeadFields(
  locale: 'en' | 'ar',
  lead: WizardLead,
  wizard: WizardData,
  reportId?: string | null
): Record<string, unknown> {
  return {
    Source: 'evaluation',
    'Full Name': lead.fullName.trim(),
    Email: lead.email.trim(),
    Phone: lead.whatsapp.trim(),
    'Preferred Contact Time': lead.preferredContactTime,
    'Consent Partner Network': lead.consentToPartnerNetwork,
    Locale: locale,
    'Report ID': reportId ?? '',
    'Region ID': wizard.regionId ?? '',
    'Listing Status': wizard.listingStatus ?? '',
    'Property Type': wizard.propertyType ?? '',
    'State Flag': wizard.stateFlag ?? '',
    Mode: wizard.mode ?? '',
    'Wizard Summary': wizardSummary(wizard),
    'Submitted At': lead.submittedAtISO ?? new Date().toISOString(),
  };
}

export function diyGuideLeadFields(
  locale: 'en' | 'ar',
  input: { fullName: string; email: string; phone: string }
): Record<string, unknown> {
  return {
    Source: 'diy_guide',
    'Full Name': input.fullName.trim(),
    Email: input.email.trim(),
    Phone: input.phone.trim(),
    Locale: locale,
    'Wizard Summary': '',
    'Submitted At': new Date().toISOString(),
  };
}
