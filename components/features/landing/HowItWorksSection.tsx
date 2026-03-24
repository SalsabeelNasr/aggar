import { useLocale } from 'next-intl';
import { MapPin, Camera, ClipboardCheck } from 'lucide-react';

export function HowItWorksSection() {
  const locale = useLocale();
  
  const steps = locale === 'ar' ? [
    { icon: MapPin, title: '١. قولنا شقتك فين', desc: 'اختار المنطقة ونوع الشقة وعدد الغرف.' },
    { icon: Camera, title: '٢. شاركنا صور الشقة', desc: 'حمّل كام صورة علشان نقدر نقيّم حالتها.' },
    { icon: ClipboardCheck, title: '٣. خُد تقييم واضح', desc: 'هتعرف شقتك ممكن تكسب كام، إيه اللي ناقصها، ونوصلك بالمتخصصين اللي يقدروا يساعدوك.' }
  ] : [
    { icon: MapPin, title: '1. Tell us where it is', desc: 'Select the region, property type, and number of rooms.' },
    { icon: Camera, title: '2. Show us the apartment', desc: 'Upload a few photos so we can assess its condition.' },
    { icon: ClipboardCheck, title: '3. Get a clear assessment', desc: 'Know how much it can earn, what is missing, and get matched with experts to help you.' }
  ];

  return (
    <section id="how-it-works" className="w-full py-24 bg-white border-y border-secondary-200 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-secondary-900 mb-16">
          {locale === 'ar' ? 'إزاي تقييم شقتك؟' : 'How does it work?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary-100 transition-colors">
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-heading font-bold text-secondary-900 mb-3" dir="ltr">{step.title}</h3>
              <p className="text-secondary-600 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
