'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CountryCode } from 'libphonenumber-js';
import { BookOpen, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useEvaluationStore } from '@/lib/store';
import { isValidPhoneForCountry } from '@/lib/validations/phone';

const PHONE_COUNTRIES: Array<{ code: CountryCode; dial: string; flag: string; label: { en: string; ar: string } }> = [
  { code: 'EG', dial: '+20', flag: '🇪🇬', label: { en: 'Egypt', ar: 'مصر' } },
  { code: 'SA', dial: '+966', flag: '🇸🇦', label: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { code: 'AE', dial: '+971', flag: '🇦🇪', label: { en: 'UAE', ar: 'الإمارات' } },
  { code: 'KW', dial: '+965', flag: '🇰🇼', label: { en: 'Kuwait', ar: 'الكويت' } },
  { code: 'QA', dial: '+974', flag: '🇶🇦', label: { en: 'Qatar', ar: 'قطر' } },
  { code: 'BH', dial: '+973', flag: '🇧🇭', label: { en: 'Bahrain', ar: 'البحرين' } },
  { code: 'US', dial: '+1', flag: '🇺🇸', label: { en: 'United States', ar: 'الولايات المتحدة' } },
  { code: 'GB', dial: '+44', flag: '🇬🇧', label: { en: 'United Kingdom', ar: 'المملكة المتحدة' } },
];

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
  const [submitted, setSubmitted] = React.useState(!!diyGuideLead);
  const isAr = lo === 'ar';
  const messages = isAr
    ? {
        fullName: 'أدخل الاسم الكامل (حرفان على الأقل).',
        email: 'أدخل بريدًا إلكترونيًا صالحًا.',
        phone: 'أدخل رقم هاتف صالح لهذه المنطقة.',
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
    setSubmitted(true);
  });

  const errCls = 'border-red-500 focus:border-red-500';
  const whatsappHref = 'https://wa.me/201140988255';

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-secondary-200 bg-gradient-to-br from-secondary-50 to-white p-5 shadow-xs">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-10 lg:divide-x lg:divide-secondary-200">
          <div className="flex h-full flex-col gap-3 lg:col-span-4 lg:pe-10">
            <div className="py-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary-700">
                    {isAr ? 'استثمر' : 'Invest'}
                  </span>
                  <span className="font-heading text-sm font-bold text-secondary-900">
                    {payAmountText}
                    <span className="ms-1 text-[10px] font-semibold text-secondary-500">EGP</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-b border-secondary-100 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-tight text-primary-700">
                      {isAr ? 'تحصل على' : 'get'}
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
                      {isAr ? 'بدلاً من' : 'Instead of'}
                    </span>
                    <span className="text-sm font-bold text-secondary-400 line-through decoration-red-400/50">
                      {currentMonthlyText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-heading text-base font-semibold text-secondary-900">
              {isAr ? 'مهتم تبني هذا؟' : 'Reach out to us'}
            </h3>
            <div className={cn('mt-auto flex flex-wrap gap-2', isAr ? 'justify-start' : 'justify-start')}>
              <Button type="button" className="shadow-xs" onClick={onRequestQuote}>
                {isAr ? 'طلب عرض سعر' : 'Email a qoute'}
              </Button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                className="inline-flex items-center gap-2 rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm font-medium text-green-700 shadow-xs transition-colors hover:bg-secondary-50"
              >
                <MessageCircle className="h-4 w-4" />
                {isAr ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>
          </div>

          <div className="flex h-full flex-col lg:col-span-6 lg:ps-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-secondary-100 p-2.5">
                <BookOpen className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-secondary-900">
                  {isAr ? 'مش جاهز تستثمر؟ خد دليل DIY مجاني' : 'Wanna do everything yourself? Request our free guide'}
                </h3>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                {isAr ? 'تم التسجيل! سنرسل لك الدليل قريباً.' : "You're registered! We'll send you the guide soon."}
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      placeholder={isAr ? 'الاسم الكامل' : 'Full name'}
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
                          aria-label={isAr ? 'رمز الدولة' : 'Country code'}
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
                        placeholder={isAr ? `${selectedCountry.dial} رقم الهاتف` : `${selectedCountry.dial} Phone number`}
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
                  {isAr ? 'أرسل لي الدليل' : 'Send me the guide'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
