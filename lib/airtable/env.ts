/**
 * Read server env at runtime (bracket access avoids Next.js inlining
 * undefined at build time when secrets are only set on the host).
 */
export function readServerEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
