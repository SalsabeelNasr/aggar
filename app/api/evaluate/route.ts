import { NextResponse } from 'next/server';
import type { WizardData } from '@/models';
import { generateReport } from '@/lib/evaluation/generateReport';
import { cacheMockReport, getCachedMockReport } from '@/lib/evaluationApi/reportCache';
import { getEvalBackendBaseUrl, proxyFetchReport, proxySubmitEvaluation } from '@/lib/evaluationApi/backendProxy';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  if (getEvalBackendBaseUrl()) {
    try {
      const upstream = await proxyFetchReport(id);
      const text = await upstream.text();
      return new NextResponse(text, {
        status: upstream.status,
        headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
      });
    } catch {
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }
  }

  const cached = getCachedMockReport(id);
  if (!cached) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json({ report: cached });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    if (body == null || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (getEvalBackendBaseUrl()) {
      try {
        const upstream = await proxySubmitEvaluation(body);
        const text = await upstream.text();
        return new NextResponse(text, {
          status: upstream.status,
          headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
        });
      } catch {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
      }
    }

    const data = body as WizardData;
    const report = generateReport(data);
    const reportId = cacheMockReport(report);
    return NextResponse.json({ report, reportId });
  } catch {
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}
