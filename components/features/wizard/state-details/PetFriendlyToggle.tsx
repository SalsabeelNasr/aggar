'use client';

import * as React from 'react';
import { useEvaluationStore } from '@/lib/store';
import { YesNoToggleField } from '@/components/features/wizard/state-details/YesNoSwitch';

type Props = {
  isAr: boolean;
  /** Use inside a parent {@link WizardDetailCard} so the pet row is not a second full card. */
  embedded?: boolean;
};

export function PetFriendlyToggle({ isAr, embedded = false }: Props) {
  const { data, updateData } = useEvaluationStore();
  const yes = data.petFriendly === true;

  return (
    <YesNoToggleField
      isAr={isAr}
      embedded={embedded}
      title={isAr ? 'هل الشقة مسموح فيها بالحيوانات الأليفة؟' : 'Pet-friendly setup?'}
      yesSelected={yes}
      onToggle={() => updateData({ petFriendly: !yes })}
      ariaLabel={isAr ? 'تبديل مناسب للحيوانات الأليفة' : 'Toggle pet-friendly'}
    />
  );
}
