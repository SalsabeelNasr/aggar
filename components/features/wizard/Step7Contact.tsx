'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { createWizardContactSchema, type WizardContactValues } from '@/lib/validations/wizard-contact';

const CONTACT_MSG = {
  en: {
    fullName: 'Enter your full name (at least 2 characters).',
    email: 'Enter a valid email address.',
    whatsapp: 'Enter a valid phone number for this region (e.g. Egypt +20).',
  },
  ar: {
    fullName: 'أدخل اسمك الكامل (حرفان على الأقل).',
    email: 'أدخل بريدًا إلكترونيًا صالحًا.',
    whatsapp: 'أدخل رقم هاتف صالح لهذه المنطقة (مثل مصر +20).',
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

  const form = useForm<WizardContactValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: lead.fullName,
      email: lead.email,
      whatsapp: lead.whatsapp,
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    form.reset({
      fullName: lead.fullName,
      email: lead.email,
      whatsapp: lead.whatsapp,
    });
  }, [lead.fullName, lead.email, lead.whatsapp, form]);

  React.useImperativeHandle(ref, () => ({
    validateAndSync: async () => {
      const ok = await form.trigger();
      if (!ok) return false;
      const v = form.getValues();
      updateLead({ fullName: v.fullName, email: v.email, whatsapp: v.whatsapp });
      return true;
    },
  }));

  const errCls = 'border-red-500 focus:border-red-500';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'شارك بيانات التواصل للوصول إلى نتائجك' : 'Share your contact to access your results'}
        </h2>
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
          <label className="font-bold text-secondary-900 font-heading" htmlFor="contact-whatsapp">
            {isAr ? 'رقم واتساب' : 'WhatsApp number'}
          </label>
          <input
            id="contact-whatsapp"
            type="tel"
            autoComplete="tel"
            className={`border-2 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors ${
              form.formState.errors.whatsapp ? errCls : 'border-secondary-200'
            }`}
            placeholder="+20 1XX XXX XXXX"
            dir="ltr"
            aria-invalid={form.formState.errors.whatsapp ? true : undefined}
            {...form.register('whatsapp')}
          />
          {form.formState.errors.whatsapp && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.whatsapp.message}</p>
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
