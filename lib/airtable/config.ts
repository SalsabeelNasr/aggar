export type AirtableConfig = {
  token: string;
  baseId: string;
  partnersTable: string;
  leadsTable: string;
};

const DEFAULT_PARTNERS_TABLE = 'Partner Applications';
const DEFAULT_LEADS_TABLE = 'Evaluation Leads';

export function getAirtableConfig(): AirtableConfig | null {
  const token = process.env.AIRTABLE_PAT?.trim() || process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  if (!token || !baseId) return null;

  return {
    token,
    baseId,
    partnersTable: process.env.AIRTABLE_PARTNERS_TABLE?.trim() || DEFAULT_PARTNERS_TABLE,
    leadsTable: process.env.AIRTABLE_LEADS_TABLE?.trim() || DEFAULT_LEADS_TABLE,
  };
}

export function isAirtableConfigured(): boolean {
  return getAirtableConfig() !== null;
}
