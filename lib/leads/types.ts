import type { PartnerApplicationValues } from '@/lib/validations/partner';
import type { WizardData, WizardLead } from '@/models';

export type LeadSource = 'evaluation' | 'diy_guide';

export type PartnerLeadPayload = {
  type: 'partner';
  locale: 'en' | 'ar';
  partner: PartnerApplicationValues;
};

export type EvaluationLeadPayload = {
  type: 'evaluation';
  locale: 'en' | 'ar';
  lead: WizardLead;
  wizard: WizardData;
  reportId?: string | null;
};

export type DiyGuideLeadPayload = {
  type: 'diy_guide';
  locale: 'en' | 'ar';
  fullName: string;
  email: string;
  phone: string;
};

export type LeadSubmitPayload = PartnerLeadPayload | EvaluationLeadPayload | DiyGuideLeadPayload;
