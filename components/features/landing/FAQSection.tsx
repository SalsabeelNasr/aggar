'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/lib/navigation';

export function FAQSection() {
  const locale = useLocale();
  const router = useRouter();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = locale === 'ar' ? [
    { q: 'هل Aggar بتدير الشقق؟', a: 'لا. إحنا بنقيّم شقتك ونوصلك بالشركات اللي تقدم الخدمات المتخصصة.' },
    { q: 'هل لازم أتعامل مع الشركاء؟', a: 'لا. التقييم مفيد لك حتى لو حبيت تدير وتشطب الشقة بنفسك.' },
    { q: 'هل التقييم مجاني؟', a: 'أيوه. التقييم بالكامل مجاني ولا يتطلب أي التزامات.' },
    { q: 'هل النتائج دقيقة؟', a: 'التقدير مبني على بيانات السوق السياحي في نفس المنطقة مع تحليل وتحديد حالة الشقة باستخدام الصور.' }
  ] : [
    { q: 'Does Aggar manage the apartments?', a: 'No. We assess your apartment and connect you with service companies.' },
    { q: 'Do I have to use your partners?', a: 'No. The assessment is useful even if you want to manage the apartment yourself.' },
    { q: 'Is the assessment free?', a: 'Yes. The assessment is completely free.' },
    { q: 'Are the results accurate?', a: 'The estimate is based on market data in the same area along with analysis of the apartment\'s condition and photos.' }
  ];

  return (
    <section className="w-full py-24 bg-secondary-50 relative">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-block px-5 py-2 bg-primary-100 text-primary-800 rounded-full text-base font-bold border border-primary-200 mb-6 font-heading shadow-sm">
            {locale === 'ar' ? 'دور Aggar إيه؟' : 'What is Aggar\'s role?'}
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-secondary-900 mb-6 tracking-tight">
            {locale === 'ar' ? 'Aggar مش شركة إدارة عقارات' : 'Aggar helps you find your apartment potential and connects you to trusted partners.'}
          </h2>
          <p className="text-lg text-secondary-600 font-medium leading-relaxed max-w-xl mx-auto">
            {locale === 'ar' 
              ? 'إحنا منصة تساعدك تفهم إمكانيات شقتك وتعطيك توصيات دقيقة وتوصلك مع شركاء مستقلين لأفضل النتائج.'
              : 'We are a platform that '}
          </p>
        </div>

        <div className="space-y-4 mb-24">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={cn(
                "border rounded-xl bg-white overflow-hidden transition-all duration-300",
                openIndex === idx ? "border-primary-400 shadow-md ring-4 ring-primary-50" : "border-secondary-200 hover:border-secondary-300"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-start px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className="font-heading font-bold text-lg text-secondary-900 pr-4">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-secondary-400 transition-transform duration-300 shrink-0", openIndex === idx && "rotate-180 text-primary-600")} />
              </button>
              <div className={cn("px-6 overflow-hidden transition-all duration-300 ease-in-out", openIndex === idx ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0")}>
                <p className="text-secondary-600 leading-relaxed text-base font-medium">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-white p-12 rounded-3xl border border-secondary-200 shadow-xl shadow-secondary-900/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/50 to-transparent -z-10 group-hover:from-primary-100/50 transition-colors duration-500" />
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary-900 mb-6 tracking-tight">
            {locale === 'ar' ? 'شقتك ممكن تكسب أكتر بكتير' : 'Your apartment could earn much more'}
          </h2>
          <p className="text-xl text-secondary-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
            {locale === 'ar' ? 'اعرف إمكانياتها… وخلي الخبراء يساعدوك توصل لأفضل نتيجة.' : 'Find out its potential... and let the experts help you achieve the best outcome.'}
          </p>
          <Button size="lg" onClick={() => router.push('/evaluate')} className="w-full sm:w-auto px-12 shadow-lg shadow-primary-500/20 text-xl h-16">
            {locale === 'ar' ? 'ابدأ تقييم شقتك مجاناً' : 'Start Free Assessment'}
          </Button>
        </div>

      </div>
    </section>
  );
}
