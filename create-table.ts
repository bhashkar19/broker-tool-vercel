import { supabaseAdmin } from './src/lib/supabase-database';

async function createTable() {
  console.log('🚀 Creating broker_upload_tracking table...');

  try {
    // First, check if table exists
    const { error: checkError } = await supabaseAdmin
      .from('broker_upload_tracking')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === 'PGRST116') {
      console.log('📝 Table does not exist. Creating via SQL...');

      // Since we can't execute raw SQL via the client, we need to use a workaround
      // Let's try using the REST API to check if we can access the table
      console.log('⚠️ Cannot create table directly via Supabase client.');
      console.log('');
      console.log('Please run this SQL in Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/dqmpityshhywzayjysru/sql');
      console.log('');
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
    } else if (checkError) {
      console.error('❌ Error checking table:', checkError);
    } else {
      console.log('✅ Table already exists!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTable();
