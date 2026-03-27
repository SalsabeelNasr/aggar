import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.11 17.33c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.64 1.11 2.82.13.18 1.9 2.9 4.61 4.06.64.28 1.15.45 1.54.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31z" />
      <path d="M16.02 3C8.84 3 3 8.83 3 16.01c0 2.27.6 4.48 1.74 6.42L3.6 28.99l6.74-1.11a13 13 0 0 0 5.68 1.31h.01c7.18 0 13.02-5.83 13.02-13.01C29.05 8.83 23.2 3 16.02 3zm0 23.95h-.01a10.9 10.9 0 0 1-5.56-1.52l-.4-.24-4 .66.67-3.9-.26-.4a10.88 10.88 0 0 1-1.68-5.85C4.78 9.99 9.99 4.78 16.02 4.78c6.03 0 11.24 5.21 11.24 11.23 0 6.03-5.21 11.24-11.24 11.24z" />
    </svg>
  );
}

export function Footer() {
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

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/partner" className="text-secondary-600 hover:text-primary-600 text-sm font-bold font-heading">
            Become a Partner
          </Link>
          <Link href="/terms" className="text-secondary-600 hover:text-primary-600 text-sm font-bold font-heading">
            Terms
          </Link>
          <div className="flex items-center -space-x-1">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 h-9 w-9 bg-white text-secondary-700 hover:bg-secondary-50"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/201140988255"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp +201140988255"
              className="inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 h-9 w-9 bg-white text-green-600 hover:bg-green-50"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
