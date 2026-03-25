import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="border-t border-secondary-200 bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative h-7 w-32 overflow-hidden">
            <Image
              src="/images/logo.svg"
              alt="Aggar"
              fill
              unoptimized
              sizes="(max-width: 768px) 8rem, 10rem"
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 text-sm text-secondary-500">
            <span className="cursor-pointer hover:text-secondary-900">{locale === 'ar' ? 'الخصوصية' : 'Privacy'}</span>
            <span className="cursor-pointer hover:text-secondary-900">{locale === 'ar' ? 'الشروط' : 'Terms'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/partner" className="text-secondary-600 hover:text-primary-600 text-sm font-bold font-heading">
            {locale === 'ar' ? 'انضم إلينا' : 'Become a Partner'}
          </Link>
          <Button variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50 shadow-none">
            <MessageCircle className="h-4 w-4" />
            {locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
          </Button>
        </div>
      </div>
    </footer>
  );
}
