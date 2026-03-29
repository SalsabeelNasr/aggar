'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { listingStatusSkipsPropertyStateStep } from '@/models';
import { furnishedPerformanceStepHasVisibleCards } from '@/lib/wizard/furnishedPerformanceVisibility';
import { useEvaluationStore } from '@/lib/store';
import { submitEvaluation } from '@/lib/evaluationApi/client';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { ReportLoadingStatus } from '@/components/ui/ReportLoadingStatus';
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
import { firstWizardErrorFieldKey } from '@/lib/wizard/error-order';

function wizardErrorsShallowEqual(a: Record<string, string>, b: Record<string, string>): boolean {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => a[k] === b[k]);
}

/** Non-furnished: Property → Location → Listed? → State → Budget → Photos → Operations → Results */
const stepsAR_NF = ['نوع العقار', 'المكان', 'هل هو معلن؟', 'حالة العقار', 'الميزانية', 'الصور', 'التشغيل', 'بيانات التواصل'];
const stepsEN_NF = ['Property', 'Location', 'Listed?', 'State', 'Budget', 'Photos', 'Operations', 'Contact'];

/** Furnished: + Pain points + Performance before Results */
const stepsAR_F = [
  'نوع العقار',
  'المكان',
  'هل هو معلن؟',
  'حالة العقار',
  'الميزانية',
  'الصور',
  'التشغيل',
  'التحديات',
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
    setReportId,
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
  const skipFurnishedPerformanceStep =
    isFurnished && !furnishedPerformanceStepHasVisibleCards(data.mode);
  const finalStep = isFurnished ? 9 : 7;

  const steps = React.useMemo(() => {
    const ar = [...(isFurnished ? stepsAR_F : stepsAR_NF)];
    const en = [...(isFurnished ? stepsEN_F : stepsEN_NF)];
    if (skipPropertyStateStep) {
      ar.splice(3, 1);
      en.splice(3, 1);
    }
    if (isFurnished && skipFurnishedPerformanceStep) {
      const perfIndex = skipPropertyStateStep ? 7 : 8;
      ar.splice(perfIndex, 1);
      en.splice(perfIndex, 1);
    }
    return locale === 'ar' ? ar : en;
  }, [locale, isFurnished, skipPropertyStateStep, skipFurnishedPerformanceStep]);

  const stepperCurrentStep = React.useMemo(() => {
    let s = currentStep;
    if (skipPropertyStateStep && currentStep >= 4) s -= 1;
    if (isFurnished && skipFurnishedPerformanceStep && currentStep >= 9) s -= 1;
    return s;
  }, [currentStep, skipPropertyStateStep, isFurnished, skipFurnishedPerformanceStep]);

  React.useEffect(() => {
    if (!skipPropertyStateStep || currentStep !== 3) return;
    updateData({ stateFlag: 'FURNISHED' });
    setStep(4);
  }, [skipPropertyStateStep, currentStep, setStep, updateData]);

  React.useEffect(() => {
    if (!isFurnished || !skipFurnishedPerformanceStep || currentStep !== 8) return;
    setStep(9);
  }, [isFurnished, skipFurnishedPerformanceStep, currentStep, setStep]);

  React.useEffect(() => {
    if (currentStep > finalStep) setStep(finalStep);
  }, [currentStep, finalStep, setStep]);

  React.useEffect(() => {
    const keys = Object.keys(wizardFieldErrors);
    if (keys.length === 0) return;
    const field = firstWizardErrorFieldKey(currentStep, wizardFieldErrors);
    if (!field) return;
    const scrollField = field === 'hassleLevel' ? 'mode' : field;
    const run = () => {
      const el = document.querySelector(`[data-wizard-field="${scrollField}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [wizardFieldErrors, currentStep]);

  /** Clear or shrink field errors as soon as the user fixes inputs (no need to press Next). */
  React.useEffect(() => {
    setWizardFieldErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const d = useEvaluationStore.getState().data;
      const furnished = d.stateFlag === 'FURNISHED';
      const fStep = furnished ? 9 : 7;
      const v = validateEvaluationStep({
        currentStep,
        data: d,
        isFurnished: furnished,
        finalStep: fStep,
        locale: locale === 'ar' ? 'ar' : 'en',
      });
      if (v.ok) return {};
      if (wizardErrorsShallowEqual(prev, v.errors)) return prev;
      return v.errors;
    });
  }, [data, currentStep, locale]);

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

    if (currentStep === 7 && isFurnished && skipFurnishedPerformanceStep) {
      const v = runStepValidation();
      if (!v.ok) {
        setWizardFieldErrors(v.errors);
        return;
      }
      setWizardFieldErrors({});
      setStep(9);
      return;
    }

    if (currentStep === finalStep) {
      setSubmitError(null);
      const contact = contactRef.current;
      if (!contact) {
        setSubmitError(
          locale === 'ar'
            ? 'النموذج ما زال يُحمّل. أعد المحاولة بعد لحظة.'
            : 'The form is still loading. Please try again in a moment.'
        );
        return;
      }
      const ok = await contact.validateAndSync();
      if (ok !== true) return;

      const snapshotPre = useEvaluationStore.getState().data;
      const locV = validateEvaluationStep({
        currentStep: 1,
        data: snapshotPre,
        isFurnished,
        finalStep,
        locale: locale === 'ar' ? 'ar' : 'en',
      });
      if (!locV.ok) {
        setWizardFieldErrors(locV.errors);
        setSubmitError(
          locale === 'ar'
            ? 'يرجى تصحيح بيانات الموقع قبل إنشاء التقرير.'
            : 'Please fix your property location before generating the report.'
        );
        setStep(1);
        return;
      }

      setWizardFieldErrors({});
      setSubmitError(null);
      setSubmitting(true);

      try {
        const snapshot = useEvaluationStore.getState().data;
        const { report, reportId } = await submitEvaluation(snapshot);

        setReport(report);
        setReportId(reportId ?? null);
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

    if (currentStep === 9 && isFurnished && skipFurnishedPerformanceStep) {
      setStep(7);
      return;
    }

    prevStep();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl flex flex-col min-h-[calc(100vh-200px)]">
      {submitting && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-secondary-50/95 px-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <ReportLoadingStatus locale={locale === 'ar' ? 'ar' : 'en'} />
        </div>
      )}
      <Stepper steps={steps} currentStep={stepperCurrentStep} className="mb-12" />

      <WizardValidationContext.Provider value={{ errors: wizardFieldErrors }}>
        <div className="flex-grow flex flex-col relative w-full min-w-0 overflow-x-visible overflow-y-visible px-0.5 sm:px-1">
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
        <Button
          onClick={() => {
            void handleNext();
          }}
          className="gap-2 px-6 shadow-sm shadow-primary-500/20 shrink-0"
          disabled={submitting}
        >
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
