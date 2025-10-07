import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up broker_upload_tracking table...\n');

  try {
    // Check if table exists
    console.log('📋 Checking if table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('broker_upload_tracking')
      .select('id')
      .limit(1);

    if (checkError) {
      if (checkError.code === 'PGRST116' || checkError.message.includes('does not exist')) {
        console.log('❌ Table does not exist');
        console.log('\n⚠️  The Supabase JS client cannot create tables directly.');
        console.log('📝 Please run this SQL in your Supabase SQL Editor:\n');
        console.log('🔗 Go to: https://supabase.com/dashboard/project/dqmpityshhywzayjysru/sql\n');
        console.log('─'.repeat(70));
        console.log(`
CREATE TABLE IF NOT EXISTS broker_upload_tracking (
  id BIGSERIAL PRIMARY KEY,
  broker_id TEXT UNIQUE NOT NULL,
  last_upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broker_upload_tracking_broker_id
ON broker_upload_tracking(broker_id);

COMMENT ON TABLE broker_upload_tracking IS
'Tracks when CSV conversion data was last uploaded for each broker. Used to calculate new clicks since last upload.';
        `);
        console.log('─'.repeat(70));
        console.log('\n✅ After running the SQL, the feature will work immediately!');
      } else {
        console.error('❌ Error checking table:', checkError.message);
      }
    } else {
      console.log('✅ Table already exists!');
      console.log('✅ Everything is set up correctly!');

      // Test insert to verify permissions
      console.log('\n🧪 Testing table access...');
      const { data: testData, error: testError } = await supabase
        .from('broker_upload_tracking')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('⚠️  Error accessing table:', testError.message);
      } else {
        console.log('✅ Table is accessible and working!');
        console.log(`📊 Current records: ${testData?.length || 0}`);
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupDatabase();
