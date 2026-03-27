'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, Images, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const realPhotos = React.useMemo(() => photos.filter((p) => Boolean(p.url)).slice(0, 12), [photos]);
  const items = realPhotos.length > 0 ? realPhotos : MOCK_PHOTOS;

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: 'smooth' });
  };

  return (
    <div className={cn('mt-6 select-none', className)}>
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-secondary-900">
          {isAr ? 'معرض الصور' : 'Property photos'}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="group flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100 text-secondary-500 transition-all hover:bg-primary-600 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="group flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100 text-secondary-500 transition-all hover:bg-primary-600 hover:text-white"
          >
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          'flex overflow-x-auto snap-x snap-mandatory px-1 pb-4',
          'scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
        style={{ gap: '12px' }}
      >
        {items.map((p) => <PhotoItem key={p.id} photo={p} />)}
      </div>
    </div>
  );
}
