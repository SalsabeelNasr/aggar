import type { FurnishedPhotoChecklistId } from '@/models';
import type { DiyChecklistItem } from '@/lib/results/resultsStatic';

export const ALL_FURNISHED_PHOTO_CHECKLIST_IDS: FurnishedPhotoChecklistId[] = [
  'balcony_window_view',
  'kitchen_cabinets_cleanliness_proof',
  'mattress_pillows_hotel_tuck',
  'smart_lock_keyless_entry',
  'wifi_speed_screenshot_or_router',
  'fire_safety_smoke_detectors',
];

const DIY_BY_GAP: Record<FurnishedPhotoChecklistId, DiyChecklistItem> = {
  balcony_window_view: {
    id: 'gap_balcony_window_view',
    name: {
      en: 'Shoot the view from balcony or window',
      ar: 'صوّر الإطلالة من البلكونة أو الشباك',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Shoot in daylight; include a sliver of interior so scale reads clearly.',
      ar: 'صوّر نهاراً؛ أظهر جزءاً من الداخل لتوضيح المقاس.',
    },
    whyItHelps: {
      en: 'View proof is a top click driver on OTAs — it answers “what will I wake up to?” before price even matters.',
      ar: 'إثبات الإطلالة من أقوى عوامل النقر — يجيب «إيه اللي هشوفه الصبح؟» قبل السعر.',
    },
  },
  kitchen_cabinets_cleanliness_proof: {
    id: 'gap_kitchen_cabinets_cleanliness_proof',
    name: {
      en: 'Photo inside kitchen cabinets (cleanliness proof)',
      ar: 'صورة داخل خزائن المطبخ (إثبات النظافة)',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Open one upper and one lower door; wipe shelves so whites read true on camera.',
      ar: 'افتح باب علوي وسفلي؛ امسح الرفوف حتى تظهر الألوان بوضوح.',
    },
    whyItHelps: {
      en: 'Guests infer hygiene from kitchens. Proof shots reduce “will it be gross?” friction and support higher trust scores.',
      ar: 'الضيوف يستنتجون النظافة من المطبخ. لقطات الإثبات تقلل الشك وتدعم الثقة.',
    },
  },
  mattress_pillows_hotel_tuck: {
    id: 'gap_mattress_pillows_hotel_tuck',
    name: {
      en: 'Close-up: mattress & pillows (hotel-style tuck)',
      ar: 'لقطة قريبة: المرتبة والمخدات (طيّ فندقي)',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Crisp triple-par white reads “hotel clean”; shoot parallel to the bed, soft daylight.',
      ar: 'الأبيض الفندقي الثلاثي يقرأ «نظافة فندقية»؛ صوّر موازياً للسرير بنور ناعم.',
    },
    whyItHelps: {
      en: 'Bedding is a review magnet — this frame scores almost as hard as a pro shoot for perceived quality.',
      ar: 'المفروشات تظهر في التقييمات كثيراً — هذه اللقطة ترفع إحساس الجودة مثل التصوير الاحترافي أحياناً.',
    },
  },
  smart_lock_keyless_entry: {
    id: 'gap_smart_lock_keyless_closeup',
    name: {
      en: 'Close-up: smart lock / keyless entry point',
      ar: 'لقطة قريبة: القفل الذكي أو نقطة الدخول بدون مفتاح',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Include the keypad and handle; avoid glare — one landscape + one portrait crop for carousel.',
      ar: 'أضف اللوحة والمقبض؛ تجنب الوهج — أفقي وعمودي للمعرض.',
    },
    whyItHelps: {
      en: 'Self check-in is a conversion signal — a clear lock frame cuts pre-arrival anxiety and message volume.',
      ar: 'الدخول الذاتي يزيد التحويل — لقطة واضحة للقفل تقلل القلق ورسائل ما قبل الوصول.',
    },
  },
  wifi_speed_screenshot_or_router: {
    id: 'gap_wifi_speed_screenshot_or_router',
    name: {
      en: 'Add Wi‑Fi speed screenshot or router photo',
      ar: 'أضف لقطة سرعة الواي فاي أو صورة الراوتر',
    },
    cost: { en: 'Free', ar: 'مجاني' },
    tip: {
      en: 'Run a speed test in the living area; screenshot Mbps + ping visible, or label the router shelf cleanly.',
      ar: 'اختبر السرعة في الصالة؛ اظهر Mbps وping، أو صوّر الراوتر بوضوح.',
    },
    whyItHelps: {
      en: 'Wi‑Fi proof ranks with AC in complaint avoidance — it is a quiet score lever for business and family stays.',
      ar: 'إثبات الواي فاي مهم مثل التكييف لتجنب الشكاوى — مهم للإقامات العائلية والعمل.',
    },
  },
  fire_safety_smoke_detectors: {
    id: 'gap_fire_safety_smoke_detectors',
    name: {
      en: 'Photo fire-safety kit / smoke detectors',
      ar: 'صوّر طقم السلامة من الحرائق أو كاشفات الدخان',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Ceiling detectors in frame + kit location in kitchen/hall — keep labels readable.',
      ar: 'كاشفات السقف + موقع الطقم — الحفاظ على وضوح الملصقات.',
    },
    whyItHelps: {
      en: 'Compliance and care read as professionalism; platforms and families weigh safety cues in browse decisions.',
      ar: 'السلامة تبدو احترافاً؛ العائلات والمنصات تلتقط إشارات الأمان عند التصفح.',
    },
  },
};

