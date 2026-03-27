'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Images, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type UploadedPhoto = {
  id: string;
  url?: string | null;
  name?: string | null;
};

const MOCK_PHOTOS: UploadedPhoto[] = [
  { id: 'mock-boho', url: '/images/design-styles/boho.png', name: 'Boho' },
  { id: 'mock-hotel', url: '/images/design-styles/hotel.png', name: 'Hotel' },
  { id: 'mock-classic', url: '/images/design-styles/classic.png', name: 'Classic' },
  { id: 'mock-coastal', url: '/images/design-styles/coastal.png', name: 'Coastal' },
  { id: 'mock-artistic', url: '/images/design-styles/artistic.png', name: 'Artistic' },
  { id: 'mock-fun', url: '/images/design-styles/fun.png', name: 'Fun' },
  { id: 'mock-modern', url: '/images/design-styles/modern.png', name: 'Modern' },
];

function PhotoItem({ photo }: { photo: UploadedPhoto }) {
  const [error, setError] = React.useState(false);

  return (
    <div
      className="group relative h-40 w-32 shrink-0 snap-start overflow-hidden rounded-xl bg-secondary-100 transition-all duration-500 hover:w-48"
    >
      {error || !photo.url ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-secondary-50 p-4 text-center">
          <Images className="h-6 w-6 text-secondary-300" />
          <span className="mt-2 text-[10px] font-medium tracking-wider text-secondary-400">
            {photo.name || 'Missing'}
          </span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.name ?? ''}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            draggable={false}
            onError={() => setError(true)}
          />
          {/* On-brand primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-[10px] font-bold text-white tracking-wide truncate pr-2">
              {photo.name}
            </span>
            <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
              <Maximize2 className="h-3 w-3 text-white shrink-0" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ResultsPhotoCarousel({ photos, className }: { photos: UploadedPhoto[]; className?: string }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const realPhotos = React.useMemo(() => photos.filter((p) => Boolean(p.url)).slice(0, 12), [photos]);
  const items = realPhotos.length > 0 ? realPhotos : MOCK_PHOTOS;

  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible item (highest intersectionRatio).
        const best = entries.reduce<{ idx: number; ratio: number } | null>((acc, e) => {
          const idx = Number((e.target as HTMLElement).dataset.index ?? -1);
          if (idx < 0) return acc;
          const ratio = e.intersectionRatio ?? 0;
          if (!acc || ratio > acc.ratio) return { idx, ratio };
          return acc;
        }, null);
        if (best && best.ratio > 0) setActiveIndex(best.idx);
      },
      { root, threshold: [0.35, 0.6, 0.85] }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items.length]);

  const scrollToIndex = (idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <Card className={cn('mt-6 w-full min-w-0 select-none border-secondary-200 shadow-xs', className)}>
      <CardHeader className="p-4 pb-2 pt-3">
        <CardTitle className="font-heading text-sm font-semibold text-secondary-900">
          {isAr ? 'معرض الصور' : 'Property photos'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div
          ref={scrollRef}
          className={cn(
            'flex overflow-x-auto snap-x snap-mandatory pb-4',
            'scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
          style={{ gap: '12px' }}
        >
          {items.map((p, idx) => (
            <div
              key={p.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              data-index={idx}
              className="shrink-0 snap-start"
            >
              <PhotoItem photo={p} />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {items.map((p, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={`dot-${p.id}`}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={
                    isAr ? `انتقل إلى الصورة ${idx + 1} من ${items.length}` : `Go to photo ${idx + 1} of ${items.length}`
                  }
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    active ? 'bg-primary-600 w-6' : 'bg-secondary-300 hover:bg-secondary-400'
                  )}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
