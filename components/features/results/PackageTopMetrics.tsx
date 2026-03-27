'use client';

import * as React from 'react';
import { formatMoney } from './utils';
import { Wallet, TrendingUp, Calendar, BarChart3, ArrowUpRight } from 'lucide-react';

interface PackageTopMetricsProps {
  sectionSubtitle: string;
  currentNetMonthlyEgp: number;
  servicesCostMin: number;
  servicesCostMax: number;
  netMonthlyEgp: number;
  breakEvenMonths: { min: number; max: number } | null;
  year1ProjectedNetEgp: { min: number; max: number } | null;
  locale: string;
  lo: 'en' | 'ar';
}

export function PackageTopMetrics({
  sectionSubtitle,
  currentNetMonthlyEgp,
  servicesCostMin,
  servicesCostMax,
  netMonthlyEgp,
  breakEvenMonths,
  year1ProjectedNetEgp,
  locale,
  lo,
}: PackageTopMetricsProps) {
  const isAr = lo === 'ar';

  return (
    <section className="overflow-hidden rounded-3xl border border-secondary-200 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Primary Focus: Investment Cost */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">
                {isAr ? 'الاستثمار المطلوب' : 'Total Investment'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-secondary-900 md:text-5xl">
                  {formatMoney(servicesCostMin, locale)}
                </span>
                <span className="text-xl font-bold text-secondary-300">
                  – {formatMoney(servicesCostMax, locale)}
                </span>
                <span className="ml-1 text-base font-bold text-secondary-400">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
              
              {/* Break-even moved under investment */}
              <div className="mt-2 flex items-center gap-2 text-xs font-medium text-secondary-500">
                <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                <span>{isAr ? 'مدة التعادل المتوقعة:' : 'Expected break-even:'}</span>
                <span className="font-bold text-secondary-900">
                  {breakEvenMonths ? `${breakEvenMonths.min}–${breakEvenMonths.max}` : '—'}
                  <span className="ml-0.5 text-[10px] font-normal text-secondary-500">{isAr ? 'شهر' : 'mo'}</span>
                </span>
              </div>
            </div>

            <div className="max-w-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400 mb-0.5">
                {isAr ? 'الهدف من الاستثمار' : 'Investment Goal'}
              </p>
              <h3 className="text-lg font-bold leading-tight text-secondary-800">
                {sectionSubtitle}
              </h3>
            </div>
          </div>
        </div>

        {/* Secondary Focus: Monthly Outcome */}
        <div className="w-full bg-secondary-50 p-6 md:w-72 md:p-8 border-t md:border-t-0 md:border-l border-secondary-100">
          <div className="flex flex-col h-full justify-center gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-400">
                  {isAr ? 'صافي الدخل الشهري' : 'Target Monthly Net'}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary-700 tabular-nums">
                    {formatMoney(netMonthlyEgp, locale)}
                  </span>
                  <span className="text-[10px] font-bold text-primary-600/70">{isAr ? 'ج.م/شهر' : 'EGP/mo'}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary-100/50 px-2 py-0.5 text-[9px] font-bold text-primary-700">
                  <ArrowUpRight className="h-2.5 w-2.5" />
                  {isAr ? 'زيادة عن اليوم' : 'Increase from today'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-secondary-200/60">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-secondary-400">
                    {isAr ? 'صافي السنة ١' : 'Year 1 Net'}
                  </p>
                  <p className="text-xs font-bold text-secondary-900">
                    {year1ProjectedNetEgp ? formatMoney(year1ProjectedNetEgp.min, locale) : '—'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-secondary-400">
                    {isAr ? 'العائد السنوي' : 'Annual Net'}
                  </p>
                  <p className="text-xs font-bold text-secondary-900">
                    {year1ProjectedNetEgp ? formatMoney(year1ProjectedNetEgp.max, locale) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
