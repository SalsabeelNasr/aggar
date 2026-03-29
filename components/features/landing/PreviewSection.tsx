'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/lib/navigation';
import { Lock, MapPin, TrendingUp, Sparkles, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/components/features/results/utils';
import { ResultsPhotoCarousel } from '@/components/features/results/ResultsPhotoCarousel';

const DEMO_SCORE = 78;

function ScoreRadial({ score, className }: { score: number; className?: string }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const cx = 60;
  const cy = 60;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" className={cn('shrink-0', className)} aria-hidden>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={7} className="text-secondary-200" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="text-primary-600"
      />
    </svg>
  );
}

const PACKAGE_PREVIEW: { id: string; en: string; ar: string; recommended?: boolean }[] = [
  { id: 'quick_start', en: 'Quick Start', ar: 'بداية سريعة' },
  { id: 'sweet_spot', en: 'Sweet Spot', ar: 'المنطقة الذهبية', recommended: true },
  { id: 'asset_flip', en: 'Asset Flip', ar: 'قلب الأصل' },
  { id: 'custom', en: 'Custom', ar: 'مخصص' },
];

export function PreviewSection() {
  const locale = useLocale();
  const router = useRouter();
  const lo: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';

  const regionLabel = lo === 'ar' ? 'التجمع الخامس، القاهرة الجديدة' : 'New Cairo';
  const gapSample =
    lo === 'ar'
      ? 'عقارات قريبة بنفس المساحة بتسجّل دخل أعلى بسبب التعرّض والتجهيز.'
      : 'Similar nearby listings are earning more due to positioning and fit-out.';
  const amenitySample =
    lo === 'ar'
      ? 'زيادة عرض الصور الاحترافية والتأسيس المناسب بترفع ترتيبك ضمن المنطقة.'
      : 'Stronger listing photos and guest-ready basics lift you in local comps.';
  const tagline = lo === 'ar' ? 'استثمار في الشكل لرفع الأداء.' : 'Invest in the look. Unlock the top 20% of your neighborhood.';
  const investmentMin = 85_000;
  const investmentMax = 120_000;
  const currentNet = 22_000;
  const targetNet = 35_000;
  const year1Min = 180_000;
  const year1Max = 260_000;

  return (
    <section className="relative w-full overflow-hidden border-y border-secondary-200 bg-secondary-100 py-24">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="mb-6 font-heading text-3xl font-extrabold text-secondary-900 md:text-5xl">
          {lo === 'ar' ? 'تقرير مليان تفاصيل بتهمك' : 'A report full of insights you care about'}
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-xl font-medium text-secondary-600">
          {lo === 'ar'
            ? 'شوف بعينك شكل تقرير الجاهزية اللي هتاخده بعد التقييم — مقفول دلوقتي لحد ما تخلص خطواتك.'
            : 'See the same readiness report layout you get after evaluation — locked until you finish your steps.'}
        </p>

        <div className="relative mx-auto mb-12 max-w-5xl text-start">
          <div
            className="relative max-h-[min(32vh,340px)] overflow-hidden rounded-xl border border-secondary-200 bg-secondary-50 shadow-2xl sm:max-h-[min(34vh,360px)] md:max-h-[min(36vh,380px)]"
            dir={lo === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="border-b border-secondary-200 bg-white shadow-xs">
              <div className="px-4 py-6 md:px-6 md:py-8">
                <header className="mb-5 space-y-1 md:mb-6">
                  <h3 className="font-heading text-2xl font-semibold tracking-tight text-secondary-900 md:text-4xl">
                    {lo === 'ar' ? 'تقرير جاهزية عقارك' : 'Market readiness report'}
                  </h3>
                  <p className="text-sm text-secondary-500">
                    {lo === 'ar' ? 'نموذج توضيحي — بيانات وهمية' : 'Illustrative sample — placeholder data'}
                  </p>
                </header>

                <section className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-start md:gap-5 lg:gap-6">
                    <div className="flex min-w-0 flex-col gap-4 md:col-span-1 lg:gap-5">
                      <Card className="flex w-full min-w-0 flex-col border-secondary-200 shadow-xs">
                        <CardHeader className="p-4 pb-1 pt-3 text-center">
                          <CardTitle className="font-heading text-base font-semibold text-secondary-900">
                            {lo === 'ar' ? 'جاهزية العقار' : 'Market readiness'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center px-4 pb-3 pt-0">
                          <div className="flex w-full flex-col items-center">
                            <div className="relative shrink-0">
                              <ScoreRadial score={DEMO_SCORE} />
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-xl font-semibold tabular-nums text-primary-700">{DEMO_SCORE}</p>
                                  <p className="text-[11px] font-medium leading-tight text-secondary-500">
                                    {lo === 'ar' ? 'من ١٠٠' : '/ 100'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <ResultsPhotoCarousel photos={[{ id: 'landing-preview' }]} className="mt-0" />
                    </div>

                    <div className="flex min-w-0 flex-col gap-4 md:col-span-4 lg:gap-5">
                      <Card className="overflow-hidden border-secondary-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-secondary-100 bg-white px-4 py-4 md:px-6">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 md:text-base">
                                {lo === 'ar' ? 'تحليل السوق والمنافسة' : 'Market Intelligence & Analysis'}
                              </h4>
                              <p className="text-xs text-secondary-500">
                                {lo === 'ar'
                                  ? 'رؤى حقيقية عشان توصل عقارك لأعلى فئة ربحية'
                                  : "Data-driven insights to unlock your property's top-tier potential"}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y divide-secondary-100 border-b border-secondary-100">
                            <div className="bg-gradient-to-r from-amber-50/50 to-transparent p-5 md:p-6">
                              <div className="mb-3 flex">
                                <div className="flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-secondary-700">
                                  <MapPin className="h-3.5 w-3.5 text-secondary-400" />
                                  {regionLabel}
                                </div>
                              </div>
                              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    {lo === 'ar' ? 'فجوة الدخل الشهري' : 'Monthly Revenue Gap'}
                                  </div>
                                  <p className="max-w-xl text-xs leading-relaxed text-secondary-600 md:text-sm">{gapSample}</p>
                                </div>
                                <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-primary-600 px-3 py-1.5 text-center shadow-sm ring-1 ring-primary-700/10 md:-mt-8">
                                  <p className="text-lg font-bold tracking-tight text-white md:text-xl">
                                    +{formatMoney(13_000, locale)}
                                  </p>
                                  <div className="mt-0.5 flex items-center gap-1">
                                    <span className="h-1 w-1 animate-pulse rounded-full bg-accent-300" />
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-primary-100">
                                      {lo === 'ar' ? 'ج.م زيادة / شهر' : 'extra EGP / mo'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-5 md:p-6">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                                  <Sparkles className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary-700">
                                    {lo === 'ar' ? 'ميزة التجهيز' : 'Competitive Amenity Gap'}
                                  </div>
                                  <p className="text-sm font-medium leading-relaxed text-secondary-700">{amenitySample}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-5 md:p-6">
                            <h5 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary-400">
                              {lo === 'ar' ? 'مراجعة تفاصيل العقار' : 'Property Audit Details'}
                            </h5>
                            <ul className="space-y-3">
                              {[1, 2].map((i) => (
                                <li key={i} className="flex gap-3">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                                  <div className="h-3 flex-1 rounded-full bg-secondary-100">
                                    <div className={cn('h-full rounded-full bg-secondary-200/80', i === 1 ? 'w-4/5' : 'w-3/5')} />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="w-full min-w-0 overflow-hidden rounded-xl border border-secondary-200 bg-white">
                    <div className="space-y-6 px-4 py-5 md:px-6 md:py-6">
                      <h3 className="font-heading text-lg font-semibold text-secondary-900">
                        {lo === 'ar' ? 'إزاي تحسن أداء عقارك؟' : 'How do you improve?'}
                      </h3>

                      <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-hidden>
                        {PACKAGE_PREVIEW.map((p) => {
                          const selected = p.id === 'sweet_spot';
                          return (
                            <div
                              key={p.id}
                              className={cn(
                                'relative flex min-h-[40px] w-full flex-col items-start gap-0.5 overflow-visible rounded-xl border-2 p-2 pb-2 pt-5 text-start text-sm',
                                selected
                                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                                  : 'border-secondary-200 bg-white'
                              )}
                            >
                              {p.recommended && (
                                <span className="absolute end-2 top-0 z-10 -translate-y-1/2 rounded-full bg-primary-700 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                                  {lo === 'ar' ? 'الأفضل قيمة' : 'Recommended'}
                                </span>
                              )}
                              <div className="w-full px-1 pb-1">
                                <p
                                  className={cn(
                                    'font-heading text-sm font-bold leading-snug',
                                    selected ? 'text-primary-900' : 'text-secondary-900'
                                  )}
                                >
                                  {lo === 'ar' ? p.ar : p.en}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <section className="overflow-hidden rounded-3xl border border-secondary-200 bg-white shadow-sm">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6 md:p-8">
                            <div className="flex flex-col gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">
                                  {lo === 'ar' ? 'الاستثمار المطلوب' : 'Total Investment'}
                                </p>
                                <div className="flex flex-wrap items-baseline gap-2">
                                  <span className="text-3xl font-black tracking-tighter text-secondary-900 md:text-4xl">
                                    {formatMoney(investmentMin, locale)}
                                  </span>
                                  <span className="text-lg font-bold text-secondary-300">
                                    – {formatMoney(investmentMax, locale)}
                                  </span>
                                  <span className="ml-1 text-base font-bold text-secondary-400">{lo === 'ar' ? 'ج.م' : 'EGP'}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-secondary-500">
                                  <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                                  <span>{lo === 'ar' ? 'هترجع استثمارك في خلال:' : 'Expected break-even:'}</span>
                                  <span className="font-bold text-secondary-900">
                                    4–7
                                    <span className="ml-0.5 text-[10px] font-normal text-secondary-500">
                                      {lo === 'ar' ? 'شهور' : 'mo'}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="max-w-md">
                                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">
                                  {lo === 'ar' ? 'الهدف من الباقة' : 'Investment Goal'}
                                </p>
                                <h4 className="text-base font-bold leading-tight text-secondary-800 md:text-lg">{tagline}</h4>
                              </div>
                            </div>
                          </div>
                          <div className="w-full border-t border-secondary-100 bg-secondary-50 p-6 md:w-72 md:border-l md:border-t-0 md:p-8">
                            <div className="flex h-full flex-col justify-center gap-6">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-400">
                                    {lo === 'ar' ? 'صافي الدخل الشهري المستهدف' : 'Target Monthly Net'}
                                  </p>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black tabular-nums text-primary-700">
                                      {formatMoney(targetNet, locale)}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary-600/70">
                                      {lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}
                                    </span>
                                  </div>
                                  <div className="inline-flex items-center gap-1 rounded-full bg-primary-100/50 px-2 py-0.5 text-[9px] font-bold text-primary-700">
                                    <ArrowUpRight className="h-2.5 w-2.5" />
                                    {lo === 'ar' ? 'أعلى من دخلك الحالي' : 'Increase from today'}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-secondary-200/60 pt-4">
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-secondary-400">
                                      {lo === 'ar' ? 'صافي أول سنة' : 'Year 1 Net'}
                                    </p>
                                    <p className="text-xs font-bold text-secondary-900">{formatMoney(year1Min, locale)}</p>
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-secondary-400">
                                      {lo === 'ar' ? 'إجمالي السنة' : 'Annual Net'}
                                    </p>
                                    <p className="text-xs font-bold text-secondary-900">{formatMoney(year1Max, locale)}</p>
                                  </div>
                                </div>
                                <p className="text-[10px] text-secondary-500">
                                  {lo === 'ar' ? 'اليوم (تقريبي):' : 'Today (est.):'}{' '}
                                  <span className="font-semibold tabular-nums text-secondary-800">
                                    {formatMoney(currentNet, locale)} {lo === 'ar' ? 'ج.م/شهر' : 'EGP/mo'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-secondary-200 bg-white p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4"
                          >
                            <div className="min-w-0 space-y-2">
                              <div className="h-3 w-2/3 rounded-full bg-secondary-100" />
                              <div className="h-2.5 w-full rounded-full bg-secondary-50" />
                            </div>
                            <div className="mt-2 h-3 w-20 rounded-md bg-secondary-100 sm:mt-0 sm:justify-self-end" />
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="border-t border-secondary-200" />
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <p className="text-base font-extrabold text-secondary-900">{lo === 'ar' ? 'الإجمالي' : 'Total'}</p>
                          <p className="text-lg font-black tabular-nums text-secondary-900">
                            {formatMoney(investmentMin, locale)}–{formatMoney(investmentMax, locale)}{' '}
                            {lo === 'ar' ? 'ج.م' : 'EGP'}
                          </p>
                        </div>
                      </div>

                      <h3 className="font-heading text-lg font-semibold text-secondary-900">
                        {lo === 'ar' ? 'حابب نبدأ في التنفيذ؟' : 'Interested in building this?'}
                      </h3>
                      <div className="h-24 rounded-xl border border-dashed border-secondary-200 bg-secondary-50/50" />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[min(88%,100%)] min-h-[280px] flex-col items-center justify-end bg-gradient-to-t from-secondary-100 via-white/90 to-transparent pb-8 pt-48 backdrop-blur-[6px]">
              <div className="pointer-events-auto flex flex-col items-center px-4">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary-50 bg-white text-primary-600 shadow-xl shadow-secondary-900/10 md:h-16 md:w-16">
                  <Lock className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <Button
                  size="lg"
                  onClick={() => router.push('/evaluate')}
                  className="h-14 px-10 text-lg shadow-xl shadow-primary-500/30 md:h-16 md:px-12 md:text-xl"
                >
                  {lo === 'ar' ? 'افتح التقرير الخاص بيا' : 'Unlock My Custom Report'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
