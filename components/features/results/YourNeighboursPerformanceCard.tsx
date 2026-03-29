import * as React from 'react';
import { Eye, MapPin, Sparkles, TrendingUp, Clock, Palette, CheckCircle2, Wifi, ShieldCheck, Home, Zap, Camera, Key, Waves, Coffee, Bed, Thermometer, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatMoney } from './utils';
import type { CompetitionSnapshot, PropertyAnalysisItem } from '@/lib/evaluation/types';
import { cn } from '@/lib/utils';

type Props = {
  lo: 'en' | 'ar';
  locale: string;
  regionName: string;
  snapshot: CompetitionSnapshot;
  analysisItems: PropertyAnalysisItem[];
};

/**
 * Maps common audit keywords to relevant icons for a personalized feel.
 */
function getAuditIcon(title: string, body: string) {
  const text = (title + ' ' + body).toLowerCase();
  if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('إنترنت')) return Wifi;
  if (text.includes('photo') || text.includes('صورة') || text.includes('تصوير')) return Camera;
  if (text.includes('ac') || text.includes('تكييف') || text.includes('cooling')) return Thermometer;
  if (text.includes('lock') || text.includes('قفل') || text.includes('access') || text.includes('دخول')) return Key;
  if (text.includes('security') || text.includes('أمن') || text.includes('safety')) return ShieldCheck;
  if (text.includes('kitchen') || text.includes('مطبخ') || text.includes('nespresso') || text.includes('coffee')) return Coffee;
  if (text.includes('bed') || text.includes('linen') || text.includes('سرير') || text.includes('sleep')) return Bed;
  if (text.includes('view') || text.includes('نيل') || text.includes('beach') || text.includes('pool')) return Waves;
  if (text.includes('electricity') || text.includes('smart') || text.includes('automation')) return Zap;
  if (text.includes('shell') || text.includes('finish') || text.includes('renovate')) return Home;
  return CheckCircle2;
}

export function YourNeighboursPerformanceCard({ lo, locale, regionName, snapshot, analysisItems }: Props) {
  const isAr = lo === 'ar';
  
  const gapLine = isAr ? snapshot.revenueGapLine.ar : snapshot.revenueGapLine.en;
  const amenityLine = isAr ? snapshot.amenityAhaLine.ar : snapshot.amenityAhaLine.en;
  const designLine = isAr ? snapshot.designBenchmarkLine.ar : snapshot.designBenchmarkLine.en;
  const responseLine = isAr ? snapshot.responseDeltaLine.ar : snapshot.responseDeltaLine.en;
  const footnote = isAr ? snapshot.footnote.ar : snapshot.footnote.en;

  const title = isAr ? 'تحليل السوق والمنافسة' : 'Market Intelligence & Analysis';
  const subtitle = isAr 
    ? 'رؤى حقيقية عشان توصل عقارك لأعلى فئة ربحية' 
    : 'Data-driven insights to unlock your property\'s top-tier potential';

  return (
    <Card className="overflow-hidden border-secondary-200 bg-white shadow-sm">
      {/* 1. Header: Professional & Subtle (Untitled UI style) */}
      <CardHeader className="border-b border-secondary-100 bg-white px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 md:text-base">{title}</h3>
            <p className="text-xs text-secondary-500">{subtitle}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* 2. The "Hook" Metrics: Revenue & Amenity Gaps (Stacked for focus) */}
        <div className="divide-y divide-secondary-100 border-b border-secondary-100">
          {/* Revenue Gap Section */}
          <div className="p-5 md:p-6 bg-gradient-to-r from-amber-50/50 to-transparent">
            <div className="mb-3 flex">
              <div className="flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-secondary-700">
                <MapPin className="h-3.5 w-3.5 text-secondary-400" />
                {regionName}
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {isAr ? 'فجوة الدخل الشهري' : 'Monthly Revenue Gap'}
                </div>
                <p className="text-xs leading-relaxed text-secondary-600 max-w-xl md:text-sm">
                  {gapLine}
                </p>
              </div>
              {snapshot.revenueGapEgp && (
                <div className="shrink-0 flex flex-col items-center justify-center rounded-lg bg-primary-600 px-3 py-1.5 text-center shadow-sm ring-1 ring-primary-700/10 md:-mt-8">
                  <p className="text-lg font-bold tracking-tight text-white md:text-xl">
                    +{formatMoney(snapshot.revenueGapEgp, locale)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-accent-300 animate-pulse" />
                    <p className="text-[8px] font-bold uppercase tracking-widest text-primary-100">
                      {isAr ? 'ج.م زيادة / شهر' : 'extra EGP / mo'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenity Gap Section */}
          <div className="p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary-700">
                  {isAr ? 'ميزة التجهيز' : 'Competitive Amenity Gap'}
                </div>
                <p className="text-sm leading-relaxed text-secondary-700 font-medium">
                  {amenityLine}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Property Audit: Specific Analysis Items (Compact Flat List) */}
        <div className="p-5 md:p-6">
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary-400">
            {isAr ? 'مراجعة تفاصيل العقار' : 'Property Audit Details'}
          </h4>
          <ul className="space-y-4">
            {analysisItems.map((item, idx) => {
              const Icon = getAuditIcon(item.title?.[lo] ?? '', item.body[lo]);
              return (
                <li key={idx} className="flex items-start gap-3.5 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    {item.title && (
                      <p className="text-xs font-bold text-secondary-900">
                        {isAr ? item.title.ar : item.title.en}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-secondary-600">
                      {isAr ? item.body.ar : item.body.en}
                    </p>
                  </div>
                </li>
              );
            })}

            {/* Market Demand Hint as a list item */}
            <li className="flex items-start gap-3.5 group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 pt-0.5">
                <p className="text-xs font-bold text-secondary-900">
                  {isAr ? 'توقعات السوق' : 'Market Demand Outlook'}
                </p>
                <p className="text-xs leading-relaxed text-secondary-600">
                  {footnote}
                </p>
              </div>
            </li>

            {/* Design Standard as a list item */}
            <li className="flex items-start gap-3.5 group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-500 transition-colors group-hover:bg-secondary-100">
                <Palette className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 pt-0.5">
                <p className="text-xs font-bold text-secondary-900">
                  {isAr ? 'ستايل الديكور' : 'Design Standard'}
                </p>
                <p className="text-xs leading-relaxed text-secondary-600">
                  {designLine}
                </p>
              </div>
            </li>

            {/* Response Time as a list item */}
            <li className="flex items-start gap-3.5 group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-500 transition-colors group-hover:bg-secondary-100">
                <Clock className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 pt-0.5">
                <p className="text-xs font-bold text-secondary-900">
                  {isAr ? 'سرعة الرد' : 'Response Time'}
                </p>
                <p className="text-xs leading-relaxed text-secondary-600">
                  {responseLine}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
