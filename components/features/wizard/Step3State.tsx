'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { PropertyStateFlag } from '@/models';
import { cn } from '@/lib/utils';
import { Hammer, PaintRoller, Sofa } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

const states: { id: PropertyStateFlag; icon: any; ar: string; en: string }[] = [
  {
    id: 'SHELL',
    icon: Hammer,
    ar: 'خرسانة أو طوب فقط، دون أي تشطيب.',
    en: 'Concrete or brick shell only, no finishes.',
  },
  {
    id: 'FINISHED_EMPTY',
    icon: PaintRoller,
    ar: 'مكتملة التشطيب وغير مفروشة.',
    en: 'Fully finished and unfurnished.',
  },
  {
    id: 'FURNISHED',
    icon: Sofa,
    ar: 'مفروشة، جاهزة للسكن أو لتحسينات بسيطة.',
    en: 'Furnished, ready to move in or needs light updates.',
  },
];

export function Step3State() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const stateErr = useWizardFieldError('stateFlag');
  const availableStates = states;

  const selectedState = data.stateFlag;

  const allowedIds = React.useMemo(() => new Set(availableStates.map((s) => s.id)), [availableStates]);

  React.useEffect(() => {
    if (selectedState == null) return;
    if (!allowedIds.has(selectedState)) {
      updateData({ stateFlag: 'FURNISHED' });
    }
  }, [allowedIds, selectedState, updateData]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['stateFlag']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {locale === 'ar' ? 'ما هي حالة العقار الحالية؟' : 'What is the current state?'}
        </h2>
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 mb-10',
          stateErr.invalid && 'ring-2 ring-red-500 ring-offset-2 rounded-2xl p-1 -m-1'
        )}
      >
        {availableStates.map((state) => {
          const isSelected = selectedState === state.id;
          return (
            <button
              key={state.id}
              onClick={() => updateData({ stateFlag: state.id })}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border-2 transition-colors focus:outline-none text-start cursor-pointer w-full',
                isSelected 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-secondary-200 bg-white hover:border-primary-300'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  isSelected ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                )}
              >
                <state.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-medium text-base text-secondary-900">
                  {locale === 'ar' ? state.ar : state.en}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
