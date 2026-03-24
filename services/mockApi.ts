import { Region, RegionId, EvaluationInput, EvaluationResult, PartnerService } from '@/models';

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
  }
};

export async function getRegions(): Promise<Region[]> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 600));
  return Object.values(MOCK_REGIONS);
}

export async function evaluateProperty(input: EvaluationInput): Promise<EvaluationResult> {
  await new Promise(r => setTimeout(r, 1500)); // Simulate "AI Scan" delay

  const region = MOCK_REGIONS[input.regionId] || MOCK_REGIONS['new_cairo'];
  
  let stateScore = 0;
  let readinessMultiplier = 0.35;
  if (input.state === 'shell_core') {
    stateScore = 15;
    readinessMultiplier = 0.35;
  } else if (input.state === 'finished_empty') {
    stateScore = 50;
    readinessMultiplier = 0.60;
  } else if (input.state === 'fully_furnished') {
    stateScore = 80;
    readinessMultiplier = 0.90;
  }

  // Artificial AI image adjustment
  const imageBoost = input.mockedImageSignals.length > 0 ? 10 : 0;
  
  const baseScore = stateScore + imageBoost + (input.hasBawab ? 5 : 0) + (10 - input.hassleLevel);
  const score = Math.min(100, Math.max(0, Math.round(baseScore)));
  
  let stage: 1 | 2 | 3 = 1;
  let stageName = { en: 'The Builder', ar: 'المبادر (الإنشاء)' };
  let recommendedPath: 'quick_start' | 'sweet_spot' | 'asset_flip' = 'asset_flip';

  if (score >= 75) {
    stage = 3;
    stageName = { en: 'The Host', ar: 'المُضيف (التشغيل)' };
    recommendedPath = 'quick_start';
  } else if (score >= 45) {
    stage = 2;
    stageName = { en: 'The Designer', ar: 'المُصمم (الفرش)' };
    recommendedPath = 'sweet_spot';
  }

  const aiInsights = [];
  if (input.mockedImageSignals.includes('natural_light')) {
    aiInsights.push({ en: 'Nice natural light detected.', ar: 'تم ملاحظة إضاءة طبيعية ممتازة.' });
  }
  if (input.mockedImageSignals.includes('view_potential')) {
    aiInsights.push({ en: 'Balcony potential detected. Upgrading seating could increase rate.', ar: 'إمكانيات بلكونة ممتازة. تحسين الجلسة سيزيد السعر اليومي.' });
  }
  if (aiInsights.length === 0) {
    aiInsights.push({ en: 'Standard layout detected. Focus on durable furnishing.', ar: 'تخطيط قياسي. ركز على اختيار أثاث متين ومريح.' });
  }

  const reasons = [
    { en: 'Region demand is very strong this season.', ar: 'الطلب في المنطقة قوي جداً هذا الموسم.' },
    { en: `Current state (${input.state}) is the primary bottleneck.`, ar: 'الحالة الحالية للعقار هي التحدي الأكبر.' }
  ];

  const optNightly = region.avgNightlyRate * (1 + (input.bedrooms * 0.15));
  const optOcc = region.avgOccupancy;
  const optRevenue = optNightly * (optOcc / 100) * 30;

  const curNightly = optNightly * readinessMultiplier;
  const curOcc = Math.max(0, optOcc - (100 - score) * 0.4);
  const curRevenue = curNightly * (curOcc / 100) * 30;

  return {
    score,
    stage,
    stageName,
    currentMonthlyRevenue: Math.round(curRevenue),
    optimizedMonthlyRevenue: Math.round(optRevenue),
    currentOccupancy: Math.round(curOcc),
    optimizedOccupancy: Math.round(optOcc),
    currentNightlyRate: Math.round(curNightly),
    optimizedNightlyRate: Math.round(optNightly),
    recommendedPath,
    aiInsights,
    reasons
  };
}

export async function getRecommendedServices(stage: 1 | 2 | 3): Promise<PartnerService[]> {
  const ALL_SERVICES: PartnerService[] = [
    { id: 'ren1', type: 'renovation', targetStage: 1, name: { en: 'Smart Finishing Co.', ar: 'شركة التشطيب الذكي' }, description: { en: 'Turnkey shell & core finishing with installment plans.', ar: 'تشطيب متكامل مع تسليم مفتاح وأنظمة تقسيط.' } },
    { id: 'styl1', type: 'styling', targetStage: 2, name: { en: 'Airbnb-Proof Interiors', ar: 'فرش مخصص للإيجار' }, description: { en: 'Durable, stylish furniture packages optimized for guest sleep count.', ar: 'باقات أثاث متينة وعصرية محسنة لزيادة عدد الضيوف.' } },
    { id: 'clean1', type: 'cleaning', targetStage: 3, name: { en: 'Hotel-Grade Turnover', ar: 'نظافة فندقية' }, description: { en: 'Deep cleaning, balcony dust handling, and quick turnover.', ar: 'نظافة عميقة وتنظيف البلكونات بين الحجوزات.' } },
    { id: 'lin1', type: 'linen', targetStage: 3, name: { en: 'Egyptian Cotton Subs', ar: 'اشتراك بياضات قطن مصري' }, description: { en: 'Ongoing laundry swap service for fresh sheets and towels.', ar: 'خدمة استبدال دورية للملايات والفوط النظيفة.' } },
    { id: 'smart1', type: 'smart_lock', targetStage: 2, name: { en: 'Keyless Access', ar: 'أقفال ذكية' }, description: { en: 'Smart lock installation bypassing traditional bawabs.', ar: 'تركيب أقفال ذكية تتيح الدخول بدون الحاجة للحارس التقليدي.' } },
  ];
  return ALL_SERVICES.filter(s => s.targetStage === stage);
}
