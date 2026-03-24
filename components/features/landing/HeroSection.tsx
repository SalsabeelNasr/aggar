'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-secondary-50">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className="flex flex-col items-start text-start max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100/50 text-primary-800 rounded-full text-sm font-bold border border-primary-200 mb-6 font-heading">
            {locale === 'ar' ? 'اعرف إمكانيات شقتك… ونوصلك بالناس الصح' : 'Know your apartment\'s potential... and let us connect you with the right people'}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-heading font-extrabold text-secondary-900 tracking-tight leading-tight">
            {locale === 'ar' 
              ? 'خلي شقتك تشتغل وتكسب… بدل ما تفضل فاضية' 
              : 'Find out how much your apartment could earn'}
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-secondary-600 font-medium leading-relaxed">
            {locale === 'ar'
              ? 'اعرف شقتك ممكن تكسب كام من التأجير القصير خلال دقيقتين بس. وهنوصلك بالخبراء اللي يقدروا يجهزوها علشان تحقق أعلى دخل.'
              : 'Evaluate your property in minutes and discover the fastest path to rental income.'}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <Button size="lg" onClick={() => router.push('/evaluate')} className="w-full sm:w-auto px-10 shadow-lg shadow-primary-500/20 text-lg">
              {locale === 'ar' ? 'ابدأ تقييم شقتك' : 'Start your evaluation'}
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-secondary-500 font-medium">
            {locale === 'ar' ? 'تحليل مبني على بيانات سوق الإيجار السياحي في مصر.' : 'Analysis based on Egypt\'s tourism rental market data.'}
          </p>
        </div>

        <div className="relative w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-secondary-900/10 border border-secondary-200/50">
          <Image 
            src="/images/hero.jpg" 
            alt={locale === 'ar' ? 'شقة جاهزة للإيجار السياحي' : 'Ready for short-term rental'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/30 to-transparent pointer-events-none" />
        </div>

      </div>
      
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
