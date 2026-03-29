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
    seasonalityNotes: { en: 'High demand during summer and winter holidays.', ar: 'طلب عالي في الصيف وإجازات الشتا.' },
    marketFact: { 
      en: 'Properties in New Cairo see 15% higher occupancy than the Cairo average.', 
      ar: 'العقارات في التجمع والقاهرة الجديدة فيها نسبة إشغال أعلى بـ ١٥٪ من متوسط القاهرة.' 
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
    seasonalityNotes: { en: 'Year-round steady demand.', ar: 'طلب مستقر طول السنة.' },
    marketFact: { 
      en: 'Villas and large apartments are highly requested by GCC visitors here.', 
      ar: 'الفيلات والشقق الكبيرة عليها طلب كبير جداً من الضيوف الخليجيين هنا.' 
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
    seasonalityNotes: { en: 'Peak season: June to August.', ar: 'موسم الذروة: من يونيو لأغسطس.' },
    marketFact: { 
      en: 'Sahel properties can generate a year of revenue in just 3 summer months.', 
      ar: 'عقارات الساحل ممكن تعمل دخل سنة كاملة في ٣ شهور صيف بس!' 
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
    seasonalityNotes: { en: 'Strong year-round demand with winter peak.', ar: 'طلب قوي طول السنة وبيرتفع جداً في الشتا.' },
    marketFact: {
      en: 'El Gouna commands Egypt’s highest nightly rates with premium guest demand.',
      ar: 'الجونة فيها أعلى سعر ليلة في مصر مع طلب من ضيوف مميزين جداً.'
    },
  },
  zamalek: {
    id: 'zamalek',
    name: { en: 'Zamalek', ar: 'الزمالك' },
    avgOccupancy: 34.8,
    avgNightlyRate: 92,
    premiumLevel: 'high',
    bestFitAudiences: [{ en: 'Diplomatic & Business Guests', ar: 'دبلوماسيين ورجال أعمال' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Stable urban demand across the year.', ar: 'طلب ثابت طول السنة عشان طبيعة المنطقة.' },
    marketFact: {
      en: 'Zamalek is one of Cairo’s premium urban STR markets.',
      ar: 'الزمالك من أرقى وأقوى مناطق الإيجار القصير في قلب القاهرة.'
    },
  },
  nasr_city_6th_october: {
    id: 'nasr_city_6th_october',
    name: { en: 'Giza / 6th October / Nasr City', ar: 'الجيزة / أكتوبر / مدينة نصر' },
    avgOccupancy: 45,
    avgNightlyRate: 55,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Tourists & museum visitors', ar: 'سياح وزوار متاحف' }, { en: 'Medium-stay guests', ar: 'إقامات متوسطة' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: {
      en: 'Strong Oct–May window aligned with GEM and Cairo tourism.',
      ar: 'فترة قوية من أكتوبر لمايو مع سياحة المتحف المصري الكبير.'
    },
    marketFact: {
      en: 'This corridor benefits from GEM-driven tourism and year-round Cairo access.',
      ar: 'المناطق دي بتستفيد جداً من سياحة المتحف المصري الجديد وسهولة الحركة في القاهرة.'
    },
  },
  maadi: {
    id: 'maadi',
    name: { en: 'Maadi', ar: 'المعادي' },
    avgOccupancy: 40,
    avgNightlyRate: 70,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Expats', ar: 'مغتربين' }, { en: 'Families', ar: 'عائلات' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Reliable demand driven by expat stays.', ar: 'طلب مستقر جداً بفضل إقامات الأجانب والمغتربين.' },
    marketFact: {
      en: 'Maadi demand is driven by expat and medium-stay guests.',
      ar: 'المعادي بتعتمد بشكل أساسي على الأجانب والإقامات اللي مدتها متوسطة.'
    },
  },
  hurghada: {
    id: 'hurghada',
    name: { en: 'Hurghada', ar: 'الغردقة' },
    avgOccupancy: 48,
    avgNightlyRate: 58,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Leisure travelers', ar: 'سياحة وترفيه' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Studios', ar: 'استوديوهات' }],
    seasonalityNotes: { en: 'Peak seasons from Oct to Apr.', ar: 'موسم الذروة من أكتوبر لأبريل.' },
    marketFact: {
      en: 'Hurghada offers accessible entry with strong Red Sea tourism demand.',
      ar: 'الغردقة سوق ممتاز للبداية مع طلب سياحي قوي طول السنة على البحر الأحمر.'
    },
  },
  sharm: {
    id: 'sharm',
    name: { en: 'Sharm El Sheikh', ar: 'شرم الشيخ' },
    avgOccupancy: 45,
    avgNightlyRate: 70,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Tourism guests', ar: 'ضيوف سياحيين' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }, { en: 'Resort units', ar: 'وحدات منتجعية' }],
    seasonalityNotes: { en: 'Seasonal peaks around holidays.', ar: 'ذروات موسمية في الإجازات والأعياد.' },
    marketFact: {
      en: 'Sharm is tourism-heavy with strong but competitive demand.',
      ar: 'شرم سوق سياحي ضخم، الطلب فيه قوي بس المنافسة كمان عالية.'
    },
  },
  dahab: {
    id: 'dahab',
    name: { en: 'Dahab', ar: 'دهب' },
    avgOccupancy: 42,
    avgNightlyRate: 65,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Lifestyle travelers', ar: 'مسافري نمط الحياة' }],
    topPropertyTypes: [{ en: 'Studios', ar: 'استوديوهات' }, { en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Demand sensitive to design quality.', ar: 'الطلب هنا حساس جداً لجودة التصميم والديكور.' },
    marketFact: {
      en: 'Dahab guests care deeply about style and atmosphere.',
      ar: 'ضيوف دهب بيدوروا على الروح والتصميم المميز قبل أي حاجة.'
    },
  },
  luxor_aswan: {
    id: 'luxor_aswan',
    name: { en: 'Luxor / Aswan', ar: 'الأقصر / أسوان' },
    avgOccupancy: 30,
    avgNightlyRate: 55,
    premiumLevel: 'medium',
    bestFitAudiences: [{ en: 'Cultural tourists', ar: 'سياحة ثقافية' }],
    topPropertyTypes: [{ en: 'Apartments', ar: 'شقق' }],
    seasonalityNotes: { en: 'Highly seasonal tourism cycles.', ar: 'طلب موسمي جداً، بيوصل لذروته في الشتا.' },
    marketFact: {
      en: 'Luxor/Aswan demand is mostly seasonal and culture-driven.',
      ar: 'الأقصر وأسوان بيعتمدوا بشكل كلي على السياحة الشتوية والثقافية.'
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
    seasonalityNotes: { en: 'Benchmarked against Cairo average.', ar: 'بنقيس الأداء بناءً على متوسط القاهرة.' },
    marketFact: {
      en: 'We will benchmark your area against the nearest comparable market.',
      ar: 'هنقارن منطقتك بأقرب سوق مشابه ليها عشان نديك أدق نتايج.'
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
