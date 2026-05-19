import type { AirtableConfig } from './config';
import { getAirtableConfig } from './config';

const AIRTABLE_API = 'https://api.airtable.com/v0';

export class AirtableApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: string
  ) {
    super(message);
    this.name = 'AirtableApiError';
  }
}

export async function createAirtableRecord(
  config: AirtableConfig,
  tableName: string,
  fields: Record<string, unknown>
): Promise<{ id: string }> {
  const tablePath = encodeURIComponent(tableName);
  const res = await fetch(`${AIRTABLE_API}/${config.baseId}/${tablePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new AirtableApiError(`Airtable create failed (${res.status})`, res.status, text);
  }

  const parsed = JSON.parse(text) as { id?: string };
  if (!parsed.id) {
    throw new AirtableApiError('Airtable response missing record id', res.status, text);
  }
  return { id: parsed.id };
}

export async function createRecordInConfiguredTable(
  tableName: string,
  fields: Record<string, unknown>
): Promise<{ id: string } | null> {
  const config = getAirtableConfig();
  if (!config) return null;
  return createAirtableRecord(config, tableName, fields);
}
