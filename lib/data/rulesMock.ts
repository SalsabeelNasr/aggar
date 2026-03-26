import type { ServiceRule } from './rules';

/**
 * Mock rules mapping property data → needed services.
 * Rules within the same logic_group are AND-ed; groups for a service are OR-ed.
 * Mirrors the future Supabase `service_rules` table rows.
 */
export const MOCK_RULES: ServiceRule[] = [
  // ── deep_clean: always needed for unlisted properties ─────────────────
  { id: 'r_deep_clean_1', service_id: 'deep_clean', field_path: 'listingStatus', operator: 'eq', value: 'not_listed', logic_group: 'deep_clean_g1' },

  // ── pro_photography: needed for non-listed properties ─────────────────
  { id: 'r_photo_1', service_id: 'pro_photography', field_path: 'listingStatus', operator: 'eq', value: 'not_listed', logic_group: 'photo_g1' },

  // ── rephotography: needed for listed underperformers ──────────────────
  { id: 'r_rephoto_1', service_id: 'rephotography', field_path: 'listingStatus', operator: 'in', value: ['listed_underperform', 'listed_barely_any_bookings'], logic_group: 'rephoto_g1' },

  // ── listing_setup: needed for unlisted ────────────────────────────────
  { id: 'r_listing_1', service_id: 'listing_setup', field_path: 'listingStatus', operator: 'eq', value: 'not_listed', logic_group: 'listing_g1' },

  // ── copy_rewrite: needed for listed underperformers ───────────────────
  { id: 'r_copywrite_1', service_id: 'copy_rewrite', field_path: 'listingStatus', operator: 'in', value: ['listed_underperform', 'listed_barely_any_bookings'], logic_group: 'copy_g1' },

  // ── listing_audit: needed for listed underperformers ──────────────────
  { id: 'r_audit_1', service_id: 'listing_audit', field_path: 'listingStatus', operator: 'in', value: ['listed_underperform', 'listed_barely_any_bookings'], logic_group: 'audit_g1' },

  // ── styling_consult: needed for finished_empty or when AI detects dated furniture ─
  { id: 'r_style_1', service_id: 'styling_consult', field_path: 'stateFlag', operator: 'eq', value: 'FINISHED_EMPTY', logic_group: 'style_g1' },

  // ── furniture_upgrades: needed for finished_empty ─────────────────────
  { id: 'r_furn_1', service_id: 'furniture_upgrades', field_path: 'stateFlag', operator: 'eq', value: 'FINISHED_EMPTY', logic_group: 'furn_g1' },

  // ── lighting: needed when no efficient full coverage AC (proxy for older units) ─
  { id: 'r_light_1', service_id: 'lighting', field_path: 'stateFlag', operator: 'in', value: ['FINISHED_EMPTY', 'FURNISHED'], logic_group: 'light_g1' },

  // ── bathroom_refresh: needed for finished empty or furnished ──────────
  { id: 'r_bath_1', service_id: 'bathroom_refresh', field_path: 'stateFlag', operator: 'in', value: ['FINISHED_EMPTY', 'FURNISHED'], logic_group: 'bath_g1' },

  // ── linen_starter: needed for unlisted or finished empty ──────────────
  { id: 'r_linen_1', service_id: 'linen_starter', field_path: 'listingStatus', operator: 'eq', value: 'not_listed', logic_group: 'linen_g1' },
  { id: 'r_linen_2', service_id: 'linen_starter', field_path: 'stateFlag', operator: 'eq', value: 'FINISHED_EMPTY', logic_group: 'linen_g2' },

  // ── reno_per_sqm: needed for shell ────────────────────────────────────
  { id: 'r_reno_1', service_id: 'reno_per_sqm', field_path: 'stateFlag', operator: 'eq', value: 'SHELL', logic_group: 'reno_g1' },

  // ── kitchen: needed for shell ─────────────────────────────────────────
  { id: 'r_kitchen_1', service_id: 'kitchen', field_path: 'stateFlag', operator: 'eq', value: 'SHELL', logic_group: 'kitchen_g1' },

  // ── bathrooms (renovation): needed for shell ──────────────────────────
  { id: 'r_bathrooms_1', service_id: 'bathrooms', field_path: 'stateFlag', operator: 'eq', value: 'SHELL', logic_group: 'bathrooms_g1' },

  // ── smart_lock: needed when no smart lock or lockbox ──────────────────
  { id: 'r_lock_1', service_id: 'smart_lock', field_path: 'regulatory.guestAccessSolution', operator: 'neq', value: 'smart_lock_or_lockbox', logic_group: 'lock_g1' },
  // Also needed when access solution not set
  { id: 'r_lock_2', service_id: 'smart_lock', field_path: 'regulatory.guestAccessSolution', operator: 'is_empty', value: true, logic_group: 'lock_g2' },

  // ── hvac: needed when AC is poor ──────────────────────────────────────
  { id: 'r_hvac_1', service_id: 'hvac', field_path: 'acCoverage', operator: 'in', value: ['none_or_broken', 'one_old_unit'], logic_group: 'hvac_g1' },
  // Also needed for shell (no AC at all)
  { id: 'r_hvac_2', service_id: 'hvac', field_path: 'stateFlag', operator: 'eq', value: 'SHELL', logic_group: 'hvac_g2' },

  // ── channel_manager_suite: needed for all non-listed ──────────────────
  { id: 'r_channel_1', service_id: 'channel_manager_suite', field_path: 'listingStatus', operator: 'eq', value: 'not_listed', logic_group: 'channel_g1' },
  // Also needed for underperformers without a channel manager
  { id: 'r_channel_2', service_id: 'channel_manager_suite', field_path: 'listingStatus', operator: 'in', value: ['listed_underperform', 'listed_barely_any_bookings'], logic_group: 'channel_g2' },

  // ── management: needed when mode is MANAGED ───────────────────────────
  { id: 'r_mgmt_1', service_id: 'management', field_path: 'mode', operator: 'eq', value: 'MANAGED', logic_group: 'mgmt_g1' },

  // ── dynamic_pricing: needed for listed underperformers ────────────────
  { id: 'r_pricing_1', service_id: 'dynamic_pricing', field_path: 'listingStatus', operator: 'in', value: ['listed_underperform', 'listed_barely_any_bookings'], logic_group: 'pricing_g1' },

  // ── licensing: needed when in gated compound or specific regions ──────
  { id: 'r_license_1', service_id: 'licensing', field_path: 'regulatory.inGatedCompound', operator: 'eq', value: true, logic_group: 'license_g1' },

  // ── essentials_kit: always nice-to-have for non-shell ─────────────────
  { id: 'r_essentials_1', service_id: 'essentials_kit', field_path: 'stateFlag', operator: 'neq', value: 'SHELL', logic_group: 'essentials_g1' },

  // ── workspace: needed for most properties ─────────────────────────────
  { id: 'r_workspace_1', service_id: 'workspace', field_path: 'stateFlag', operator: 'in', value: ['FINISHED_EMPTY', 'FURNISHED'], logic_group: 'workspace_g1' },
];
