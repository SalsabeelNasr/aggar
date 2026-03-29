import type { CountryCode } from 'libphonenumber-js';

export const PHONE_COUNTRIES: Array<{
  code: CountryCode;
  dial: string;
  flag: string;
  label: { en: string; ar: string };
}> = [
  { code: 'EG', dial: '+20', flag: '🇪🇬', label: { en: 'Egypt', ar: 'مصر' } },
  { code: 'SA', dial: '+966', flag: '🇸🇦', label: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { code: 'AE', dial: '+971', flag: '🇦🇪', label: { en: 'UAE', ar: 'الإمارات' } },
  { code: 'KW', dial: '+965', flag: '🇰🇼', label: { en: 'Kuwait', ar: 'الكويت' } },
  { code: 'QA', dial: '+974', flag: '🇶🇦', label: { en: 'Qatar', ar: 'قطر' } },
  { code: 'BH', dial: '+973', flag: '🇧🇭', label: { en: 'Bahrain', ar: 'البحرين' } },
  { code: 'US', dial: '+1', flag: '🇺🇸', label: { en: 'United States', ar: 'الولايات المتحدة' } },
  { code: 'GB', dial: '+44', flag: '🇬🇧', label: { en: 'United Kingdom', ar: 'المملكة المتحدة' } },
];
