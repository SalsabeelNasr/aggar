import { z } from 'zod';
import { DEFAULT_PHONE_COUNTRY, isValidPhoneForCountry } from '@/lib/validations/phone';

export interface WizardContactMessages {
  fullName: string;
  email: string;
  whatsapp: string;
}

export function createWizardContactSchema(messages: WizardContactMessages) {
  return z.object({
    fullName: z.string().trim().min(2, messages.fullName),
    email: z.string().trim().email(messages.email),
    whatsapp: z
      .string()
      .trim()
      .refine((v) => isValidPhoneForCountry(v, DEFAULT_PHONE_COUNTRY), messages.whatsapp),
  });
}

export type WizardContactValues = z.infer<ReturnType<typeof createWizardContactSchema>>;
