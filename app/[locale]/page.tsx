import { useLocale } from 'next-intl';
import { HeroSection } from '@/components/features/landing/HeroSection';
import { HowItWorksSection } from '@/components/features/landing/HowItWorksSection';
import { PreviewSection } from '@/components/features/landing/PreviewSection';
import { ServicesSection } from '@/components/features/landing/ServicesSection';
import { FAQSection } from '@/components/features/landing/FAQSection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      <PreviewSection />
      <FAQSection />
    </div>
  );
}
