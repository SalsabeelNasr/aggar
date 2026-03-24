'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Lock } from 'lucide-react';

export function Step7Contact() {
  const locale = useLocale();
  const { contact, updateContact } = useEvaluationStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'أين نرسل لك التقرير المخصص؟' : 'Where should we send your custom report?'}
        </h2>
        <p className="text-secondary-600 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          {locale === 'ar' ? 'بياناتك آمنة تماماً. لا توجد رسائل مزعجة.' : 'Your data is secure. No spam.'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-secondary-200 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading">{locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
          <input 
            type="text"
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            placeholder={locale === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your name'}
            value={contact.name}
            onChange={e => updateContact({ name: e.target.value })}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading">{locale === 'ar' ? 'رقم الهاتف (واتساب)' : 'Phone Number (WhatsApp)'}</label>
          <input 
            type="tel"
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            placeholder="+20 1XX XXX XXXX"
            value={contact.phone}
            onChange={e => updateContact({ phone: e.target.value })}
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900 font-heading">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
          <input 
            type="email"
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            placeholder="name@example.com"
            value={contact.email}
            onChange={e => updateContact({ email: e.target.value })}
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
