import { defineRouting } from 'next-intl/routing';

/** Single source of truth for middleware + navigation (prefix rules, default locale). */
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
});
