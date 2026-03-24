'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { getRegions } from '@/services/mockApi';
import { Region, RegionId } from '@/models';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

export function Step1Location() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const [regions, setRegions] = React.useState<Region[]>([]);

  React.useEffect(() => {
    getRegions().then(setRegions);
  }, []);

  const selectedRegion = regions.find(r => r.id === data.regionId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'أين يقع عقارك؟' : 'Where is your property located?'}
        </h2>
        <p className="text-secondary-600">
          {locale === 'ar' ? 'قم باختيار المنطقة لاحتساب معدلات الإشغال.' : 'Select the region to calculate accurate occupancy rates.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => {
          const isSelected = data.regionId === region.id;
          return (
            <button
              key={region.id}
              onClick={() => updateData({ regionId: region.id })}
              className={cn(
                'flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-center',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm text-primary-900' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50 text-secondary-900'
              )}
            >
              <MapPin className={cn("w-8 h-8 mb-4", isSelected ? "text-primary-600" : "text-secondary-400")} />
              <span className="font-heading font-bold whitespace-nowrap">{region.name[locale as 'en'|'ar']}</span>
            </button>
          );
        })}
      </div>

      {selectedRegion && (
        <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-primary-900 font-medium text-center text-sm md:text-base">
            💡 {selectedRegion.marketFact[locale as 'en'|'ar']}
          </p>
        </div>
      )}
    </div>
  );
}
