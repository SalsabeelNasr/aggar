import type { LocalizedString } from '@/models';

export function toLocalizedString(en: string, ar: string): LocalizedString {
  return { en, ar };
}

/**
 * Resolve a dot-notation path against an object.
 * e.g. resolveFieldPath(data, 'regulatory.inGatedCompound') → data.regulatory?.inGatedCompound
 */
export function resolveFieldPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc != null && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
