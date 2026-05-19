#!/usr/bin/env node
/**
 * One-time setup: create Partner Applications + Evaluation Leads tables in your base.
 *
 * Requires in .env.local (project root):
 *   AIRTABLE_PAT=pat...
 *   AIRTABLE_BASE_ID=app...
 *
 * Run: npm run setup:airtable
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/** Load KEY=value lines from .env.local / .env into process.env (no extra deps). */
function loadEnvFiles() {
  for (const name of ['.env.local', '.env']) {
    const path = join(projectRoot, name);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadEnvFiles();

const token = process.env.AIRTABLE_PAT || process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!token || !baseId) {
  console.error('Missing Airtable credentials.\n');
  console.error('1. Copy .env.example → .env.local in the project root');
  console.error('2. Fill in:');
  console.error('     AIRTABLE_PAT=pat...     (https://airtable.com/create/tokens)');
  console.error('     AIRTABLE_BASE_ID=app... (from your base URL)');
  console.error('3. Run: npm run setup:airtable\n');
  process.exit(1);
}

const PARTNERS_TABLE = process.env.AIRTABLE_PARTNERS_TABLE || 'Partner Applications';
const LEADS_TABLE = process.env.AIRTABLE_LEADS_TABLE || 'Evaluation Leads';
const KEEP_TABLES = new Set([PARTNERS_TABLE, LEADS_TABLE]);

/** Default Airtable base tables that are not used by the app. */
const UNUSED_TABLE_NAMES = new Set(['Table 1', 'Table 2', 'Grid view']);

const partnerFields = [
  { name: 'Company Name', type: 'singleLineText' },
  {
    name: 'Primary Service',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'Renovation & Contracting' },
        { name: 'Interior Styling & Furnishing' },
        { name: 'Property Photography' },
        { name: 'Cleaning' },
        { name: 'Property Management' },
        { name: 'Other' },
      ],
    },
  },
  { name: 'Operating Zones', type: 'multilineText' },
  { name: 'Portfolio URL', type: 'url' },
  { name: 'Phone', type: 'phoneNumber' },
  { name: 'Email', type: 'email' },
  {
    name: 'Locale',
    type: 'singleSelect',
    options: { choices: [{ name: 'en' }, { name: 'ar' }] },
  },
  {
    name: 'Submitted At',
    type: 'dateTime',
    options: {
      timeZone: 'utc',
      dateFormat: { name: 'iso' },
      timeFormat: { name: '24hour' },
    },
  },
];

const leadFields = [
  { name: 'Full Name', type: 'singleLineText' },
  {
    name: 'Source',
    type: 'singleSelect',
    options: { choices: [{ name: 'evaluation' }, { name: 'diy_guide' }] },
  },
  { name: 'Email', type: 'email' },
  { name: 'Phone', type: 'phoneNumber' },
  {
    name: 'Preferred Contact Time',
    type: 'singleSelect',
    options: { choices: [{ name: 'morning' }, { name: 'afternoon' }, { name: 'evening' }] },
  },
  {
    name: 'Consent Partner Network',
    type: 'checkbox',
    options: { icon: 'check', color: 'greenBright' },
  },
  {
    name: 'Locale',
    type: 'singleSelect',
    options: { choices: [{ name: 'en' }, { name: 'ar' }] },
  },
  { name: 'Report ID', type: 'singleLineText' },
  { name: 'Region ID', type: 'singleLineText' },
  { name: 'Listing Status', type: 'singleLineText' },
  { name: 'Property Type', type: 'singleLineText' },
  { name: 'State Flag', type: 'singleLineText' },
  { name: 'Mode', type: 'singleLineText' },
  { name: 'Wizard Summary', type: 'multilineText' },
  {
    name: 'Submitted At',
    type: 'dateTime',
    options: {
      timeZone: 'utc',
      dateFormat: { name: 'iso' },
      timeFormat: { name: '24hour' },
    },
  },
];

async function listTables() {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`list tables failed (${res.status}): ${text}`);
  const data = JSON.parse(text);
  return data.tables ?? [];
}

async function createTable(name, fields) {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      fields: fields.map((f) => ({ ...f, description: f.description ?? '' })),
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`create table "${name}" failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

async function deleteTable(tableId, tableName) {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) {
    console.log(`  (skip ${tableName}: delete via Airtable UI or airtable-user-mcp delete_table)`);
    return false;
  }
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`delete table "${tableName}" failed (${res.status}): ${text}`);
  }
  return true;
}

async function removeUnusedTables(existing) {
  const removable = existing.filter((t) => !KEEP_TABLES.has(t.name) && UNUSED_TABLE_NAMES.has(t.name));
  if (removable.length === 0) return;

  console.log('Removing unused default tables…');
  for (const t of removable) {
    const ok = await deleteTable(t.id, t.name);
    if (ok) console.log(`✓ Deleted: ${t.name} (${t.id})`);
  }
}

async function main() {
  console.log('Listing existing tables…');
  let existing = await listTables();
  await removeUnusedTables(existing);
  existing = await listTables();
  const names = new Set(existing.map((t) => t.name));

  const extras = existing.filter((t) => !KEEP_TABLES.has(t.name));
  if (extras.length > 0) {
    console.log('\nOther tables in this base (not removed automatically):');
    for (const t of extras) console.log(`  - ${t.name} (${t.id})`);
    console.log('Delete manually in Airtable if you do not need them.\n');
  }

  if (names.has(PARTNERS_TABLE)) {
    console.log(`✓ Table already exists: ${PARTNERS_TABLE}`);
  } else {
    const created = await createTable(PARTNERS_TABLE, partnerFields);
    console.log(`✓ Created: ${created.name} (${created.id})`);
  }

  if (names.has(LEADS_TABLE)) {
    console.log(`✓ Table already exists: ${LEADS_TABLE}`);
  } else {
    const created = await createTable(LEADS_TABLE, leadFields);
    console.log(`✓ Created: ${created.name} (${created.id})`);
  }

  console.log('\nDone. Add these to .env.local and Netlify:');
  console.log(`  AIRTABLE_PAT=pat...`);
  console.log(`  AIRTABLE_BASE_ID=${baseId}`);
  console.log(`  AIRTABLE_PARTNERS_TABLE=${PARTNERS_TABLE}`);
  console.log(`  AIRTABLE_LEADS_TABLE=${LEADS_TABLE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
