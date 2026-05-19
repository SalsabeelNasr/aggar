import type { LeadSubmitPayload } from '@/lib/leads/types';

export type LeadSubmitResponse = {
  ok: boolean;
  recordId?: string;
  skipped?: boolean;
};

export type LeadSubmitErrorResponse = {
  error: string;
};

/** Persist a lead to Airtable via the server. No-op when Airtable env is not configured. */
export async function submitLead(payload: LeadSubmitPayload): Promise<LeadSubmitResponse> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as LeadSubmitResponse | LeadSubmitErrorResponse;

  if (!res.ok) {
    const err = 'error' in data ? data.error : 'Failed to save lead';
    throw new Error(err);
  }

  return data as LeadSubmitResponse;
}

/** Fire-and-forget: never blocks UX on lead save failures. */
export function submitLeadQuietly(payload: LeadSubmitPayload): void {
  void submitLead(payload).catch(() => {
    /* logged server-side; optional client telemetry later */
  });
}
