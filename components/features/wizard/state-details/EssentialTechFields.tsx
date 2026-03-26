'use client';

import * as React from 'react';
import type { EssentialTechId } from '@/models';
import { cn } from '@/lib/utils';

type Props = {
  isAr: boolean;
  selectedIds: EssentialTechId[] | undefined;
  onToggle: (id: EssentialTechId) => void;
};

const TECH_OPTS = [
  {
    id: 'smart_lock' as const,
    en: 'Smart lock installation',
    ar: 'تركيب قفل ذكي',
  },
  {
    id: 'mesh_wifi' as const,
    en: 'High-speed mesh Wi‑Fi setup',
    ar: 'شبكة Wi‑Fi Mesh عالية السرعة',
  },
  {
    id: 'smart_tv_sound' as const,
    en: 'Smart TV / sound system',
    ar: 'تلفزيون ذكي / نظام صوت',
  },
] satisfies { id: EssentialTechId; en: string; ar: string }[];

export function EssentialTechFields({ isAr, selectedIds, onToggle }: Props) {
  return (
    <div className="mt-6">
      <div className="font-heading font-bold text-secondary-900 mb-3">
        {isAr ? 'احتياجات تقنية أساسية (تشغيل / إيجار قصير)' : 'Essential tech (hosting / STR)'}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {TECH_OPTS.map((opt) => {
          const selected = (selectedIds ?? []).includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              className={cn(
                'px-3 py-2 rounded-xl border text-sm font-semibold text-start transition-colors',
                selected
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-secondary-200 text-secondary-800 hover:border-primary-300'
              )}
            >
              {isAr ? opt.ar : opt.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
