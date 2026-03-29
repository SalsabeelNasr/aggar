import type { FurnishingAesthetic, RegionId, WizardData } from '@/models';

export interface NeighborhoodMarketData {
  avgOcc: number;
  topOcc: number;
  avgADR: number;
  topADR: number;
  mustHaveAmenities: string[];
  dominantAesthetic: { en: string; ar: string };
  demandNote: { en: string; ar: string };
}

function n(en: string, ar: string) {
  return { en, ar };
}

/**
 * Mock-market benchmarks (EGP nightly-style ADR × model occupancy).
 * Consumed by the evaluation report + competition snapshot card.
 */
export const MARKET_DATA: Record<string, NeighborhoodMarketData> = {
  'New Cairo': {
    avgOcc: 0.38,
    topOcc: 0.68,
    avgADR: 2200,
    topADR: 7600,
    mustHaveAmenities: ['fiber_internet', 'smart_lock', 'dedicated_workspace', 'inverter_ac'],
    dominantAesthetic: n('Quiet-Luxury Modern', 'مودرن هادي وفخم'),
    demandNote: n('Corporate + compound demand is year-round; weekends stay volatile.', 'طلب الشركات والكمبوندات شغال طول السنة؛ والويك إند عليه ضغط عالي.'),
  },
  'Sheikh Zayed': {
    avgOcc: 0.32,
    topOcc: 0.66,
    avgADR: 3300,
    topADR: 6100,
    mustHaveAmenities: ['gated_security', 'king_bed', 'smart_home_controls', 'outdoor_seating'],
    dominantAesthetic: n('Resort-Adjacency Contemporary', 'معاصر بلمسة منتجعات'),
    demandNote: n('Villa + large-layout demand from GCC families on long weekends.', 'الفيلات والمساحات الكبيرة مطلوبة جداً للعائلات الخليجية في الإجازات.'),
  },
  Zamalek: {
    avgOcc: 0.35,
    topOcc: 0.75,
    avgADR: 4500,
    topADR: 7000,
    mustHaveAmenities: ['concierge_service', 'nespresso', 'high_ceilings', 'premium_linens'],
    dominantAesthetic: n('Heritage Nile Chic', 'أناقة نيلية كلاسيكية'),
    demandNote: n('Premium urban STR: calendars fill on events + winter diplomatic season.', 'سوق راقي جداً؛ المواعيد بتتحجز بسرعة في موسم الشتا الدبلوماسي.'),
  },
  'Giza / 6th October / Nasr City': {
    avgOcc: 0.44,
    topOcc: 0.7,
    avgADR: 2500,
    topADR: 4500,
    mustHaveAmenities: ['pyramid_view_focus', 'tourist_safety_kit', 'self_check_in'],
    dominantAesthetic: n('Museum-Route Functional Boutique', 'بوتيك عملي قريب من المتاحف'),
    demandNote: n('GEM-led tourism lifts Oct–May; optimize for short cultural stays.', 'سياحة المتحف الجديد بتزود الطلب جداً من أكتوبر لمايو.'),
  },
  'North Coast': {
    avgOcc: 0.25,
    topOcc: 0.85,
    avgADR: 6500,
    topADR: 12500,
    mustHaveAmenities: ['beach_access_pass', 'premium_towels', 'fully_equipped_kitchen', 'shuttle_service'],
    dominantAesthetic: n('Sahel Coastal Maximalist', 'ساحلي صيفي فخم جداً'),
    demandNote: n('Peak is Jun–Aug; off-season averages collapse—price like a seasonable asset.', 'الذروة في الصيف (يونيو-أغسطس)؛ استغل الموسم صح عشان تعمل دخل السنة كلها.'),
  },
  'El Gouna': {
    avgOcc: 0.6,
    topOcc: 0.82,
    avgADR: 5000,
    topADR: 9000,
    mustHaveAmenities: ['fiber_internet', 'bicycle_access', 'outdoor_shower', 'lagoon_access'],
    dominantAesthetic: n('Mediterranean Minimalist', 'بسيط بلمسة البحر المتوسط'),
    demandNote: n(
      'Winter-sun + lagoon access listings command outsized ADR.',
      'الوحدات اللي بتطل على اللاجون أو قريبة من البحر بتجيب أعلى سعر ليلة.'
    ),
  },
  Maadi: {
    avgOcc: 0.43,
    topOcc: 0.65,
    avgADR: 3000,
    topADR: 5500,
    mustHaveAmenities: ['pet_friendly_setup', 'green_view', 'quiet_zone_insulation'],
    dominantAesthetic: n('Garden-Quiet Expats Standard', 'هادي بفيو شجر ومناسب للأجانب'),
    demandNote: n('Expat + medium-stay demand; noise insulation shows up in reviews.', 'طلب عالي من الأجانب للإقامات الطويلة؛ الهدوء أهم ميزة بيدوروا عليها.'),
  },
  Hurghada: {
    avgOcc: 0.5,
    topOcc: 0.78,
    avgADR: 2800,
    topADR: 5200,
    mustHaveAmenities: ['pool_access', 'cleaning_on_demand', 'snorkeling_gear'],
    dominantAesthetic: n('Red Sea Resort-Ready', 'ستايل منتجعات البحر الأحمر'),
    demandNote: n('Oct–Apr leisure peak; pool + cleaning SLAs are table stakes.', 'موسم السياحة من أكتوبر لأبريل؛ حمام السباحة والنضافة أهم حاجة.'),
  },
  'Sharm El Sheikh': {
    avgOcc: 0.52,
    topOcc: 0.8,
    avgADR: 3200,
    topADR: 6000,
    mustHaveAmenities: ['shuttle_bus', 'smart_tv_with_netflix', 'balcony_furniture'],
    dominantAesthetic: n('Resort Balcony Living', 'قعدة بلكونة بستايل منتجعات'),
    demandNote: n('Holiday spikes dominate; transfers + balcony scenes convert clicks.', 'الطلب بيزيد جداً في الإجازات؛ صور البلكونة هي اللي بتجيب الحجوزات.'),
  },
  'Dahab': {
    avgOcc: 0.55,
    topOcc: 0.85,
    avgADR: 1800,
    topADR: 3500,
    mustHaveAmenities: ['hammock', 'fast_wifi', 'eco_friendly_toiletries'],
    dominantAesthetic: n('Laid-Back Eco Lodge', 'ستايل بيئي مريح وبسيط'),
    demandNote: n('Aesthetic-sensitive market; Wi‑Fi promises must survive speed tests.', 'سوق دهب بيعشق الديكور المميز؛ والواي فاي السريع ضروري جداً.'),
  },
  'Luxor / Aswan': {
    avgOcc: 0.45,
    topOcc: 0.75,
    avgADR: 3500,
    topADR: 6500,
    mustHaveAmenities: ['nile_view', 'traditional_decor', 'guided_tour_contacts'],
    dominantAesthetic: n('Nile Heritage Storytelling', 'روح النيل والتراث المصري'),
    demandNote: n('Winter cultural peak; Nile-view framing beats generic “nice apartment”.', 'الذروة في شتا الأقصر وأسوان؛ فيو النيل بيكسب أي شقة تانية.'),
  },
};

