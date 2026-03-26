'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'aggar-cookie-consent';

type CookieConsentProps = {
  /** `inline`: sits in page flow (e.g. under the evaluate stepper). `banner`: fixed to viewport bottom. */
  variant?: 'banner' | 'inline';
};

export function CookieConsent({ variant = 'banner' }: CookieConsentProps) {
  const locale = useLocale();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1') {
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = React.useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  if (!mounted || !visible) return null;

  const isAr = locale === 'ar';

  const shell =
    variant === 'inline'
      ? 'relative z-10 w-full rounded-xl border border-secondary-200 bg-white shadow-sm'
      : 'fixed bottom-0 inset-x-0 z-[60] border-t border-secondary-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)]';

  const inner =
    variant === 'inline'
      ? 'px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6'
      : 'container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 max-w-6xl';

  return (
    <div
      role="dialog"
      aria-label={isAr ? 'موافقة ملفات تعريف الارتباط' : 'Cookie consent'}
      className={shell}
    >
      <div className={inner}>
        <p className="text-sm md:text-base text-secondary-700 leading-relaxed flex-1">
          {isAr ? (
            <>
              نستخدم ملفات تعريف الارتباط والتخزين المحلي والتقنيات المشابهة لتشغيل الموقع
              وتذكّر تفضيلاتك والتحليلات وتحسين التجربة. بالضغط على «موافقة» فإنك توافق على
              استخدامها كما هو موضّح في{' '}
              <Link href="/terms" className="text-primary-600 font-bold underline-offset-2 hover:underline">
                شروط الاستخدام
              </Link>
              .
            </>
          ) : (
            <>
              We use cookies, local storage, and similar technologies to run the site, remember
              preferences, analytics, and improve your experience. By clicking Accept, you agree
              to their use as described in our{' '}
              <Link href="/terms" className="text-primary-600 font-bold underline-offset-2 hover:underline">
                Terms of Use
              </Link>
              .
            </>
          )}
        </p>
        <div className="flex flex-shrink-0 gap-2 md:gap-3 justify-end">
          <Button
            type="button"
            size="md"
            className="w-full md:w-auto min-w-[8rem]"
            onClick={accept}
          >
            {isAr ? 'موافقة' : 'Accept'}
          </Button>
        </div>
      </div>
    </div>
  );
}
