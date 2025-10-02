#!/usr/bin/env bun
import { supabase } from './src/lib/supabase-database';

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  // Check user_submissions
  const { data: submissions, error: subError } = await supabase
    .from('user_submissions')
    .select('id')
    .limit(1);

  if (subError) {
    console.log('❌ user_submissions:', subError.code, '-', subError.message);
  } else {
    console.log('✅ user_submissions table exists!');
  }

  // Check tracking_events
  const { data: events, error: eventsError } = await supabase
    .from('tracking_events')
    .select('id')
    .limit(1);

  if (eventsError) {
    console.log('❌ tracking_events:', eventsError.code, '-', eventsError.message);
    console.log('\n⚠️  Please create the tracking_events table by:');
    console.log('   1. Go to https://supabase.com/dashboard/project/dqmpityshhywzayjysru/editor');
    console.log('   2. Click "SQL Editor" in left sidebar');
    console.log('   3. Click "New Query"');
    console.log('   4. Copy contents from: supabase-migration-tracking-events.sql');
    console.log('   5. Click "Run"\n');
  } else {
    console.log('✅ tracking_events table exists!');
  }
}

checkTables().catch(console.error);
