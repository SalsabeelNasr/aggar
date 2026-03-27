import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatMoney } from './utils';

type Props = {
  lo: 'en' | 'ar';
  locale: string;
  regionName: string;
  nightlyRateEgp: number;
  occupancyPct: number;
  typicalMonthlyUsd: number | null;
  top10MonthlyUsd: number | null;
  peakSeasonNote: { en: string; ar: string };
};

export function YourNeighboursPerformanceCard({
  lo,
  locale,
  regionName,
  nightlyRateEgp,
  occupancyPct,
  typicalMonthlyUsd,
  top10MonthlyUsd,
  peakSeasonNote,
}: Props) {
  return (
    <Card className="flex w-full flex-col border border-primary-200/60 bg-gradient-to-br from-white to-primary-50/40 shadow-xs">
      <CardHeader className="p-4 pb-1.5 pt-3">
        <CardTitle className="font-heading text-base font-semibold text-secondary-900">
          {lo === 'ar' ? 'أداء الجيران' : 'Your neighbours performance'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-3.5 sm:pt-0 md:pb-3.5 md:pe-4 md:ps-4 md:pt-0">
        <div className="border-t border-secondary-200/80 pt-3" />
        <div className="grid min-w-0 grid-cols-1 gap-3 text-sm sm:grid-cols-3 sm:items-start">
          <div className="flex min-w-0 items-center gap-2 sm:pt-4">
            <MapPin className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />
            <span className="min-w-0 truncate font-semibold text-secondary-900">{regionName}</span>
          </div>

          <div className="flex min-w-0 flex-col gap-0.5 sm:border-s sm:border-secondary-200/80 sm:ps-3">
            <span className="text-secondary-600">{lo === 'ar' ? 'متوسط السعر الليلي' : 'Average daily rate'}</span>
            <span className="font-semibold tabular-nums text-secondary-900">
              {formatMoney(nightlyRateEgp, locale)}
              <span className="ms-1 text-xs font-normal text-secondary-500">{lo === 'ar' ? 'ج.م/ليلة' : 'EGP/night'}</span>
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-0.5 sm:border-s sm:border-secondary-200/80 sm:ps-3 sm:text-end">
            <span className="text-secondary-600">{lo === 'ar' ? 'متوسط الإشغال' : 'Avg occupancy'}</span>
            <span className="font-semibold tabular-nums text-secondary-900">{occupancyPct}%</span>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-secondary-200/70 bg-white/70 px-3 py-2 text-xs text-secondary-700">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-secondary-900">{lo === 'ar' ? 'مرجع 2025 (إرشادي)' : '2025 benchmark (guide)'}</span>
            <span className="text-secondary-600">{peakSeasonNote[lo]}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <span className="text-secondary-600">{lo === 'ar' ? 'متوسط شهري' : 'Typical monthly'}:</span>{' '}
              <span className="font-semibold tabular-nums text-secondary-900">
                {typicalMonthlyUsd == null ? (lo === 'ar' ? 'غير ثابت' : 'Varies') : `$${typicalMonthlyUsd}`}
              </span>
            </span>
            <span>
              <span className="text-secondary-600">{lo === 'ar' ? 'أفضل 10%' : 'Top 10%'}:</span>{' '}
              <span className="font-semibold tabular-nums text-secondary-900">
                {top10MonthlyUsd == null ? '—' : `$${top10MonthlyUsd}`}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