export const REGION_ID_TO_MARKET_LABEL: Record<RegionId, keyof typeof MARKET_DATA | null> = {
  new_cairo: 'New Cairo',
  sheikh_zayed: 'Sheikh Zayed',
  zamalek: 'Zamalek',
  nasr_city_6th_october: 'Giza / 6th October / Nasr City',
  north_coast: 'North Coast',
  el_gouna: 'El Gouna',
  maadi: 'Maadi',
  hurghada: 'Hurghada',
  sharm: 'Sharm El Sheikh',
  dahab: 'Dahab',
  luxor_aswan: 'Luxor / Aswan',
  industrial_informal: 'Giza / 6th October / Nasr City',
  other: null,
};

const DEFAULT_MARKET_KEY: keyof typeof MARKET_DATA = 'New Cairo';

export function getNeighborhoodMarketData(regionId: RegionId | undefined): NeighborhoodMarketData {
  const label = REGION_ID_TO_MARKET_LABEL[regionId ?? 'other'] ?? DEFAULT_MARKET_KEY;
  const key = label ?? DEFAULT_MARKET_KEY;
  return MARKET_DATA[key] ?? MARKET_DATA[DEFAULT_MARKET_KEY]!;
}

/** Host-facing labels for mock amenity keys (EN / AR). */
export const AMENITY_MARKET_LABELS: Record<string, { en: string; ar: string }> = {
  fiber_internet: n('fiber internet', 'نت فايبر سريع'),
  smart_lock: n('a smart lock / self check-in stack', 'قفل ذكي ودخول ذاتي'),
  dedicated_workspace: n('a dedicated workspace', 'ركن مخصص للشغل'),
  inverter_ac: n('quiet inverter AC', 'تكييف إنفيرتر هادي'),
  gated_security: n('24/7 gated security cues', 'أمن وحراسة ٢٤ ساعة'),
  king_bed: n('a true king bed', 'سرير كينج كبير ومريح'),
  smart_home_controls: n('smart-home controls', 'تحكم ذكي في البيت'),
  outdoor_seating: n('styled outdoor seating', 'قعدة خارجية شيك'),
  concierge_service: n('concierge-style handoffs', 'خدمة استقبال مميزة'),
  nespresso: n('a Nespresso machine', 'ماكينة قهوة نسبريسو'),
  high_ceilings: n('high-ceiling drama in photos', 'سقف عالي بيدي فخامة'),
  premium_linens: n('premium hotel linens', 'مفروشات فندقية راقية'),
  pyramid_view_focus: n('pyramid-story photos', 'فيو مباشر للأهرامات'),
  tourist_safety_kit: n('a tourist safety + orientation kit', 'شنطة أمان ومعلومات للسياح'),
  self_check_in: n('frictionless self check-in', 'دخول ذاتي سهل وسريع'),
  beach_access_pass: n('beach access / pass clarity', 'دخول مباشر للبحر'),
  premium_towels: n('premium pool/beach towels', 'فوط بحر ومسبح فخمة'),
  fully_equipped_kitchen: n('a fully equipped chef kitchen', 'مطبخ مجهز بالكامل'),
  shuttle_service: n('transfer / shuttle options', 'خدمة توصيل وانتقالات'),
  bicycle_access: n('bicycle_access', 'عجل متاح للاستخدام'),
  outdoor_shower: n('an outdoor shower', 'دش خارجي'),
  lagoon_access: n('lagoon / beach adjacency', 'قريب جداً من اللاجون'),
  pet_friendly_setup: n('pet-friendly setup', 'مجهز لاستقبال الحيوانات'),
  green_view: n('green-view frames', 'فيو شجر وجناين'),
  quiet_zone_insulation: n('quiet-zone insulation', 'عزل صوت عشان الهدوء'),
  pool_access: n('pool access', 'دخول لحمام السباحة'),
  cleaning_on_demand: n('on-demand cleaning SLAs', 'خدمة تنضيف عند الطلب'),
  snorkeling_gear: n('snorkeling gear for guests', 'معدات غطس للضيوف'),
  shuttle_bus: n('airport / hub shuttles', 'أتوبيس توصيل للمطار'),
  smart_tv_with_netflix: n('smart TV + streaming stack', 'تلفزيون ذكي مع نتفليكس'),
  balcony_furniture: n('styled balcony furniture', 'فرش بلكونة مريح'),
  hammock: n('a hammock moment', 'أرجوحة (هاموك) للاسترخاء'),
  fast_wifi: n('fast Wi‑Fi proof', 'نت سريع جداً ومجرب'),
  eco_friendly_toiletries: n('eco toiletries', 'مستلزمات حمام صديقة للبيئة'),
  nile_view: n('a Nile view lane', 'إطلالة مباشرة على النيل'),
  traditional_decor: n('traditional decor cues', 'ديكور تراثي مصري'),
  guided_tour_contacts: n('trusted tour contacts', 'أرقام مرشدين سياحيين ثقة'),
};

const AESTHETIC_LABEL: Record<FurnishingAesthetic, { en: string; ar: string }> = {
  boho: n('Boho', 'بوهو (Boho)'),
  hotel_like: n('Hotel-like', 'فندقي راقي'),
  coastal: n('Coastal', 'ساحلي'),
  industrial: n('Industrial', 'صناعي'),
  fun: n('Playful', 'مبهج وعصري'),
  modern_minimalist: n('Modern Minimalist', 'مودرن بسيط'),
  classic: n('Classic', 'كلاسيكي'),
};

export function furnishingStyleHint(data: WizardData): { en: string; ar: string } | null {
  const a = data.furnishingAesthetic;
  if (!a) return null;
  return AESTHETIC_LABEL[a] ?? null;
}
