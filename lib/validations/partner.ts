import { z } from 'zod';
import { DEFAULT_PHONE_COUNTRY, isValidPhoneForCountry } from '@/lib/validations/phone';

const PRIMARY_SERVICE_VALUES = ['ren', 'sty', 'pho', 'cle', 'man', 'oth'] as const;

export interface PartnerApplicationMessages {
  companyName: string;
  primaryService: string;
  operatingZones: string;
  portfolioUrl: string;
  phone: string;
  email: string;
}

export function createPartnerApplicationSchema(messages: PartnerApplicationMessages) {
  return z.object({
    companyName: z.string().trim().min(2, messages.companyName),
    primaryService: z
      .string()
      .min(1, messages.primaryService)
      .refine(
        (v): v is (typeof PRIMARY_SERVICE_VALUES)[number] =>
          (PRIMARY_SERVICE_VALUES as readonly string[]).includes(v),
        messages.primaryService
      ),
    operatingZones: z.string().trim().min(2, messages.operatingZones),
    portfolioUrl: z.string().trim().url(messages.portfolioUrl),
    phone: z
      .string()
      .trim()
      .refine((v) => isValidPhoneForCountry(v, DEFAULT_PHONE_COUNTRY), messages.phone),
    email: z.string().trim().email(messages.email),
  });
}

export type PartnerApplicationValues = z.infer<ReturnType<typeof createPartnerApplicationSchema>>;
