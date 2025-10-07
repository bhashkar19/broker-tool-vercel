import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTrackingEvents() {
  console.log('🔍 Checking tracking_events table...\n');

  try {
    // 1. Check total count
    const { count: totalCount, error: countError } = await supabase
      .from('tracking_events')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting events:', countError);
      return;
    }

    console.log(`📊 Total tracking events: ${totalCount}\n`);

    // 2. Get event breakdown by event_name
    const { data: eventBreakdown, error: breakdownError } = await supabase
      .from('tracking_events')
      .select('event_name')
      .order('created_at', { ascending: false });

    if (breakdownError) {
      console.error('❌ Error getting breakdown:', breakdownError);
      return;
    }

    // Count events by name
    const eventCounts: Record<string, number> = {};
    eventBreakdown?.forEach(event => {
      eventCounts[event.event_name] = (eventCounts[event.event_name] || 0) + 1;
    });

    console.log('📋 Event breakdown:');
    Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([name, count]) => {
        console.log(`  - ${name}: ${count}`);
      });
    console.log('');

    // 3. Get latest 10 events
    const { data: latestEvents, error: latestError } = await supabase
      .from('tracking_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (latestError) {
      console.error('❌ Error getting latest events:', latestError);
      return;
    }

    console.log('🕐 Latest 10 events:');
    latestEvents?.forEach((event, idx) => {
      console.log(`\n${idx + 1}. ${event.event_name}`);
      console.log(`   Session: ${event.session_id}`);
      console.log(`   Broker: ${event.broker_id || 'N/A'}`);
      console.log(`   Time: ${new Date(event.created_at).toLocaleString()}`);
      if (event.event_data && Object.keys(event.event_data).length > 0) {
        console.log(`   Data:`, JSON.stringify(event.event_data, null, 2));
      }
    });

    // 4. Check for duplicate sessions
    const { data: sessions, error: sessionError } = await supabase
      .from('tracking_events')
      .select('session_id')
      .order('created_at', { ascending: false });

    if (sessionError) {
      console.error('❌ Error getting sessions:', sessionError);
      return;
    }

    const uniqueSessions = new Set(sessions?.map(s => s.session_id));
    console.log(`\n\n👥 Unique sessions: ${uniqueSessions.size}`);
    console.log(`📊 Average events per session: ${totalCount ? (totalCount / uniqueSessions.size).toFixed(2) : 0}`);

    // 5. Check table structure
    console.log('\n\n🏗️  Table structure check:');
    const { data: sampleRow } = await supabase
      .from('tracking_events')
      .select('*')
      .limit(1)
      .single();

    if (sampleRow) {
      console.log('✅ Table columns:', Object.keys(sampleRow).join(', '));
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n\n✅ Tracking events check complete!');
}

checkTrackingEvents();
