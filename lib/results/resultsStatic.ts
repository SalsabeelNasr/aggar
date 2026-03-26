import type { LocalizedString, PropertyStateFlag, RegionId } from '@/models';

export interface DiyChecklistItem {
  id: string;
  name: LocalizedString;
  cost: LocalizedString;
  tip: LocalizedString;
  /** How this nudges reviews / perceived quality (not a formal score line). */
  whyItHelps: LocalizedString;
}

export const DIY_CHECKLIST_ITEMS: DiyChecklistItem[] = [
  {
    id: 'netflix',
    name: { en: 'Netflix Standard', ar: 'Netflix Standard' },
    cost: { en: '165–210 EGP/mo', ar: '١٦٥–٢١٠ ج.م/شهر' },
    tip: {
      en: 'Create a guest profile, not your personal account.',
      ar: 'أنشئ ملفًا للضيوف، ليس حسابك الشخصي.',
    },
    whyItHelps: {
      en: 'Streaming is a quiet “value per night” signal — happy guests mention it, and that sentiment feeds how strong your listing feels overall.',
      ar: 'البث يعطي إحساساً بقيمة الإقامة — الضيوف الراضون يذكرونه، وهذا يغذي انطباع قوة الإعلان.',
    },
  },
  {
    id: 'shahid',
    name: { en: 'Shahid VIP', ar: 'Shahid VIP' },
    cost: { en: '100–150 EGP/mo', ar: '١٠٠–١٥٠ ج.م/شهر' },
    tip: { en: 'Essential for Arabic-speaking guests.', ar: 'مهم لضيوف يتحدثون العربية.' },
    whyItHelps: {
      en: 'For many regional guests this matters as much as Wi‑Fi — it is an easy way to lift perceived hospitality without touching your floorplan.',
      ar: 'لكثير من الضيوف المحليين يهم مثل الواي فاي — رفع بسيط لإحساس الضيافة دون تغيير المساحة.',
    },
  },
  {
    id: 'mesh',
    name: { en: 'Mesh Wi‑Fi (TP-Link Deco)', ar: 'Mesh Wi‑Fi (TP-Link Deco)' },
    cost: { en: '2,500–4,500 EGP', ar: '٢٬٥٠٠–٤٬٥٠٠ ج.م' },
    tip: { en: 'Post tested speed visibly in the unit.', ar: 'اعرض سرعة الاختبار بوضوح في الوحدة.' },
    whyItHelps: {
      en: 'Dead zones kill reviews. Solid Wi‑Fi is one of the fastest paths to “great stay” mentions — platforms weight that heavily in practice.',
      ar: 'المناطق الميتة تقتل التقييمات. واي فاي قوي من أسرع الطرق لذكر «إقامة ممتازة» — والمنصات تعتبره مهماً عملياً.',
    },
  },
  {
    id: 'welcome',
    name: { en: 'Welcome basket (water, sweets, fruit)', ar: 'سلة ترحيب (مياه، حلوى، فاكهة)' },
    cost: { en: '200–400 EGP/stay', ar: '٢٠٠–٤٠٠ ج.م/إقامة' },
    tip: { en: 'Guests mention this in reviews.', ar: 'الضيوف يذكرونها في التقييمات.' },
    whyItHelps: {
      en: 'Tiny touches often become five-star sentences — they do not replace photos, but they nudge review tone in your favor.',
      ar: 'لمسات صغيرة غالباً تتحول لجمل خمس نجوم — لا تحل محل الصور، لكنها تدفع نبرة التقييم لصالحك.',
    },
  },
  {
    id: 'first_aid',
    name: { en: 'First aid kit', ar: 'حقيبة إسعافات أولية' },
    cost: { en: '300–500 EGP', ar: '٣٠٠–٥٠٠ ج.م' },
    tip: { en: 'Panadol, plasters, antiseptic wipes.', ar: 'مسكن، لاصقات، مناديل مطهرة.' },
    whyItHelps: {
      en: 'Safety and care read as professionalism — families notice, and calmer guests write calmer reviews.',
      ar: 'الأمان والعناية يبدوان احترافاً — العائلات تلاحظ، والضيف الأهدأ يكتب تقييماً أهدأ.',
    },
  },
];

