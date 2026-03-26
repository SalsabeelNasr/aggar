import type { PackageDefinition } from '@/lib/engines/packageEngine';

/** Map a themed score-improvement row to a concrete line item in the current package, if any. */
export function improvementToServiceId(improvementId: string, pkg: PackageDefinition): string | null {
  switch (improvementId) {
    case 'photo':
      if (pkg.services.some((s) => s.id === 'pro_photography')) return 'pro_photography';
      if (pkg.services.some((s) => s.id === 'rephotography')) return 'rephotography';
      return null;
    case 'lighting':
      return pkg.services.some((s) => s.id === 'lighting') ? 'lighting' : null;
    case 'linen':
      return pkg.services.some((s) => s.id === 'linen_starter') ? 'linen_starter' : null;
    case 'bath':
      if (pkg.services.some((s) => s.id === 'bathroom_refresh')) return 'bathroom_refresh';
      if (pkg.services.some((s) => s.id === 'bathrooms')) return 'bathrooms';
      return null;
    case 'workspace':
      return null;
    default:
      return null;
  }
}

/** Conversational “why this matters” for each improvement theme (pairs with SCORE_IMPROVEMENT_ROWS). */
export const IMPROVEMENT_CONVERSATION: Record<string, { en: string; ar: string }> = {
  photo: {
    en: 'Guests decide in seconds from your cover photo. Sharp, well-lit shots read as trustworthy and professional — that translates straight into clicks, saves, and bookings. Our score model treats this as one of the biggest levers you can pull.',
    ar: 'الضيف يقرر في ثوانٍ من صورة الغلاف. صور واضحة وإضاءة جيدة تعطي انطباعاً احترافياً — وهذا ينعكس مباشرة على النقرات والحفظ والحجوزات. نموذج النقاط عندنا يعتبر التصوير من أقوى المحفزات.',
  },
  lighting: {
    en: 'Yellow or dim rooms feel tired on listing sites. Brighter, layered lighting makes spaces feel larger and cleaner — photos look better too, so you get a double win on appeal and score.',
    ar: 'الإضاءة الصفراء أو الخافتة تُظهر المكان متعباً في الإعلانات. إضاءة أوضح ومتعددة المستويات تجعل المساحة تبدو أنظف وأوسع — والصور تتحسن أيضاً، فتربح مرتين في الجاذبية والنقاط.',
  },
  linen: {
    en: 'Hotel-grade bedding is one of those details guests touch every night. It shows up in reviews as “comfortable” and “clean” — exactly the signals platforms use when ranking you.',
    ar: 'مفروشات على مستوى فندقي تُلمَس كل ليلة. تظهر في التقييمات كـ«مريح» و«نظيف» — وهذه إشارات مهمة عندما ترتبك المنصات.',
  },
  bath: {
    en: 'Safe, modern bathrooms reduce friction for families and older guests. Non-slip surfaces and decent fixtures tick compliance boxes and lift your “quality” perception in the score.',
    ar: 'حمام آمن وحديث يقلل القلق للعائلات وكبار السن. مانع الانزلاق وخلاطات لائقة تساعد في الامتثال وترفع إحساس الجودة في النقاط.',
  },
  workspace: {
    en: 'A simple desk and chair signals “I can work here” — huge for mid-week stays and business travelers. You do not need a full office; one clear photo of a usable corner is enough to move the needle on desirability.',
    ar: 'مكتب صغير وكرسي يقولان «أقدر أشتغل هنا» — مهم جداً لإقامات منتصف الأسبوع ورحّال الأعمال. لا تحتاج مكتباً كاملاً؛ زاوية واضحة في الصور تكفي لرفع الجاذبية.',
  },
};

