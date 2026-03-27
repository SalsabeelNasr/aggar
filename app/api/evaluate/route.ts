import { NextResponse } from 'next/server';
import type { WizardData } from '@/models';
import { generateReport } from '@/lib/evaluation/generateReport';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    if (body == null || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const data = body as WizardData;
    const report = generateReport(data);
    return NextResponse.json({ report });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}

