import type { Metadata } from 'next';
import { CalendlyWidget } from '@/components/features/consultation/CalendlyWidget';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = params.locale === 'ar';
  return {
    title: isAr ? 'احجز استشارة | عقار' : 'Book a Consultation | Aggar',
    description: isAr
      ? 'احجز مكالمة استشارية مجانية لمدة 30 دقيقة مع فريق عقار.'
      : 'Schedule a free 30-minute consultation with the Aggar team.',
  };
}

export default function ConsultationPage() {
  return (
    <div className="calendly-embed-root fixed inset-x-0 top-16 bottom-0 z-10 overflow-hidden bg-white">
      <CalendlyWidget />
    </div>
  );
}
