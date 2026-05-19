import { createAirtableRecord } from '@/lib/airtable/client';
import { getAirtableConfig } from '@/lib/airtable/config';
import {
  diyGuideLeadFields,
  evaluationLeadFields,
  partnerFields,
} from '@/lib/leads/airtableFields';
import type { LeadSubmitPayload } from '@/lib/leads/types';
import type { WizardData } from '@/models';

export type LeadSubmitResult =
  | { ok: true; recordId: string }
  | { ok: false; skipped: true }
  | { ok: false; skipped: false; error: string };

export async function submitLeadToAirtable(payload: LeadSubmitPayload): Promise<LeadSubmitResult> {
  const config = getAirtableConfig();
  if (!config) {
    return { ok: false, skipped: true };
  }

  try {
    if (payload.type === 'partner') {
      const result = await createAirtableRecord(
        config,
        config.partnersTable,
        partnerFields(payload.locale, payload.partner)
      );
      return { ok: true, recordId: result.id };
    }

    const fields =
      payload.type === 'evaluation'
        ? evaluationLeadFields(payload.locale, payload.lead, payload.wizard as WizardData, payload.reportId)
        : diyGuideLeadFields(payload.locale, payload);

    const result = await createAirtableRecord(config, config.leadsTable, fields);
    return { ok: true, recordId: result.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Airtable error';
    return { ok: false, skipped: false, error: message };
  }
}
