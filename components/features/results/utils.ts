export function formatMoney(n: number, locale: string) {
  return n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
}