/** Extra listing-photo habits that reinforce high-scoring themes (linen, lock, depth). Shown for furnished hosts after checklist gaps. */
export const FURNISHED_LISTING_PHOTO_COMPANION_DIY: DiyChecklistItem[] = [
  {
    id: 'photo_companion_bedroom_wide_and_detail',
    name: {
      en: 'Listing set: wide bedroom + tuck detail (pair)',
      ar: 'معرض الصور: غرفة بالكامل + لقطة تفصيل للطيّ',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Algorithms favor sets — establish the room, then sell the bed quality with your tuck close-up.',
      ar: 'الأنظمة تفضّل المجموعات — لقطة للغرفة ثم لقطة للبيعة بالطيّ القريب.',
    },
    whyItHelps: {
      en: 'Pairs with linen scoring levers: wide + detail mimics pro shoots and lifts perceived “hotel ready” without new furniture.',
      ar: 'يضاعف تأثير المفروشات في النقاط: لقطة واسعة + تفصيل يشبه التصوير الاحترافي دون شراء أثاث جديد.',
    },
  },
  {
    id: 'photo_companion_lock_in_context',
    name: {
      en: 'Smart lock: keypad close-up + door frame in one frame',
      ar: 'القفل الذكي: لوحة قريبة + باب في نفس الإطار',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Guests want to know where to stand — context beats a floating keypad crop.',
      ar: 'الضيف يحتاج يعرف يقف فين — السياق أفضل من لقطة لوحة معزولة.',
    },
    whyItHelps: {
      en: 'Reduces “how do I get in?” messages and supports the same conversion cues as your ops software story.',
      ar: 'يقلل أسئلة «إزاي أدخل؟» ويدعم نفس إشارات التحويل مع قصة البرمجيات.',
    },
  },
  {
    id: 'photo_companion_cross_light_kitchen',
    name: {
      en: 'Kitchen still life: counters + one cabinet peek (no clutter)',
      ar: 'مطبخ: كاونتر + نظرة داخل خزانة (بدون فوضى)',
    },
    cost: { en: 'Free (reshoot)', ar: 'مجاني (إعادة تصوير)' },
    tip: {
      en: 'Cross-light the worktop; hide bins and cables — reads “turnkey” in search thumbnails.',
      ar: 'أضيء الكاونتر بزاوية؛ أخفِ السلال والأسلاك — يبدو «جاهز للتشغيل» في المصغرات.',
    },
    whyItHelps: {
      en: 'Kitchen micro-stories compound with cabinet proof — together they answer hygiene and host seriousness faster.',
      ar: 'تفاصيل المطبخ تتضاعف مع صور الخزائن — تُجيب عن النظافة وجدية المضيف أسرع.',
    },
  },
];

export function diyChecklistItemsForMissingFurnishedPhotos(
  have: FurnishedPhotoChecklistId[] | undefined
): DiyChecklistItem[] {
  const haveSet = new Set(have ?? []);
  return ALL_FURNISHED_PHOTO_CHECKLIST_IDS.filter((id) => !haveSet.has(id)).map((id) => DIY_BY_GAP[id]);
}
