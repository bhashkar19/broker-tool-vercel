#!/usr/bin/env bun
/**
 * Setup broker_upload_tracking table in Supabase
 * Run with: bun run setup-broker-upload-tracking.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
    .map(([key, ...values]) => [key.trim(), values.join('=').trim()])
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupBrokerUploadTracking() {
  console.log('🚀 Setting up broker_upload_tracking table...\n');

  try {
    // Check if table already exists
    console.log('📋 Checking if broker_upload_tracking table exists...');
    const { error: checkError } = await supabase
      .from('broker_upload_tracking')
      .select('id')
      .limit(1);

    if (!checkError || checkError.code !== 'PGRST116') {
      console.log('✅ Table broker_upload_tracking already exists!');
      console.log('   Verifying structure...');

      // Test insert to verify structure
      const testRecord = {
        broker_id: 'test_broker_' + Date.now(),
        last_upload_date: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('broker_upload_tracking')
        .insert([testRecord])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Table structure verification failed:', insertError);
        console.log('\n📌 You may need to create the table manually in Supabase SQL editor:');
        console.log(getSQLScript());
        process.exit(1);
      }

      console.log('✅ Table structure verified! Test record created:', data.id);

      // Clean up test record
      await supabase
        .from('broker_upload_tracking')
        .delete()
        .eq('id', data.id);

      console.log('✅ Test record cleaned up');
      console.log('\n🎉 Broker upload tracking system is ready to use!');
      return;
    }

    // Table doesn't exist - show SQL script
    console.log('⚠️  Table broker_upload_tracking does not exist');
    console.log('\n📌 Please run this SQL script in your Supabase SQL Editor:');
    console.log('   (Dashboard → SQL Editor → New Query)\n');
    console.log(getSQLScript());
    console.log('\nThen run this script again to verify.\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

function getSQLScript(): string {
  return `
-- Create broker_upload_tracking table
-- This table tracks when CSV data was last uploaded for each broker
-- Used to calculate "NEW clicks since last upload"

CREATE TABLE IF NOT EXISTS broker_upload_tracking (
  id BIGSERIAL PRIMARY KEY,
  broker_id TEXT UNIQUE NOT NULL,
  last_upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_broker_upload_tracking_broker_id
ON broker_upload_tracking(broker_id);

-- Enable Row Level Security (RLS)
ALTER TABLE broker_upload_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role full access" ON broker_upload_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON broker_upload_tracking TO service_role;
GRANT USAGE, SELECT ON SEQUENCE broker_upload_tracking_id_seq TO service_role;

-- Add comment
COMMENT ON TABLE broker_upload_tracking IS
'Tracks when CSV conversion data was last uploaded for each broker. Used to calculate new clicks since last upload.';
`;
}

setupBrokerUploadTracking().catch(console.error);
