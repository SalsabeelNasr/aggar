import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="border-t border-secondary-200 bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative h-7 w-32 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Aggar"
              fill
              unoptimized
              sizes="(max-width: 768px) 8rem, 10rem"
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/partner" className="text-secondary-600 hover:text-primary-600 text-sm font-bold font-heading">
            {locale === 'ar' ? 'انضم إلينا' : 'Become a Partner'}
          </Link>
          <Link href="/terms" className="text-secondary-600 hover:text-primary-600 text-sm font-bold font-heading">
            {locale === 'ar' ? 'الشروط' : 'Terms'}
          </Link>
          <a
            href="https://wa.me/201140988255"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex font-heading items-center justify-center rounded-lg font-bold transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'h-11 px-6 text-base border bg-white shadow-sm gap-2',
              'text-green-600 border-green-200 hover:bg-green-50 shadow-none'
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
          </a>
        </div>
      </div>
    </footer>
  );
}
