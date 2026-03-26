'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { listingStatusSkipsPropertyStateStep } from '@/models';
import { useEvaluationStore } from '@/lib/store';
import { Stepper } from '@/components/ui/Stepper';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { Step0Listed } from '@/components/features/wizard/Step0Listed';
import { Step1Location } from '@/components/features/wizard/Step1Location';
import { Step2Asset } from '@/components/features/wizard/Step2Asset';
import { Step3State } from '@/components/features/wizard/Step3State';
import { Step4StateDetails } from '@/components/features/wizard/Step4StateDetails';
import { StepPainPoints } from '@/components/features/wizard/StepPainPoints';
import { StepFurnishedPerformance } from '@/components/features/wizard/StepFurnishedPerformance';
import { Step5Hassle } from '@/components/features/wizard/Step5Hassle';
import { Step7Contact, type Step7ContactHandle } from '@/components/features/wizard/Step7Contact';
import { StepPhotos } from '@/components/features/wizard/StepPhotos';
import { WizardValidationContext } from '@/components/features/wizard/WizardValidationContext';
import { validateEvaluationStep } from '@/lib/validations/wizard-steps';

/** Non-furnished: State → Details → Photos → Operations → Results */
const stepsAR_NF = ['العقار', 'الموقع', 'هل عقارك مُعلن؟', 'حالة العقار', 'التفاصيل', 'الصور', 'التشغيل', 'النتيجة'];
const stepsEN_NF = ['Property', 'Location', 'Listed?', 'State', 'Details', 'Photos', 'Operations', 'Results'];

/** Furnished: State → Details → Photos → Operations → Pain points → Performance → Results */
const stepsAR_F = [
  'العقار',
  'الموقع',
  'هل عقارك مُعلن؟',
  'حالة العقار',
  'التفاصيل',
  'الصور',
  'التشغيل',
  'نقاط الألم',
  'الأداء',
  'النتيجة',
];
const stepsEN_F = [
  'Property',
  'Location',
  'Listed?',
  'State',
  'Details',
  'Photos',
  'Operations',
  'Pain points',
  'Performance',
  'Results',
];

export default function EvaluatePage() {
  const locale = useLocale();
  const router = useRouter();
  const { currentStep, nextStep, prevStep, setStep, setResultsAccess, updateLead, updateData, data } =
    useEvaluationStore();

  const [wizardFieldErrors, setWizardFieldErrors] = React.useState<Record<string, string>>({});
  const contactRef = React.useRef<Step7ContactHandle | null>(null);

  const isFurnishedReno = data.stateFlag === 'FURNISHED_RENO';
  const skipPropertyStateStep = listingStatusSkipsPropertyStateStep(data.listingStatus);
  const contactStep = isFurnishedReno ? 9 : 7;

  const steps = React.useMemo(() => {
    const ar = [...(isFurnishedReno ? stepsAR_F : stepsAR_NF)];
    const en = [...(isFurnishedReno ? stepsEN_F : stepsEN_NF)];
    if (skipPropertyStateStep) {
      ar.splice(3, 1);
      en.splice(3, 1);
    }
    return locale === 'ar' ? ar : en;
  }, [locale, isFurnishedReno, skipPropertyStateStep]);

  const stepperCurrentStep =
    skipPropertyStateStep && currentStep >= 4 ? currentStep - 1 : currentStep;

  React.useEffect(() => {
    if (!skipPropertyStateStep || currentStep !== 3) return;
    updateData({ stateFlag: 'FURNISHED_RENO' });
    setStep(4);
  }, [skipPropertyStateStep, currentStep, setStep, updateData]);

  React.useEffect(() => {
    if (currentStep > contactStep) setStep(contactStep);
  }, [currentStep, contactStep, setStep]);

  const runStepValidation = React.useCallback(() => {
    return validateEvaluationStep({
      currentStep,
      data,
      isFurnishedReno,
      contactStep,
      locale: locale === 'ar' ? 'ar' : 'en',
    });
  }, [contactStep, currentStep, data, isFurnishedReno, locale]);

  const handleNext = async () => {
    if (currentStep === 2 && skipPropertyStateStep) {
      const v = runStepValidation();
      if (!v.ok) {
        setWizardFieldErrors(v.errors);
        return;
      }
      setWizardFieldErrors({});
      setStep(4);
      return;
    }

    if (currentStep === contactStep) {
      const ok = await contactRef.current?.validateAndSync();
      if (ok !== true) return;
      setWizardFieldErrors({});
      setResultsAccess('full');
      updateLead({ submittedAtISO: new Date().toISOString() });
      router.push('/results');
      return;
    }

    const v = runStepValidation();
    if (!v.ok) {
      setWizardFieldErrors(v.errors);
      return;
    }
    setWizardFieldErrors({});
    nextStep();
  };

  const handlePrev = () => {
    setWizardFieldErrors({});
    if (currentStep === 0) {
      router.push('/');
      return;
    }

    if (currentStep === 4 && skipPropertyStateStep) {
      setStep(2);
      return;
    }

    prevStep();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl flex flex-col min-h-[calc(100vh-200px)]">
      <Stepper steps={steps} currentStep={stepperCurrentStep} className="mb-12" />
      <CookieConsent variant="inline" />

      <WizardValidationContext.Provider value={{ errors: wizardFieldErrors }}>
        <div className="flex-grow flex flex-col relative w-full overflow-hidden">
          {currentStep === 0 && <Step2Asset />}
          {currentStep === 1 && <Step1Location />}
          {currentStep === 2 && <Step0Listed />}
          {currentStep === 3 && <Step3State />}
          {currentStep === 4 && <Step4StateDetails />}
          {currentStep === 5 && <StepPhotos />}
          {currentStep === 6 && <Step5Hassle />}
          {currentStep === 7 && (isFurnishedReno ? <StepPainPoints /> : <Step7Contact ref={contactRef} />)}
          {currentStep === 8 && isFurnishedReno && <StepFurnishedPerformance />}
          {currentStep === 9 && isFurnishedReno && <Step7Contact ref={contactRef} />}
        </div>
      </WizardValidationContext.Provider>

      <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-sm z-10 sticky bottom-4">
        <Button variant="ghost" onClick={handlePrev} className="gap-2 shrink-0">
          {locale === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="hidden sm:inline">{locale === 'ar' ? (currentStep === 0 ? 'رجوع' : 'السابق') : (currentStep === 0 ? 'Back' : 'Previous')}</span>
        </Button>
        <Button onClick={() => void handleNext()} className="gap-2 px-6 shadow-sm shadow-primary-500/20 shrink-0">
          {locale === 'ar'
            ? currentStep === contactStep
              ? 'عرض النتيجة المخصصة'
              : 'التالي'
            : currentStep === contactStep
              ? 'Get Custom Results'
              : 'Next'}
          {locale === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
