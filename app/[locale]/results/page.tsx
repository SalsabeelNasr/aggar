'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { useRouter } from '@/lib/navigation';
import { Loader2 } from 'lucide-react';
import FullResultsContent from '@/components/features/results/FullResultsContent';

export default function ResultsPage() {
  const locale = useLocale();
  const router = useRouter();
  const resultsAccess = useEvaluationStore((s) => s.resultsAccess);

  const [storeHydrated, setStoreHydrated] = React.useState(false);

  React.useEffect(() => {
    if (useEvaluationStore.persist.hasHydrated()) {
      setStoreHydrated(true);
      return;
    }
    const unsub = useEvaluationStore.persist.onFinishHydration(() => setStoreHydrated(true));
    return unsub;
  }, []);

  if (!storeHydrated || resultsAccess !== 'full') {
    return (
      <div
        className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-6 px-4 py-16"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin shrink-0" aria-hidden />
        <div className="text-center space-y-2 max-w-sm">
          <p className="font-heading font-bold text-lg text-secondary-900">
            {locale === 'ar' ? 'جاري تحميل التقرير…' : 'Loading your report…'}
          </p>
          <p className="text-sm text-secondary-600">
            {locale === 'ar' ? 'يرجى الانتظار لحظة.' : 'This will only take a moment.'}
          </p>
        </div>
        {storeHydrated && resultsAccess !== 'full' && (
          <button
            type="button"
            onClick={() => router.push('/evaluate')}
            className="text-sm font-bold text-primary-700 underline underline-offset-4 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            {locale === 'ar' ? 'لم تكمل التقييم بعد؟ أكمل الخطوات' : 'Haven’t finished? Continue evaluation'}
          </button>
        )}
      </div>
    );
  }

  return <FullResultsContent />;
}
