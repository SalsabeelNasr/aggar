'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';

export function Step5Hassle() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'مقياس إرهاق التشغيل' : 'How much hassle do you want?'}
        </h2>
        <p className="text-secondary-600 max-w-md mx-auto">
          {locale === 'ar' 
            ? 'كم من الجهد ترغب في بذله في التعامل مع الضيوف والنظافة؟' 
            : 'How much effort do you want to spend dealing with guests, cleaning, and keys?'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-secondary-200 shadow-sm mt-12">
        <div className="mb-12 relative pt-8">
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={data.hassleLevel}
            onChange={(e) => updateData({ hassleLevel: Number(e.target.value) })}
            className="w-full h-3 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div 
            className="absolute top-0 -ml-6 bg-primary-600 text-white font-bold px-3 py-1 rounded-lg text-sm transition-all shadow-md"
            style={{ left: `${(data.hassleLevel! / 10) * 100}%` }}
          >
            {data.hassleLevel}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium text-secondary-500">
          <div className="text-center w-24">
            <span className="block text-2xl mb-2">🏄‍♂️</span>
            {locale === 'ar' ? 'أريد الدخل فقط بدون مجهود' : 'Zero work, full management'}
          </div>
          <div className="text-center w-24">
            <span className="block text-2xl mb-2">🛠️</span>
            {locale === 'ar' ? 'أنا سأتولى بعض المهام' : 'I will handle some tasks'}
          </div>
        </div>
      </div>
    </div>
  );
}