export interface ScoreImprovementRow {
  id: string;
  title: LocalizedString;
  scoreGain: LocalizedString;
  cost: LocalizedString;
}

export const SCORE_IMPROVEMENT_ROWS: ScoreImprovementRow[] = [
  {
    id: 'photo',
    title: { en: 'Professional photography', ar: 'تصوير احترافي' },
    scoreGain: { en: '+6 pts', ar: '+٦ نقاط' },
    cost: { en: '5,000–16,000 EGP', ar: '٥٬٠٠٠–١٦٬٠٠٠ ج.م' },
  },
  {
    id: 'lighting',
    title: { en: 'Improve lighting', ar: 'تحسين الإضاءة' },
    scoreGain: { en: '+5 pts', ar: '+٥ نقاط' },
    cost: { en: '8,000–15,000 EGP', ar: '٨٬٠٠٠–١٥٬٠٠٠ ج.م' },
  },
  {
    id: 'linen',
    title: { en: 'Linen upgrade to triple par', ar: 'ترقية مفروشات فندقية (طقم ثلاثي)' },
    scoreGain: { en: '+4 pts', ar: '+٤ نقاط' },
    cost: { en: '9,000–10,500 EGP', ar: '٩٬٠٠٠–١٠٬٥٠٠ ج.م' },
  },
  {
    id: 'bath',
    title: { en: 'Bathroom non-slip + fixtures', ar: 'حمام مانع انزلاق + خلاطات' },
    scoreGain: { en: '+3 pts', ar: '+٣ نقاط' },
    cost: { en: '8,000–20,000 EGP', ar: '٨٬٠٠٠–٢٠٬٠٠٠ ج.م' },
  },
  {
    id: 'workspace',
    title: { en: 'Add workspace (desk + chair)', ar: 'إضافة مكتب عمل' },
    scoreGain: { en: '+2 pts', ar: '+٢ نقاط' },
    cost: { en: '3,500–7,000 EGP', ar: '٣٬٥٠٠–٧٬٠٠٠ ج.م' },
  },
];

export interface ConsultantCard {
  id: string;
  name: LocalizedString;
  title: LocalizedString;
  bio: LocalizedString;
  regionIds: RegionId[];
  rating: number;
  consultations: number;
  availability: LocalizedString;
  priceEgp: { min: number; max: number };
  /** Used for spec “matching logic” ordering */
  specialties: Array<'reno' | 'styling' | 'ops' | 'licensing' | 'invest'>;
}

