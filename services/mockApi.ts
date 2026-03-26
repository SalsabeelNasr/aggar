import type { Region, RegionId } from '@/models';

const MOCK_REGIONS: Record<string, Region> = {
  new_cairo: {
    id: 'new_cairo',
    name: { en: 'New Cairo', ar: 'القاهرة الجديدة' },
    avgOccupancy: 65,
    avgNightlyRate: 80,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Business Travelers', ar: 'مسافرو الأعمال' }, { en: 'Expats', ar: 'المغتربون' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Villas', ar: 'فيلات' }],
    seasonalityNotes: { en: 'High demand during summer and winter holidays.', ar: 'طلب مرتفع خلال إجازات الصيف والشتاء.' },
    marketFact: { 
      en: 'Properties in New Cairo see 15% higher occupancy than the Cairo average.', 
      ar: 'العقارات في القاهرة الجديدة تشهد إشغاراً أعلى بنسبة 15% من متوسط القاهرة.' 
    }
  },
  sheikh_zayed: {
    id: 'sheikh_zayed',
    name: { en: 'Sheikh Zayed', ar: 'الشيخ زايد' },
    avgOccupancy: 60,
    avgNightlyRate: 85,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'GCC Families', ar: 'عائلات خليجية' }],
    topPropertyTypes: [{ en: 'Villas', ar: 'فيلات' }, { en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Year-round steady demand.', ar: 'طلب مستقر على مدار العام.' },
    marketFact: { 
      en: 'Villas and large apartments are highly requested by GCC visitors here.', 
      ar: 'الفيلات والشقق الكبيرة مطلوبة بشدة من الزوار الخليجيين هنا.' 
    }
  },
  north_coast: {
    id: 'north_coast',
    name: { en: 'North Coast', ar: 'الساحل الشمالي' },
    avgOccupancy: 85,
    avgNightlyRate: 200,
    premiumLevel: 'elite',
    bestFitAudiences: [{ en: 'Vacationers', ar: 'المصطافون' }],
    topPropertyTypes: [{ en: 'Chalets', ar: 'شاليهات' }, { en: 'Villas', ar: 'فيلات' }],
    seasonalityNotes: { en: 'Peak season: June to August.', ar: 'موسم الذروة: يونيو إلى أغسطس.' },
    marketFact: { 
      en: 'Sahel properties can generate a year of revenue in just 3 summer months.', 
      ar: 'عقارات الساحل يمكنها تحقيق إيرادات عام كامل في 3 أشهر صيفية فقط.' 
    }
  },
  el_gouna: {
    id: 'el_gouna',
    name: { en: 'El Gouna', ar: 'الجونة' },
    avgOccupancy: 47,
    avgNightlyRate: 224,
    premiumLevel: 'elite',
    bestFitAudiences: [{ en: 'European Travelers', ar: 'زوار أوروبيون' }, { en: 'GCC Guests', ar: 'زوار خليجيون' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Villas', ar: 'فيلات' }],
    seasonalityNotes: { en: 'Strong year-round demand with winter peak.', ar: 'طلب قوي طوال العام مع ذروة شتوية.' },
    marketFact: {
      en: 'El Gouna commands Egypt’s highest nightly rates with premium guest demand.',
      ar: 'الجونة من أعلى الأسواق في السعر الليلي داخل مصر مع طلب ضيوف مميز.',
    },
  },
  zamalek: {
    id: 'zamalek',
    name: { en: 'Zamalek', ar: 'الزمالك' },
    avgOccupancy: 34.8,
    avgNightlyRate: 92,
    premiumLevel: 'high',
    bestFitAudiences: [{ en: 'Diplomatic & Business Guests', ar: 'ضيوف دبلوماسيون وأعمال' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Stable urban demand across the year.', ar: 'طلب حضري ثابت طوال العام.' },
    marketFact: {
      en: 'Zamalek is one of Cairo’s premium urban STR markets.',
      ar: 'الزمالك من أقوى الأسواق الحضرية للإيجار القصير في القاهرة.',
    },
  },
  nasr_city_6th_october: {
    id: 'nasr_city_6th_october',
    name: { en: 'Giza / 6th October / Nasr City', ar: 'الجيزة / أكتوبر / مدينة نصر' },
    avgOccupancy: 45,
    avgNightlyRate: 55,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Tourists & museum visitors', ar: 'سياح وزوار المتاحف' }, { en: 'Medium-stay guests', ar: 'ضيوف إقامة متوسطة' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: {
      en: 'Strong Oct–May window aligned with GEM and Cairo tourism.',
      ar: 'فترة قوية من أكتوبر إلى مايو مع المتحف المصري الكبير وسياحة القاهرة.',
    },
    marketFact: {
      en: 'This corridor benefits from GEM-driven tourism and year-round Cairo access.',
      ar: 'هذا الممر يستفيد من السياحة المرتبطة بالمتحف المصري الكبير ووصول القاهرة طوال العام.',
    },
  },
  maadi: {
    id: 'maadi',
    name: { en: 'Maadi', ar: 'المعادي' },
    avgOccupancy: 40,
    avgNightlyRate: 70,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Expats', ar: 'مغتربون' }, { en: 'Families', ar: 'عائلات' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Reliable demand driven by expat stays.', ar: 'طلب مستقر مدفوع بإقامات المغتربين.' },
    marketFact: {
      en: 'Maadi demand is driven by expat and medium-stay guests.',
      ar: 'طلب المعادي يأتي غالبًا من المغتربين والإقامات المتوسطة.',
    },
  },
  hurghada: {
    id: 'hurghada',
    name: { en: 'Hurghada', ar: 'الغردقة' },
    avgOccupancy: 48,
    avgNightlyRate: 58,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Leisure travelers', ar: 'مسافرو الترفيه' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Studios', ar: 'استوديوهات' }],
    seasonalityNotes: { en: 'Peak seasons from Oct to Apr.', ar: 'مواسم الذروة من أكتوبر إلى أبريل.' },
    marketFact: {
      en: 'Hurghada offers accessible entry with strong Red Sea tourism demand.',
      ar: 'الغردقة سوق مناسب للدخول مع طلب سياحي قوي على البحر الأحمر.',
    },
  },
  sharm: {
    id: 'sharm',
    name: { en: 'Sharm El Sheikh', ar: 'شرم الشيخ' },
    avgOccupancy: 45,
    avgNightlyRate: 70,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Tourism guests', ar: 'ضيوف سياحيون' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Resort units', ar: 'وحدات منتجعية' }],
    seasonalityNotes: { en: 'Seasonal peaks around holidays.', ar: 'ذروات موسمية حول الإجازات.' },
    marketFact: {
      en: 'Sharm is tourism-heavy with strong but competitive demand.',
      ar: 'شرم سوق سياحي قوي لكنه تنافسي.',
    },
  },
  dahab: {
    id: 'dahab',
    name: { en: 'Dahab', ar: 'دهب' },
    avgOccupancy: 42,
    avgNightlyRate: 65,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Lifestyle travelers', ar: 'مسافرو نمط الحياة' }],
    topPropertyTypes: [{ en: 'Studios', ar: 'استوديوهات' }, { en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Demand sensitive to design quality.', ar: 'الطلب حساس لجودة التصميم.' },
    marketFact: {
      en: 'Dahab guests care deeply about style and atmosphere.',
      ar: 'ضيوف دهب يهتمون جدًا بالتصميم والأجواء.',
    },
  },
  luxor_aswan: {
    id: 'luxor_aswan',
    name: { en: 'Luxor / Aswan', ar: 'الأقصر / أسوان' },
    avgOccupancy: 30,
    avgNightlyRate: 55,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Cultural tourists', ar: 'سياح ثقافيون' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Highly seasonal tourism cycles.', ar: 'طلب موسمي مرتفع التقلب.' },
    marketFact: {
      en: 'Luxor/Aswan demand is mostly seasonal and culture-driven.',
      ar: 'طلب الأقصر/أسوان موسمي ويرتبط بالسياحة الثقافية.',
    },
  },
  other: {
    id: 'other',
    name: { en: 'Other', ar: 'أخرى' },
    avgOccupancy: 34.5,
    avgNightlyRate: 67,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Mixed demand', ar: 'طلب متنوع' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Benchmarked against Cairo average.', ar: 'يتم القياس على متوسط القاهرة.' },
    marketFact: {
      en: 'We will benchmark your area against the nearest comparable market.',
      ar: 'سنقارن منطقتك بأقرب سوق مماثل.',
    },
  },
};

export function getRegionById(id: RegionId | undefined): Region {
  const key = (id ?? 'other') as string;
  return MOCK_REGIONS[key] ?? MOCK_REGIONS.other;
}

export async function getRegions(): Promise<Region[]> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 600));
  return Object.values(MOCK_REGIONS);
}
