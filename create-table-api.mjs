import fetch from 'node-fetch';

const supabaseUrl = 'https://dqmpityshhywzayjysru.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBpdHlzaGh5d3pheWp5c3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0MzM5NywiZXhwIjoyMDc0NzE5Mzk3fQ.q8Km0yCw00y0pY8JcRi40PIw9hIVn-CQwtKWeLWhPhg';

const sql = `
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
`;

async function createTable() {
  console.log('🚀 Attempting to create table via Supabase API...\n');

  try {
    // Try using the pg meta API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Table created successfully!');
      console.log(result);
    } else {
      console.log('⚠️  API method not available');
      console.log('\n📝 Please create the table manually in Supabase SQL Editor:');
      console.log('🔗 https://supabase.com/dashboard/project/dqmpityshhywzayjysru/sql\n');
      console.log('─'.repeat(70));
      console.log(sql);
      console.log('─'.repeat(70));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Please create the table manually in Supabase SQL Editor:');
    console.log('🔗 https://supabase.com/dashboard/project/dqmpityshhywzayjysru/sql\n');
    console.log('─'.repeat(70));
    console.log(sql);
    console.log('─'.repeat(70));
  }
}

createTable();
