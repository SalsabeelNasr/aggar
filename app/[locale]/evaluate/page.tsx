'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { listingStatusSkipsPropertyStateStep } from '@/models';
import { useEvaluationStore } from '@/lib/store';
import type { EvaluationReport } from '@/lib/evaluation/types';
import { Stepper } from '@/components/ui/Stepper';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { Step0Listed } from '@/components/features/wizard/Step0Listed';
import { Step1Location } from '@/components/features/wizard/Step1Location';
import { Step2Asset } from '@/components/features/wizard/Step2Asset';
import { Step3State } from '@/components/features/wizard/Step3State';
import { StepPainPoints } from '@/components/features/wizard/StepPainPoints';
import { StepFurnishedPerformance } from '@/components/features/wizard/StepFurnishedPerformance';
import { Step5Hassle } from '@/components/features/wizard/Step5Hassle';
import { Step7Contact, type Step7ContactHandle } from '@/components/features/wizard/Step7Contact';
import { StepPhotos } from '@/components/features/wizard/StepPhotos';
import { StepBudgetSize } from '@/components/features/wizard/StepBudgetSize';
import { WizardValidationContext } from '@/components/features/wizard/WizardValidationContext';
import { validateEvaluationStep } from '@/lib/validations/wizard-steps';

/** Non-furnished: Property → Location → Listed? → State → Budget → Photos → Operations → Results */
const stepsAR_NF = ['العقار', 'الموقع', 'هل عقارك مُعلن؟', 'حالة العقار', 'الميزانية', 'الصور', 'التشغيل', 'بيانات التواصل'];
const stepsEN_NF = ['Property', 'Location', 'Listed?', 'State', 'Budget', 'Photos', 'Operations', 'Contact'];

/** Furnished: + Pain points + Performance before Results */
const stepsAR_F = [
  'العقار',
  'الموقع',
  'هل عقارك مُعلن؟',
  'حالة العقار',
  'الميزانية',
  'الصور',
  'التشغيل',
  'نقاط الألم',
  'الأداء',
  'بيانات التواصل',
];
const stepsEN_F = [
  'Property',
  'Location',
  'Listed?',
  'State',
  'Budget',
  'Photos',
  'Operations',
  'Pain points',
  'Performance',
  'Contact',
];

export default function EvaluatePage() {
  const locale = useLocale();
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    setResultsAccess,
    setReport,
    updateLead,
    updateData,
    updateDiyGuideLead,
    data,
  } = useEvaluationStore();

  const [wizardFieldErrors, setWizardFieldErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const contactRef = React.useRef<Step7ContactHandle | null>(null);

  const isFurnished = data.stateFlag === 'FURNISHED';
  const skipPropertyStateStep = listingStatusSkipsPropertyStateStep(data.listingStatus);
  const finalStep = isFurnished ? 9 : 7;

  const steps = React.useMemo(() => {
    const ar = [...(isFurnished ? stepsAR_F : stepsAR_NF)];
    const en = [...(isFurnished ? stepsEN_F : stepsEN_NF)];
    if (skipPropertyStateStep) {
      ar.splice(3, 1);
      en.splice(3, 1);
    }
    return locale === 'ar' ? ar : en;
  }, [locale, isFurnished, skipPropertyStateStep]);

  const stepperCurrentStep =
    skipPropertyStateStep && currentStep >= 4 ? currentStep - 1 : currentStep;

  React.useEffect(() => {
    if (!skipPropertyStateStep || currentStep !== 3) return;
    updateData({ stateFlag: 'FURNISHED' });
    setStep(4);
  }, [skipPropertyStateStep, currentStep, setStep, updateData]);

  React.useEffect(() => {
    if (currentStep > finalStep) setStep(finalStep);
  }, [currentStep, finalStep, setStep]);

  const runStepValidation = React.useCallback(() => {
    return validateEvaluationStep({
      currentStep,
      data,
      isFurnished,
      finalStep,
      locale: locale === 'ar' ? 'ar' : 'en',
    });
  }, [finalStep, currentStep, data, isFurnished, locale]);

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

    if (currentStep === finalStep) {
      const ok = await contactRef.current?.validateAndSync();
      if (ok !== true) return;
      setWizardFieldErrors({});
      setSubmitError(null);
      setSubmitting(true);

      try {
        const snapshot = useEvaluationStore.getState().data;
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(snapshot),
        });

        if (!res.ok) throw new Error('Evaluate failed');
        const json = (await res.json()) as { report?: EvaluationReport };
        if (!json.report || json.report.version !== 1) throw new Error('No report');

        setReport(json.report);
        setResultsAccess('full');
        updateLead({ submittedAtISO: new Date().toISOString() });
      } catch {
        setSubmitError(locale === 'ar' ? 'تعذر إنشاء التقرير. حاول مرة أخرى.' : 'Could not generate the report. Please try again.');
        setSubmitting(false);
        return;
      }

      const { lead } = useEvaluationStore.getState();
      updateDiyGuideLead({
        fullName: (lead.fullName ?? '').trim(),
        email: (lead.email ?? '').trim(),
        phone: (lead.whatsapp ?? '').trim(),
        requestedAtISO: new Date().toISOString(),
      });
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
          {currentStep === 4 && <StepBudgetSize />}
          {currentStep === 5 && <StepPhotos />}
          {currentStep === 6 && <Step5Hassle />}
          {currentStep === 7 && (isFurnished ? <StepPainPoints /> : <Step7Contact ref={contactRef} />)}
          {currentStep === 8 && isFurnished && <StepFurnishedPerformance />}
          {currentStep === 9 && isFurnished && <Step7Contact ref={contactRef} />}
        </div>
      </WizardValidationContext.Provider>

      {submitError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-sm z-10 sticky bottom-4">
        <Button variant="ghost" onClick={handlePrev} className="gap-2 shrink-0">
          {locale === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="hidden sm:inline">{locale === 'ar' ? (currentStep === 0 ? 'رجوع' : 'السابق') : (currentStep === 0 ? 'Back' : 'Previous')}</span>
        </Button>
        <Button onClick={() => void handleNext()} className="gap-2 px-6 shadow-sm shadow-primary-500/20 shrink-0" disabled={submitting}>
          {locale === 'ar'
            ? currentStep === finalStep
              ? submitting
                ? '...جاري الإنشاء'
                : 'إنشاء تقريري'
              : 'التالي'
            : currentStep === finalStep
              ? submitting
                ? 'Generating...'
                : 'Generate my report'
              : 'Next'}
          {locale === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
