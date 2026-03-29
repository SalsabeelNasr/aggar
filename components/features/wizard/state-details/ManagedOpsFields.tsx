'use client';

import * as React from 'react';
import { useEvaluationStore } from '@/lib/store';
import type { WizardData } from '@/models';
import { cn } from '@/lib/utils';
import { YesNoSwitchRow } from '@/components/features/wizard/state-details/YesNoSwitch';
import { wizardDetailSurfaceClassName } from '@/components/features/wizard/state-details/wizardDetailUi';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

type Props = { isAr: boolean; className?: string };

/** Managed mode: property manager or PMC already in place (parent supplies outer layout when needed). */
export function ManagedPropertyManagerField({ isAr, className }: Props) {
  const { data, updateData } = useEvaluationStore();
  const fieldErr = useWizardFieldError('hasPropertyManagerOrCompany');
  if (data.mode !== 'MANAGED') return null;

  const yes = data.hasPropertyManagerOrCompany === 'yes';

  return (
    <div className={className}>
      <div className={cn(wizardDetailSurfaceClassName, 'flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2')}>
        <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
          {isAr
            ? 'هل عندك مدير عقار أو شركة إدارة حالياً؟'
            : 'Do you already have a property manager or property management company?'}
        </div>
        <div
          data-wizard-field="hasPropertyManagerOrCompany"
          className={cn('shrink-0 rounded-xl p-1', fieldErr.invalid && 'border-2 border-red-500')}
        >
          <YesNoSwitchRow
            isAr={isAr}
            yesSelected={yes}
            onToggle={() =>
              updateData({
                hasPropertyManagerOrCompany: (yes ? 'no' : 'yes') as WizardData['hasPropertyManagerOrCompany'],
              })
            }
            ariaLabel={
              isAr ? 'تبديل: مدير عقار أو شركة إدارة' : 'Toggle: property manager or management company'
            }
          />
        </div>
      </div>
      <WizardInlineFieldError message={fieldErr.error} />
    </div>
  );
}

/** Managed mode: dedicated cleaning / housekeeping for turnovers. */
export function ManagedCleaningTeamField({ isAr, className }: Props) {
  const { data, updateData } = useEvaluationStore();
  const fieldErr = useWizardFieldError('hasDedicatedCleaningTeam');
  if (data.mode !== 'MANAGED') return null;

  const yes = data.hasDedicatedCleaningTeam === 'yes';

  return (
    <div className={className}>
      <div className={cn(wizardDetailSurfaceClassName, 'flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2')}>
        <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
          {isAr ? 'هل عندك فريق تنضيف لتجهيز الشقة بين الضيوف؟' : 'Do you already have a cleaning team for turnovers?'}
        </div>
        <div
          data-wizard-field="hasDedicatedCleaningTeam"
          className={cn('shrink-0 rounded-xl p-1', fieldErr.invalid && 'border-2 border-red-500')}
        >
          <YesNoSwitchRow
            isAr={isAr}
            yesSelected={yes}
            onToggle={() =>
              updateData({
                hasDedicatedCleaningTeam: (yes ? 'no' : 'yes') as WizardData['hasDedicatedCleaningTeam'],
              })
            }
            ariaLabel={isAr ? 'تبديل: فريق نظافة لمغادرة الضيوف' : 'Toggle: cleaning team for turnovers'}
          />
        </div>
      </div>
      <WizardInlineFieldError message={fieldErr.error} />
    </div>
  );
}
