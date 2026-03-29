'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ConsultantCard } from '@/lib/results/resultsStatic';

const CARD_GAP_PX = 12; // gap-3
/** Match `tailwind.config.ts` animation duration (one full half-loop). */
const MARQUEE_DURATION_SEC = 110;
const DRAG_THRESHOLD_PX = 8;

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduce;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return Boolean((target as HTMLElement | null)?.closest('button, a, [role="button"]'));
}

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
  const reduceMotion = usePrefersReducedMotion();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const xRef = React.useRef(0);
  const modeRef = React.useRef<'auto' | 'drag'>('auto');
  const halfWidthRef = React.useRef(1);
  const lastTRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const dragSession = React.useRef<{
    pointerId: number | null;
    armed: boolean;
    dragging: boolean;
    startClientX: number;
    startX: number;
  }>({ pointerId: null, armed: false, dragging: false, startClientX: 0, startX: 0 });

  const [draggingUi, setDraggingUi] = React.useState(false);

  const loop = React.useMemo(() => [...consultants, ...consultants], [consultants]);
  const loopKey = consultants.map((c) => c.id).join('|');

  const applyTransform = React.useCallback(() => {
    const inner = innerRef.current;
    if (inner) inner.style.transform = `translate3d(${xRef.current}px,0,0)`;
  }, []);

  React.useEffect(() => {
    if (reduceMotion || n <= 1) return;

    xRef.current = 0;
    lastTRef.current = null;

    const inner = innerRef.current;
    if (!inner) return;

    const measure = () => {
      halfWidthRef.current = Math.max(1, inner.scrollWidth / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);

    const speedPxPerSec = () => halfWidthRef.current / MARQUEE_DURATION_SEC;

    const tick = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = Math.min((t - lastTRef.current) / 1000, 0.064);
      lastTRef.current = t;

      if (modeRef.current === 'auto') {
        xRef.current -= speedPxPerSec() * dt;
        const half = halfWidthRef.current;
        while (xRef.current <= -half) xRef.current += half;
      }
      inner.style.transform = `translate3d(${xRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTRef.current = null;
    };
  }, [reduceMotion, n, loopKey]);

  const scrollByStep = React.useCallback(
    (dir: -1 | 1) => {
      const inner = innerRef.current;
      if (!inner) return;
      const first = inner.querySelector('[data-carousel-snap]') as HTMLElement | null;
      const step = (first?.offsetWidth ?? 260) + CARD_GAP_PX;
      const half = Math.max(1, inner.scrollWidth / 2);
      halfWidthRef.current = half;
      xRef.current += dir * step;
      while (xRef.current > 0) xRef.current -= half;
      while (xRef.current <= -half) xRef.current += half;
      inner.style.transform = `translate3d(${xRef.current}px,0,0)`;
    },
    []
  );

  const endPointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = dragSession.current;
      if (s.pointerId !== e.pointerId) return;
      const track = trackRef.current;
      if (track && s.dragging && track.hasPointerCapture(e.pointerId)) {
        track.releasePointerCapture(e.pointerId);
      }
      if (s.dragging) {
        modeRef.current = 'auto';
        lastTRef.current = null;
      }
      s.pointerId = null;
      s.armed = false;
      s.dragging = false;
      setDraggingUi(false);
    },
    []
  );

  const onPointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isInteractiveTarget(e.target)) return;
    const inner = innerRef.current;
    if (!inner) return;

    dragSession.current = {
      pointerId: e.pointerId,
      armed: true,
      dragging: false,
      startClientX: e.clientX,
      startX: xRef.current,
    };
  }, []);

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragSession.current;
    if (!s.armed || s.pointerId !== e.pointerId) return;

    const dx = e.clientX - s.startClientX;

    if (!s.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      s.dragging = true;
      modeRef.current = 'drag';
      lastTRef.current = null;
      trackRef.current?.setPointerCapture(e.pointerId);
      setDraggingUi(true);
    }

    xRef.current = s.startX + dx;
    const half = halfWidthRef.current;
    while (xRef.current > 0) xRef.current -= half;
    while (xRef.current <= -half) xRef.current += half;
    applyTransform();
  }, [applyTransform]);

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      endPointer(e);
    },
    [endPointer]
  );

  if (n === 0) return null;

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
    <div className="relative w-full space-y-4">
      <p className="sr-only">
        {lo === 'ar'
          ? 'شريط متحرك للمختصين — يتحرك تلقائياً؛ اسحب أفقياً لتصفح يدوياً، أو استخدم الأزرار.'
          : 'Auto-scrolling specialist strip — drags horizontally for manual browsing, or use the arrow buttons.'}
      </p>
      <div className="overflow-hidden rounded-2xl pb-2" dir="ltr">
        <div
          ref={trackRef}
          role="region"
          aria-label={lo === 'ar' ? 'مختصون متاحون' : 'Available specialists'}
          className={cn(
            'relative w-full touch-pan-y',
            !draggingUi && 'cursor-grab',
            draggingUi && 'cursor-grabbing select-none'
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={innerRef} className="flex w-max gap-3 py-1 will-change-transform" style={{ gap: CARD_GAP_PX }}>
            {loop.map((c, i) => (
              <div key={`${c.id}-${i}`} data-carousel-snap className="shrink-0">
                <ConsultantCardItem c={c} lo={lo} onBook={onBook} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4" dir="ltr">
        <button
          type="button"
          aria-label={lo === 'ar' ? 'المختص السابق' : 'Previous specialist'}
          onClick={() => scrollByStep(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={lo === 'ar' ? 'المختص التالي' : 'Next specialist'}
          onClick={() => scrollByStep(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
