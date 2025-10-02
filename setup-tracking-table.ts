#!/usr/bin/env bun
/**
 * Setup tracking_events table in Supabase
 * Run with: bun run setup-tracking-table.ts
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

async function setupTrackingTable() {
  console.log('🚀 Setting up tracking_events table...\n');

  try {
    // Check if table already exists
    console.log('📋 Checking if tracking_events table exists...');
    const { error: checkError } = await supabase
      .from('tracking_events')
      .select('id')
      .limit(1);

    if (!checkError || checkError.code !== 'PGRST116') {
      console.log('✅ Table tracking_events already exists!');
      console.log('   Verifying structure...');

      // Test insert to verify structure
      const testEvent = {
        event_name: 'test_event',
        session_id: 'test_session_' + Date.now(),
        broker_id: 'zerodha',
        event_data: { test: true },
        user_agent: 'setup-script',
        ip_address: '127.0.0.1'
      };

      const { data, error: insertError } = await supabase
        .from('tracking_events')
        .insert([testEvent])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Table structure verification failed:', insertError);
        console.log('\n📌 You may need to create the table manually in Supabase SQL editor:');
        console.log(getSQLScript());
        process.exit(1);
      }

      console.log('✅ Table structure verified! Test event created:', data.id);

      // Clean up test event
      await supabase
        .from('tracking_events')
        .delete()
        .eq('id', data.id);

      console.log('✅ Test event cleaned up');
      console.log('\n🎉 Tracking system is ready to use!');
      return;
    }

    // Table doesn't exist - show SQL script
    console.log('⚠️  Table tracking_events does not exist');
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
-- Create tracking_events table for backup analytics
CREATE TABLE IF NOT EXISTS tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  broker_id TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_name ON tracking_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_broker ON tracking_events(broker_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert
CREATE POLICY "Allow service role to insert" ON tracking_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow service role to select
CREATE POLICY "Allow service role to select" ON tracking_events
  FOR SELECT
  TO service_role
  USING (true);

-- Grant permissions
GRANT ALL ON tracking_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE tracking_events_id_seq TO service_role;

COMMENT ON TABLE tracking_events IS 'Backup tracking events (alternative to Facebook Pixel)';
`;
}

setupTrackingTable().catch(console.error);
