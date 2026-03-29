'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { BudgetBand } from '@/lib/data/budgetBands';
import { BUDGET_BAND_OPTIONS } from '@/lib/data/budgetBands';
import { cn } from '@/lib/utils';
import { Wallet } from 'lucide-react';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';
import type { FurnishingBudgetBand, FurnishingPaymentPreference, UnfinishedBudgetPerSqm, UnfinishedFinancingPreference } from '@/models';

export function StepBudgetSize() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const budgetErr = useWizardFieldError('budgetBand');
  const unfinishedBudgetErr = useWizardFieldError('unfinishedBudgetPerSqm');
  const unfinishedFinanceErr = useWizardFieldError('unfinishedFinancingPreference');
  const furnishingBudgetErr = useWizardFieldError('furnishingBudgetBand');
  const furnishingPayErr = useWizardFieldError('furnishingPaymentPreference');

  const isAr = locale === 'ar';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'ميزانيتك للاستثمار في حدود كام؟' : 'What is your investment budget?'}
        </h2>
      </div>

      {/* Budget band selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary-600" />
          <h3 className="font-heading font-bold text-lg text-secondary-900">
            {isAr ? 'اختار النطاق المناسب' : 'Choose a budget band'}
          </h3>
        </div>
        <div
          data-wizard-field="budgetBand"
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl p-1',
            budgetErr.invalid && 'border-2 border-red-500'
          )}
        >
          {BUDGET_BAND_OPTIONS.map((opt) => {
            const isSelected = data.budgetBand === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateData({ budgetBand: opt.id as BudgetBand })}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none text-start',
                  isSelected
                    ? 'border-primary-600 bg-primary-50 shadow-sm'
                    : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
                )}
              >
                <span className={cn('font-heading font-bold', isSelected ? 'text-primary-900' : 'text-secondary-900')}>
                  {isAr ? opt.ar : opt.en}
                </span>
              </button>
            );
          })}
        </div>
        <WizardInlineFieldError message={budgetErr.error} />
      </div>

      {data.stateFlag === 'SHELL' && (
        <div className="space-y-6">
          <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
            <div className="font-heading font-bold text-secondary-900 mb-3">
              {isAr ? 'ميزانية التشطيب للمتر' : 'Finishing budget per sqm'}
            </div>
            <div
              data-wizard-field="unfinishedBudgetPerSqm"
              className={cn(
                'flex flex-col gap-2 rounded-xl p-2 -mx-1',
                unfinishedBudgetErr.invalid && 'border-2 border-red-500'
              )}
            >
              {(
                [
                  {
                    id: 'economy' as const,
                    en: 'Economy: 2,500 – 4,000 EGP / sqm',
                    ar: 'اقتصادي: 2,500 – 4,000 ج.م / م²',
                  },
                  {
                    id: 'premium' as const,
                    en: 'Premium: 4,000 – 7,000 EGP / sqm',
                    ar: 'مميز: 4,000 – 7,000 ج.م / م²',
                  },
                  {
                    id: 'luxury_custom' as const,
                    en: 'Luxury / custom: 7,000+ EGP / sqm',
                    ar: 'فاخر/مخصص: 7,000+ ج.م / م²',
                  },
                ] satisfies { id: UnfinishedBudgetPerSqm; en: string; ar: string }[]
              ).map((opt) => {
                const checked = data.unfinishedBudgetPerSqm === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
                      checked ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="unfinishedBudgetPerSqm"
                      className="accent-primary-600"
                      checked={checked}
                      onChange={() => updateData({ unfinishedBudgetPerSqm: opt.id })}
                    />
                    <span className="text-base font-medium text-secondary-900">{isAr ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
            <WizardInlineFieldError message={unfinishedBudgetErr.error} />
          </div>

          <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
            <div className="font-heading font-bold text-secondary-900 mb-3">
              {isAr ? 'بتفضل تمول المشروع إزاي؟' : 'Financing preference'}
            </div>
            <div
              data-wizard-field="unfinishedFinancingPreference"
              className={cn(
                'flex flex-col gap-2 rounded-xl p-2 -mx-1',
                unfinishedFinanceErr.invalid && 'border-2 border-red-500'
              )}
            >
              {(
                [
                  {
                    id: 'lump_sum' as const,
                    en: 'Lump sum (cash discount preferred)',
                    ar: 'كاش (أفضل خصم نقدي)',
                  },
                  {
                    id: 'installment_12_24' as const,
                    en: 'Installment plan (12–24 months, e.g. valU / contact consumer finance)',
                    ar: 'تقسيط (12–24 شهر، زي valU أو Contact)',
                  },
                  {
                    id: 'bank_loan_3_5y' as const,
                    en: 'Long-term bank loan (3–5 years refurbishment loan)',
                    ar: 'قرض بنكي طويل (3–5 سنوات لتشطيب/تجديد)',
                  },
                ] satisfies { id: UnfinishedFinancingPreference; en: string; ar: string }[]
              ).map((opt) => {
                const checked = data.unfinishedFinancingPreference === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
                      checked ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="unfinishedFinancingPreference"
                      className="accent-primary-600"
                      checked={checked}
                      onChange={() => updateData({ unfinishedFinancingPreference: opt.id })}
                    />
                    <span className="text-base font-medium text-secondary-900">{isAr ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
            <WizardInlineFieldError message={unfinishedFinanceErr.error} />
          </div>
        </div>
      )}

      {data.stateFlag === 'FINISHED_EMPTY' && (
        <div className="space-y-6">
          <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
            <div className="font-heading font-bold text-secondary-900 mb-3">
              {isAr ? 'ميزانية الفرش المتوقعة' : 'Furnishing budget range'}
            </div>
            <div
              data-wizard-field="furnishingBudgetBand"
              className={cn(
                'flex flex-col gap-2 rounded-xl p-2 -mx-1',
                furnishingBudgetErr.invalid && 'border-2 border-red-500'
              )}
            >
              {(
                [
                  { id: 'budget_250_450k' as const, en: 'Budget: EGP 250k – 450k', ar: 'اقتصادي: 250 – 450 ألف ج.م' },
                  { id: 'premium_500_850k' as const, en: 'Premium: EGP 500k – 850k', ar: 'مميز: 500 – 850 ألف ج.م' },
                  { id: 'luxury_1m_plus' as const, en: 'Luxury: EGP 1M+', ar: 'فاخر: مليون ج.م أو أكتر' },
                ] satisfies { id: FurnishingBudgetBand; en: string; ar: string }[]
              ).map((opt) => {
                const checked = data.furnishingBudgetBand === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
                      checked ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="furnishingBudgetBand"
                      className="accent-primary-600"
                      checked={checked}
                      onChange={() => updateData({ furnishingBudgetBand: opt.id })}
                    />
                    <span className="text-base font-medium text-secondary-900">{isAr ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
            <WizardInlineFieldError message={furnishingBudgetErr.error} />
          </div>

          <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm w-full">
            <div className="font-heading font-bold text-secondary-900 mb-3">
              {isAr ? 'بتفضل تدفع أو تمول الفرش إزاي؟' : 'Payment & financing preference'}
            </div>
            <div
              data-wizard-field="furnishingPaymentPreference"
              className={cn(
                'flex flex-col gap-2 rounded-xl p-2 -mx-1',
                furnishingPayErr.invalid && 'border-2 border-red-500'
              )}
            >
              {(
                [
                  { id: 'cash_package_discount' as const, en: 'Cash (package discount)', ar: 'كاش (عشان تاخد خصم الباقة)' },
                  { id: 'short_installments_card_6_12' as const, en: 'Short installments (6–12 months, card)', ar: 'تقسيط قصير (6–12 شهر - بطاقة)' },
                  { id: 'long_finance_valu_contact_halan' as const, en: 'Long-term financing (24–60 mo. via valU / Contact / Halan)', ar: 'تمويل طويل (24–60 شهر - valU / Contact)' },
                  { id: 'revenue_share_management' as const, en: 'Revenue share (furnishing for mgmt %)', ar: 'مشاركة أرباح (فرش مقابل نسبة من الإيراد)' },
                ] satisfies { id: FurnishingPaymentPreference; en: string; ar: string }[]
              ).map((opt) => {
                const checked = data.furnishingPaymentPreference === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
                      checked ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="furnishingPaymentPreference"
                      className="accent-primary-600"
                      checked={checked}
                      onChange={() => updateData({ furnishingPaymentPreference: opt.id })}
                    />
                    <span className="text-base font-medium text-secondary-900">{isAr ? opt.ar : opt.en}</span>
                  </label>
                );
              })}
            </div>
            <WizardInlineFieldError message={furnishingPayErr.error} />
          </div>
        </div>
      )}
    </div>
  );
}
