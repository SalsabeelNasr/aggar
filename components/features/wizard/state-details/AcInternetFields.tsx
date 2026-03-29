'use client';

import * as React from 'react';
import type { ACCoverage, InternetSpeed } from '@/models';
import { cn } from '@/lib/utils';
import { wizardDetailSelectClassName } from '@/components/features/wizard/state-details/wizardDetailUi';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

type Props = {
  isAr: boolean;
  acCoverage: ACCoverage | undefined;
  internetSpeed: InternetSpeed | undefined;
  onAcChange: (v: ACCoverage) => void;
  onInternetChange: (v: InternetSpeed) => void;
};

/** Paired AC + internet selects (one row on sm+). */
export function AcInternetFields({
  isAr,
  acCoverage,
  internetSpeed,
  onAcChange,
  onInternetChange,
}: Props) {
  const ac = acCoverage ?? 'adequate_functional';
  const net = internetSpeed ?? 'fiber_100_plus';
  const acFieldErr = useWizardFieldError('acCoverage');
  const netFieldErr = useWizardFieldError('internetSpeed');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <div className="font-heading font-bold text-secondary-900 mb-3">
          {isAr ? 'حالة التكييف' : 'Air conditioning coverage'}
        </div>
        <select
          data-wizard-field="acCoverage"
          className={cn(
            wizardDetailSelectClassName,
            acFieldErr.invalid && 'border-red-500 border-2'
          )}
          aria-invalid={acFieldErr.invalid || undefined}
          value={ac}
          onChange={(e) => onAcChange(e.target.value as ACCoverage)}
        >
          <option value="none_or_broken">{isAr ? 'مفيش / بايظ' : 'None or broken'}</option>
          <option value="one_old_unit">{isAr ? 'تكييف واحد قديم' : '1 old unit'}</option>
          <option value="adequate_functional">{isAr ? 'تغطية كويسة وشغال' : 'Adequate, functional'}</option>
          <option value="efficient_full_coverage">{isAr ? 'تغطية ممتازة وموفر للكهرباء' : 'Efficient, full coverage'}</option>
        </select>
        <WizardInlineFieldError message={acFieldErr.error} />
      </div>
      <div>
        <div className="font-heading font-bold text-secondary-900 mb-3">
          {isAr ? 'سرعة النت' : 'Internet speed'}
        </div>
        <select
          data-wizard-field="internetSpeed"
          className={cn(
            wizardDetailSelectClassName,
            netFieldErr.invalid && 'border-red-500 border-2'
          )}
          aria-invalid={netFieldErr.invalid || undefined}
          value={net}
          onChange={(e) => onInternetChange(e.target.value as InternetSpeed)}
        >
          <option value="none_or_adsl">{isAr ? 'مفيش / ADSL بطيء' : 'None / ADSL'}</option>
          <option value="basic_under_50">{isAr ? 'أقل من 50 ميجا' : 'Under 50 Mbps'}</option>
          <option value="fiber_100_plus">{isAr ? 'فايبر 100 ميجا أو أكتر' : 'Fiber 100+ Mbps'}</option>
          <option value="mesh_200_plus">{isAr ? 'سرعة عالية جداً مع Mesh' : '200+ Mbps + mesh'}</option>
        </select>
        <WizardInlineFieldError message={netFieldErr.error} />
      </div>
    </div>
  );
}
