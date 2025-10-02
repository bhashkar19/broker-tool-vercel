#!/usr/bin/env bun
/**
 * Create tracking_events table directly via Supabase client
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function createTable() {
  console.log('🚀 Creating tracking_events table via direct SQL...\n');

  const sql = `
-- Create tracking_events table
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_name ON tracking_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_broker ON tracking_events(broker_id);

-- Enable RLS
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role to insert" ON tracking_events;
DROP POLICY IF EXISTS "Allow service role to select" ON tracking_events;

-- Create policies
CREATE POLICY "Allow service role to insert" ON tracking_events
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role to select" ON tracking_events
  FOR SELECT TO service_role USING (true);

-- Grant permissions
GRANT ALL ON tracking_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE tracking_events_id_seq TO service_role;
`;

  try {
    // Use the REST API to execute SQL via a custom approach
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    });

    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Table created successfully!');
    } else {
      console.log('⚠️ Could not create via REST API');
      console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
      console.log(sql);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📋 Please run the SQL manually in Supabase SQL Editor:');
    console.log(sql);
  }

  // Verify by trying to insert test data
  console.log('\n🔍 Verifying table exists...');
  const testInsert = await supabase
    .from('tracking_events')
    .insert({
      event_name: 'test',
      session_id: 'test_' + Date.now(),
      event_data: { source: 'setup_script' }
    })
    .select();

  if (testInsert.error) {
    console.log('❌ Verification failed:', testInsert.error.message);
    console.log('\n⚠️ Table does not exist. Please create it manually.');
    console.log('📖 See: supabase-migration-tracking-events.sql');
  } else {
    console.log('✅ Table verified! Test row created:', testInsert.data[0].id);

    // Clean up test row
    await supabase
      .from('tracking_events')
      .delete()
      .eq('id', testInsert.data[0].id);

    console.log('✅ Test row cleaned up');
    console.log('\n🎉 Tracking system is ready!');
  }
}

createTable();
