'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { GuestAccessReliabilityChoice } from '@/components/features/wizard/state-details/GuestAccessReliabilityChoice';
import {
  ManagedCleaningTeamField,
  ManagedPropertyManagerField,
} from '@/components/features/wizard/state-details/ManagedOpsFields';

/** Access & compliance block (former Step6 content), embedded in Details step. */
export function AccessComplianceCard() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const { data } = useEvaluationStore();

  if (data.mode === 'MANAGED') {
    return (
      <>
        <ManagedPropertyManagerField isAr={isAr} className="mb-10" />
        <ManagedCleaningTeamField isAr={isAr} className="mb-10" />
        <GuestAccessReliabilityChoice isAr={isAr} className="mb-10" />
      </>
    );
  }

  return <GuestAccessReliabilityChoice isAr={isAr} className="mb-10" />;
}
