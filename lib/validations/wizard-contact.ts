import { z } from 'zod';
import type { CountryCode } from 'libphonenumber-js';
import { PHONE_COUNTRIES } from '@/lib/phone/phoneCountries';
import { isValidPhoneForCountry } from '@/lib/validations/phone';

export interface WizardContactMessages {
  fullName: string;
  email: string;
  whatsapp: string;
}

const countryCodeSchema = z.custom<CountryCode>(
  (val): val is CountryCode =>
    typeof val === 'string' && PHONE_COUNTRIES.some((c) => c.code === (val as CountryCode))
);

export function createWizardContactSchema(messages: WizardContactMessages) {
  return z
    .object({
      fullName: z.string().trim().min(2, messages.fullName),
      email: z.string().trim().email(messages.email),
      countryCode: countryCodeSchema,
      phone: z.string().trim().min(1, messages.whatsapp),
    })
    .superRefine((value, ctx) => {
      const normalized = `${value.phone}`.trim();
      const hasPlusPrefix = normalized.startsWith('+');
      const selectedCountry = PHONE_COUNTRIES.find((x) => x.code === value.countryCode);
      const composed = hasPlusPrefix ? normalized : `${selectedCountry?.dial ?? '+20'} ${normalized}`;
      if (!isValidPhoneForCountry(composed, value.countryCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: messages.whatsapp,
        });
      }
    });
}

export type WizardContactValues = z.infer<ReturnType<typeof createWizardContactSchema>>;

/** E.164-friendly string for `lead.whatsapp` (same rules as results DIY phone field). */
export function normalizeContactPhoneForStore(phone: string, countryCode: CountryCode): string {
  const clean = phone.trim();
  if (!clean) return '';
  if (clean.startsWith('+')) return clean;
  const dial = PHONE_COUNTRIES.find((x) => x.code === countryCode)?.dial ?? '+20';
  return `${dial} ${clean}`;
}
