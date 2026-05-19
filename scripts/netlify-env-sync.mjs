#!/usr/bin/env node
/**
 * Sync Airtable env vars from .env.local to Netlify (requires `netlify login` once).
 *
 *   node scripts/netlify-env-sync.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env.local');

if (!existsSync(envPath)) {
  console.error('Missing .env.local — add AIRTABLE_PAT and AIRTABLE_BASE_ID first.');
  process.exit(1);
}

const vars = {};
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq <= 0) continue;
  vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const toSync = ['AIRTABLE_PAT', 'AIRTABLE_BASE_ID', 'AIRTABLE_PARTNERS_TABLE', 'AIRTABLE_LEADS_TABLE'];
const missing = toSync.filter((k) => k === 'AIRTABLE_PAT' || k === 'AIRTABLE_BASE_ID').filter((k) => !vars[k]);
if (missing.length) {
  console.error('Missing in .env.local:', missing.join(', '));
  process.exit(1);
}

for (const key of toSync) {
  const value = vars[key];
  if (!value) continue;
  const isSecret = key === 'AIRTABLE_PAT';
  console.log(`Setting ${key} on Netlify (production)…`);
  const args = ['netlify', 'env:set', key, value, '--context', 'production'];
  if (isSecret) args.push('--secret');
  const result = spawnSync('npx', ['--yes', 'netlify-cli@latest', ...args.slice(1)], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`\nFailed. Run: npx netlify-cli login`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nDone. Trigger a new deploy: Netlify → Deploys → Trigger deploy → Deploy site');
