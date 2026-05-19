import { NextResponse } from 'next/server';
import { parseLeadPayload } from '@/lib/leads/validatePayload';
import { submitLeadToAirtable } from '@/lib/leads/submitLead';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const payload = parseLeadPayload(body);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const result = await submitLeadToAirtable(payload);

    if (result.ok) {
      return NextResponse.json({ ok: true, recordId: result.recordId });
    }

    if (result.skipped) {
      const isProd = process.env.NODE_ENV === 'production' || process.env.CONTEXT === 'production';
      if (isProd) {
        console.error('[api/leads] Airtable not configured: set AIRTABLE_PAT in Netlify environment variables');
        return NextResponse.json(
          { error: 'Lead storage is not configured on the server' },
          { status: 503 }
        );
      }
      return NextResponse.json({ ok: true, skipped: true });
    }

    console.error('[api/leads] Airtable error:', result.error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 502 });
  } catch (err) {
    console.error('[api/leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
