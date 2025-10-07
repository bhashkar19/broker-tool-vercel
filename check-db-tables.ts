import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('📊 Checking database tables...\n');

  // Check tracking_events
  const { count: trackingCount } = await supabaseAdmin
    .from('tracking_events')
    .select('*', { count: 'exact', head: true });
  console.log(`📍 tracking_events: ${trackingCount || 0} rows`);

  // Check conversion_imports
  const { count: importsCount } = await supabaseAdmin
    .from('conversion_imports')
    .select('*', { count: 'exact', head: true });
  console.log(`📥 conversion_imports: ${importsCount || 0} rows`);

  // Check manual_review_queue
  const { count: reviewCount } = await supabaseAdmin
    .from('manual_review_queue')
    .select('*', { count: 'exact', head: true });
  console.log(`👀 manual_review_queue: ${reviewCount || 0} rows`);

  // Check user_submissions (already deleted)
  const { count: submissionsCount } = await supabaseAdmin
    .from('user_submissions')
    .select('*', { count: 'exact', head: true });
  console.log(`✉️  user_submissions: ${submissionsCount || 0} rows`);
}

checkTables();
