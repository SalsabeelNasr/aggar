'use client';

import * as React from 'react';
import Image from 'next/image';
import type { FurnishingAesthetic } from '@/models';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CARD_WIDTH = 200;
const CARD_GAP = 16;

const STYLES: {
  id: FurnishingAesthetic;
  image: string;
  en: string;
  ar: string;
}[] = [
  {
    id: 'boho',
    image: '/images/design-styles/boho.png',
    en: 'Boho',
    ar: 'بوهو',
  },
  {
    id: 'hotel_like',
    image: '/images/design-styles/hotel.png',
    en: 'Hotel',
    ar: 'أسلوب فندقي',
  },
  {
    id: 'classic',
    image: '/images/design-styles/classic.png',
    en: 'Classic',
    ar: 'كلاسيكي',
  },
  {
    id: 'coastal',
    image: '/images/design-styles/coastal.png',
    en: 'Coastal',
    ar: 'ساحلي',
  },
  {
    id: 'industrial',
    image: '/images/design-styles/artistic.png',
    en: 'Artistic',
    ar: 'فني',
  },
  {
    id: 'fun',
    image: '/images/design-styles/fun.png',
    en: 'Fun',
    ar: 'مرح',
  },
  {
    id: 'modern_minimalist',
    image: '/images/design-styles/modern.png',
    en: 'Modern',
    ar: 'حديث',
  },
];

type DesignStyleCarouselProps = {
  value: FurnishingAesthetic | undefined;
  onChange: (id: FurnishingAesthetic) => void;
  isAr: boolean;
};

export function DesignStyleCarousel({ value, onChange, isAr }: DesignStyleCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = CARD_WIDTH + CARD_GAP;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1',
          'scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
        style={{ gap: CARD_GAP }}
      >
        {STYLES.map((style) => {
          const selected = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              style={{ width: CARD_WIDTH }}
              className={cn(
                'group relative shrink-0 snap-start overflow-hidden text-start transition-all duration-500',
                'rounded-3xl bg-white aspect-[4/5]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                selected
                  ? 'scale-[1.02] z-[1]'
                  : 'hover:-translate-y-1'
              )}
            >
              <div className="absolute inset-0 bg-secondary-100">
                <Image
                  src={style.image}
                  alt=""
                  fill
                  className={cn(
                    "object-cover transition-all duration-700 ease-out",
                    selected ? "scale-110" : "group-hover:scale-110"
                  )}
                  sizes={`${CARD_WIDTH}px`}
                />
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500',
                    selected ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'
                  )}
                />
                
                {selected && (
                  <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg animate-in zoom-in fade-in duration-300">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end min-h-[50%]">
                <span
                  className={cn(
                    'text-sm font-heading font-bold leading-tight tracking-tight text-white drop-shadow-md transition-transform duration-500',
                    selected ? 'translate-y-0' : 'translate-y-1 group-hover:translate-y-0',
                    isAr && 'text-end'
                  )}
                >
                  {isAr ? style.ar : style.en}
                </span>
                
                {selected && (
                  <div className="mt-2 h-1 w-8 bg-primary-500 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label={isAr ? 'السابق' : 'Previous'}
          onClick={() => scroll(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-md active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={isAr ? 'التالي' : 'Next'}
          onClick={() => scroll(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-md active:scale-95"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
