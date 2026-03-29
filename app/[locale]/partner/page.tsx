'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, TrendingUp, CheckCircle, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPartnerApplicationSchema, type PartnerApplicationValues } from '@/lib/validations/partner';

const PARTNER_MSG = {
  en: {
    companyName: 'Company name must be at least 2 characters.',
    primaryService: 'Please select a primary service.',
    operatingZones: 'Describe your operating areas (at least 2 characters).',
    portfolioUrl: 'Enter a valid portfolio URL.',
    phone: 'Enter a valid phone number for this region (e.g. Egypt +20).',
    email: 'Enter a valid email address.',
  },
  ar: {
    companyName: 'يا ريت تكتب اسم الشركة (حرفين على الأقل).',
    primaryService: 'اختار الخدمة الأساسية اللي بتقدمها.',
    operatingZones: 'قولنا بتغطي مناطق إيه (حرفين على الأقل).',
    portfolioUrl: 'حط رابط صح لمعرض أعمالك.',
    phone: 'اكتب رقم موبايل صح.',
    email: 'اكتب بريد إلكتروني صح.',
  },
} as const;

export default function PartnerPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const messages = isAr ? PARTNER_MSG.ar : PARTNER_MSG.en;
  const schema = React.useMemo(() => createPartnerApplicationSchema(messages), [messages]);

  const form = useForm<PartnerApplicationValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      primaryService: '' as PartnerApplicationValues['primaryService'],
      operatingZones: '',
      portfolioUrl: '',
      phone: '',
      email: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  });

  const benefits = isAr
    ? [
        {
          icon: TrendingUp,
          title: 'عملاء جاهزين',
          desc: 'بنوصلك بعملاء مهتمين فعلاً ومحتاجين خدماتك دلوقتي.',
        },
        {
          icon: Briefcase,
          title: 'وفر تكاليف التسويق',
          desc: 'إحنا بنقوم بالدور ده وبنجيب لك المشاريع لحد عندك.',
        },
        {
          icon: CheckCircle,
          title: 'بيانات واضحة',
          desc: 'بنبعت لك تفاصيل العقار والصور عشان تسعر صح وبكل شفافية.',
        },
      ]
    : [
        {
          icon: TrendingUp,
          title: 'Qualified Leads',
          desc: 'High-intent clients looking for your specific services.',
        },
        {
          icon: Briefcase,
          title: 'Zero Marketing Cost',
          desc: 'We handle marketing and bring verified projects to you.',
        },
        {
          icon: CheckCircle,
          title: 'Accurate Briefs',
          desc: 'Full property specs and photos before quoting.',
        },
      ];

  const requiredMark = (
    <span className="text-primary-600 ms-1 font-semibold" aria-hidden>
      *
    </span>
  );

  const err =
    (f: keyof PartnerApplicationValues) =>
    cn(
      'bg-secondary-50 border-2 rounded-xl p-4 outline-none font-medium transition-colors',
      form.formState.errors[f]
        ? 'border-red-500 focus:border-red-500'
        : 'border-secondary-200 focus:border-primary-500 focus:bg-white'
    );

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg min-h-[60vh] flex flex-col justify-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
          {isAr ? 'طلبك وصل بنجاح!' : 'Application Received!'}
        </h2>
        <p className="text-secondary-600 text-lg font-medium">
          {isAr
            ? 'هنراجع طلبك ونكلمك في خلال ٤٨ ساعة عشان نحدد ميعاد ونتعرف على بعض أكتر.'
            : 'We will review your application and contact you within 48 hours for an interview.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary-50 min-h-screen pb-24">
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 flex flex-col items-start text-start">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold border border-primary-100 mb-8 font-heading">
                <Sparkles className="w-4 h-4" />
                {isAr ? 'شراكة حقيقية لنجاح أكبر' : 'Join the Elite Network'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight text-secondary-900 leading-[1.15]">
                {isAr ? 'خليك شريك في نجاح الاستثمار العقاري' : 'Join Us for Real Estate Success'}
              </h1>
              <p className="text-xl md:text-2xl text-secondary-600 mb-10 font-medium leading-relaxed max-w-xl">
                {isAr
                  ? 'بنوصلك بأصحاب العقارات اللي بيدوروا على محترفين يجهزوا ويديروا عقاراتهم للإيجار قصير المدى. كبّر شغلك، وفر مصاريف التسويق، وحقق أرباح مستدامة.'
                  : 'Connect with property owners actively seeking transformation and operations services without worrying about customer acquisition.'}
              </p>
              <Button
                size="lg"
                className="px-8 h-14 text-lg font-bold shadow-xl shadow-primary-500/20"
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {isAr ? 'سجل بياناتك وانضم لينا' : 'Apply to Join Us'}
              </Button>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="relative h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-secondary-100 group">
                <Image
                  src="/images/towel.jpg"
                  alt="Partner network"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-secondary-900/10 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {benefits.map((b, i) => (
            <Card key={i} className="border-secondary-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
              <CardContent className="p-10 text-center flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-accent-50 text-accent-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-accent-100">
                  <b.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-4">{b.title}</h3>
                <p className="text-secondary-600 font-medium text-lg leading-relaxed flex-1">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="application-form" className="scroll-mt-32">
          <Card className="w-full shadow-xl border-secondary-200 bg-white overflow-hidden">
            <CardHeader className="bg-secondary-50 border-b border-secondary-100 p-8 text-center pt-10">
              <CardTitle className="text-3xl font-heading font-bold text-secondary-900">
                {isAr ? 'بيانات طلب الانضمام' : 'Partner Application Form'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <form onSubmit={onSubmit} className="space-y-8" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg" htmlFor="partner-company">
                      {isAr ? 'اسم الشركة أو النشاط' : 'Company Name'}
                      {requiredMark}
                    </label>
                    <input
                      id="partner-company"
                      className={err('companyName')}
                      placeholder={isAr ? 'مثلاً: شركة التشطيب الحديث' : 'e.g. Modern Decor Ltd.'}
                      aria-invalid={form.formState.errors.companyName ? true : undefined}
                      {...form.register('companyName')}
                    />
                    {form.formState.errors.companyName && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.companyName.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg" htmlFor="partner-service">
                      {isAr ? 'بتقدم خدمة إيه؟' : 'Primary Service'}
                      {requiredMark}
                    </label>
                    <div className="relative">
                      <select
                        id="partner-service"
                        className={cn(err('primaryService'), 'w-full appearance-none')}
                        aria-invalid={form.formState.errors.primaryService ? true : undefined}
                        {...form.register('primaryService')}
                      >
                        <option value="">{isAr ? 'اختار الخدمة الأساسية' : 'Select Service'}</option>
                        <option value="ren">{isAr ? 'تشطيب ومقاولات' : 'Renovation & Contracting'}</option>
                        <option value="sty">{isAr ? 'فرش وتصميم داخلي' : 'Interior Styling & Furnishing'}</option>
                        <option value="pho">{isAr ? 'تصوير عقاري' : 'Property Photography'}</option>
                        <option value="cle">{isAr ? 'نظافة فندقية' : 'Deep Cleaning'}</option>
                        <option value="man">{isAr ? 'إدارة أملاك' : 'Property Management'}</option>
                        <option value="oth">{isAr ? 'حاجة تانية' : 'Other'}</option>
                      </select>
                    </div>
                    {form.formState.errors.primaryService && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.primaryService.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2 flex-wrap" htmlFor="partner-zones">
                      <MapPin className="w-5 h-5 text-secondary-400 shrink-0" />
                      <span>
                        {isAr ? 'بتغطي مناطق إيه؟' : 'Operating Zones'}
                        {requiredMark}
                      </span>
                    </label>
                    <input
                      id="partner-zones"
                      className={err('operatingZones')}
                      placeholder={isAr ? 'مثلاً: التجمع، الساحل، الجونة...' : 'e.g. New Cairo, Sahel...'}
                      aria-invalid={form.formState.errors.operatingZones ? true : undefined}
                      {...form.register('operatingZones')}
                    />
                    {form.formState.errors.operatingZones && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.operatingZones.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="font-bold font-heading text-secondary-900 text-lg" htmlFor="partner-url">
                      {isAr ? 'رابط سابقة الأعمال (إنستجرام أو موقعك)' : 'Portfolio Link'}
                      {requiredMark}
                    </label>
                    <input
                      id="partner-url"
                      type="url"
                      className={err('portfolioUrl')}
                      dir="ltr"
                      placeholder="https://"
                      aria-invalid={form.formState.errors.portfolioUrl ? true : undefined}
                      {...form.register('portfolioUrl')}
                    />
                    {form.formState.errors.portfolioUrl && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.portfolioUrl.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2 flex-wrap" htmlFor="partner-phone">
                      <Phone className="w-5 h-5 text-secondary-400 shrink-0" />
                      <span>
                        {isAr ? 'رقم الموبايل' : 'Phone Number'}
                        {requiredMark}
                      </span>
                    </label>
                    <input
                      id="partner-phone"
                      type="tel"
                      className={err('phone')}
                      dir="ltr"
                      placeholder="+20..."
                      aria-invalid={form.formState.errors.phone ? true : undefined}
                      {...form.register('phone')}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2 flex-wrap" htmlFor="partner-email">
                      <Mail className="w-5 h-5 text-secondary-400 shrink-0" />
                      <span>
                        {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        {requiredMark}
                      </span>
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      className={err('email')}
                      dir="ltr"
                      placeholder="contact@..."
                      aria-invalid={form.formState.errors.email ? true : undefined}
                      {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 font-medium">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-secondary-100">
                  <Button type="submit" size="lg" className="w-full h-16 text-xl shadow-lg shadow-primary-500/20" disabled={isSubmitting}>
                    {isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : isAr ? 'انضم لشبكة شركائنا' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