/** Short story for services that are not tied to a themed improvement row in the same view. */
export const SERVICE_CONVERSATION: Partial<Record<string, { en: string; ar: string }>> = {
  deep_clean: {
    en: 'First impressions start at the door. A spotless handover sets the tone for reviews and repeat bookings.',
    ar: 'أول انطباع يبدأ من الباب. تسليم نظيف يرسم توقعاً إيجابياً للتقييمات وتكرار الحجز.',
  },
  smart_lock: {
    en: 'Self check-in means fewer midnight messages and smoother turnovers — guests love the flexibility.',
    ar: 'دخول ذاتي يعني أقل رسائل في منتصف الليل وتسليم أسهل — الضيوف يقدرون المرونة.',
  },
  listing_setup: {
    en: 'Bilingual copy and the right amenities list help you show up in search and answer guest questions before they ask.',
    ar: 'نص ثنائي اللغة وقائمة مرافق دقيقة تساعدك على الظهور في البحث وتقليل الأسئلة المتكررة.',
  },
  management: {
    en: 'Hands-off operations protect your time; the score rewards consistency — fewer missed messages and calmer guests.',
    ar: 'تشغيل بلا إرهاق يحمي وقتك؛ الاتساق ينعكس على التقييم — أقل رسائل ضائعة وضيوف أكثر راحة.',
  },
  styling_consult: {
    en: 'A clear design direction stops expensive guesswork. You stage once with intent instead of buying random pieces.',
    ar: 'اتجاه تصميم واضح يقلل التخمين المكلف. تفرش بقصد بدل شراء قطع عشوائية.',
  },
  furniture_upgrades: {
    en: 'A few hero pieces photograph well and anchor the whole listing — the algorithm notices engagement on strong lead images.',
    ar: 'بعض القطع «البطلة» تصوّر بشكل ممتاز وتثبت هوية المكان — الخوارزمية تلاحظ تفاعل الصور القوية.',
  },
  dynamic_pricing: {
    en: 'Letting price breathe with demand protects revenue on peak nights and fills soft dates without you staring at a spreadsheet.',
    ar: 'تسعير يتحرك مع الطلب يحمي دخل الليالي المزدحمة ويملأ التواريخ الهادئة دون متابعة يدوية مستمرة.',
  },
  channel_manager_suite: {
    en: 'One system ties top OTAs together: calendars stay in sync so you avoid double bookings, pricing and demand signals stay current, and guest messages land in a single inbox instead of five apps.',
    ar: 'منظومة واحدة تربط أبرز المنصات: تقويم موحّد يقلل ازدواج الحجز، وتسعير وإشارات طلب محدّثة، ورسائل الضيوف في صندوق وارد واحد بدل تعدد التطبيقات.',
  },
  reno_per_sqm: {
    en: 'Full renovation resets the ceiling on nightly rate and review potential — the foundation for a premium listing.',
    ar: 'تجديد كامل يرفع سقف السعر الليلي وإمكانية التقييم — أساس لإعلان فئة أعلى.',
  },
  kitchen: {
    en: 'Kitchen quality is a top filter for families and longer stays; it is also a compliance and safety story in one package.',
    ar: 'جودة المطبخ من أهم عوامل اختيار العائلات والإقامات الأطول؛ وقصة امتثال وأمان معاً.',
  },
  bathrooms: {
    en: 'Two refreshed bathrooms spread morning load for groups and read as “serious host” in photos and reviews.',
    ar: 'حمامان مجددان يخففان ضغط الصباح للمجموعات ويعطيان انطباع مضيف جاد في الصور والتقييمات.',
  },
  hvac: {
    en: 'Quiet, efficient cooling is non-negotiable in Egypt summers — it dominates comfort mentions in reviews.',
    ar: 'تبريد هادئ وفعّال غير قابل للتفاوض في صيف مصر — يظهر بوضوح في تقييمات الراحة.',
  },
  licensing: {
    en: 'Operating with the right STR paperwork removes platform and guest anxiety — it is a trust signal, not just paperwork.',
    ar: 'التشغيل بأوراق STR الصحيحة يقلل قلق المنصة والضيف — إشارة ثقة وليس مجرد إجراءات.',
  },
  listing_audit: {
    en: 'We pinpoint whether photos, pricing, or copy is holding you back — so you fix the real bottleneck first.',
    ar: 'نحدد هل الصور أو التسعير أو النص هو المعطل — لتعالج السبب الحقيقي أولاً.',
  },
  copy_rewrite: {
    en: 'Search-friendly bilingual wording helps the right guests find you and understand the stay in one skim.',
    ar: 'صياغة ثنائية اللغة مناسبة للبحث تساعد الضيف المناسب على إيجادك وفهم الإقامة بسرعة.',
  },
};
