import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ManagementMode } from '@/models';

type Props = {
  lo: 'en' | 'ar';
  bullets: Array<{ en: string; ar: string }>;
};

export function PropertyAnalysisCard({
  lo,
  bullets,
}: Props) {
  return (
    <Card className="w-full border-primary-200 bg-primary-50/50 shadow-xs">
      <CardHeader className="p-4 pb-1.5 pt-3">
        <CardTitle className="font-heading text-base font-semibold text-secondary-900">
          {lo === 'ar' ? 'تحليل العقار' : 'Your property analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0 text-sm text-secondary-800">
        <div className="border-t border-secondary-200/80 pt-3" />
        <ul className="mt-2 list-disc space-y-1 ps-5">
          {bullets.map((b, idx) => (
            <li key={idx}>{b[lo]}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

