'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { DIY_CHECKLIST_ITEMS, type DiyChecklistItem } from '@/lib/results/resultsStatic';

type Lo = 'en' | 'ar';

function DiyChecklistBlocks({ lo, items }: { lo: Lo; items: DiyChecklistItem[] }) {
  return (
    <ul className="mt-3 list-none space-y-3 p-0">
      {items.map((item) => (
        <li key={item.id}>
          <label className="flex cursor-pointer gap-3 rounded-xl border border-secondary-100 bg-secondary-50/30 p-4 hover:bg-secondary-50/60">
            <input type="checkbox" className="mt-1 accent-primary-600" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-sm font-semibold text-secondary-900">{item.name[lo]}</span>
                <span className="shrink-0 text-xs font-medium text-primary-800">{item.cost[lo]}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary-700">{item.whyItHelps[lo]}</p>
              <p className="mt-2 text-sm text-secondary-600">
                <span className="font-medium text-secondary-800">{lo === 'ar' ? 'تلميح: ' : 'Tip: '}</span>
                {item.tip[lo]}
              </p>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}

export function DiyUpgradesSection({
  lo,
  photoProofItems = [],
  photoCompanionItems = [],
}: {
  lo: Lo;
  /** Missing shots from the furnished photo checklist (stepper). */
  photoProofItems?: DiyChecklistItem[];
  /** Extra high-scoring listing-photo habits for furnished hosts. */
  photoCompanionItems?: DiyChecklistItem[];
}) {
  const showPhotoSection = photoProofItems.length > 0 || photoCompanionItems.length > 0;

  return (
    <div className="rounded-xl border border-secondary-200 bg-white p-4 shadow-xs md:p-5">
      <h3 className="text-sm font-semibold text-secondary-900">
        {lo === 'ar' ? 'تحسينات تفعلها بنفسك' : 'DIY upgrades we still recommend'}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-secondary-600">
        {lo === 'ar'
          ? 'لا تدخل تلقائياً في عرض السعر — لكنها ترفع راحة الضيف وتظهر في التقييمات.'
          : 'Not auto-included in your quote — but they lift comfort and show up in reviews.'}
      </p>

      {showPhotoSection && (
        <div className="mt-6 border-t border-secondary-100 pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-primary-800">
            {lo === 'ar' ? 'التصوير وإثبات الجودة' : 'Photography & proof shots'}
          </h4>
          <p className="mt-1.5 text-sm text-secondary-600">
            {lo === 'ar'
              ? 'من إجاباتك في خطوة الصور — أضف هذه اللقطات إلى جلسة التصوير أو أعد التصوير لتقوية الإعلان والنقاط.'
              : 'From your photo step — add these frames to your shoot or re-shoot to strengthen the listing and score levers.'}
          </p>
          {photoProofItems.length > 0 && (
            <>
              <p className="mt-3 text-xs font-medium text-secondary-500">
                {lo === 'ar' ? 'لم تُحدَّد بعد أنك صوّرت هذه اللقطات' : 'Not marked as shots you have yet'}
              </p>
              <DiyChecklistBlocks lo={lo} items={photoProofItems} />
            </>
          )}
          {photoCompanionItems.length > 0 && (
            <>
              <p className="mt-4 text-xs font-medium text-secondary-500">
                {lo === 'ar'
                  ? 'لقطات إضافية عالية الأثر (مفروشات، قفل، مطبخ)'
                  : 'High-impact adds (linen, lock, kitchen depth)'}
              </p>
              <DiyChecklistBlocks lo={lo} items={photoCompanionItems} />
            </>
          )}
        </div>
      )}

      <div className={cn(showPhotoSection ? 'mt-8 border-t border-secondary-100 pt-5' : 'mt-4')}>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-secondary-500">
          {lo === 'ar' ? 'راحة الضيف والترفيه والسلامة' : 'Comfort, streaming & safety'}
        </h4>
        <DiyChecklistBlocks lo={lo} items={DIY_CHECKLIST_ITEMS} />
      </div>
    </div>
  );
}
