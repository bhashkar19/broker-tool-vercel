import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeTrackingIssues() {
  console.log('🔍 Analyzing tracking_events for potential issues...\n');

  try {
    // Get all events
    const { data: allEvents, error } = await supabase
      .from('tracking_events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching events:', error);
      return;
    }

    if (!allEvents || allEvents.length === 0) {
      console.log('ℹ️  No events found in database');
      return;
    }

    // Group events by session
    const sessionEvents: Record<string, any[]> = {};
    allEvents.forEach(event => {
      if (!sessionEvents[event.session_id]) {
        sessionEvents[event.session_id] = [];
      }
      sessionEvents[event.session_id].push(event);
    });

    console.log(`📊 Total sessions analyzed: ${Object.keys(sessionEvents).length}\n`);

    // Issue 1: Check for duplicate tool_started events in same session
    console.log('🔍 Issue 1: Duplicate tool_started events');
    let duplicateToolStarted = 0;
    Object.entries(sessionEvents).forEach(([sessionId, events]) => {
      const toolStartedCount = events.filter(e => e.event_name === 'tool_started').length;
      if (toolStartedCount > 1) {
        duplicateToolStarted++;
        console.log(`  ⚠️  Session ${sessionId}: ${toolStartedCount} tool_started events`);
      }
    });
    console.log(`  ${duplicateToolStarted === 0 ? '✅' : '⚠️'} Found ${duplicateToolStarted} sessions with duplicate tool_started\n`);

    // Issue 2: Check for excessive question_progressed events
    console.log('🔍 Issue 2: Excessive question_progressed events');
    let excessiveProgressed = 0;
    Object.entries(sessionEvents).forEach(([sessionId, events]) => {
      const progressedCount = events.filter(e => e.event_name === 'question_progressed').length;
      if (progressedCount > 10) { // More than 10 is suspicious
        excessiveProgressed++;
        console.log(`  ⚠️  Session ${sessionId}: ${progressedCount} question_progressed events`);
      }
    });
    console.log(`  ${excessiveProgressed === 0 ? '✅' : '⚠️'} Found ${excessiveProgressed} sessions with excessive question_progressed (>10)\n`);

    // Issue 3: Check for sessions with lead_captured but no recommendation_viewed
    console.log('🔍 Issue 3: Incomplete funnels (lead captured but no recommendation)');
    let incompleteFunnels = 0;
    Object.entries(sessionEvents).forEach(([sessionId, events]) => {
      const hasLead = events.some(e => e.event_name === 'lead_captured');
      const hasRecommendation = events.some(e => e.event_name === 'recommendation_viewed');
      if (hasLead && !hasRecommendation) {
        incompleteFunnels++;
      }
    });
    console.log(`  ℹ️  Found ${incompleteFunnels} sessions with lead but no recommendation (drop-off)\n`);

    // Issue 4: Check conversion rate
    console.log('🔍 Issue 4: Conversion metrics');
    const totalSessions = Object.keys(sessionEvents).length;
    const sessionsWithLead = Object.values(sessionEvents).filter(events =>
      events.some(e => e.event_name === 'lead_captured')
    ).length;
    const sessionsWithRecommendation = Object.values(sessionEvents).filter(events =>
      events.some(e => e.event_name === 'recommendation_viewed')
    ).length;
    const sessionsWithCTA = Object.values(sessionEvents).filter(events =>
      events.some(e => e.event_name === 'cta_clicked')
    ).length;

    console.log(`  📊 Total sessions: ${totalSessions}`);
    console.log(`  📊 Lead capture rate: ${((sessionsWithLead / totalSessions) * 100).toFixed(1)}% (${sessionsWithLead} sessions)`);
    console.log(`  📊 Recommendation view rate: ${((sessionsWithRecommendation / totalSessions) * 100).toFixed(1)}% (${sessionsWithRecommendation} sessions)`);
    console.log(`  📊 CTA click rate: ${((sessionsWithCTA / totalSessions) * 100).toFixed(1)}% (${sessionsWithCTA} sessions)`);
    console.log(`  📊 Lead → Recommendation: ${sessionsWithLead > 0 ? ((sessionsWithRecommendation / sessionsWithLead) * 100).toFixed(1) : 0}%`);
    console.log(`  📊 Recommendation → CTA: ${sessionsWithRecommendation > 0 ? ((sessionsWithCTA / sessionsWithRecommendation) * 100).toFixed(1) : 0}%\n`);

    // Issue 5: Check average events per session distribution
    console.log('🔍 Issue 5: Events per session distribution');
    const eventsPerSession = Object.values(sessionEvents).map(events => events.length);
    const avgEvents = eventsPerSession.reduce((sum, count) => sum + count, 0) / eventsPerSession.length;
    const minEvents = Math.min(...eventsPerSession);
    const maxEvents = Math.max(...eventsPerSession);

    console.log(`  📊 Average: ${avgEvents.toFixed(2)} events/session`);
    console.log(`  📊 Min: ${minEvents} events`);
    console.log(`  📊 Max: ${maxEvents} events`);

    // Find sessions with abnormally high event counts
    const abnormalSessions = Object.entries(sessionEvents)
      .filter(([_, events]) => events.length > avgEvents * 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);

    if (abnormalSessions.length > 0) {
      console.log(`  ⚠️  Top 5 sessions with abnormally high event counts:`);
      abnormalSessions.forEach(([sessionId, events]) => {
        const eventBreakdown = events.reduce((acc: Record<string, number>, e) => {
          acc[e.event_name] = (acc[e.event_name] || 0) + 1;
          return acc;
        }, {});
        console.log(`    - ${sessionId}: ${events.length} events`);
        console.log(`      Breakdown:`, eventBreakdown);
      });
    }

    console.log('\n✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

analyzeTrackingIssues();
