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
    id: 'FURNISHED_RENO',
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
      updateData({ stateFlag: 'FURNISHED_RENO' });
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
          'flex flex-col gap-4 mb-10 rounded-xl p-1 -m-1',
          stateErr.invalid && 'ring-2 ring-red-500 ring-offset-2'
        )}
      >
        {availableStates.map((state) => {
          const isSelected = selectedState === state.id;
          return (
            <button
              key={state.id}
              onClick={() => updateData({ stateFlag: state.id })}
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none text-start',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div className={cn("p-3 rounded-lg mr-4 ml-4", isSelected ? "bg-primary-600 text-white" : "bg-secondary-100 text-secondary-600")}>
                <state.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={cn("font-heading font-bold text-lg", isSelected ? "text-primary-900" : "text-secondary-900")}>
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
