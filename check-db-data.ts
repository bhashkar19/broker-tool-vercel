import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');

  // 1. Check total submissions
  const { data: submissions, error: subError, count: totalCount } = await supabase
    .from('user_submissions')
    .select('*', { count: 'exact', head: false })
    .order('created_at', { ascending: false })
    .limit(10);

  if (subError) {
    console.error('❌ Error fetching submissions:', subError);
  } else {
    console.log(`📊 Total Submissions: ${totalCount}`);
    console.log(`📋 Latest 10 Submissions:\n`);

    submissions?.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} (${sub.mobile})`);
      console.log(`   Recommended: ${sub.recommended_broker}`);
      console.log(`   Has Account: ${sub.has_account || 'N/A'}`);
      console.log(`   User Type: ${JSON.stringify(sub.user_type) || 'N/A'}`);
      console.log(`   CTA Clicked: ${sub.cta_clicked ? '✅' : '❌'}`);
      console.log(`   Created: ${new Date(sub.created_at).toLocaleString('en-IN')}`);
      console.log('');
    });
  }

  // 2. Check broker clicks
  const { data: clicks, error: clickError, count: clickCount } = await supabase
    .from('broker_clicks')
    .select('*', { count: 'exact', head: false })
    .order('clicked_at', { ascending: false })
    .limit(10);

  if (clickError) {
    console.error('❌ Error fetching clicks:', clickError);
  } else {
    console.log(`\n🖱️  Total CTA Clicks: ${clickCount}`);
    console.log(`📋 Latest 10 Clicks:\n`);

    clicks?.forEach((click, index) => {
      console.log(`${index + 1}. ${click.user_name || 'Unknown'} → ${click.broker_id}`);
      console.log(`   Mobile: ${click.user_mobile}`);
      console.log(`   Clicked: ${new Date(click.clicked_at).toLocaleString('en-IN')}`);
      console.log(`   UTM Source: ${click.utm_source || 'N/A'}`);
      console.log('');
    });
  }

  // 3. Check broker recommendation breakdown
  const { data: brokerStats, error: statsError } = await supabase
    .from('user_submissions')
    .select('recommended_broker');

  if (statsError) {
    console.error('❌ Error fetching stats:', statsError);
  } else {
    const brokerCounts: Record<string, number> = {};
    brokerStats?.forEach(sub => {
      brokerCounts[sub.recommended_broker] = (brokerCounts[sub.recommended_broker] || 0) + 1;
    });

    console.log(`\n📊 Broker Recommendation Breakdown:\n`);
    Object.entries(brokerCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([broker, count]) => {
        const percentage = totalCount ? ((count / totalCount) * 100).toFixed(1) : 0;
        console.log(`   ${broker}: ${count} (${percentage}%)`);
      });
  }

  // 4. Check if new columns exist
  console.log(`\n🔍 Checking New Database Columns:\n`);

  const sampleSubmission = submissions?.[0];
  if (sampleSubmission) {
    console.log(`   ✅ has_account: ${sampleSubmission.has_account ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ✅ broker_info: ${sampleSubmission.broker_info !== undefined ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ✅ user_type: ${sampleSubmission.user_type !== undefined ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ✅ main_challenge: ${sampleSubmission.main_challenge !== undefined ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ✅ cta_clicked: ${sampleSubmission.cta_clicked !== undefined ? 'EXISTS' : 'MISSING'}`);
  }

  console.log('\n✅ Database check complete!\n');
}

checkDatabase().catch(console.error);
