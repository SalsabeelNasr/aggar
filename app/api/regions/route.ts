import { NextResponse } from 'next/server';
import { listRegionsMock } from '@/lib/mocks/regions';
import { getEvalBackendBaseUrl, proxyListRegions } from '@/lib/evaluationApi/backendProxy';

export async function GET() {
  if (getEvalBackendBaseUrl()) {
    try {
      const upstream = await proxyListRegions();
      const text = await upstream.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: 'Invalid upstream JSON' }, { status: 502 });
      }
      if (!upstream.ok) {
        return NextResponse.json(
          parsed && typeof parsed === 'object' && parsed !== null ? parsed : { error: 'Upstream error' },
          { status: upstream.status }
        );
      }
      if (Array.isArray(parsed)) {
        return NextResponse.json({ regions: parsed });
      }
      if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as { regions?: unknown }).regions)
      ) {
        return NextResponse.json(parsed);
      }
      return NextResponse.json({ error: 'Unexpected regions shape from upstream' }, { status: 502 });
    } catch {
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }
  }

  const regions = await listRegionsMock();
  return NextResponse.json({ regions });
}
