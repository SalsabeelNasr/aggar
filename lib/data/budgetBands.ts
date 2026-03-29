export type BudgetBand = 'under_50k' | '50_150k' | '150_400k' | 'over_400k';

export const BUDGET_BAND_RANGES: Record<BudgetBand, { min: number; max: number }> = {
  under_50k: { min: 0, max: 50_000 },
  '50_150k': { min: 50_000, max: 150_000 },
  '150_400k': { min: 150_000, max: 400_000 },
  over_400k: { min: 400_000, max: Infinity },
};

export const BUDGET_BAND_OPTIONS: Array<{ id: BudgetBand; en: string; ar: string }> = [
  { id: 'under_50k', en: 'Under 50,000 EGP', ar: 'أقل من 50,000 ج.م' },
  { id: '50_150k', en: '50,000 – 150,000 EGP', ar: '50,000 – 150,000 ج.م' },
  { id: '150_400k', en: '150,000 – 400,000 EGP', ar: '150,000 – 400,000 ج.م' },
  { id: 'over_400k', en: 'Over 400,000 EGP', ar: 'أكثر من 400,000 ج.م' },
];
