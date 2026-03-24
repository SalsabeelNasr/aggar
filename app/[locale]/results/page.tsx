'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { evaluateProperty, getRecommendedServices } from '@/services/mockApi';
import { EvaluationResult, PartnerService } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Sparkles, Activity, TrendingUp } from 'lucide-react';

export default function ResultsPage() {
  const locale = useLocale();
  const { data } = useEvaluationStore();
  const [result, setResult] = React.useState<EvaluationResult | null>(null);
  const [partners, setPartners] = React.useState<PartnerService[]>([]);

  React.useEffect(() => {
    evaluateProperty(data as any).then(res => {
      setResult(res);
      getRecommendedServices(res.stage).then(setPartners);
    });
  }, [data]);

  if (!result) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="mt-8 text-xl font-heading font-bold text-secondary-900 animate-pulse">
        {locale === 'ar' ? 'جارِ بناء التقرير المخصص وربط إشارات الذكاء الاصطناعي...' : 'Generating custom report and AI insights...'}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header & Score */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary-900 mb-8">
          {locale === 'ar' ? 'تقرير جاهزية العقار' : 'Property Readiness Report'}
        </h1>
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-primary-200 rounded-2xl shadow-sm mx-auto">
          <Activity className="w-8 h-8 text-primary-600" />
          <span className="font-heading font-bold text-2xl text-secondary-900">
            {locale === 'ar' ? 'مؤشر الجاهزية:' : 'Market Readiness:'} <span className="text-primary-700">{result.score}</span> / 100
          </span>
          <span className="px-4 py-1.5 bg-primary-600 text-white rounded-xl text-sm font-bold ml-4 shadow-sm shadow-primary-500/30">
            {result.stageName[locale as 'en'|'ar']}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* Revenue Snapshot */}
        <Card className="lg:col-span-2 border-primary-200 shadow-xl shadow-primary-500/5 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -z-10 -mr-32 -mt-32 pointer-events-none" />
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-secondary-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              {locale === 'ar' ? 'العائد الشهري المتوقع' : 'Estimated Monthly Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-secondary-50 border border-secondary-200 rounded-2xl shadow-sm transition-transform hover:-translate-y-1">
                <div className="text-secondary-500 font-bold mb-3">{locale === 'ar' ? 'الوضع الحالي' : 'Current State'}</div>
                <div className="text-5xl font-extrabold text-secondary-900 mb-4 tracking-tight">${result.currentMonthlyRevenue}</div>
                <div className="text-sm text-secondary-600 font-medium">
                  {locale === 'ar' ? `إشغال ${result.currentOccupancy}%` : `${result.currentOccupancy}% Occupancy`} • ${result.currentNightlyRate} / {locale === 'ar' ? 'ليلة' : 'night'}
                </div>
              </div>
              <div className="p-8 bg-primary-600 border border-primary-500 rounded-2xl shadow-lg shadow-primary-600/20 text-white transition-transform hover:-translate-y-1">
                <div className="text-primary-100 font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {locale === 'ar' ? 'بعد التحسينات والشراكات' : 'Optimized Potential'}
                </div>
                <div className="text-5xl font-extrabold text-white mb-4 tracking-tight">${result.optimizedMonthlyRevenue}</div>
                <div className="text-sm text-primary-100 font-medium">
                  {locale === 'ar' ? `إشغال ${result.optimizedOccupancy}%` : `${result.optimizedOccupancy}% Occupancy`} • ${result.optimizedNightlyRate} / {locale === 'ar' ? 'ليلة' : 'night'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights & Reasons */}
        <Card className="border-secondary-200 shadow-md flex flex-col">
          <CardHeader className="bg-secondary-50 border-b border-secondary-100 pb-4">
            <CardTitle className="text-xl text-secondary-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-500" />
              {locale === 'ar' ? 'تحليل وملاحظات الذكاء الاصطناعي' : 'AI & Market Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-grow bg-white">
            {result.aiInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-secondary-800 bg-accent-50 p-4 rounded-xl border border-accent-100">
                <p className="font-medium leading-relaxed">{insight[locale as 'en'|'ar']}</p>
              </div>
            ))}
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-secondary-700 bg-primary-50 p-4 rounded-xl border border-primary-100">
                <p className="font-medium leading-relaxed">{reason[locale as 'en'|'ar']}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Service Partners Section */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-heading font-extrabold text-secondary-900 mb-4">
            {locale === 'ar' ? 'شركاء التنفيذ للوصول لهدفك' : 'Recommended Partners to Reach Your Goal'}
          </h3>
          <p className="text-secondary-600 max-w-2xl mx-auto text-lg">
            {locale === 'ar' 
              ? 'بناءً على التقييم الخاص بك، هؤلاء هم أفضل الشركاء الموثوقين لرفع جاهزية عقارك وزيادة الإيرادات.'
              : 'Based on your evaluation, these are the top vetted partners to help boost your readiness and income.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map(partner => (
            <Card key={partner.id} className="hover:border-primary-500 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-primary-100 group-hover:border-primary-600">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-bold text-xl text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors">{partner.name[locale as 'en'|'ar']}</h4>
                <p className="text-secondary-600 text-sm leading-relaxed">{partner.description[locale as 'en'|'ar']}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
