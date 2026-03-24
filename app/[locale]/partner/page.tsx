'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

export default function PartnerPage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1500);
  };

  const benefits = locale === 'ar' ? [
    { icon: TrendingUp, title: 'عملاء جاهزون', desc: 'عملاء ذوي نية عالية يبحثون عن خدماتك.' },
    { icon: Briefcase, title: 'بدون تكلفة تسويق', desc: 'نحن نتولى التسويق وجلب المشاريع.' },
    { icon: CheckCircle, title: 'بيانات دقيقة', desc: 'نرسل لك حالة العقار والصور لتسعير دقيق.' },
  ] : [
    { icon: TrendingUp, title: 'Qualified Leads', desc: 'High-intent clients looking for your services.' },
    { icon: Briefcase, title: 'Zero Marketing Cost', desc: 'We handle marketing and bring projects to you.' },
    { icon: CheckCircle, title: 'Accurate Briefs', desc: 'Full property specs and photos before quoting.' },
  ];

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg min-h-[60vh] flex flex-col justify-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
          {locale === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Application Received!'}
        </h2>
        <p className="text-secondary-600 text-lg">
          {locale === 'ar' ? 'سنقوم بمراجعة طلبك والتواصل معك خلال ٤٨ ساعة لتحديد موعد مقابلة.' : 'We will review your application and contact you within 48 hours for an interview.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-secondary-900 text-white pt-24 pb-32">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/20 text-accent-400 rounded-full text-sm font-bold border border-accent-500/30 mb-6 font-heading">
            <Sparkles className="w-4 h-4" />
            {locale === 'ar' ? 'انضم لشبكة أفضل الشركاء' : 'Join the Elite Network'}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 tracking-tight">
            {locale === 'ar' ? 'كن شريكاً في نجاح الاستثمار العقاري' : 'Partner for Real Estate Success'}
          </h1>
          <p className="text-xl text-secondary-300">
            {locale === 'ar' 
              ? 'نصلك بأصحاب العقارات الذين يبحثون عن خدمات التشطيب، الفرش، والنظافة.'
              : 'Connect with property owners actively seeking transformation and operations services.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((b, i) => (
            <Card key={i} className="border-none shadow-lg shadow-secondary-900/5">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-secondary-900 mb-2">{b.title}</h3>
                <p className="text-secondary-600 font-medium">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card className="max-w-3xl mx-auto shadow-xl border-secondary-200">
          <CardHeader className="bg-white border-b border-secondary-100 p-8">
            <CardTitle className="text-2xl font-heading font-bold text-secondary-900">
              {locale === 'ar' ? 'طلب الانضمام كشريك' : 'Partner Application Form'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'اسم الشركة / النشاط' : 'Company Name'}</label>
                  <input required className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none" placeholder={locale === 'ar' ? 'مثال: شركة التشطيب الحديث' : 'e.g. Modern Decor Ltd.'} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'نوع الخدمة' : 'Primary Service'}</label>
                  <select required className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none bg-white">
                    <option value="">{locale === 'ar' ? 'اختر الخدمة الأساسية' : 'Select Service'}</option>
                    <option value="ren">{locale === 'ar' ? 'تشطيب ومقاولات' : 'Renovation & Contracting'}</option>
                    <option value="sty">{locale === 'ar' ? 'فرش وتصميم داخلي' : 'Interior Styling & Furnishing'}</option>
                    <option value="pho">{locale === 'ar' ? 'تصوير عقاري' : 'Property Photography'}</option>
                    <option value="cle">{locale === 'ar' ? 'نظافة فندقية' : 'Deep Cleaning'}</option>
                    <option value="man">{locale === 'ar' ? 'إدارة أملاك' : 'Property Management'}</option>
                    <option value="oth">{locale === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'نطاق العمل (المناطق)' : 'Operating Zones'}</label>
                  <input required className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none" placeholder={locale === 'ar' ? 'أين يمكنك تقديم الخدمة؟' : 'e.g. New Cairo, Sahel...'} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'رابط سابقة الأعمال (Instagram/Website)' : 'Portfolio Link'}</label>
                  <input required type="url" className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none" dir="ltr" placeholder="https://" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <input required type="tel" className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none" dir="ltr" placeholder="+20..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold font-heading text-secondary-900">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input required type="email" className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none" dir="ltr" placeholder="contact@..." />
                </div>
              </div>
              
              <Button type="submit" size="lg" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (locale === 'ar' ? 'تقديم الطلب' : 'Submit Application')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
