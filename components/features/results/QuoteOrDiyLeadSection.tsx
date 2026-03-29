'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CountryCode } from 'libphonenumber-js';
import { BookOpen, ChevronDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useEvaluationStore } from '@/lib/store';
import { PHONE_COUNTRIES } from '@/lib/phone/phoneCountries';
import { isValidPhoneForCountry } from '@/lib/validations/phone';

type DiyLeadValues = {
  fullName: string;
  email: string;
  countryCode: CountryCode;
  phone: string;
};

function createDiyGuideSchema(messages: {
  fullName: string;
  email: string;
  phone: string;
}) {
  return z
    .object({
      fullName: z.string().trim().min(2, messages.fullName),
      email: z.string().trim().email(messages.email),
      countryCode: z.string().trim().min(2) as z.ZodType<CountryCode>,
      phone: z.string().trim().min(1, messages.phone),
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
          message: messages.phone,
        });
      }
    });
}

type Props = {
  lo: 'en' | 'ar';
  onRequestQuote?: () => void;
  payAmountText: string;
  optimizedMonthlyText: string;
  currentMonthlyText: string;
};

export function QuoteOrDiyLeadSection({
  lo,
  onRequestQuote,
  payAmountText,
  optimizedMonthlyText,
  currentMonthlyText,
}: Props) {
  const { updateDiyGuideLead, diyGuideLead } = useEvaluationStore();
  const isAr = lo === 'ar';
  const messages = isAr
    ? {
        fullName: 'أدخل اسمك الكريم (حرفين على الأقل).',
        email: 'أدخل بريد إلكتروني صح.',
        phone: 'أدخل رقم موبايل صح.',
      }
    : {
        fullName: 'Enter your full name (at least 2 characters).',
        email: 'Enter a valid email address.',
        phone: 'Enter a valid phone number for this region.',
      };

  const schema = React.useMemo(() => createDiyGuideSchema(messages), [messages]);
  const form = useForm<DiyLeadValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: diyGuideLead?.fullName ?? '',
      email: diyGuideLead?.email ?? '',
      countryCode: 'EG',
      phone: diyGuideLead?.phone ?? '',
    },
    mode: 'onTouched',
  });

  const selectedCountryCode = form.watch('countryCode');
  const selectedCountry = React.useMemo(
    () => PHONE_COUNTRIES.find((x) => x.code === selectedCountryCode) ?? PHONE_COUNTRIES[0],
    [selectedCountryCode]
  );

  const onSubmit = form.handleSubmit((values) => {
    const cleanPhone = values.phone.trim();
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : `${selectedCountry.dial} ${cleanPhone}`;
    updateDiyGuideLead({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: normalizedPhone,
      requestedAtISO: new Date().toISOString(),
    });
  });

  const errCls = 'border-red-500 focus:border-red-500';

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-secondary-200 bg-gradient-to-br from-secondary-50 to-white p-5 shadow-xs">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
          <div className="flex h-full flex-col gap-3 lg:col-span-4 lg:pe-10">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-secondary-100 p-2.5">
                <Mail className="h-5 w-5 text-secondary-600" />
              </div>
              <h3 className="font-heading text-base font-semibold text-secondary-900">
                {isAr ? 'حابب نبدأ في التنفيذ؟' : 'Reach out to us'}
              </h3>
            </div>
            <div className="py-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 border-b border-secondary-100 pb-2">
                  <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary-700">
                    {isAr ? 'استثمار' : 'Invest'}
                  </span>
                  <span className="font-heading text-sm font-bold text-secondary-900">
                    {payAmountText}
                    <span className="ms-1 text-[10px] font-semibold text-secondary-500">ج.م</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-tight text-primary-700">
                      {isAr ? 'العائد المتوقع' : 'get'}
                    </span>
                    <span className="font-heading text-sm font-bold text-primary-700">
                      {optimizedMonthlyText}
                      <span className="ms-1 text-[10px] font-medium text-secondary-500">
                        {isAr ? '/شهر' : '/mo'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-tight text-primary-700">
                      {isAr ? 'بدل ما تاخد' : 'Instead of'}
                    </span>
                    <span className="text-sm font-bold text-secondary-400 line-through decoration-red-400/50">
                      {currentMonthlyText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn('mt-auto flex flex-col gap-2', isAr ? 'justify-start' : 'justify-start')}>
              <Button type="button" className="mt-auto w-full shadow-xs" onClick={onRequestQuote}>
                {isAr ? 'اطلب عرض سعر' : 'Email me a qoute'}
              </Button>
            </div>
          </div>

          <div className="flex h-full flex-col border-secondary-200 lg:col-span-6 lg:border-s lg:ps-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-secondary-100 p-2.5">
                <BookOpen className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-secondary-900">
                  {isAr ? 'مش جاهز دلوقتي؟ خد دليل الـ DIY مجاناً' : 'Wanna do everything yourself? Request our free guide'}
                </h3>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder={isAr ? 'الاسم بالكامل' : 'Full name'}
                    aria-invalid={form.formState.errors.fullName ? true : undefined}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-500/30',
                      form.formState.errors.fullName ? errCls : 'border-secondary-200'
                    )}
                    {...form.register('fullName')}
                  />
                  {form.formState.errors.fullName && (
                    <p className="mt-1 text-sm font-medium text-red-600">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <div
                    className={cn(
                      'flex overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-500/30',
                      form.formState.errors.phone ? 'border-red-500' : 'border-secondary-200'
                    )}
                  >
                    <div className="relative w-11 shrink-0 border-e border-secondary-200 bg-secondary-50">
                      <select
                        aria-label={isAr ? 'كود الدولة' : 'Country code'}
                        className="h-full w-full cursor-pointer appearance-none bg-transparent py-2.5 text-transparent outline-none"
                        {...form.register('countryCode')}
                      >
                        {PHONE_COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.dial} - {isAr ? country.label.ar : country.label.en}
                          </option>
                        ))}
                      </select>
                      <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center ps-0.5">
                        <span className="flex items-center gap-0.5 text-base">
                          {selectedCountry.flag}
                          <ChevronDown aria-hidden className="h-3.5 w-3.5 text-secondary-500" />
                        </span>
                      </span>
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder={isAr ? `رقم الموبايل` : `${selectedCountry.dial} Phone number`}
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      aria-invalid={form.formState.errors.phone ? true : undefined}
                      {...form.register('phone')}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="mt-1 text-sm font-medium text-red-600">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  dir="ltr"
                  placeholder={isAr ? 'البريد الإلكتروني' : 'Email address'}
                  aria-invalid={form.formState.errors.email ? true : undefined}
                  className={cn(
                    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-500/30',
                    form.formState.errors.email ? errCls : 'border-secondary-200'
                  )}
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm font-medium text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="mt-auto w-full shadow-xs">
                {isAr ? 'ابعت لي الدليل' : 'Send me the guide'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
