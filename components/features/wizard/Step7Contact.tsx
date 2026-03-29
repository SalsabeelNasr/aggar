'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { ChevronDown, Lock } from 'lucide-react';
import { useEvaluationStore } from '@/lib/store';
import { PHONE_COUNTRIES } from '@/lib/phone/phoneCountries';
import { leadWhatsappToFormFields } from '@/lib/validations/phone';
import {
  createWizardContactSchema,
  normalizeContactPhoneForStore,
  type WizardContactValues,
} from '@/lib/validations/wizard-contact';
import { cn } from '@/lib/utils';

const CONTACT_MSG = {
  en: {
    fullName: 'Enter your full name (at least 2 characters).',
    email: 'Enter a valid email address.',
    whatsapp: 'Enter a valid phone number for this region.',
  },
  ar: {
    fullName: 'أدخل اسمك الكريم (حرفين على الأقل).',
    email: 'أدخل بريد إلكتروني صح.',
    whatsapp: 'أدخل رقم موبايل صح.',
  },
} as const;

export type Step7ContactHandle = {
  validateAndSync: () => Promise<boolean>;
};

export const Step7Contact = React.forwardRef<Step7ContactHandle, object>(function Step7Contact(_props, ref) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const { lead, updateLead } = useEvaluationStore();
  const messages = isAr ? CONTACT_MSG.ar : CONTACT_MSG.en;
  const schema = React.useMemo(() => createWizardContactSchema(messages), [messages]);

  const phoneDefaults = React.useMemo(() => leadWhatsappToFormFields(lead.whatsapp ?? ''), [lead.whatsapp]);

  const form = useForm<WizardContactValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: lead.fullName,
      email: lead.email,
      countryCode: phoneDefaults.countryCode,
      phone: phoneDefaults.phone,
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    const p = leadWhatsappToFormFields(lead.whatsapp ?? '');
    form.reset({
      fullName: lead.fullName,
      email: lead.email,
      countryCode: p.countryCode,
      phone: p.phone,
    });
  }, [lead.fullName, lead.email, lead.whatsapp, form]);

  const selectedCountryCode = form.watch('countryCode');
  const selectedCountry = React.useMemo(
    () => PHONE_COUNTRIES.find((x) => x.code === selectedCountryCode) ?? PHONE_COUNTRIES[0],
    [selectedCountryCode]
  );

  React.useImperativeHandle(ref, () => ({
    validateAndSync: async () => {
      const ok = await form.trigger();
      if (!ok) {
        const state = form.formState;
        const order = ['fullName', 'countryCode', 'phone', 'email'] as const;
        for (const name of order) {
          if (!form.getFieldState(name, state).invalid) continue;
          const id =
            name === 'fullName'
              ? 'contact-fullName'
              : name === 'countryCode'
                ? 'contact-countryCode'
                : name === 'phone'
                  ? 'contact-phone'
                  : 'contact-email';
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
          break;
        }
        return false;
      }
      const v = form.getValues();
      updateLead({
        fullName: v.fullName,
        email: v.email,
        whatsapp: normalizeContactPhoneForStore(v.phone, v.countryCode),
      });
      return true;
    },
  }));

  const errCls = 'border-red-500 focus:border-red-500';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {isAr ? 'أين نرسل لك التقرير المخصص؟' : 'Where should we send your custom report?'}
        </h2>
        <p className="text-secondary-600 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-green-600" aria-hidden />
          {isAr ? 'بياناتك آمنة تماماً. لا توجد رسائل مزعجة.' : 'Your data is secure. No spam.'}
        </p>
      </div>

      <form className="bg-white p-8 rounded-2xl border border-secondary-200 shadow-sm flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading" htmlFor="contact-fullName">
            {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <input
            id="contact-fullName"
            autoComplete="name"
            className={`border-2 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors ${
              form.formState.errors.fullName ? errCls : 'border-secondary-200'
            }`}
            placeholder={isAr ? 'أدخل اسمك الكريم' : 'Enter your name'}
            aria-invalid={form.formState.errors.fullName ? true : undefined}
            {...form.register('fullName')}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading" htmlFor="contact-phone">
            {isAr ? 'رقم واتساب' : 'WhatsApp number'}
          </label>
          <div
            className={cn(
              'flex overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-500/30',
              form.formState.errors.phone ? 'border-red-500' : 'border-secondary-200'
            )}
          >
            <div className="relative w-11 shrink-0 border-e border-secondary-200 bg-secondary-50">
              <select
                id="contact-countryCode"
                aria-label={isAr ? 'رمز الدولة' : 'Country code'}
                className="h-full w-full min-h-[48px] cursor-pointer appearance-none bg-transparent py-2.5 text-transparent outline-none"
                aria-invalid={form.formState.errors.countryCode ? true : undefined}
                {...form.register('countryCode')}
              >
                {PHONE_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.dial} - {isAr ? country.label.ar : country.label.en}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center ps-0.5"
              >
                <span className="flex items-center gap-0.5 text-base">
                  {selectedCountry.flag}
                  <ChevronDown aria-hidden className="h-3.5 w-3.5 text-secondary-500" />
                </span>
              </span>
            </div>
            <input
              id="contact-phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder={
                isAr ? `${selectedCountry.dial} رقم الهاتف` : `${selectedCountry.dial} Phone number`
              }
              className="w-full min-h-[48px] px-3 py-2.5 text-sm outline-none"
              aria-invalid={form.formState.errors.phone ? true : undefined}
              {...form.register('phone')}
            />
          </div>
          {form.formState.errors.countryCode && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.countryCode.message}</p>
          )}
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading" htmlFor="contact-email">
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className={`border-2 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors ${
              form.formState.errors.email ? errCls : 'border-secondary-200'
            }`}
            placeholder="name@example.com"
            dir="ltr"
            aria-invalid={form.formState.errors.email ? true : undefined}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.email.message}</p>
          )}
        </div>
      </form>
    </div>
  );
});
