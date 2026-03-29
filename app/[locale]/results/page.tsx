'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { useRouter } from '@/lib/navigation';
import FullResultsContent from '@/components/features/results/FullResultsContent';
import { ReportLoadingStatus } from '@/components/ui/ReportLoadingStatus';
import { fetchReportById } from '@/lib/evaluationApi/client';

export default function ResultsPage() {
  const locale = useLocale();
  const router = useRouter();
  const resultsAccess = useEvaluationStore((s) => s.resultsAccess);
  const report = useEvaluationStore((s) => s.report);
  const reportId = useEvaluationStore((s) => s.reportId);
  const setReport = useEvaluationStore((s) => s.setReport);

  const [storeHydrated, setStoreHydrated] = React.useState(false);
  const [fetchingReportSnapshot, setFetchingReportSnapshot] = React.useState(false);

  React.useEffect(() => {
    // Fallback: avoid indefinite loading if hydration callbacks don't fire (Safari/private mode edge-cases).
    const t = window.setTimeout(() => setStoreHydrated(true), 1500);
    if (useEvaluationStore.persist.hasHydrated()) {
      setStoreHydrated(true);
      window.clearTimeout(t);
      return () => window.clearTimeout(t);
    }
    const unsub = useEvaluationStore.persist.onFinishHydration(() => setStoreHydrated(true));
    return () => {
      window.clearTimeout(t);
      unsub();
    };
  }, []);

  React.useEffect(() => {
    if (!storeHydrated || resultsAccess !== 'full' || report || !reportId) return;
    let cancelled = false;
    setFetchingReportSnapshot(true);
    fetchReportById(reportId)
      .then(({ report: r }) => {
        if (!cancelled) setReport(r);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFetchingReportSnapshot(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storeHydrated, resultsAccess, report, reportId, setReport]);

  if (!storeHydrated || resultsAccess !== 'full' || !report || fetchingReportSnapshot) {
    return (
      <div
        className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-6 px-4 py-16"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <ReportLoadingStatus locale={locale === 'ar' ? 'ar' : 'en'} />
        {(resultsAccess !== 'full' || !report) && (
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
