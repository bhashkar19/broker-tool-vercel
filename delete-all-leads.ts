import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllLeads() {
  try {
    console.log('🗑️  Deleting all leads from user_submissions table...');

    // First, get the count
    const { count: totalCount } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Found ${totalCount || 0} leads to delete`);

    if (!totalCount || totalCount === 0) {
      console.log('✅ No leads to delete. Database is already empty.');
      return;
    }

    // Delete all records
    const { error } = await supabaseAdmin
      .from('user_submissions')
      .delete()
      .neq('id', 0); // This deletes all rows (id is always >= 1)

    if (error) {
      console.error('❌ Error deleting leads:', error);
      process.exit(1);
    }

    // Verify deletion
    const { count: remainingCount } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Successfully deleted all leads!`);
    console.log(`📊 Remaining leads: ${remainingCount || 0}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the function
deleteAllLeads();
