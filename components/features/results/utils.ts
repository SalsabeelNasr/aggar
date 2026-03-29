const moneyFmt = (locale: string) =>
  new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', { numberingSystem: 'latn' });

export function formatMoney(n: number, locale: string) {
  return moneyFmt(locale).format(n);
}
