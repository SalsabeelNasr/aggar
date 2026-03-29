import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { PropertyAnalysisItem } from '@/lib/evaluation/types';

type Props = {
  lo: 'en' | 'ar';
  items: PropertyAnalysisItem[];
};

export function PropertyAnalysisCard({ lo, items }: Props) {
  const isAr = lo === 'ar';

  return (
    <Card className="w-full border-primary-200 bg-primary-50/50 shadow-xs">
      <CardHeader className="p-4 pb-1.5 pt-3">
        <CardTitle className="font-heading text-base font-semibold text-secondary-900">
          {isAr ? 'تحليل العقار' : 'Your property analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0 text-sm text-secondary-800">
        <div className="border-t border-secondary-200/80 pt-3" />
        <ul className="mt-2 list-none space-y-3 ps-0">
          {items.map((item, idx) => {
            const title = item.title?.[lo];
            const body = item.body[lo];
            return (
              <li key={idx} className="border-b border-secondary-200/60 pb-3 last:border-b-0 last:pb-0">
                {title ? (
                  <>
                    <span className="font-heading font-semibold text-secondary-900">{title}: </span>
                    <span className="text-secondary-800">{body}</span>
                  </>
                ) : (
                  <span className="text-secondary-800">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs leading-snug text-secondary-500">
          {isAr
            ? 'الأرقام والنِّسَب أعلاه تقديرية لأغراض التوجيه وليست ضماناً.'
            : 'Percentages and figures above are directional estimates for guidance, not guarantees.'}
        </p>
      </CardContent>
    </Card>
  );
}
