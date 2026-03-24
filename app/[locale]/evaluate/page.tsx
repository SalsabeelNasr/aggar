'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { useEvaluationStore } from '@/lib/store';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { Step1Location } from '@/components/features/wizard/Step1Location';
import { Step2Asset } from '@/components/features/wizard/Step2Asset';
import { Step3State } from '@/components/features/wizard/Step3State';
import { Step4Goal } from '@/components/features/wizard/Step4Goal';
import { Step5Hassle } from '@/components/features/wizard/Step5Hassle';
import { Step6Bawab } from '@/components/features/wizard/Step6Bawab';
import { Step7Contact } from '@/components/features/wizard/Step7Contact';

const stepsAR = ['الموقع', 'العقار', 'الحالة والصور', 'الهدف', 'التشغيل', 'البواب', 'النتيجة'];
const stepsEN = ['Location', 'Asset', 'State & Photos', 'Goal', 'Hassle', 'Access', 'Results'];

export default function EvaluatePage() {
  const locale = useLocale();
  const router = useRouter();
  const { currentStep, nextStep, prevStep } = useEvaluationStore();
  
  const steps = locale === 'ar' ? stepsAR : stepsEN;

  const handleNext = () => {
    if (currentStep === 6) {
      router.push('/results');
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      router.push('/');
    } else {
      prevStep();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl flex flex-col min-h-[calc(100vh-200px)]">
      <Stepper steps={steps} currentStep={currentStep} className="mb-12" />
      
      <div className="flex-grow flex flex-col relative w-full overflow-hidden">
        {currentStep === 0 && <Step1Location />}
        {currentStep === 1 && <Step2Asset />}
        {currentStep === 2 && <Step3State />}
        {currentStep === 3 && <Step4Goal />}
        {currentStep === 4 && <Step5Hassle />}
        {currentStep === 5 && <Step6Bawab />}
        {currentStep === 6 && <Step7Contact />}
      </div>

      <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-sm z-10 sticky bottom-4">
        <Button variant="ghost" onClick={handlePrev} className="gap-2 shrink-0">
          {locale === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="hidden sm:inline">{locale === 'ar' ? (currentStep === 0 ? 'رجوع' : 'السابق') : (currentStep === 0 ? 'Back' : 'Previous')}</span>
        </Button>
        <Button onClick={handleNext} className="gap-2 px-6 shadow-sm shadow-primary-500/20 shrink-0">
          {locale === 'ar' ? (currentStep === 6 ? 'عرض النتيجة المخصصة' : 'التالي') : (currentStep === 6 ? 'Get Custom Results' : 'Next')}
          {locale === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
