'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/lib/navigation';
import { Lock, TrendingUp, Sparkles, MapPin, Activity } from 'lucide-react';

export function PreviewSection() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="w-full py-24 bg-secondary-100 overflow-hidden relative border-y border-secondary-200">
      <div className="container mx-auto px-4 text-center z-10 relative">
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6 text-secondary-900">
          {locale === 'ar' ? 'تقرير مليان تفاصيل بتهمك' : 'A report full of insights you care about'}
        </h2>
        <p className="text-secondary-600 max-w-2xl mx-auto mb-16 text-xl font-medium">
          {locale === 'ar' 
            ? 'شوف بعينك إزاي التقرير بيفصلك كل فرصة لزيادة دخلك.'
            : 'See exactly how the report breaks down every opportunity to increase your income.'}
        </p>

        <div className="max-w-4xl mx-auto relative mb-12 text-start">
          
          <Card className="bg-white border-secondary-200 overflow-hidden shadow-2xl relative">
            <CardContent className="p-8 pb-32">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-secondary-100 pb-6 mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-primary-600 mb-2 font-bold font-heading">
                    <MapPin className="w-5 h-5" />
                    {locale === 'ar' ? 'نموذج لشقة في التجمع الخامس' : 'Sample: Apartment in New Cairo'}
                  </div>
                  <div className="text-secondary-500 font-medium text-lg">3 {locale === 'ar' ? 'غرف نوم' : 'Bedrooms'} • {locale === 'ar' ? 'نصف تشطيب' : 'Finished Empty'}</div>
                </div>
                <div className="bg-primary-50 px-6 py-3 rounded-2xl border border-primary-100 flex items-center gap-4">
                  <Activity className="w-8 h-8 text-primary-600" />
                  <div>
                    <div className="text-secondary-500 text-xs font-bold uppercase tracking-wide">
                      {locale === 'ar' ? 'مؤشر الجاهزية' : 'Readiness Score'}
                    </div>
                    <div className="text-3xl font-bold font-heading text-secondary-900">78 <span className="text-sm text-secondary-400">/ 100</span></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="p-8 bg-secondary-50 rounded-2xl border border-secondary-100">
                  <div className="text-secondary-500 font-bold mb-3">{locale === 'ar' ? 'الدخل المتوقع (الوضع الحالي)' : 'Expected Revenue (Current)'}</div>
                  <div className="text-4xl font-extrabold text-secondary-900">22,000 <span className="text-lg text-secondary-500 font-normal">{locale === 'ar' ? 'جنيه/شهر' : 'EGP/mo'}</span></div>
                </div>
                <div className="p-8 bg-primary-600 rounded-2xl border border-primary-500 shadow-lg shadow-primary-600/20 text-white">
                  <div className="text-primary-100 font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {locale === 'ar' ? 'الدخل المتوقع (بعد التطوير)' : 'Expected Revenue (Optimized)'}
                  </div>
                  <div className="text-4xl font-extrabold text-white">35,000 <span className="text-lg text-primary-200 font-normal">{locale === 'ar' ? 'جنيه/شهر' : 'EGP/mo'}</span></div>
                </div>
              </div>

              <div className="space-y-6 relative">
                <div className="p-8 bg-accent-50 rounded-2xl border border-accent-100 flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-accent-500 shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="font-bold text-secondary-900 font-heading text-xl mb-4">{locale === 'ar' ? 'تحليل الذكاء الاصطناعي الاستثماري' : 'AI Investment Analysis'}</div>
                    <div className="space-y-3 w-full">
                      <div className="h-4 bg-accent-200/60 rounded-full w-3/4"></div>
                      <div className="h-4 bg-accent-200/60 rounded-full w-full"></div>
                      <div className="h-4 bg-accent-200/60 rounded-full w-5/6"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pb-12">
                  <div className="p-8 bg-secondary-50 rounded-2xl border border-secondary-100">
                    <div className="font-bold text-secondary-900 font-heading mb-6">{locale === 'ar' ? 'التحسينات المطلوبة' : 'Required Improvements'}</div>
                    <div className="h-4 bg-secondary-200/60 rounded-full w-full mb-4"></div>
                    <div className="h-4 bg-secondary-200/60 rounded-full w-2/3"></div>
                  </div>
                  <div className="p-8 bg-secondary-50 rounded-2xl border border-secondary-100">
                    <div className="font-bold text-secondary-900 font-heading mb-6">{locale === 'ar' ? 'ترشيحات الشركاء' : 'Partner Recommendations'}</div>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-secondary-200/60 rounded-xl"></div>
                      <div className="w-14 h-14 bg-secondary-200/60 rounded-xl"></div>
                      <div className="w-14 h-14 bg-secondary-200/60 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="absolute inset-x-0 bottom-0 h-[450px] bg-gradient-to-t from-secondary-100 via-white/80 to-transparent flex flex-col items-center justify-end pb-20 backdrop-blur-[4px]">
              <div className="w-20 h-20 bg-white shadow-xl shadow-secondary-900/10 rounded-full flex items-center justify-center mb-6 text-primary-600 border-4 border-primary-50">
                <Lock className="w-8 h-8" />
              </div>
              <Button size="lg" onClick={() => router.push('/evaluate')} className="px-12 h-16 text-xl shadow-xl shadow-primary-500/30">
                {locale === 'ar' ? 'افتح التقرير الخاص بيا' : 'Unlock My Custom Report'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
