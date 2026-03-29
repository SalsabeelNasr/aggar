import { BACKEND_PATH_EVALUATIONS, BACKEND_PATH_REGIONS } from './constants';

export function getEvalBackendBaseUrl(): string | null {
  const u = process.env.EVAL_BACKEND_BASE_URL?.trim();
  if (!u) return null;
  return u.replace(/\/$/, '');
}

export async function proxySubmitEvaluation(body: unknown): Promise<Response> {
  const base = getEvalBackendBaseUrl();
  if (!base) throw new Error('EVAL_BACKEND_BASE_URL is not set');
  return fetch(`${base}${BACKEND_PATH_EVALUATIONS}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function proxyFetchReport(id: string): Promise<Response> {
  const base = getEvalBackendBaseUrl();
  if (!base) throw new Error('EVAL_BACKEND_BASE_URL is not set');
  return fetch(`${base}${BACKEND_PATH_EVALUATIONS}/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
}

export async function proxyListRegions(): Promise<Response> {
  const base = getEvalBackendBaseUrl();
  if (!base) throw new Error('EVAL_BACKEND_BASE_URL is not set');
  return fetch(`${base}${BACKEND_PATH_REGIONS}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
}
