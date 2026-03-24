'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Key, UserCheck } from 'lucide-react';

export function Step6Bawab() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'هل يوجد حارس (بواب) يعتمد عليه؟' : 'Do you have a reliable building guard (Bawab)?'}
        </h2>
        <p className="text-secondary-600">
          {locale === 'ar' ? 'يساعد الحارس في تسليم المفاتيح، وإذا لم يتوفر سنقترح حلول للأقفال الذكية.' : 'Helps with key handover. If not, we will recommend smart lock partners.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => updateData({ hasBawab: true })}
          className={cn(
            'flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center hover:-translate-y-1',
            data.hasBawab === true 
              ? 'border-primary-600 bg-primary-50 shadow-md text-primary-900' 
              : 'border-secondary-200 bg-white hover:border-primary-300 hover:shadow-sm text-secondary-900'
          )}
        >
          <UserCheck className={cn("w-12 h-12 mb-4 transition-colors", data.hasBawab === true ? "text-primary-600" : "text-secondary-400")} />
          <span className="font-heading font-bold text-2xl">{locale === 'ar' ? 'نعم، أعتمد عليه' : 'Yes, I have one'}</span>
        </button>

        <button
          onClick={() => updateData({ hasBawab: false })}
          className={cn(
            'flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center hover:-translate-y-1',
            data.hasBawab === false 
              ? 'border-primary-600 bg-primary-50 shadow-md text-primary-900' 
              : 'border-secondary-200 bg-white hover:border-primary-300 hover:shadow-sm text-secondary-900'
          )}
        >
          <Key className={cn("w-12 h-12 mb-4 transition-colors", data.hasBawab === false ? "text-primary-600" : "text-secondary-400")} />
          <span className="font-heading font-bold text-2xl">{locale === 'ar' ? 'لا يوجد / غير متوفر' : 'No / Unreliable'}</span>
        </button>
      </div>
    </div>
  );
}
