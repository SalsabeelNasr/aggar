import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Tajawal, Almarai, Nunito, DM_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const almarai = Almarai({ 
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Aggar | Property Income Advisor',
  description: 'Evaluate your property earning potential securely.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  const headingFont = locale === 'ar' ? tajawal.variable : nunito.variable;
  const bodyFont = locale === 'ar' ? almarai.variable : dmSans.variable;

  return (
    <html lang={locale} dir={direction} className={`${headingFont} ${bodyFont}`}>
      <body className="antialiased min-h-screen flex flex-col bg-secondary-50 text-secondary-900 font-body">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
