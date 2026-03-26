import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

/** Default region for WhatsApp / phone placeholders (+20). */
export const DEFAULT_PHONE_COUNTRY: CountryCode = 'EG';

export function isValidPhoneForCountry(value: string, country: CountryCode = DEFAULT_PHONE_COUNTRY): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const parsed = parsePhoneNumberFromString(trimmed, country);
  return parsed ? parsed.isValid() : false;
}
