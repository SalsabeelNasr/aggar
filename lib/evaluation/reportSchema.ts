import { z } from 'zod';
import type { EvaluationReport } from './types';

const evaluationReportCore = z.object({
  version: z.literal(2),
});

/**
 * Minimal runtime gate for API responses; extra fields are accepted via cast.
 * Tighten fields incrementally as the backend contract stabilizes.
 */
export function parseEvaluationReportPayload(input: unknown): EvaluationReport {
  const r = evaluationReportCore.safeParse(input);
  if (!r.success) {
    throw new Error('Invalid evaluation report: expected version 2');
  }
  return input as EvaluationReport;
}
