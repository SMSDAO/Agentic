#!/usr/bin/env node
/**
 * validate-env.js — Validates required environment variables before build.
 * Run: node scripts/validate-env.js
 */

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SOLANA_NETWORK',
  'OPENAI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SOLANA_PRIVATE_KEY',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set.');
