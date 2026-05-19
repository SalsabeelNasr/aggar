'use client';

import * as React from 'react';
import Script from 'next/script';
import { cn } from '@/lib/utils';

const CALENDLY_URL = 'https://calendly.com/aggar/consultation?primary_color=71785a';

export function CalendlyWidget({ className }: { className?: string }) {
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <>
      <div
        className={cn('calendly-inline-widget h-full w-full min-h-0', className)}
        data-url={CALENDLY_URL}
        style={{ minWidth: 320 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
