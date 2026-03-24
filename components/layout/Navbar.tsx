'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-primary-600">
            {locale === 'ar' ? 'عقار' : 'Aggar'}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/partner" className="text-secondary-600 hover:text-primary-600 font-medium hidden sm:block">
            {locale === 'ar' ? 'انضم إلينا' : 'Become a Partner'}
          </Link>
          <Button variant="ghost" onClick={toggleLanguage} size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="uppercase font-heading font-bold">{locale === 'ar' ? 'EN' : 'عربي'}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
