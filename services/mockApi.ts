export { MOCK_REGIONS, getRegionById, listRegionsMock } from '@/lib/mocks/regions';
import { listRegionsMock } from '@/lib/mocks/regions';
import type { Region } from '@/models';

/** @deprecated Prefer `listRegions` from `@/lib/evaluationApi/client` in new code. */
export async function getRegions(): Promise<Region[]> {
  return listRegionsMock();
}

export {
  MARKET_DATA,
  getNeighborhoodMarketData,
  REGION_ID_TO_MARKET_LABEL,
} from '@/lib/data/marketData';
