import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WizardData, WizardLead, WizardState, DiyGuideLead } from '@/models';

interface EvaluationStore {
  data: WizardData;
  currentStep: number;
  lead: WizardLead;
  diyGuideLead: DiyGuideLead | null;
  resultsAccess: WizardState['resultsAccess'];
  updateData: (updates: Partial<WizardData>) => void;
  updateLead: (updates: Partial<WizardLead>) => void;
  updateDiyGuideLead: (lead: DiyGuideLead) => void;
  setResultsAccess: (access: WizardState['resultsAccess']) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialData: WizardData = {
  regionId: 'new_cairo',
  address: '',
  listingStatus: 'not_listed',
  propertyType: 'apartment',
  bedrooms: 2,
  bathrooms: 1,
  sleepCapacity: 4,
  stateFlag: 'FINISHED_EMPTY',
  acCoverage: 'adequate_functional',
  internetSpeed: 'fiber_100_plus',
  photoUpload: { files: [], aiSignals: [] },
  hassleLevel: 5,
  mode: 'MANAGED',
  regulatory: {
    inGatedCompound: undefined,
    hasLift: undefined,
    floorNumber: undefined,
    guestAccessSolution: undefined,
  },
  budgetBand: undefined,
  propertySizeSqm: undefined,
};

const initialLead: WizardLead = {
  fullName: '',
  email: '',
  whatsapp: '',
  preferredContactTime: 'afternoon',
  consentToPartnerNetwork: false,
};

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set) => ({
      data: { ...initialData },
      currentStep: 0,
      lead: { ...initialLead },
      diyGuideLead: null,
      resultsAccess: 'teaser',
      updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
      updateLead: (updates) => set((state) => ({ lead: { ...state.lead, ...updates } })),
      updateDiyGuideLead: (lead) => set({ diyGuideLead: lead }),
      setResultsAccess: (access) => set({ resultsAccess: access }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      setStep: (step) => set({ currentStep: step }),
      reset: () =>
        set({
          currentStep: 0,
          data: { ...initialData },
          lead: { ...initialLead },
          diyGuideLead: null,
          resultsAccess: 'teaser',
        }),
    }),
    {
      name: 'aggar-evaluation-v10',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        currentStep: state.currentStep,
        lead: state.lead,
        diyGuideLead: state.diyGuideLead,
        resultsAccess: state.resultsAccess,
      }),
    }
  )
);
