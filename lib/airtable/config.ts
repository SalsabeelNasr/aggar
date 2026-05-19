import { readServerEnv } from '@/lib/airtable/env';

export type AirtableConfig = {
  token: string;
  baseId: string;
  partnersTable: string;
  leadsTable: string;
};

const DEFAULT_PARTNERS_TABLE = 'Partner Applications';
const DEFAULT_LEADS_TABLE = 'Evaluation Leads';

export function getAirtableConfig(): AirtableConfig | null {
  const token = readServerEnv('AIRTABLE_PAT') ?? readServerEnv('AIRTABLE_TOKEN');
  const baseId = readServerEnv('AIRTABLE_BASE_ID');
  if (!token || !baseId) return null;

  return {
    token,
    baseId,
    partnersTable: readServerEnv('AIRTABLE_PARTNERS_TABLE') ?? DEFAULT_PARTNERS_TABLE,
    leadsTable: readServerEnv('AIRTABLE_LEADS_TABLE') ?? DEFAULT_LEADS_TABLE,
  };
}

export function isAirtableConfigured(): boolean {
  return getAirtableConfig() !== null;
}
