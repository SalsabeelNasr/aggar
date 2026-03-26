'use client';

import * as React from 'react';
import { useEvaluationStore } from '@/lib/store';
import type { GuestAccessSolution } from '@/models';
import { cn } from '@/lib/utils';
import { wizardDetailSurfaceClassName } from '@/components/features/wizard/state-details/wizardDetailUi';
import { Key, LockKeyhole, UserCheck } from 'lucide-react';

type Props = { isAr: boolean; className?: string };

const OPTIONS: {
  id: GuestAccessSolution;
  icon: typeof UserCheck;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}[] = [
  {
    id: 'bawab_concierge',
    icon: UserCheck,
    titleEn: 'Bawab or concierge',
    titleAr: 'بواب أو كونسيرج',
    descEn: 'Human handoff: bawab, concierge, or consistent key transfer.',
    descAr: 'تسليم بشري: بواب، كونسيرج، أو تسليم مفاتيح ثابت.',
  },
  {
    id: 'smart_lock_or_lockbox',
    icon: LockKeyhole,
    titleEn: 'Smart lock or lockbox',
    titleAr: 'قفل ذكي أو صندوق مفاتيح',
    descEn: 'Guests self-check-in with a code, app, or lockbox.',
    descAr: 'الضيوف يدخلون بكود أو تطبيق أو صندوق مفاتيح.',
  },
  {
    id: 'none',
    icon: Key,
    titleEn: 'Not yet',
    titleAr: 'ليس بعد',
    descEn: 'I still need a reliable access solution.',
    descAr: 'ما زلت أحتاج حل وصول موثوق للضيوف.',
  },
];

/** Three-way choice: human handoff, smart lock/lockbox, or not in place yet. */
export function GuestAccessReliabilityChoice({ isAr, className }: Props) {
  const { data, updateData } = useEvaluationStore();
  const selected = data.regulatory?.guestAccessSolution;

  return (
    <div className={cn(wizardDetailSurfaceClassName, className)}>
      <div className="font-heading font-bold text-secondary-900 mb-4">
        {isAr ? 'هل لديك حل وصول موثوق للضيوف؟' : 'Do you have a reliable guest access solution?'}
      </div>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                updateData({
                  regulatory: { ...data.regulatory, guestAccessSolution: opt.id },
                })
              }
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 ring-primary-500/30 text-start group w-full',
                isActive
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg mr-4 ml-4 shrink-0 transition-colors',
                  isActive ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className={cn('font-heading font-bold text-base', isActive ? 'text-primary-900' : 'text-secondary-900')}>
                  {isAr ? opt.titleAr : opt.titleEn}
                </h4>
                <p className="text-secondary-500 text-sm mt-1">{isAr ? opt.descAr : opt.descEn}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
