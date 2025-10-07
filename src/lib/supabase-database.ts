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
  current_broker: string;
  execution_issues: string;
  tools_satisfaction: string;
  support_experience: string;
  charges_concern: string;
  session_id: string;
  recommended_broker: string;
  user_agent: string;
  ip_address: string;
  fb_click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;

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
        name: data.name,
        mobile: data.mobile,
        current_broker: data.current_broker,
        execution_issues: data.execution_issues,
        tools_satisfaction: data.tools_satisfaction,
        support_experience: data.support_experience,
        charges_concern: data.charges_concern,
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
    const { count: totalSubmissions, error: countError } = await supabaseAdmin
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

    const { count: recentSubmissions, error: recentError } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());

    if (recentError) {
      console.error('Error getting recent count:', recentError);
    }

    // Broker recommendations stats
    const { data: brokerStats } = await supabaseAdmin
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

    const { data: brokerClicksData } = await supabaseAdmin
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
    const { data: currentBrokerStats } = await supabaseAdmin
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

// 🎯 GET QUIZ ANALYTICS - Track partial and completed quiz attempts
export async function getQuizAnalytics(timeRange: '24h' | '7d' | '10d' = '10d') {
  try {
    // Calculate time threshold
    const now = new Date();
    let hoursAgo = 240; // 10 days default
    if (timeRange === '24h') hoursAgo = 24;
    else if (timeRange === '7d') hoursAgo = 168;

    const timeThreshold = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000)).toISOString();

    // Get all sessions that started within time range
    const { data: sessionsStarted } = await supabaseAdmin
      .from('tracking_events')
      .select('session_id, created_at, event_data, user_agent, ip_address')
      .eq('event_name', 'tool_started')
      .gte('created_at', timeThreshold)
      .order('created_at', { ascending: false });

    // Get session IDs to filter other queries
    const sessionIds = sessionsStarted?.map(s => s.session_id) || [];

    if (sessionIds.length === 0) {
      return {
        success: true,
        data: {
          summary: {
            totalSessions: 0,
            completed: 0,
            droppedOff: 0,
            completionRate: 0,
            dropOffRate: 0,
          },
          funnel: { started: 0, q1: 0, q2: 0, q3: 0, q4: 0, completed: 0 },
          recentSessions: [],
          trafficSources: []
        }
      };
    }

    // Get all completed sessions (only from our session IDs)
    const { data: sessionsCompleted } = await supabaseAdmin
      .from('tracking_events')
      .select('session_id')
      .eq('event_name', 'recommendation_viewed')
      .in('session_id', sessionIds);

    const completedSessionIds = new Set(sessionsCompleted?.map(s => s.session_id) || []);

    // Get all question progress events (only from our session IDs)
    const { data: questionEvents } = await supabaseAdmin
      .from('tracking_events')
      .select('session_id, event_data, created_at')
      .eq('event_name', 'question_progressed')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: false });

    // Track max question index reached per session
    const sessionMaxQuestion: Record<string, number> = {};
    questionEvents?.forEach(event => {
      const eventData = event.event_data as { questionIndex?: number } || {};
      const questionIndex = eventData.questionIndex ?? -1;

      if (questionIndex >= 0) {
        const currentMax = sessionMaxQuestion[event.session_id] ?? -1;
        sessionMaxQuestion[event.session_id] = Math.max(currentMax, questionIndex);
      }
    });

    // Calculate drop-off funnel based on max question index reached
    const funnelData = {
      started: sessionsStarted?.length || 0,
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      completed: completedSessionIds.size
    };

    // Count sessions that reached each question (questionIndex is 0-based)
    Object.values(sessionMaxQuestion).forEach(maxIndex => {
      if (maxIndex >= 0) funnelData.q1++; // Reached Q1 (index 0)
      if (maxIndex >= 1) funnelData.q2++; // Reached Q2 (index 1)
      if (maxIndex >= 2) funnelData.q3++; // Reached Q3 (index 2)
      if (maxIndex >= 3) funnelData.q4++; // Reached Q4 (index 3)
    });

    // Build recent sessions with details
    const recentSessions = (sessionsStarted || []).map(session => {
      const isCompleted = completedSessionIds.has(session.session_id);
      const maxQuestionIndex = sessionMaxQuestion[session.session_id] ?? -1;
      const questionsAnswered = maxQuestionIndex >= 0 ? maxQuestionIndex + 1 : 0;
      const utmData = session.event_data as Record<string, unknown> || {};

      return {
        sessionId: session.session_id.substring(0, 12) + '...',
        fullSessionId: session.session_id,
        status: isCompleted ? 'completed' : questionsAnswered > 0 ? `dropped_q${questionsAnswered}` : 'started',
        questionsAnswered,
        totalQuestions: 5,
        createdAt: session.created_at,
        utmSource: utmData.utm_source as string || 'Direct',
        utmMedium: utmData.utm_medium as string || '-',
        utmCampaign: utmData.utm_campaign as string || '-',
      };
    });

    // Traffic sources breakdown
    const trafficSources: Record<string, number> = {};
    recentSessions.forEach(session => {
      const source = session.utmSource;
      trafficSources[source] = (trafficSources[source] || 0) + 1;
    });

    const completionRate = funnelData.started > 0
      ? ((funnelData.completed / funnelData.started) * 100).toFixed(1)
      : 0;

    const dropOffRate = funnelData.started > 0
      ? (((funnelData.started - funnelData.completed) / funnelData.started) * 100).toFixed(1)
      : 0;

    return {
      success: true,
      data: {
        summary: {
          totalSessions: funnelData.started,
          completed: funnelData.completed,
          droppedOff: funnelData.started - funnelData.completed,
          completionRate: parseFloat(completionRate as string),
          dropOffRate: parseFloat(dropOffRate as string),
        },
        funnel: funnelData,
        recentSessions,
        trafficSources: Object.entries(trafficSources).map(([source, count]) => ({
          source,
          count,
          percentage: ((count / funnelData.started) * 100).toFixed(1)
        })).sort((a, b) => b.count - a.count)
      }
    };
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    return { success: false, error };
  }
}
