import type { EvaluationReport } from './types';

export interface EvaluateSubmitResponse {
  report: EvaluationReport;
  /** Present when the server can reload the report (mock cache or real backend id). */
  reportId?: string;
}

export interface EvaluateErrorResponse {
  error: string;
}
