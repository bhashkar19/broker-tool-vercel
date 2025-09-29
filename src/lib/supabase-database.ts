import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: result, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
        brokerRecommendations: brokerStats?.data || [],
        topCurrentBrokers: currentBrokerStats?.data || []
      }
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { success: false, error };
  }
}