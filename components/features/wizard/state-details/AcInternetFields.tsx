'use client';

import * as React from 'react';
import type { ACCoverage, InternetSpeed } from '@/models';
import { wizardDetailSelectClassName } from '@/components/features/wizard/state-details/wizardDetailUi';

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <div className="font-heading font-bold text-secondary-900 mb-3">
          {isAr ? 'حالة التكييف' : 'Air conditioning coverage'}
        </div>
        <select
          className={wizardDetailSelectClassName}
          value={ac}
          onChange={(e) => onAcChange(e.target.value as ACCoverage)}
        >
          <option value="none_or_broken">{isAr ? 'لا يوجد / معطل' : 'None or broken'}</option>
          <option value="one_old_unit">{isAr ? 'وحدة واحدة قديمة' : '1 old unit'}</option>
          <option value="adequate_functional">{isAr ? 'تغطية كافية' : 'Adequate, functional'}</option>
          <option value="efficient_full_coverage">{isAr ? 'تغطية كاملة وكفاءة عالية' : 'Efficient, full coverage'}</option>
        </select>
      </div>
      <div>
        <div className="font-heading font-bold text-secondary-900 mb-3">
          {isAr ? 'سرعة الإنترنت' : 'Internet speed'}
        </div>
        <select
          className={wizardDetailSelectClassName}
          value={net}
          onChange={(e) => onInternetChange(e.target.value as InternetSpeed)}
        >
          <option value="none_or_adsl">{isAr ? 'لا يوجد / ADSL' : 'None / ADSL'}</option>
          <option value="basic_under_50">{isAr ? 'أقل من 50 Mbps' : 'Under 50 Mbps'}</option>
          <option value="fiber_100_plus">{isAr ? 'Fiber 100+ Mbps' : 'Fiber 100+ Mbps'}</option>
          <option value="mesh_200_plus">{isAr ? '200+ Mbps مع Mesh' : '200+ Mbps + mesh'}</option>
        </select>
      </div>
    </div>
  );
}
