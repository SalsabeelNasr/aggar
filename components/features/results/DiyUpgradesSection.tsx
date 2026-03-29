'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { PackageType } from '@/lib/engines/packageBuilder';
import type { DiyChecklistItem } from '@/lib/results/resultsStatic';

type Lo = 'en' | 'ar';

function isFreeCost(item: DiyChecklistItem): boolean {
  // DIY photo “reshoot” tasks are represented as free in the static dataset.
  const en = item.cost.en.trim().toLowerCase();
  const ar = item.cost.ar.trim();
  return en.includes('free') || ar.includes('مجاني');
}

function DiyServiceRow({ lo, item }: { lo: Lo; item: DiyChecklistItem }) {
  return (
    <div
      className="rounded-xl border border-secondary-200 bg-white p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-secondary-900">{item.name[lo]}</p>
        <p className="mt-1 text-sm text-secondary-600 line-clamp-2">{item.whyItHelps[lo]}</p>
        <p className="mt-2 text-xs text-secondary-500">
          <span className="font-medium text-secondary-800">{lo === 'ar' ? 'تلميح: ' : 'Tip: '}</span>
          {item.tip[lo]}
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold tabular-nums text-secondary-900 sm:mt-0 sm:text-end">{item.cost[lo]}</p>
    </div>
  );
}

type ComfortTopicId = 'streaming' | 'wifi' | 'welcome' | 'safety';

function comfortTopicForId(id: string): ComfortTopicId {
  switch (id) {
    case 'netflix':
    case 'shahid':
      return 'streaming';
    case 'mesh':
      return 'wifi';
    case 'welcome':
      return 'welcome';
    case 'first_aid':
      return 'safety';
    default:
      return 'welcome';
  }
}

function DiyServiceRowCompact({ lo, item }: { lo: Lo; item: DiyChecklistItem }) {
  // Compact rendering for the “rest” list (no topic grouping, shorter text).
  return (
    <div
      className="rounded-xl border border-secondary-200 bg-white p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-secondary-900">{item.name[lo]}</p>
        <p className="mt-1 text-sm text-secondary-600 line-clamp-1">{item.whyItHelps[lo]}</p>
      </div>
      <p className="mt-2 text-sm font-semibold tabular-nums text-secondary-900 sm:mt-0 sm:text-end">{item.cost[lo]}</p>
    </div>
  );
}

export function DiyUpgradesSection({
  lo,
  selectedPackage,
  comfortDiyItems,
  photoProofItems = [],
  photoCompanionItems = [],
}: {
  lo: Lo;
  /** Used to enforce: not shown in `quick_start`, shown in `sweet_spot` + `custom`. */
  selectedPackage: PackageType;
  /** Comfort / streaming / wifi DIY rows from report extras or API. */
  comfortDiyItems: DiyChecklistItem[];
  /** Missing shots from the furnished photo checklist (stepper). */
  photoProofItems?: DiyChecklistItem[];
  /** Extra high-scoring listing-photo habits for furnished hosts. */
  photoCompanionItems?: DiyChecklistItem[];
}) {
  // As per UX rule: only visible in the 2nd package and custom.
  if (selectedPackage !== 'sweet_spot' && selectedPackage !== 'custom') return null;

  const paidPhotoProofItems = React.useMemo(() => photoProofItems.filter((i) => !isFreeCost(i)), [photoProofItems]);
  const paidPhotoCompanionItems = React.useMemo(
    () => photoCompanionItems.filter((i) => !isFreeCost(i)),
    [photoCompanionItems]
  );

  const showPhotoSection = paidPhotoProofItems.length > 0 || paidPhotoCompanionItems.length > 0;

  const comfortItems = React.useMemo(() => comfortDiyItems.filter((i) => !isFreeCost(i)), [comfortDiyItems]);

  const comfortItemsOrdered = React.useMemo(() => {
    const map = new Map<ComfortTopicId, DiyChecklistItem[]>();
    for (const item of comfortItems) {
      const topic = comfortTopicForId(item.id);
      const list = map.get(topic) ?? [];
      list.push(item);
      map.set(topic, list);
    }

    // Stable display order.
    const topicOrder: ComfortTopicId[] = ['streaming', 'wifi', 'welcome', 'safety'];
    const orderedItems: DiyChecklistItem[] = [];
    for (const t of topicOrder) orderedItems.push(...(map.get(t) ?? []));
    return orderedItems;
  }, [comfortItems]);

  if (!showPhotoSection && comfortItemsOrdered.length === 0) return null;

  return (
    <div className="space-y-4">
      {showPhotoSection && (
        <div className="space-y-4">
          {paidPhotoProofItems.length > 0 && (
            <div className="space-y-2">
              {paidPhotoProofItems.map((item) => (
                <DiyServiceRow key={item.id} lo={lo} item={item} />
              ))}
            </div>
          )}
          {paidPhotoCompanionItems.length > 0 && (
            <div className="space-y-2">
              {paidPhotoCompanionItems.map((item) => (
                <DiyServiceRow key={item.id} lo={lo} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {comfortItemsOrdered.length > 0 && (
        <div className={cn(showPhotoSection ? 'pt-1' : '')}>
          <div className="space-y-2">
            {comfortItemsOrdered.map((item) => (
              <DiyServiceRowCompact key={item.id} lo={lo} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
