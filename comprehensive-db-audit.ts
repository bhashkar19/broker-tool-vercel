import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function comprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE DATABASE AUDIT\n');
  console.log('='.repeat(80));

  try {
    // ========================================
    // 1. CHECK ALL TABLES EXIST
    // ========================================
    console.log('\n📋 1. CHECKING ALL TABLES\n');

    const tables = [
      'user_submissions',
      'broker_clicks',
      'tracking_events',
      'conversion_imports',
      'manual_review_queue'
    ];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ERROR - ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} rows`);
      }
    }

    // ========================================
    // 2. CHECK user_submissions SCHEMA
    // ========================================
    console.log('\n📋 2. CHECKING user_submissions SCHEMA\n');

    const { data: sampleSubmission } = await supabase
      .from('user_submissions')
      .select('*')
      .limit(1)
      .single();

    if (sampleSubmission) {
      const columns = Object.keys(sampleSubmission);
      console.log('Columns found:', columns.length);
      console.log('Column names:', columns.join(', '));

      // Check for required new columns
      const requiredColumns = [
        'has_account',
        'broker_info',
        'user_type',
        'main_challenge',
        'trading_frequency',
        'what_matters_most',
        'investment_amount',
        'experience_level',
        'cta_clicked',
        'cta_clicked_at',
        'conversion_status',
        'fb_sync_status'
      ];

      console.log('\nRequired new columns:');
      for (const col of requiredColumns) {
        const exists = columns.includes(col);
        console.log(`  ${exists ? '✅' : '❌'} ${col}`);
      }
    } else {
      console.log('ℹ️  No sample data available to check schema');
    }

    // ========================================
    // 3. DATA QUALITY CHECKS
    // ========================================
    console.log('\n📋 3. DATA QUALITY CHECKS\n');

    // Check for null values in critical fields
    const { data: nullChecks } = await supabase
      .from('user_submissions')
      .select('id, name, mobile, session_id, recommended_broker')
      .or('name.is.null,mobile.is.null,session_id.is.null,recommended_broker.is.null');

    console.log(`Rows with NULL critical fields: ${nullChecks?.length || 0}`);
    if (nullChecks && nullChecks.length > 0) {
      console.log('⚠️  Found rows with missing critical data:', nullChecks);
    }

    // Check for duplicate session_ids
    const { data: allSubmissions } = await supabase
      .from('user_submissions')
      .select('session_id');

    if (allSubmissions) {
      const sessionIds = allSubmissions.map(s => s.session_id);
      const uniqueSessionIds = new Set(sessionIds);
      const duplicates = sessionIds.length - uniqueSessionIds.size;
      console.log(`Duplicate session_ids: ${duplicates}`);
      if (duplicates > 0) {
        console.log('⚠️  Some sessions have multiple submissions');
      }
    }

    // Check mobile number format
    const { data: allMobiles } = await supabase
      .from('user_submissions')
      .select('mobile');

    if (allMobiles) {
      const invalidMobiles = allMobiles.filter(m => {
        const cleaned = m.mobile.replace(/[\s\-\+]/g, '').replace(/^91/, '');
        return !/^[6-9]\d{9}$/.test(cleaned);
      });
      console.log(`Invalid mobile numbers: ${invalidMobiles.length}`);
      if (invalidMobiles.length > 0) {
        console.log('⚠️  Sample invalid:', invalidMobiles.slice(0, 3));
      }
    }

    // ========================================
    // 4. CLICK TRACKING ANALYSIS
    // ========================================
    console.log('\n📋 4. CLICK TRACKING ANALYSIS\n');

    const { count: clickCount } = await supabase
      .from('broker_clicks')
      .select('*', { count: 'exact', head: true });

    const { count: submissionCount } = await supabase
      .from('user_submissions')
      .select('*', { count: 'exact', head: true });

    console.log(`Total submissions: ${submissionCount}`);
    console.log(`Total clicks: ${clickCount}`);
    console.log(`Click rate: ${submissionCount ? ((clickCount! / submissionCount!) * 100).toFixed(1) : 0}%`);

    // Check for clicks without matching submissions
    const { data: allClicks } = await supabase
      .from('broker_clicks')
      .select('session_id');

    const { data: allSessions } = await supabase
      .from('user_submissions')
      .select('session_id');

    if (allClicks && allSessions) {
      const clickSessionIds = new Set(allClicks.map(c => c.session_id));
      const submissionSessionIds = new Set(allSessions.map(s => s.session_id));

      const orphanedClicks = [...clickSessionIds].filter(sid => !submissionSessionIds.has(sid));
      console.log(`Orphaned clicks (click without submission): ${orphanedClicks.length}`);
      if (orphanedClicks.length > 0) {
        console.log('⚠️  This should not happen - every click should have a submission');
      }
    }

    // ========================================
    // 5. CONVERSION STATUS ANALYSIS
    // ========================================
    console.log('\n📋 5. CONVERSION STATUS ANALYSIS\n');

    const { data: conversionStats } = await supabase
      .from('user_submissions')
      .select('conversion_status');

    if (conversionStats) {
      const statusCounts: Record<string, number> = {};
      conversionStats.forEach(s => {
        const status = s.conversion_status || 'null';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      console.log('Conversion status breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} (${((count / conversionStats.length) * 100).toFixed(1)}%)`);
      });
    }

    // Check conversion_imports table
    const { count: importCount } = await supabase
      .from('conversion_imports')
      .select('*', { count: 'exact', head: true });

    console.log(`\nTotal CSV imports: ${importCount || 0}`);

    if (importCount && importCount > 0) {
      const { data: imports } = await supabase
        .from('conversion_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      console.log('\nLatest 5 imports:');
      imports?.forEach((imp, idx) => {
        console.log(`  ${idx + 1}. ${imp.broker_id} - ${imp.file_name}`);
        console.log(`     Status: ${imp.upload_status}, Matched: ${imp.matched_rows}/${imp.total_rows}`);
      });
    }

    // ========================================
    // 6. TRACKING EVENTS INTEGRITY
    // ========================================
    console.log('\n📋 6. TRACKING EVENTS INTEGRITY\n');

    const { count: trackingCount } = await supabase
      .from('tracking_events')
      .select('*', { count: 'exact', head: true });

    console.log(`Total tracking events: ${trackingCount}`);

    // Check for events with missing session_id
    const { data: invalidEvents } = await supabase
      .from('tracking_events')
      .select('id, event_name, session_id')
      .is('session_id', null);

    console.log(`Events with NULL session_id: ${invalidEvents?.length || 0}`);

    // Check event_name distribution
    const { data: allEvents } = await supabase
      .from('tracking_events')
      .select('event_name');

    if (allEvents) {
      const eventCounts: Record<string, number> = {};
      allEvents.forEach(e => {
        eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
      });

      console.log('\nEvent distribution:');
      Object.entries(eventCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, count]) => {
          console.log(`  ${name}: ${count}`);
        });
    }

    // ========================================
    // 7. DATA RELATIONSHIPS
    // ========================================
    console.log('\n📋 7. DATA RELATIONSHIPS\n');

    // Check if every submission has tracking events
    const { data: submissionsWithoutEvents } = await supabase
      .from('user_submissions')
      .select('session_id');

    const { data: eventsGrouped } = await supabase
      .from('tracking_events')
      .select('session_id');

    if (submissionsWithoutEvents && eventsGrouped) {
      const submissionSessions = new Set(submissionsWithoutEvents.map(s => s.session_id));
      const eventSessions = new Set(eventsGrouped.map(e => e.session_id));

      const submissionsWithoutTracking = [...submissionSessions].filter(sid => !eventSessions.has(sid));
      console.log(`Submissions without tracking events: ${submissionsWithoutTracking.length}`);
      if (submissionsWithoutTracking.length > 0) {
        console.log('⚠️  Some submissions have no tracking events');
        console.log('Sample:', submissionsWithoutTracking.slice(0, 3));
      }
    }

    // ========================================
    // 8. BROKER PERFORMANCE METRICS
    // ========================================
    console.log('\n📋 8. BROKER PERFORMANCE METRICS\n');

    const { data: brokerStats } = await supabase
      .from('user_submissions')
      .select('recommended_broker');

    if (brokerStats) {
      const brokerCounts: Record<string, number> = {};
      brokerStats.forEach(s => {
        brokerCounts[s.recommended_broker] = (brokerCounts[s.recommended_broker] || 0) + 1;
      });

      console.log('Broker recommendation breakdown:');
      Object.entries(brokerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([broker, count]) => {
          const percentage = ((count / brokerStats.length) * 100).toFixed(1);
          console.log(`  ${broker}: ${count} (${percentage}%)`);
        });
    }

    // ========================================
    // 9. TIME-BASED ANALYSIS
    // ========================================
    console.log('\n📋 9. TIME-BASED ANALYSIS\n');

    const { data: timeData } = await supabase
      .from('user_submissions')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (timeData && timeData.length > 0) {
      const first = new Date(timeData[0].created_at);
      const last = new Date(timeData[timeData.length - 1].created_at);
      const daysDiff = Math.ceil((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`First submission: ${first.toLocaleString()}`);
      console.log(`Latest submission: ${last.toLocaleString()}`);
      console.log(`Data span: ${daysDiff} days`);
      console.log(`Average submissions per day: ${(timeData.length / Math.max(daysDiff, 1)).toFixed(1)}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ COMPREHENSIVE AUDIT COMPLETE\n');

  } catch (error) {
    console.error('❌ Unexpected error during audit:', error);
  }
}

comprehensiveAudit();
