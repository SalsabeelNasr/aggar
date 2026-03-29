import type { LocalizedString, WizardData } from '@/models';
import type { RevenueResult } from '@/lib/engines/revenueEngine';
import {
  AMENITY_MARKET_LABELS,
  furnishingStyleHint,
  getNeighborhoodMarketData,
  type NeighborhoodMarketData,
} from '@/lib/data/marketData';
import type { CompetitionSnapshot } from './types';

const EGP_PER_USD = 47;

function localized(en: string, ar: string) {
  return { en, ar };
}

function topPercentFromMarketPosition(userGross: number, avgGross: number, topGross: number): number {
  if (topGross <= avgGross) return 50;
  if (userGross >= topGross) return 5;
  if (userGross <= avgGross) {
    const t = Math.max(0, Math.min(1, userGross / Math.max(1, avgGross)));
    return Math.round(95 - 45 * t);
  }
  const t = (userGross - avgGross) / (topGross - avgGross);
  return Math.round(50 - 45 * Math.max(0, Math.min(1, t)));
}

function stablePercent(regionSeed: string, a: string, b: string): number {
  const s = `${regionSeed}|${a}|${b}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 72 + (h >>> 0) % 19;
}

function grossMonthlyFromMarket(m: NeighborhoodMarketData, mode: 'avg' | 'top'): number {
  const occ = mode === 'avg' ? m.avgOcc : m.topOcc;
  const adr = mode === 'avg' ? m.avgADR : m.topADR;
  return Math.round(adr * occ * 30);
}

function hasMockAmenity(data: WizardData, key: string): boolean {
  const tech = data.essentialTechNeeds ?? [];
  const ac = data.acCoverage;
  const internet = data.internetSpeed;
  const access = data.regulatory?.guestAccessSolution;
  const pet = data.petFriendly;
  const luxe = data.furnishedUnitLuxe?.smartHomeLuxe ?? [];
  const outdoors = data.outdoorSpace ?? [];
  const infra = data.unfinishedInfrastructure ?? [];

  switch (key) {
    case 'fiber_internet':
    case 'fast_wifi':
      return (
        internet === 'fiber_100_plus' ||
        internet === 'mesh_200_plus' ||
        infra.includes('fiber_ready')
      );
    case 'smart_lock':
    case 'self_check_in':
      return (
        tech.includes('smart_lock') ||
        access === 'smart_lock_or_lockbox' ||
        luxe.includes('smart_lock_existing')
      );
    case 'dedicated_workspace':
      return tech.includes('mesh_wifi');
    case 'inverter_ac':
      return ac === 'efficient_full_coverage' || ac === 'adequate_functional';
    case 'gated_security':
      return data.regulatory?.inGatedCompound === true;
    case 'king_bed':
      return (data.sleepCapacity ?? 0) >= 4 && (data.bedrooms ?? 0) >= 2;
    case 'smart_home_controls':
      return (
        data.unfinishedSmartHome === 'smart_ready' ||
        data.unfinishedSmartHome === 'full_automation' ||
        luxe.includes('smart_thermostat')
      );
    case 'outdoor_seating':
    case 'balcony_furniture':
      return outdoors.includes('balcony') || outdoors.includes('terrace') || outdoors.includes('garden');
    case 'concierge_service':
      return access === 'bawab_concierge';
    case 'nespresso':
      return (data.furnishingScope ?? []).includes('appliances');
    case 'high_ceilings':
      return (data.propertySizeSqm ?? 0) >= 120;
    case 'premium_linens':
      return data.furnishedUnitLuxe?.beddingTier === 'hotel_style_white';
    case 'pyramid_view_focus':
      return (data.photoUpload?.aiSummary?.visibleStrengths ?? []).some((x) => /view|pyramid|nile/i.test(x));
    case 'tourist_safety_kit':
      return tech.includes('smart_tv_sound');
    case 'beach_access_pass':
    case 'lagoon_access':
    case 'pool_access':
      return outdoors.length > 0;
    case 'premium_towels':
    case 'fully_equipped_kitchen':
      return (data.furnishingScope ?? []).includes('appliances') || (data.stateFlag ?? '') === 'FURNISHED';
    case 'shuttle_service':
    case 'shuttle_bus':
      return data.hasPropertyManagerOrCompany === 'yes';
    case 'bicycle_access':
      return outdoors.includes('garden');
    case 'outdoor_shower':
      return outdoors.includes('terrace') || outdoors.includes('garden');
    case 'pet_friendly_setup':
      return pet === true;
    case 'green_view':
      return (data.photoUpload?.aiSummary?.visibleStrengths ?? []).some((x) => /green|garden|tree/i.test(x));
    case 'quiet_zone_insulation':
      return data.furnishedLeadQualification?.buildingSecurity === 'compound_24_7';
    case 'cleaning_on_demand':
      return data.hasDedicatedCleaningTeam === 'yes' || data.furnishedLeadQualification?.cleaningSupport === 'trusted_cleaner';
    case 'snorkeling_gear':
      return (data.propertyType ?? '') === 'chalet' || (data.propertyType ?? '') === 'villa';
    case 'smart_tv_with_netflix':
      return tech.includes('smart_tv_sound');
    case 'hammock':
      return outdoors.includes('garden');
    case 'eco_friendly_toiletries':
      return (data.furnishingScope ?? []).includes('styling_decor');
    case 'nile_view':
      return (data.address ?? '').toLowerCase().includes('nile') || (data.photoUpload?.aiSummary?.visibleStrengths ?? []).some((x) => /nile|نيل/i.test(x));
    case 'traditional_decor':
      return data.furnishingAesthetic === 'classic' || data.furnishingAesthetic === 'boho';
    case 'guided_tour_contacts':
      return data.hasPropertyManagerOrCompany === 'yes';
    default:
      return false;
  }
}

function userEstimatedGrossMonthlyEgp(data: WizardData, revenue: RevenueResult): number {
  const reported = data.furnishedLeadQualification?.monthlyRevenueEgp;
  if (data.stateFlag === 'FURNISHED' && typeof reported === 'number' && reported > 0) {
    return Math.round(reported);
  }
  return revenue.current.grossMonthlyEgp;
}

function responseCopy(data: WizardData): { en: string; ar: string } {
  const topEn = 'Top neighbors respond in <15 minutes.';
  const topAr = 'أشطر المضيفين في منطقتك بيردوا في أقل من ١٥ دقيقة.';

  const t = data.furnishedLeadQualification?.guestResponseTime;
  if (t === 'under_5_min') {
    return localized(
      `${topEn} Your setup: under 5 minutes — you are ahead of the median host.`,
      `${topAr} إنت ممتاز وبترد في أقل من ٥ دقايق — وده بيخليك في المقدمة.`
    );
  }
   
  if (t === 'about_1_hour') {
    return localized(
      `${topEn} Your current estimate: about 1 hour.`,
      `${topAr} ردك بياخد حوالي ساعة؛ لو قللت الوقت ده حجوزاتك هتزيد.`
    );
  }
  if (t === 'several_hours') {
    return localized(
      `${topEn} Your current estimate: ~2 hours.`,
      `${topAr} ردك بياخد حوالي ساعتين؛ الضيوف بيحبوا الرد الأسرع.`
    );
  }
  if (t === 'often_miss') {
    return localized(
      `${topEn} Your current pattern: often delayed — response-time rank hurts search placement.`,
      `${topAr} ردك بيتأخر شوية؛ وده بيخلي إعلانك يظهر متأخر في نتايج البحث.`
    );
  }
  return localized(
    `${topEn} Your current estimate: ~2 hours (modeled — add your furnished details to personalize).`,
    `${topAr} ردك بياخد حوالي ساعتين تقريباً؛ كمل بيانات الفرش عشان نديك نصايح أدق.`
  );
}

export function buildCompetitionSnapshot(
  data: WizardData,
  revenue: RevenueResult,
  regionName: LocalizedString
): CompetitionSnapshot {
  const m = getNeighborhoodMarketData(data.regionId);

  const avgGross = grossMonthlyFromMarket(m, 'avg');
  const topGross = grossMonthlyFromMarket(m, 'top');
  const userGross = userEstimatedGrossMonthlyEgp(data, revenue);

  const topPct = topPercentFromMarketPosition(userGross, avgGross, topGross);
  const revenueGap = Math.max(0, topGross - userGross);
  const revenueGapRounded = Math.round(revenueGap / 500) * 500;

  const missing = m.mustHaveAmenities.filter((k) => !hasMockAmenity(data, k));
  const pick = missing.length >= 2 ? missing.slice(0, 2) : [...missing, ...m.mustHaveAmenities.filter((k) => !missing.includes(k))].slice(0, 2);

  const [a, b] = [pick[0] ?? m.mustHaveAmenities[0]!, pick[1] ?? m.mustHaveAmenities[1]!];
  const la = AMENITY_MARKET_LABELS[a] ?? localized(a, a);
  const lb = AMENITY_MARKET_LABELS[b] ?? localized(b, b);
  const pct = stablePercent(data.regionId ?? 'other', a, b);

  const amenityLineEn = `${pct}% of the most successful listings in ${regionName.en} feature both ${la.en} and ${lb.en}.`;
  const amenityLineAr = `${pct}٪ من العقارات اللي بتحقق أعلى أرباح في ${regionName.ar} موفرة ${la.ar} و${lb.ar}.`;

  const style = furnishingStyleHint(data);
  const designEn = style
    ? `The most booked listings in ${regionName.en} currently lean into “${m.dominantAesthetic.en}” aesthetics. You selected “${style.en}.”`
    : `The most booked listings in ${regionName.en} currently lean into “${m.dominantAesthetic.en}” aesthetics.`;
  const designAr = style
    ? `أكتر شقق بتتحجز في ${regionName.ar} ماشية بستايل «${m.dominantAesthetic.ar}». إنت اخترت «${style.ar}».`
    : `أكتر شقق بتتحجز في ${regionName.ar} ماشية بستايل «${m.dominantAesthetic.ar}».`;

  const response = responseCopy(data);

  const percentileEn = `You are in the top ${topPct}% of listings in ${regionName.en}.`;
  const percentileAr = `عقارك حالياً ضمن أفضل ${topPct}٪ من الشقق في ${regionName.ar}.`;

  const gapEn =
    revenueGapRounded > 0
      ? `In ${regionName.en}, top-performing properties with similar layouts are earning more than your current estimate by:`
      : `You are already near the modeled top band in ${regionName.en} — defend rank with the amenity stack below.`;
  const gapAr =
    revenueGapRounded > 0
      ? `في ${regionName.ar}، الشقق اللي زي شقتك وبتحقق أعلى أرباح بتعمل دخل زيادة عن تقديرك الحالي بـ:`
      : `إنت فعلاً قريب من القمة في ${regionName.ar}؛ حافظ على مستواك بالمزايا اللي تحت دي.`;

  return {
    topPercentile: topPct,
    percentileHeadline: localized(percentileEn, percentileAr),
    revenueGapEgp: revenueGapRounded > 0 ? revenueGapRounded : null,
    revenueGapLine: localized(gapEn, gapAr),
    amenityAhaLine: localized(amenityLineEn, amenityLineAr),
    designBenchmarkLine: localized(designEn, designAr),
    responseDeltaLine: localized(response.en, response.ar),
    footnote: m.demandNote,
    modeledGrossMonthlyTopEgp: topGross,
    modeledGrossMonthlyAvgEgp: avgGross,
    modeledTypicalMonthlyUsd: Math.round(avgGross / EGP_PER_USD),
    modeledTop10MonthlyUsd: Math.round(topGross / EGP_PER_USD),
  };
}
