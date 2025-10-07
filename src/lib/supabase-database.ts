import { createClient } from '@supabase/supabase-js';

// Validate required environment variables on startup
function validateEnvVars() {
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value || value.trim() === '')
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMsg = `🚨 CRITICAL: Missing required environment variables: ${missing.join(', ')}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Validate format
  const url = required['NEXT_PUBLIC_SUPABASE_URL'];
  if (url && !url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  }

  console.log('✅ Environment variables validated successfully');
}

// Run validation
validateEnvVars();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public operations (with anon key)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for database operations (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface UserSubmission {
  id?: number;
  name: string;
  mobile: string;
  // OLD FIELDS (mapped for backward compatibility)
  current_broker: string;
  execution_issues: string;
  tools_satisfaction: string;
  support_experience: string;
  charges_concern: string;
  // NEW COMPLETE QUIZ DATA FIELDS
  has_account?: string;
  broker_info?: unknown; // JSONB
  user_type?: unknown; // JSONB
  main_challenge?: unknown; // JSONB
  trading_frequency?: string;
  what_matters_most?: unknown; // JSONB
  investment_amount?: string;
  experience_level?: string;
  // TRACKING FIELDS
  session_id: string;
  recommended_broker: string;
  user_agent: string;
  ip_address: string;
  fb_click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
  // CLICK TRACKING
  cta_clicked?: boolean;
  cta_clicked_at?: string;
  // Conversion tracking fields
  broker_client_id?: string;
  conversion_status?: 'pending' | 'converted' | 'rejected';
  conversion_date?: string;
  match_confidence?: number;
  import_hash?: string;
  fb_sync_status?: 'pending' | 'synced' | 'failed';
  fb_sync_date?: string;
  notes?: string;
}

export interface ConversionImport {
  id?: number;
  broker_id: string;
  file_name: string;
  file_hash: string;
  total_rows: number;
  matched_rows?: number;
  unmatched_rows?: number;
  duplicate_rows?: number;
  upload_status?: 'processing' | 'completed' | 'failed';
  uploaded_by?: string;
  created_at?: string;
  completed_at?: string;
}

export interface ManualReviewQueueItem {
  id?: number;
  import_id: number;
  broker_id: string;
  broker_name: string;
  broker_client_id?: string;
  broker_conversion_date?: string;
  potential_matches?: Array<{
    submission_id: number;
    name: string;
    mobile: string;
    confidence: number;
    created_at: string;
  }>;
  matched_submission_id?: number;
  match_confidence?: number;
  review_status?: 'pending' | 'approved' | 'rejected' | 'skipped';
  reviewed_by?: string;
  reviewed_at?: string;
  csv_row_data?: Record<string, unknown>;
  created_at?: string;
}

// Initialize database table
export async function initializeDatabase() {
  try {
    // Create the user_submissions table if it doesn't exist
    const { error } = await supabase
      .from('user_submissions')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist - it should be created via migrations
      console.log('Table user_submissions not found. Please ensure migrations have been run.');
      return { success: false, error: 'Table not found' };
    }

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

// Save user submission to database
export async function saveUserSubmission(data: UserSubmission) {
  try {
    const { data: result, error } = await supabaseAdmin
      .from('user_submissions')
      .insert([{
        // Basic info
        name: data.name,
        mobile: data.mobile,
        // OLD mapped fields
        current_broker: data.current_broker,
        execution_issues: data.execution_issues,
        tools_satisfaction: data.tools_satisfaction,
        support_experience: data.support_experience,
        charges_concern: data.charges_concern,
        // NEW complete quiz data
        has_account: data.has_account,
        broker_info: data.broker_info,
        user_type: data.user_type,
        main_challenge: data.main_challenge,
        trading_frequency: data.trading_frequency,
        what_matters_most: data.what_matters_most,
        investment_amount: data.investment_amount,
        experience_level: data.experience_level,
        // Tracking
        session_id: data.session_id,
        recommended_broker: data.recommended_broker,
        user_agent: data.user_agent,
        ip_address: data.ip_address,
        fb_click_id: data.fb_click_id,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving user submission:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving user submission:', error);
    return { success: false, error };
  }
}

// Get all submissions
export async function getAllSubmissions(limit: number = 100, offset: number = 0) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching submissions:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error };
  }
}

// Get submissions by broker
export async function getSubmissionsByBroker(broker: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .eq('recommended_broker', broker)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions by broker:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching submissions by broker:', error);
    return { success: false, error };
  }
}

// 📊 BACKUP TRACKING EVENTS (Alternative to Facebook Pixel)
export interface TrackingEvent {
  event_name: string;
  session_id: string;
  broker_id?: string;
  event_data?: Record<string, unknown>;
  user_agent?: string;
  ip_address?: string;
  created_at?: string;
}

// Track event to Supabase (backup tracking)
export async function trackEvent(eventData: TrackingEvent) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tracking_events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error tracking event:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error };
  }
}

// Mark broker CSV as uploaded
export async function markBrokerAsUploaded(brokerId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('broker_upload_tracking')
      .upsert({
        broker_id: brokerId,
        last_upload_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'broker_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error marking broker as uploaded:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error marking broker as uploaded:', error);
    return { success: false, error };
  }
}

// Get analytics summary
export async function getAnalyticsSummary() {
  try {
    // Total submissions
    const { count: totalSubmissions, error: countError } = await supabase
      .from('user_submissions')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
      return { success: false, error: countError };
    }

    // Total conversions
    const { count: totalConversions } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('conversion_status', 'converted');

    // Pending review count
    const { count: pendingReview } = await supabaseAdmin
      .from('manual_review_queue')
      .select('*', { count: 'exact', head: true })
      .eq('review_status', 'pending');

    // Synced to Facebook count
    const { count: syncedToFacebook } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('fb_sync_status', 'synced');

    // Auto-matched conversions (confidence >= 90)
    const { count: autoMatched } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('conversion_status', 'converted')
      .gte('match_confidence', 90);

    // Get last upload date
    const { data: lastImport } = await supabaseAdmin
      .from('conversion_imports')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Recent submissions (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count: recentSubmissions, error: recentError } = await supabase
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());

    if (recentError) {
      console.error('Error getting recent count:', recentError);
    }

    // Broker recommendations stats
    const { data: brokerStats } = await supabase
      .from('user_submissions')
      .select('recommended_broker')
      .then(result => {
        if (result.error) return result;

        // Group by broker and count
        const grouped = result.data?.reduce((acc: Record<string, number>, item: { recommended_broker: string }) => {
          acc[item.recommended_broker] = (acc[item.recommended_broker] || 0) + 1;
          return acc;
        }, {});

        const brokerRecommendations = Object.entries(grouped || {}).map(([broker, count]) => ({
          recommended_broker: broker,
          count
        })).sort((a: { count: number }, b: { count: number }) => b.count - a.count);

        return { data: brokerRecommendations, error: null };
      });

    // Broker clicks stats (from tracking_events)
    // Get broker upload tracking first
    const { data: brokerUploads } = await supabaseAdmin
      .from('broker_upload_tracking')
      .select('broker_id, last_upload_date');

    const uploadDates = (brokerUploads || []).reduce((acc: Record<string, string>, item) => {
      acc[item.broker_id] = item.last_upload_date;
      return acc;
    }, {});

    const { data: brokerClicksData } = await supabase
      .from('tracking_events')
      .select('broker_id, event_name, created_at')
      .in('event_name', ['cta_clicked', 'alternative_broker_clicked'])
      .then(result => {
        if (result.error) return result;

        // Group by broker and count total + new clicks
        const grouped = result.data?.reduce((acc: Record<string, { total: number; newClicks: number; lastUpload: string | null }>, item: { broker_id: string; created_at: string }) => {
          if (item.broker_id) {
            if (!acc[item.broker_id]) {
              acc[item.broker_id] = { total: 0, newClicks: 0, lastUpload: uploadDates[item.broker_id] || null };
            }
            acc[item.broker_id].total += 1;

            // Count new clicks (after last upload)
            if (uploadDates[item.broker_id]) {
              const clickDate = new Date(item.created_at);
              const uploadDate = new Date(uploadDates[item.broker_id]);
              if (clickDate > uploadDate) {
                acc[item.broker_id].newClicks += 1;
              }
            } else {
              // No upload yet, all clicks are new
              acc[item.broker_id].newClicks += 1;
            }
          }
          return acc;
        }, {});

        const brokerClicks = Object.entries(grouped || {}).map(([broker, data]) => ({
          broker_id: broker,
          clicks: data.total,
          new_clicks: data.newClicks,
          last_upload_date: data.lastUpload
        })).sort((a: { clicks: number }, b: { clicks: number }) => b.clicks - a.clicks);

        return { data: brokerClicks, error: null };
      });

    // Top current brokers
    const { data: currentBrokerStats } = await supabase
      .from('user_submissions')
      .select('current_broker')
      .then(result => {
        if (result.error) return result;

        // Group by current broker and count
        const grouped = result.data?.reduce((acc: Record<string, number>, item: { current_broker: string }) => {
          acc[item.current_broker] = (acc[item.current_broker] || 0) + 1;
          return acc;
        }, {});

        const topCurrentBrokers = Object.entries(grouped || {}).map(([broker, count]) => ({
          current_broker: broker,
          count
        })).sort((a: { count: number }, b: { count: number }) => b.count - a.count).slice(0, 5);

        return { data: topCurrentBrokers, error: null };
      });

    return {
      success: true,
      data: {
        totalSubmissions: totalSubmissions || 0,
        recentSubmissions: recentSubmissions || 0,
        brokerRecommendations: brokerStats || [],
        brokerClicks: brokerClicksData || [],
        topCurrentBrokers: currentBrokerStats || [],
        // Conversion tracking stats
        totalConversions: totalConversions || 0,
        autoMatched: autoMatched || 0,
        pendingReview: pendingReview || 0,
        syncedToFacebook: syncedToFacebook || 0,
        lastUploadDate: lastImport?.created_at || null
      }
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { success: false, error };
  }
}