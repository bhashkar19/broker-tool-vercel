import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running broker_upload_tracking table migration...');

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./supabase-migration-broker-upload-tracking.sql', 'utf-8');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ Migration failed:', error);

      // Try alternative method - direct table creation
      console.log('📝 Trying direct table creation...');
      const { error: createError } = await supabase.from('broker_upload_tracking').select('id').limit(1);

      if (createError && createError.code === 'PGRST116') {
        console.log('⚠️ Table does not exist. Please run the SQL manually in Supabase SQL Editor:');
        console.log('');
        console.log(sql);
        console.log('');
        console.log('📍 Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql');
        process.exit(1);
      }
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('✅ broker_upload_tracking table created');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('');
    console.log('⚠️ Please run this SQL manually in Supabase SQL Editor:');
    console.log('');
    const sql = fs.readFileSync('./supabase-migration-broker-upload-tracking.sql', 'utf-8');
    console.log(sql);
    console.log('');
    console.log('📍 Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
  }
}

runMigration();
