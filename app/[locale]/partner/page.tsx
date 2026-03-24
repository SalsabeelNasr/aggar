'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, TrendingUp, CheckCircle, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

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
    { icon: TrendingUp, title: 'عملاء جاهزون', desc: 'نوفر لك عملاء ذوي نية عالية يبحثون بنشاط عن خدماتك.' },
    { icon: Briefcase, title: 'بدون تكلفة تسويق', desc: 'نحن نتولى عبء التسويق وجلب المشاريع إليك مباشرة.' },
    { icon: CheckCircle, title: 'بيانات دقيقة', desc: 'نرسل لك حالة العقار والصور لتقديم تسعير دقيق وشفاف.' },
  ] : [
    { icon: TrendingUp, title: 'Qualified Leads', desc: 'High-intent clients looking for your specific services.' },
    { icon: Briefcase, title: 'Zero Marketing Cost', desc: 'We handle marketing and bring verified projects to you.' },
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
        <p className="text-secondary-600 text-lg font-medium">
          {locale === 'ar' ? 'سنقوم بمراجعة طلبك والتواصل معك خلال ٤٨ ساعة لتحديد موعد مقابلة والتأكد من توافقنا.' : 'We will review your application and contact you within 48 hours for an interview.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary-50 min-h-screen pb-24">
      {/* Redesigned Hero with Image */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="lg:w-1/2 flex flex-col items-start text-start">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold border border-primary-100 mb-8 font-heading">
                <Sparkles className="w-4 h-4" />
                {locale === 'ar' ? 'رحلة نجاح مشتركة' : 'Join the Elite Network'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight text-secondary-900 leading-[1.15]">
                {locale === 'ar' ? 'انضم إلينا في نجاح الاستثمار العقاري' : 'Join Us for Real Estate Success'}
              </h1>
              <p className="text-xl md:text-2xl text-secondary-600 mb-10 font-medium leading-relaxed max-w-xl">
                {locale === 'ar' 
                  ? 'نصلك بأصحاب العقارات الذين يبحثون عن خدمات فندقية راقية. وسّع نطاق عملك، قلل تكاليف تسويقك، وحقق أرباح مستدامة.'
                  : 'Connect with property owners actively seeking transformation and operations services without worrying about customer acquisition.'}
              </p>
              <Button size="lg" className="px-8 h-14 text-lg font-bold shadow-xl shadow-primary-500/20" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
                {locale === 'ar' ? 'انضم إلينا الآن' : 'Apply to Join Us'}
              </Button>
            </div>
            
            {/* Image Content */}
            <div className="lg:w-1/2 w-full">
              <div className="relative h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-secondary-100 group">
                <Image src="/images/towel.jpg" alt="Partner network" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-secondary-900/10 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-24">
        {/* Benefits Grid */}
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

        {/* Application Form */}
        <div id="application-form" className="scroll-mt-32">
          <Card className="max-w-4xl mx-auto shadow-xl border-secondary-200 bg-white overflow-hidden">
            <CardHeader className="bg-secondary-50 border-b border-secondary-100 p-8 text-center pt-10">
              <CardTitle className="text-3xl font-heading font-bold text-secondary-900">
                {locale === 'ar' ? 'طلب الانضمام كشريك' : 'Partner Application Form'}
              </CardTitle>
              <p className="text-secondary-600 font-medium mt-3">
                {locale === 'ar' ? 'قم بملء البيانات وتوضيح مجال خبرتك لبدء التواصل.' : 'Fill in the details to start the vetting process.'}
              </p>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg">{locale === 'ar' ? 'اسم الشركة / النشاط' : 'Company Name'}</label>
                    <input required className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium" placeholder={locale === 'ar' ? 'مثال: شركة التشطيب الحديث' : 'e.g. Modern Decor Ltd.'} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg">{locale === 'ar' ? 'نوع الخدمة' : 'Primary Service'}</label>
                    <div className="relative">
                      <select required className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium w-full appearance-none">
                        <option value="">{locale === 'ar' ? 'اختر الخدمة الأساسية' : 'Select Service'}</option>
                        <option value="ren">{locale === 'ar' ? 'تشطيب ومقاولات' : 'Renovation & Contracting'}</option>
                        <option value="sty">{locale === 'ar' ? 'فرش وتصميم داخلي' : 'Interior Styling & Furnishing'}</option>
                        <option value="pho">{locale === 'ar' ? 'تصوير عقاري' : 'Property Photography'}</option>
                        <option value="cle">{locale === 'ar' ? 'نظافة فندقية' : 'Deep Cleaning'}</option>
                        <option value="man">{locale === 'ar' ? 'إدارة أملاك' : 'Property Management'}</option>
                        <option value="oth">{locale === 'ar' ? 'أخرى' : 'Other'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary-400" />
                      {locale === 'ar' ? 'نطاق العمل (المناطق)' : 'Operating Zones'}
                    </label>
                    <input required className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium" placeholder={locale === 'ar' ? 'أين يمكنك تقديم الخدمة بفاعلية؟' : 'e.g. New Cairo, Sahel...'} />
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="font-bold font-heading text-secondary-900 text-lg">{locale === 'ar' ? 'رابط سابقة الأعمال (إنستقرام / موقع ويب)' : 'Portfolio Link'}</label>
                    <input required type="url" className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium" dir="ltr" placeholder="https://" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2">
                      <Phone className="w-5 h-5 text-secondary-400" />
                      {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input required type="tel" className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium" dir="ltr" placeholder="+20..." />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-bold font-heading text-secondary-900 text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5 text-secondary-400" />
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input required type="email" className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-4 focus:border-primary-500 focus:bg-white transition-colors outline-none font-medium" dir="ltr" placeholder="contact@..." />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-secondary-100">
                  <Button type="submit" size="lg" className="w-full h-16 text-xl shadow-lg shadow-primary-500/20" disabled={isSubmitting}>
                    {isSubmitting ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (locale === 'ar' ? 'تقديم طلب الانضمام' : 'Submit Application')}
                  </Button>
                  <p className="text-secondary-400 text-sm text-center mt-4">
                    {locale === 'ar' ? 'التقديم مجاني تماماً.' : 'Application is completely free.'}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
