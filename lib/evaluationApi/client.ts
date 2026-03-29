import type { WizardData } from '@/models';
import type { Region } from '@/models';
import type { EvaluateSubmitResponse } from '@/lib/evaluation/apiContracts';
import type { EvaluationReport } from '@/lib/evaluation/types';
import { parseEvaluationReportPayload } from '@/lib/evaluation/reportSchema';

export async function submitEvaluation(payload: WizardData): Promise<EvaluateSubmitResponse> {
  const res = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Evaluate failed');
  const json = (await res.json()) as { report?: unknown; reportId?: string; error?: string };
  if (json.error || json.report == null) throw new Error('Evaluate failed');
  const report = parseEvaluationReportPayload(json.report);
  return { report, reportId: typeof json.reportId === 'string' ? json.reportId : undefined };
}

export async function listRegions(): Promise<Region[]> {
  const res = await fetch('/api/regions', { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error('Regions failed');
  const json = (await res.json()) as { regions?: unknown; error?: string };
  if (json.error != null || !Array.isArray(json.regions)) throw new Error('Regions failed');
  return json.regions as Region[];
}

export async function fetchReportById(id: string): Promise<{ report: EvaluationReport }> {
  const res = await fetch(`/api/evaluate?id=${encodeURIComponent(id)}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Report fetch failed');
  const json = (await res.json()) as { report?: unknown; error?: string };
  if (json.error != null || json.report == null) throw new Error('Report fetch failed');
  const report = parseEvaluationReportPayload(json.report);
  return { report };
}
