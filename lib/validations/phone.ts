import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { PHONE_COUNTRIES } from '@/lib/phone/phoneCountries';

/** Default region for WhatsApp / phone placeholders (+20). */
export const DEFAULT_PHONE_COUNTRY: CountryCode = 'EG';

const ALLOWED_WIZARD_PHONE_COUNTRIES = new Set(PHONE_COUNTRIES.map((c) => c.code));

export function isValidPhoneForCountry(value: string, country: CountryCode = DEFAULT_PHONE_COUNTRY): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const parsed = parsePhoneNumberFromString(trimmed, country);
  return parsed ? parsed.isValid() : false;
}

/** Split stored WhatsApp/E.164 into country + national-formatted local part for the country-selector UI. */
export function leadWhatsappToFormFields(whatsapp: string): { countryCode: CountryCode; phone: string } {
  const t = whatsapp.trim();
  if (!t) return { countryCode: DEFAULT_PHONE_COUNTRY, phone: '' };
  const p = parsePhoneNumberFromString(t);
  if (p?.country) {
    if (!ALLOWED_WIZARD_PHONE_COUNTRIES.has(p.country)) {
      return { countryCode: DEFAULT_PHONE_COUNTRY, phone: p.format('E.164') };
    }
    return { countryCode: p.country, phone: p.formatNational() };
  }
  const p2 = parsePhoneNumberFromString(t, DEFAULT_PHONE_COUNTRY);
  if (p2?.country) {
    if (!ALLOWED_WIZARD_PHONE_COUNTRIES.has(p2.country)) {
      return { countryCode: DEFAULT_PHONE_COUNTRY, phone: p2.format('E.164') };
    }
    return { countryCode: p2.country, phone: p2.formatNational() };
  }
  return { countryCode: DEFAULT_PHONE_COUNTRY, phone: t };
}
