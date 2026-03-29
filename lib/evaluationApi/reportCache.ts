import type { EvaluationReport } from '@/lib/evaluation/types';

const globalKey = '__aggarEvaluationReportCache';

function getCache(): Map<string, EvaluationReport> {
  const g = globalThis as typeof globalThis & { [globalKey]?: Map<string, EvaluationReport> };
  if (!g[globalKey]) g[globalKey] = new Map();
  return g[globalKey];
}

/** In-memory mock store for GET-by-id (dev / serverless instance–local only). */
export function cacheMockReport(report: EvaluationReport): string {
  const id = crypto.randomUUID();
  getCache().set(id, report);
  return id;
}

export function getCachedMockReport(id: string): EvaluationReport | undefined {
  return getCache().get(id);
}
