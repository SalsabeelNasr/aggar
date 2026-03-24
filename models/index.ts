export type RegionId = 'new_cairo' | 'sheikh_zayed' | 'zamalek' | 'maadi' | 'north_coast' | 'el_gouna' | 'hurghada' | 'dahab' | 'sharm';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Region {
  id: RegionId;
  name: LocalizedString;
  avgOccupancy: number;
  avgNightlyRate: number;
  premiumLevel: 'high' | 'medium' | 'elite';
  bestFitAudiences: LocalizedString[];
  topPropertyTypes: LocalizedString[];
  seasonalityNotes: LocalizedString;
  marketFact: LocalizedString;
}

export type PropertyType = 'chalet' | 'apartment' | 'studio' | 'villa';
export type PropertyState = 'shell_core' | 'finished_empty' | 'fully_furnished';
export type Goal = 'max_cashflow' | 'preserve_asset' | 'personal_vacation';

export interface EvaluationInput {
  regionId: RegionId;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sleepCapacity: number;
  state: PropertyState;
  goal: Goal;
  hassleLevel: number; // 0 to 10
  hasBawab: boolean;
  mockedImageSignals: string[]; // e.g., natural_light_detected
}

export interface EvaluationResult {
  score: number;
  stage: 1 | 2 | 3;
  stageName: LocalizedString;
  currentMonthlyRevenue: number;
  optimizedMonthlyRevenue: number;
  currentOccupancy: number;
  optimizedOccupancy: number;
  currentNightlyRate: number;
  optimizedNightlyRate: number;
  recommendedPath: 'quick_start' | 'sweet_spot' | 'asset_flip';
  aiInsights: LocalizedString[];
  reasons: LocalizedString[];
}

export type ServiceType = 'renovation' | 'styling' | 'photography' | 'cleaning' | 'linen' | 'concierge' | 'consumables' | 'licensing' | 'smart_lock';

export interface PartnerService {
  id: string;
  type: ServiceType;
  name: LocalizedString;
  description: LocalizedString;
  targetStage: 1 | 2 | 3;
}
