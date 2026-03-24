import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';

export function ServicesSection() {
  const locale = useLocale();

  return (
    <section className="w-full py-24 bg-white border-b border-secondary-200 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Why Use Aggar */}
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-8">
            {locale === 'ar' ? 'ليه تستخدم Aggar؟' : 'Why Use Aggar?'}
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            {locale === 'ar' 
              ? 'لأن أغلب الشقق في مصر ممكن تكسب أكتر بكتير… بس أصحابها مش عارفين إيه اللي ناقصها.'
              : 'Because most apartments in Egypt could earn much more... but owners don\'t know what\'s missing.'}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto text-start">
            {[
              locale === 'ar' ? 'تفهم شقتك جاهزة للإيجار ولا لأ' : 'Understand if your apartment is rental-ready',
              locale === 'ar' ? 'تعرف الدخل المتوقع منها' : 'Know the expected revenue',
              locale === 'ar' ? 'تعرف إيه التحسينات اللي تزود دخلها' : 'Know what improvements to make',
            ].map((item, i) => (
              <div key={i} className="flex-1 flex items-center justify-center text-center p-6 bg-secondary-50 rounded-2xl border border-secondary-100 shadow-sm">
                <span className="font-bold text-secondary-900 font-heading text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State-based services */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
            {locale === 'ar' ? 'حسب حالة شقتك… هنوصلك بالخبراء المناسبين' : 'Depending on your apartment\'s state... we connect you with the right experts'}
          </h2>
          <p className="text-lg text-secondary-600">
            {locale === 'ar' 
              ? 'بعد التقييم، هنرشح لك شركاء متخصصين يقدروا يساعدوك توصل لأفضل نتيجة.'
              : 'After the assessment, we recommend specialized partners who can help you achieve the best outcome.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <Card className="border-secondary-100 shadow-md overflow-hidden group flex flex-col h-full bg-white">
            <div className="relative h-64 w-full overflow-hidden shrink-0">
              <Image src="/images/worker.jpg" alt={locale === 'ar' ? 'تشطيب' : 'Finishing'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent pointer-events-none" />
            </div>
            <CardContent className="p-8 flex-1 flex flex-col">
              <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-3">
                {locale === 'ar' ? 'التشطيب' : 'Renovation'}
              </h3>
              <p className="text-secondary-600 leading-relaxed mb-6 flex-1 text-lg">
                {locale === 'ar' 
                  ? 'نوصلك بشركات تشطيب تقدر تحول الشقة من محارة أو نصف تشطيب إلى شقة جاهزة تماماً للإيجار.'
                  : 'We connect you with finishing companies that turn a shell & core to a rental-ready unit.'}
              </p>
              <div className="p-4 bg-secondary-50 justify-self-end rounded-xl text-sm font-bold text-secondary-800 border border-secondary-200">
                {locale === 'ar' ? 'منهم من يقدم أنظمة تقسيط لتقليل الضغط المالي.' : 'Crucially, some offer installment plans to reduce financial pressure.'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary-100 shadow-md overflow-hidden group flex flex-col h-full bg-white">
            <div className="relative h-64 w-full overflow-hidden shrink-0">
              <Image src="/images/decor.jpg" alt={locale === 'ar' ? 'فرش' : 'Styling'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent pointer-events-none" />
            </div>
            <CardContent className="p-8 flex-1 flex flex-col">
              <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-3">
                {locale === 'ar' ? 'الديكور' : 'Styling'}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg font-medium mb-3">
                {locale === 'ar' ? 'متخصصين التصميم والتجهيز للإيجار السياحي.' : 'STR design Specialists.'}
              </p>
              <p className="text-secondary-600 leading-relaxed text-lg flex-1">
                {locale === 'ar' ? 'مش مجرد أثاث… بل تجهيز ساحر يجذب الضيوف ويرفع سعر ليلتك.' : 'Not just buying furniture... but setting up the apartment to attract guests and boost nightly rates.'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary-100 shadow-md overflow-hidden group flex flex-col h-full bg-white">
            <div className="relative h-64 w-full overflow-hidden shrink-0">
              <Image src="/images/photographer.jpg" alt={locale === 'ar' ? 'تصوير' : 'Photography'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent pointer-events-none" />
            </div>
            <CardContent className="p-8 flex-1 flex flex-col">
              <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-3">
                {locale === 'ar' ? 'التصوير' : 'Photography'}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg flex-1 font-medium">
                {locale === 'ar' 
                  ? 'نوصلك بمصورين متخصصين في العقارات مع كتابة وصف احترافي للإعلان بالعربي والإنجليزي علشان يظهر في أول نتائج البحث.'
                  : 'We connect you with real estate photographers and professional bilingual copywriters to maximize bookings.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Operations Services */}
        <div className="bg-secondary-50 w-full rounded-3xl p-8 md:p-12 border border-secondary-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
              {locale === 'ar' ? 'لو الشقة جاهزة للتأجير' : 'If it is ready to rent'}
            </h2>
            <p className="text-secondary-600 font-bold text-xl leading-relaxed">
              {locale === 'ar' ? 'نوصلك بشركات تشغيل لضمان استمرار الإيجار بدون صداع.' : 'We connect you with operators, so renting happens headache-free.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-secondary-100 shadow-sm overflow-hidden group bg-white flex flex-col h-full">
              <div className="relative h-56 w-full shrink-0 overflow-hidden">
                <Image src="/images/vacuum.jpg" alt="Cleaning" fill className="object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700" />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col items-center justify-start text-center">
                <span className="font-bold font-heading text-secondary-900 text-xl mb-2">{locale === 'ar' ? 'التنظيف' : 'Cleaning'}</span>
                <p className="text-secondary-600 font-medium text-sm">
                  {locale === 'ar' ? 'فرق متخصصة تعتني بشقتك بعد كل ضيف' : 'Specialized teams handling turnovers'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 shadow-sm overflow-hidden group bg-white flex flex-col h-full">
              <div className="relative h-56 w-full shrink-0 overflow-hidden">
                <Image src="/images/bed.jpg" alt="Linen Swap" fill className="object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700" />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col items-center justify-start text-center">
                <span className="font-bold font-heading text-secondary-900 text-xl mb-2">{locale === 'ar' ? 'المفروشات' : 'Linens'}</span>
                <p className="text-secondary-600 font-medium text-sm">
                  {locale === 'ar' ? 'توفير وتغيير الملايات والفوط الفندقية' : 'Providing and swapping hotel-quality linens'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 shadow-sm overflow-hidden group bg-white flex flex-col h-full">
              <div className="relative h-56 w-full shrink-0 overflow-hidden">
                <Image src="/images/phone.jpg" alt="Digital Management" fill className="object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700" />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col items-center justify-start text-center">
                <span className="font-bold font-heading text-secondary-900 text-xl mb-2">{locale === 'ar' ? 'الإدارة' : 'Management'}</span>
                <p className="text-secondary-600 font-medium text-sm">
                  {locale === 'ar' ? 'احترافية في التسعير والتواصل مع الضيوف' : 'Professional pricing and guest communication'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 shadow-sm overflow-hidden group bg-white flex flex-col h-full">
              <div className="relative h-56 w-full shrink-0 overflow-hidden">
                <Image src="/images/contract.jpg" alt="Licensing" fill className="object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700" />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col items-center justify-start text-center">
                <span className="font-bold font-heading text-secondary-900 text-xl mb-2">{locale === 'ar' ? 'التراخيص' : 'Licensing'}</span>
                <p className="text-secondary-600 font-medium text-sm">
                  {locale === 'ar' ? 'مساعدة في استخراج التصاريح القانونية' : 'Assistance with required legal permits'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
      </div>
    </section>
  );
}
