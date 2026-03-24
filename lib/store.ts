import { create } from 'zustand';
import { EvaluationInput } from '@/models';

interface EvaluationStore {
  data: Partial<EvaluationInput>;
  currentStep: number;
  contact: { name: string; phone: string; email: string };
  updateData: (updates: Partial<EvaluationInput>) => void;
  updateContact: (updates: Partial<{ name: string; phone: string; email: string }>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialData: Partial<EvaluationInput> = {
  regionId: 'new_cairo',
  propertyType: 'apartment',
  bedrooms: 2,
  bathrooms: 1,
  sleepCapacity: 4,
  state: 'finished_empty',
  goal: 'max_cashflow',
  hassleLevel: 5,
  hasBawab: true,
  mockedImageSignals: [],
};

const initialContact = { name: '', phone: '', email: '' };

export const useEvaluationStore = create<EvaluationStore>((set) => ({
  data: { ...initialData },
  currentStep: 0,
  contact: { ...initialContact },
  updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
  updateContact: (updates) => set((state) => ({ contact: { ...state.contact, ...updates } })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ currentStep: 0, data: { ...initialData }, contact: { ...initialContact } })
}));
