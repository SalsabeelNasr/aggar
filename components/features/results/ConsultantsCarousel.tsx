'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ConsultantCard } from '@/lib/results/resultsStatic';

/** Slower loop on wide viewports (more cards visible = longer perceived path). */
const MARQUEE_DURATION_SEC = 140;

type Props = {
  consultants: ConsultantCard[];
  lo: 'en' | 'ar';
  onBook: (c: ConsultantCard) => void;
};

function ConsultantCardItem({ c, lo, onBook }: { c: ConsultantCard; lo: 'en' | 'ar'; onBook: (c: ConsultantCard) => void }) {
  return (
    <Card className="flex h-[min(360px,64vh)] w-[240px] shrink-0 flex-col border-secondary-200 shadow-md sm:w-[260px] md:w-[272px]">
      <CardContent className="flex flex-1 flex-col gap-3 p-5 pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-800">
            {c.name.en.charAt(0)}
          </div>
          <p className="mt-3 text-sm font-semibold text-secondary-900">{c.name[lo]}</p>
          <p className="text-xs text-primary-700">{c.title[lo]}</p>
        </div>
        <p className="line-clamp-4 h-[5.5rem] text-center text-sm leading-relaxed text-secondary-600">{c.bio[lo]}</p>
        <p className="text-center text-xs text-secondary-500">
          ★ {c.rating} · {c.consultations}+ {lo === 'ar' ? 'جلسات' : 'sessions'}
        </p>
        <p className="text-center text-sm font-semibold text-secondary-900">
          {c.priceEgp.toLocaleString('en-US')} {lo === 'ar' ? 'ج.م' : 'EGP'}
        </p>
        <Button type="button" className="mt-auto w-full shadow-xs" size="sm" onClick={() => onBook(c)}>
          {lo === 'ar' ? `احجز مع ${c.name.ar.split(' ')[0]}` : `Book with ${c.name.en.split(' ')[0]}`}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ConsultantsCarousel({ consultants, lo, onBook }: Props) {
  const n = consultants.length;
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = React.useState(false);

  if (n === 0) return null;

  /** Two identical sequences for a seamless loop (tail rotates into view). */
  const loop = React.useMemo(() => [...consultants, ...consultants], [consultants]);

  if (reduceMotion || n === 1) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-4">
          {consultants.map((c) => (
            <ConsultantCardItem key={c.id} c={c} lo={lo} onBook={onBook} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <p className="sr-only">
        {lo === 'ar'
          ? 'شريط متحرك للمختصين — يتوقف عند تمرير المؤشر أو التركيز.'
          : 'Scrolling specialist strip — pauses on hover or keyboard focus.'}
      </p>
      <div className="overflow-hidden rounded-2xl pb-2" dir="ltr">
        <div
          className={cn(
            'flex w-max gap-3 py-1 animate-consultants-marquee motion-reduce:animate-none',
            paused && '[animation-play-state:paused]'
          )}
          style={{ animationDuration: `${MARQUEE_DURATION_SEC}s` }}
        >
          {loop.map((c, i) => (
            <ConsultantCardItem key={`${c.id}-${i}`} c={c} lo={lo} onBook={onBook} />
          ))}
        </div>
      </div>
    </div>
  );
}