export const CONSULTANT_MOCK: ConsultantCard[] = [
  {
    id: 'c1',
    name: { en: 'Nour El-Masry', ar: 'نور المصري' },
    title: { en: 'Renovation & interior design', ar: 'تشطيب وتصميم داخلي' },
    bio: {
      en: '15+ renewals in New Cairo & Sheikh Zayed. STR-first floorplans.',
      ar: 'أكثر من ١٥ مشروع تجديد في القاهرة الجديدة والشيخ زايد بتركيز STR.',
    },
    regionIds: ['new_cairo', 'sheikh_zayed', 'north_coast'],
    rating: 4.9,
    consultations: 214,
    availability: { en: 'Next slot: Thu 3pm', ar: 'أقرب موعد: الخميس ٣ م' },
    priceEgp: { min: 800, max: 1200 },
    specialties: ['reno', 'styling'],
  },
  {
    id: 'c2',
    name: { en: 'Omar Hassanein', ar: 'عمر حسنين' },
    title: { en: 'STR operations & listing optimization', ar: 'تشغيل STR وتحسين الإعلان' },
    bio: {
      en: 'Former OTA host advisor; focuses on Hurghada & Sharm performance.',
      ar: 'خبير سابق في منصات الحجز؛ يركز على أداء الغردقة وشرم.',
    },
    regionIds: ['hurghada', 'sharm', 'el_gouna'],
    rating: 4.8,
    consultations: 176,
    availability: { en: 'Available today', ar: 'متاح اليوم' },
    priceEgp: { min: 600, max: 900 },
    specialties: ['ops', 'invest'],
  },
  {
    id: 'c3',
    name: { en: 'Layla Khaled', ar: 'ليلى خالد' },
    title: { en: 'Decree 209 & licensing', ar: 'قرار ٢٠٩ والتراخيص' },
    bio: {
      en: 'Compliance-first onboarding for Zamalek & Maadi mixed-use.',
      ar: 'امتثال وترخيص للمباني المختلطة في الزمالك والمعادي.',
    },
    regionIds: ['zamalek', 'maadi', 'new_cairo'],
    rating: 5.0,
    consultations: 132,
    availability: { en: 'Next slot: Wed 11am', ar: 'أقرب موعد: الأربعاء ١١ ص' },
    priceEgp: { min: 900, max: 1500 },
    specialties: ['licensing'],
  },
  {
    id: 'c4',
    name: { en: 'Karim Fadel', ar: 'كريم فاضل' },
    title: { en: 'Investment & ROI strategy', ar: 'استثمار واستراتيجية عائد' },
    bio: {
      en: 'Bundles capex, yield, and payback for coastal & Cairo portfolios.',
      ar: 'يربط الاستثمار والعائد واسترداد رأس المال للساحل والقاهرة.',
    },
    regionIds: ['north_coast', 'el_gouna', 'new_cairo'],
    rating: 4.7,
    consultations: 98,
    availability: { en: 'Next slot: Fri 10am', ar: 'أقرب موعد: الجمعة ١٠ ص' },
    priceEgp: { min: 700, max: 1100 },
    specialties: ['invest'],
  },
];

function firstSpecialtyForState(state: PropertyStateFlag | undefined): ConsultantCard['specialties'][number] {
  switch (state) {
    case 'SHELL':
    case 'FURNISHED':
      return 'reno';
    case 'FINISHED_EMPTY':
      return 'styling';
    default:
      return 'ops';
  }
}

export function rankConsultantsForProperty(
  consultants: ConsultantCard[],
  regionId: RegionId | undefined,
  stateFlag: PropertyStateFlag | undefined,
  licensingFirst: boolean
): ConsultantCard[] {
  const region = regionId ?? 'other';
  const want = licensingFirst ? 'licensing' : firstSpecialtyForState(stateFlag);
  return [...consultants].sort((a, b) => {
    const score = (c: ConsultantCard) => {
      let s = 0;
      if (c.regionIds.includes(region)) s += 10;
      if (c.specialties.includes(want)) s += 20;
      if (c.specialties.includes('ops') && stateFlag === 'FURNISHED') s += 5;
      return s;
    };
    return score(b) - score(a);
  });
}

export const PARTNER_CATEGORY_KEYS = [
  { id: 'reno', name: { en: 'Renovation', ar: 'تشطيب' } },
  { id: 'photo', name: { en: 'Photography', ar: 'تصوير' } },
  { id: 'mgmt', name: { en: 'Property management', ar: 'إدارة تشغيل' } },
  { id: 'lock', name: { en: 'Smart access', ar: 'دخول ذكي' } },
  { id: 'license', name: { en: 'STR licensing', ar: 'ترخيص STR' } },
] as const;

export type PartnerCategoryId = (typeof PARTNER_CATEGORY_KEYS)[number]['id'];

/** Map UI chips to consultant `specialties` (mock data uses a small specialty enum). */
export const SPECIALIST_FILTER_TO_SPECIALTIES: Record<
  PartnerCategoryId,
  readonly ConsultantCard['specialties'][number][]
> = {
  reno: ['reno'],
  photo: ['styling'],
  mgmt: ['ops'],
  lock: ['ops'],
  license: ['licensing'],
};

export function filterConsultantsByPartnerCategory(
  consultants: ConsultantCard[],
  filter: PartnerCategoryId | null
): ConsultantCard[] {
  if (filter === null) return consultants;
  const wanted = SPECIALIST_FILTER_TO_SPECIALTIES[filter];
  return consultants.filter((c) => wanted.some((s) => c.specialties.includes(s)));
}
