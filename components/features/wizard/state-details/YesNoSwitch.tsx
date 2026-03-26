'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { wizardDetailSurfaceClassName } from '@/components/features/wizard/state-details/wizardDetailUi';

type SwitchRowProps = {
  isAr: boolean;
  /** `true` = Yes selected. */
  yesSelected: boolean;
  onToggle: () => void;
  ariaLabel: string;
};

/** No · pill switch · Yes — same as compound / lift on the property step. */
export function YesNoSwitchRow({ isAr, yesSelected, onToggle, ariaLabel }: SwitchRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-secondary-600">{isAr ? 'لا' : 'No'}</span>
      <button
        type="button"
        role="switch"
        aria-checked={yesSelected}
        aria-label={ariaLabel}
        onClick={onToggle}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 ring-primary-500/30',
          yesSelected ? 'bg-primary-600' : 'bg-secondary-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
            yesSelected ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      <span className="text-sm font-medium text-secondary-600">{isAr ? 'نعم' : 'Yes'}</span>
    </div>
  );
}

type ToggleFieldProps = {
  isAr: boolean;
  title: React.ReactNode;
  yesSelected: boolean;
  onToggle: () => void;
  ariaLabel: string;
  /** When true, sits inside {@link WizardDetailCard}: thin inner row only (no second full surface). */
  embedded?: boolean;
};

/** Title + {@link YesNoSwitchRow} on one line. Standalone uses wizard card surface; embedded uses a light inset row. */
export function YesNoToggleField({
  isAr,
  title,
  yesSelected,
  onToggle,
  ariaLabel,
  embedded = false,
}: ToggleFieldProps) {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2',
        embedded
          ? 'border border-secondary-200 rounded-xl bg-white p-4'
          : wizardDetailSurfaceClassName
      )}
    >
      <div className="min-w-0 flex-1 text-secondary-900 font-semibold">{title}</div>
      <div className="shrink-0">
        <YesNoSwitchRow isAr={isAr} yesSelected={yesSelected} onToggle={onToggle} ariaLabel={ariaLabel} />
      </div>
    </div>
  );
}
