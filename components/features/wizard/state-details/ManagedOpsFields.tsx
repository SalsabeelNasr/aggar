'use client';

import * as React from 'react';
import { useEvaluationStore } from '@/lib/store';
import type { WizardData } from '@/models';
import { cn } from '@/lib/utils';
import { YesNoSwitchRow } from '@/components/features/wizard/state-details/YesNoSwitch';
import { wizardDetailSurfaceClassName } from '@/components/features/wizard/state-details/wizardDetailUi';

type Props = { isAr: boolean; className?: string };

/** Managed mode: property manager or PMC already in place (parent supplies outer layout when needed). */
export function ManagedPropertyManagerField({ isAr, className }: Props) {
  const { data, updateData } = useEvaluationStore();
  if (data.mode !== 'MANAGED') return null;

  const yes = data.hasPropertyManagerOrCompany === 'yes';

  return (
    <div className={className}>
      <div
        className={cn(
          wizardDetailSurfaceClassName,
          'flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2'
        )}
      >
        <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
          {isAr
            ? 'هل لديك مدير عقار أو شركة إدارة عقارات حاليًا؟'
            : 'Do you already have a property manager or property management company?'}
        </div>
        <div className="shrink-0">
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
    </div>
  );
}

/** Managed mode: dedicated cleaning / housekeeping for turnovers. */
export function ManagedCleaningTeamField({ isAr, className }: Props) {
  const { data, updateData } = useEvaluationStore();
  if (data.mode !== 'MANAGED') return null;

  const yes = data.hasDedicatedCleaningTeam === 'yes';

  return (
    <div className={className}>
      <div
        className={cn(
          wizardDetailSurfaceClassName,
          'flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2'
        )}
      >
        <div className="min-w-0 flex-1 text-secondary-900 font-semibold">
          {isAr ? 'هل لديك فريق نظافة لمغادرة الضيوف والتجهيز؟' : 'Do you already have a cleaning team for turnovers?'}
        </div>
        <div className="shrink-0">
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
    </div>
  );
}
