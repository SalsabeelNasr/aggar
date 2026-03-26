'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { BudgetBand } from '@/lib/data/budgetBands';
import { BUDGET_BAND_OPTIONS } from '@/lib/data/budgetBands';
import { cn } from '@/lib/utils';
import { Wallet, Ruler } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

export function StepBudgetSize() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const budgetErr = useWizardFieldError('budgetBand');
  const sqmErr = useWizardFieldError('propertySizeSqm');

  const isAr = locale === 'ar';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['budgetBand', 'propertySizeSqm']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'الميزانية والمساحة' : 'Budget & Property Size'}
        </h2>
        <p className="text-secondary-600 mt-2">
          {isAr
            ? 'ساعدنا نفهم ميزانيتك ومساحة العقار عشان نقدر نقترح الخطة المناسبة.'
            : "Help us understand your budget and property size so we can recommend the right plan."}
        </p>
      </div>

      {/* Budget band selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary-600" />
          <h3 className="font-heading font-bold text-lg text-secondary-900">
            {isAr ? 'ما هي ميزانيتك للاستثمار؟' : 'What is your investment budget?'}
          </h3>
        </div>
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl p-1 -m-1',
            budgetErr.invalid && 'ring-2 ring-red-500 ring-offset-2'
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
      </div>

      {/* Property size input */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-primary-600" />
          <h3 className="font-heading font-bold text-lg text-secondary-900">
            {isAr ? 'مساحة العقار (متر مربع)' : 'Property size (sqm)'}
          </h3>
        </div>
        <div className={cn('rounded-xl p-1 -m-1', sqmErr.invalid && 'ring-2 ring-red-500 ring-offset-2')}>
          <input
            type="number"
            min={10}
            max={2000}
            value={data.propertySizeSqm ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : Number(e.target.value);
              updateData({ propertySizeSqm: val });
            }}
            placeholder={isAr ? 'مثال: ١٢٠' : 'e.g. 120'}
            className={cn(
              'w-full p-4 rounded-xl border-2 text-lg font-heading focus:outline-none focus:ring-4 ring-primary-500/30 transition-all',
              sqmErr.invalid ? 'border-red-500' : 'border-secondary-200 focus:border-primary-600'
            )}
          />
        </div>
        <p className="text-secondary-500 text-sm mt-2">
          {isAr ? 'المساحة تساعدنا نحسب تكلفة التشطيب بدقة أكبر.' : 'Size helps us estimate renovation costs more accurately.'}
        </p>
      </div>
    </div>
  );
}
