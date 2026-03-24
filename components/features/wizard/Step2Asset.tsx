'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { PropertyType } from '@/models';
import { cn } from '@/lib/utils';
import { Home, Building, Blocks, Tent } from 'lucide-react';

const types: { id: PropertyType; icon: any; ar: string; en: string }[] = [
  { id: 'apartment', icon: Building, ar: 'شقة', en: 'Apartment' },
  { id: 'villa', icon: Home, ar: 'فيلا', en: 'Villa' },
  { id: 'chalet', icon: Tent, ar: 'شاليه', en: 'Chalet' },
  { id: 'studio', icon: Blocks, ar: 'ستوديو', en: 'Studio' },
];

export function Step2Asset() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'ما هو نوع عقارك؟' : 'What type of property is it?'}
        </h2>
        <p className="text-secondary-600">
          {locale === 'ar' ? 'نوع العقار ومساحته تؤثر في الأرباح.' : 'Property type directly affects earnings.'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {types.map((type) => {
          const isSelected = data.propertyType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => updateData({ propertyType: type.id })}
              className={cn(
                'flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm text-primary-900' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50 text-secondary-900'
              )}
            >
              <type.icon className={cn("w-8 h-8 mb-4", isSelected ? "text-primary-600" : "text-secondary-400")} />
              <span className="font-heading font-bold">{locale === 'ar' ? type.ar : type.en}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Beds */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900">{locale === 'ar' ? 'غرف النوم' : 'Bedrooms'}</label>
          <input 
            type="number" min="0" max="10" 
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            value={data.bedrooms} 
            onChange={e => updateData({ bedrooms: Number(e.target.value) })}
          />
        </div>
        {/* Baths */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900">{locale === 'ar' ? 'الحمامات' : 'Bathrooms'}</label>
          <input 
            type="number" min="1" max="10" 
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            value={data.bathrooms} 
            onChange={e => updateData({ bathrooms: Number(e.target.value) })}
          />
        </div>
        {/* Sleep Capacity */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-secondary-900">{locale === 'ar' ? 'يرحب بعدد ضيوف (السعة)' : 'Sleep Capacity'}</label>
          <input 
            type="number" min="1" max="20" 
            className="border-2 border-secondary-200 rounded-lg p-3 focus:border-primary-500 outline-none transition-colors"
            value={data.sleepCapacity} 
            onChange={e => updateData({ sleepCapacity: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
