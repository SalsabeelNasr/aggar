'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { Goal } from '@/models';
import { cn } from '@/lib/utils';
import { Coins, ShieldAlert, Plane } from 'lucide-react';

const goals: { id: Goal; icon: any; ar: string; en: string; descEn: string; descAr: string }[] = [
  { id: 'max_cashflow', icon: Coins, ar: 'أعلى عائد مادي', en: 'Max Cashflow', descEn: 'I want to yield the highest ROI possible.', descAr: 'أريد تحقيق أعلى أرباح شهرية.' },
  { id: 'preserve_asset', icon: ShieldAlert, ar: 'الحفاظ على الأصل', en: 'Preserve the Asset', descEn: 'I want safe, high-quality tenants only.', descAr: 'أريد ضيوف بجودة عالية للحفاظ على العقار.' },
  { id: 'personal_vacation', icon: Plane, ar: 'استخدام شخصي جزئي', en: 'Personal Vacation Home', descEn: 'I want to use it sometimes, rent the rest.', descAr: 'أريد استخدامه أحياناً وتأجيره باقي الوقت.' },
];

export function Step4Goal() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'ما هو هدفك الأساسي؟' : 'What is your main goal?'}
        </h2>
        <p className="text-secondary-600">
          {locale === 'ar' ? 'هذا سيؤثر على استراتيجية التسعير والشركاء المناسبين.' : 'This will influence the recommended path and pricing strategy.'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {goals.map((goal) => {
          const isSelected = data.goal === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => updateData({ goal: goal.id })}
              className={cn(
                'flex items-center p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none text-start group hover:-translate-y-1',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-md ring-4 ring-primary-500/10' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:shadow-sm'
              )}
            >
              <div className={cn("p-4 rounded-xl mr-5 ml-5 transition-colors", isSelected ? "bg-primary-600 text-white" : "bg-secondary-100 text-secondary-500 group-hover:bg-primary-100 group-hover:text-primary-600")}>
                <goal.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className={cn("font-heading font-bold text-xl mb-1", isSelected ? "text-primary-900" : "text-secondary-900")}>
                  {locale === 'ar' ? goal.ar : goal.en}
                </h3>
                <p className="text-secondary-500">{locale === 'ar' ? goal.descAr : goal.descEn}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
