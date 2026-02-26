#!/usr/bin/env node

/**
 * Supabase Connection Test
 *
 * Tests connection to Supabase database and verifies schema
 * Usage: node supabase-test.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Validate credentials
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  console.error('\nPlease set:');
  console.error('  SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('  SUPABASE_ANON_KEY=xxxxxxxx');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('📡 Connecting to Supabase...');

    // Test 1: Query barras_vitais
    console.log('  - Testing barras_vitais table...');
    const { data: barras, error: barrasError } = await supabase
      .from('barras_vitais')
      .select('*')
      .limit(1);

    if (barrasError) throw new Error(`barras_vitais: ${barrasError.message}`);
    console.log('    ✅ barras_vitais accessible');

    // Test 2: Query log_financeiro
    console.log('  - Testing log_financeiro table...');
    const { data: log, error: logError } = await supabase
      .from('log_financeiro')
      .select('*')
      .limit(1);

    if (logError) throw new Error(`log_financeiro: ${logError.message}`);
    console.log('    ✅ log_financeiro accessible');

    // Test 3: Query orgaos
    console.log('  - Testing orgaos table...');
    const { data: orgaos, error: orgaosError } = await supabase
      .from('orgaos')
      .select('*')
      .limit(1);

    if (orgaosError) throw new Error(`orgaos: ${orgaosError.message}`);
    console.log('    ✅ orgaos accessible');

    // Test 4: Query squads
    console.log('  - Testing squads table...');
    const { data: squads, error: squadsError } = await supabase
      .from('squads')
      .select('*')
      .limit(1);

    if (squadsError) throw new Error(`squads: ${squadsError.message}`);
    console.log('    ✅ squads accessible');

    console.log('\n✅ All tests passed! Connection to Supabase is working.\n');
    return true;

  } catch (error) {
    console.error(`\n❌ Connection test failed: ${error.message}\n`);
    return false;
  }
}

// Run tests
const success = await testConnection();
process.exit(success ? 0 : 1);
