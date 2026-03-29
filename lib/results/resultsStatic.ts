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
    name: { en: 'Netflix Standard', ar: 'اشتراك نتفليكس' },
    cost: { en: '165–210 EGP/mo', ar: '165–210 ج.م/شهر' },
    tip: {
      en: 'Create a guest profile, not your personal account.',
      ar: 'اعمل بروفايل خاص للضيوف، بلاش تستخدم حسابك الشخصي.',
    },
    whyItHelps: {
      en: 'Streaming is a quiet “value per night” signal — happy guests mention it, and that sentiment feeds how strong your listing feels overall.',
      ar: 'وجود خدمات ترفيهية بيدي إحساس بقيمة الليلة، والضيوف بيحبوا يذكروا ده في تقييماتهم.',
    },
  },
  {
    id: 'shahid',
    name: { en: 'Shahid VIP', ar: 'اشتراك شاهد VIP' },
    cost: { en: '100–150 EGP/mo', ar: '100–150 ج.م/شهر' },
    tip: { en: 'Essential for Arabic-speaking guests.', ar: 'مهم جداً للضيوف العرب والمصريين.' },
    whyItHelps: {
      en: 'For many regional guests this matters as much as Wi‑Fi — it is an easy way to lift perceived hospitality without touching your floorplan.',
      ar: 'بالنسبة لكتير من الضيوف، "شاهد" مهم زي الواي فاي بالظبط، وبيرفع مستوى الضيافة بسهولة.',
    },
  },
  {
    id: 'mesh',
    name: { en: 'Mesh Wi‑Fi (TP-Link Deco)', ar: 'مقوي واي فاي (Mesh)' },
    cost: { en: '2,500–4,500 EGP', ar: '2,500–4,500 ج.م' },
    tip: { en: 'Post tested speed visibly in the unit.', ar: 'اعرض سرعة النت بوضوح في الشقة عشان الضيف يطمن.' },
    whyItHelps: {
      en: 'Dead zones kill reviews. Solid Wi‑Fi is one of the fastest paths to “great stay” mentions — platforms weight that heavily in practice.',
      ar: 'النت الضعيف بيقتل التقييمات. واي فاي قوي في كل ركن هو أسرع طريق لتقييم 5 نجوم.',
    },
  },
  {
    id: 'welcome',
    name: { en: 'Welcome basket (water, sweets, fruit)', ar: 'سلة ترحيب (مياه، سناكس، فاكهة)' },
    cost: { en: '200–400 EGP/stay', ar: '200–400 ج.م/إقامة' },
    tip: { en: 'Guests mention this in reviews.', ar: 'الضيوف دايماً بيشكروا في الحركة دي في التقييمات.' },
    whyItHelps: {
      en: 'Tiny touches often become five-star sentences — they do not replace photos, but they nudge review tone in your favor.',
      ar: 'اللمسات الصغيرة هي اللي بتخلي الضيف يكتب عنك كلام حلو، وبتحسسه إنه في بيته.',
    },
  },
  {
    id: 'first_aid',
    name: { en: 'First aid kit', ar: 'شنطة إسعافات أولية' },
    cost: { en: '300–500 EGP', ar: '300–500 ج.م' },
    tip: { en: 'Panadol, plasters, antiseptic wipes.', ar: 'بنادول، بلاستر، ومناديل مطهرة.' },
    whyItHelps: {
      en: 'Safety and care read as professionalism — families notice, and calmer guests write calmer reviews.',
      ar: 'الأمان والاهتمام بيبين إنك مضيف محترف، والعائلات بالذات بتهتم جداً بالتفاصيل دي.',
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
    scoreGain: { en: '+6 pts', ar: '+6 نقاط' },
    cost: { en: '5,000–16,000 EGP', ar: '5,000–16,000 ج.م' },
  },
  {
    id: 'lighting',
    title: { en: 'Improve lighting', ar: 'تحسين الإضاءة' },
    scoreGain: { en: '+5 pts', ar: '+5 نقاط' },
    cost: { en: '8,000–15,000 EGP', ar: '8,000–15,000 ج.م' },
  },
  {
    id: 'linen',
    title: { en: 'Linen upgrade to triple par', ar: 'مفروشات فندقية (طقم ثلاثي)' },
    scoreGain: { en: '+4 pts', ar: '+4 نقاط' },
    cost: { en: '9,000–10,500 EGP', ar: '9,000–10,500 ج.م' },
  },
  {
    id: 'bath',
    title: { en: 'Bathroom non-slip + fixtures', ar: 'تجديد الحمام (أمان + خلاطات)' },
    scoreGain: { en: '+3 pts', ar: '+3 نقاط' },
    cost: { en: '8,000–20,000 EGP', ar: '8,000–20,000 ج.م' },
  },
  {
    id: 'workspace',
    title: { en: 'Add workspace (desk + chair)', ar: 'إضافة ركن للعمل' },
    scoreGain: { en: '+2 pts', ar: '+2 نقاط' },
    cost: { en: '3,500–7,000 EGP', ar: '3,500–7,000 ج.م' },
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
  /** Fixed consultation rate in EGP (per session). */
  priceEgp: number;
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
      ar: 'أكتر من 15 مشروع تجديد في التجمع وزايد بتركيز خاص على الإيجار القصير.',
    },
    regionIds: ['new_cairo', 'sheikh_zayed', 'north_coast'],
    rating: 4.9,
    consultations: 214,
    availability: { en: 'Next slot: Thu 3pm', ar: 'الموعد الجاي: الخميس 3 م' },
    priceEgp: 1000,
    specialties: ['reno', 'styling'],
  },
  {
    id: 'c2',
    name: { en: 'Omar Hassanein', ar: 'عمر حسنين' },
    title: { en: 'STR operations & listing optimization', ar: 'تشغيل STR وتحسين الإعلانات' },
    bio: {
      en: 'Former OTA host advisor; focuses on Hurghada & Sharm performance.',
      ar: 'خبير سابق في منصات الحجز؛ متخصص في رفع أداء عقارات الغردقة وشرم.',
    },
    regionIds: ['hurghada', 'sharm', 'el_gouna'],
    rating: 4.8,
    consultations: 176,
    availability: { en: 'Available today', ar: 'متاح النهاردة' },
    priceEgp: 750,
    specialties: ['ops', 'invest'],
  },
  {
    id: 'c3',
    name: { en: 'Layla Khaled', ar: 'ليلى خالد' },
    title: { en: 'Decree 209 & licensing', ar: 'تراخيص سياحية (قرار 209)' },
    bio: {
      en: 'Compliance-first onboarding for Zamalek & Maadi mixed-use.',
      ar: 'متخصصة في التراخيص والامتثال القانوني، خصوصاً في الزمالك والمعادي.',
    },
    regionIds: ['zamalek', 'maadi', 'new_cairo'],
    rating: 5.0,
    consultations: 132,
    availability: { en: 'Next slot: Wed 11am', ar: 'الموعد الجاي: الأربعاء 11 ص' },
    priceEgp: 1200,
    specialties: ['licensing'],
  },
  {
    id: 'c4',
    name: { en: 'Karim Fadel', ar: 'كريم فاضل' },
    title: { en: 'Investment & ROI strategy', ar: 'استراتيجيات الاستثمار والعائد' },
    bio: {
      en: 'Bundles capex, yield, and payback for coastal & Cairo portfolios.',
      ar: 'بيساعدك تحسب العائد على استثمارك وفترة استرداد رأس المال في الساحل والقاهرة.',
    },
    regionIds: ['north_coast', 'el_gouna', 'new_cairo'],
    rating: 4.7,
    consultations: 98,
    availability: { en: 'Next slot: Fri 10am', ar: 'الموعد الجاي: الجمعة 10 ص' },
    priceEgp: 900,
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
  { id: 'reno', name: { en: 'Renovation', ar: 'تشطيب وتجديد' } },
  { id: 'photo', name: { en: 'Photography', ar: 'تصوير احترافي' } },
  { id: 'mgmt', name: { en: 'Property management', ar: 'إدارة وتشغيل' } },
  { id: 'lock', name: { en: 'Smart access', ar: 'دخول ذكي' } },
  { id: 'license', name: { en: 'STR licensing', ar: 'تراخيص سياحية' } },
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
