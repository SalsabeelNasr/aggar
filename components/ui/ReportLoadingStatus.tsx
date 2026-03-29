'use client';

import { Loader2 } from 'lucide-react';

export type ReportLoadingLocale = 'ar' | 'en';

type Props = {
  locale: ReportLoadingLocale;
};

/** Spinner + copy shared by results (hydration) and evaluate (pre-navigation generation). */
export function ReportLoadingStatus({ locale }: Props) {
  const isAr = locale === 'ar';
  return (
    <div className="flex flex-col items-center gap-6">
      <Loader2 className="h-12 w-12 text-primary-600 animate-spin shrink-0" aria-hidden />
      <div className="text-center space-y-2 max-w-sm">
        <p className="font-heading font-bold text-lg text-secondary-900">
          {isAr ? 'جاري تحميل التقرير…' : 'Loading your report…'}
        </p>
        <p className="text-sm text-secondary-600">
          {isAr ? 'يرجى الانتظار لحظة.' : 'This will only take a moment.'}
        </p>
      </div>
    </div>
  );
}
