'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { PARTNER_CATEGORY_KEYS, type ConsultantCard, type PartnerCategoryId } from '@/lib/results/resultsStatic';
import { ConsultantsCarousel } from './ConsultantsCarousel';

type Props = {
  lo: 'en' | 'ar';
  specialistFilter: PartnerCategoryId | null;
  onSpecialistFilterChange: React.Dispatch<React.SetStateAction<PartnerCategoryId | null>>;
  filteredConsultants: ConsultantCard[];
  onBook: (consultant: ConsultantCard) => void;
};

export function SpecialistHelpSection({
  lo,
  specialistFilter,
  onSpecialistFilterChange,
  filteredConsultants,
  onBook,
}: Props) {
  return (
    <div id="consultants" className="scroll-mt-8 space-y-6">
      <section className="space-y-1" aria-labelledby="consultants-help-heading">
        <h2 id="consultants-help-heading" className="font-heading text-lg font-semibold text-secondary-900">
          {lo === 'ar' ? 'تحتاج مساعدة؟ تحدث مع مختص' : 'Need help? Talk to a specialist'}
        </h2>
      </section>

      <section id="consultants-carousel" className="space-y-3 scroll-mt-8" aria-labelledby="consultants-help-heading">
        <div className="flex flex-wrap gap-2" role="group" aria-label={lo === 'ar' ? 'تصفية حسب التخصص' : 'Filter by specialty'}>
          <Button type="button" size="sm" variant={specialistFilter === null ? 'primary' : 'outline'} className="rounded-full shadow-xs" onClick={() => onSpecialistFilterChange(null)}>
            {lo === 'ar' ? 'الكل' : 'All'}
          </Button>
          {PARTNER_CATEGORY_KEYS.map((c) => (
            <Button key={c.id} type="button" size="sm" variant={specialistFilter === c.id ? 'primary' : 'outline'} className="rounded-full shadow-xs" onClick={() => onSpecialistFilterChange((prev) => (prev === c.id ? null : c.id))}>
              {c.name[lo]}
            </Button>
          ))}
        </div>

        {specialistFilter !== null && filteredConsultants.length === 0 && (
          <p className="text-sm text-secondary-600">{lo === 'ar' ? 'لا يوجد مختصون في هذا التصنيف حالياً.' : 'No specialists in this category yet.'}</p>
        )}

        <ConsultantsCarousel consultants={filteredConsultants} lo={lo} onBook={onBook} />
      </section>
    </div>
  );
}
