#!/usr/bin/env node
/**
 * Fail Netlify production builds when Airtable is not configured.
 * Prevents shipping a site that silently drops all leads.
 */
const isNetlify = process.env.NETLIFY === 'true';
const context = process.env.CONTEXT || process.env.NETLIFY_CONTEXT || '';
const isProduction = context === 'production';

if (!isNetlify || !isProduction) {
  process.exit(0);
}

const pat = (process.env.AIRTABLE_PAT || process.env.AIRTABLE_TOKEN || '').trim();
const baseId = (process.env.AIRTABLE_BASE_ID || '').trim();

if (pat && baseId) {
  console.log('[airtable] Production env OK (AIRTABLE_PAT + AIRTABLE_BASE_ID set)');
  process.exit(0);
}

console.error('\n[airtable] Production deploy blocked: lead capture is not configured.\n');
console.error('Add these in Netlify → Site configuration → Environment variables:\n');
console.error('  AIRTABLE_PAT          (secret, scopes: data.records:write)');
console.error('  AIRTABLE_BASE_ID      (e.g. app35phakMmxSxxIe — already in netlify.toml)\n');
console.error('Or run locally after `npx netlify-cli login`:\n');
console.error('  npm run netlify:env\n');
process.exit(1);
