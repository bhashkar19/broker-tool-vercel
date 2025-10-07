import { NextRequest, NextResponse } from 'next/server';
import { saveUserSubmission, initializeDatabase } from '@/lib/supabase-database';

// 🛡️ SPAM PROTECTION - Simple rate limiting and validation
const submissionTracker = new Map<string, { count: number; lastSubmission: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_MINUTE = 3;
const MIN_TIME_BETWEEN_SUBMISSIONS = 10000; // 10 seconds

// Clean up function (called inline, no setInterval in serverless)
function cleanupOldTracking() {
  const now = Date.now();
  const threshold = RATE_LIMIT_WINDOW * 5;
  for (const [key, data] of submissionTracker.entries()) {
    if (now - data.lastSubmission > threshold) {
      submissionTracker.delete(key);
    }
  }
}

interface SubmissionData {
  // Contact info
  name: string;
  mobile: string;
  sessionId: string;
  recommended_broker: string;
  timestamp: string;
  user_agent: string;
  fb_click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  // NEW Multi-select fields (priority)
  hasAccount?: string;
  brokerInfo?: { count?: string; brokers?: string[] } | string;
  userType?: string[] | string;
  mainChallenge?: string[] | string;
  tradingFrequency?: string;
  whatMattersMost?: string[] | string;
  investmentAmount?: string;
  experienceLevel?: string;

  // LEGACY single fields (for compatibility)
  currentBroker?: string;
  executionIssues?: string;
  toolsSatisfaction?: string;
  supportExperience?: string;
  chargesConcern?: string;
}

// 🔄 FIELD MAPPING FUNCTION: Convert new multi-select to old single fields
function mapNewFieldsToOld(data: SubmissionData) {
  // Handle broker selection (new format: brokerInfo, old format: currentBroker)
  let currentBroker = data.currentBroker || 'none';
  if (data.brokerInfo) {
    let brokerData = data.brokerInfo;

    // Parse string to object if needed
    if (typeof brokerData === 'string') {
      try {
        brokerData = JSON.parse(brokerData);
      } catch {
        brokerData = { brokers: [] };
      }
    }

    // Type guard: ensure brokerData is object with brokers array
    if (brokerData && typeof brokerData === 'object' && 'brokers' in brokerData) {
      const brokers = brokerData.brokers;
      if (Array.isArray(brokers) && brokers.length > 0) {
        currentBroker = brokers[0]; // Take first broker
      }
    }
  }

  // Handle challenges (new: mainChallenge - now single value, old: executionIssues string)
  let executionIssues = data.executionIssues || 'none';
  if (data.mainChallenge) {
    // Can be string (radio) or array (legacy checkbox)
    const challenges = Array.isArray(data.mainChallenge) ? data.mainChallenge : [data.mainChallenge];
    executionIssues = challenges.join(', ');
  }

  // Handle what matters most (new: whatMattersMost - now single value, old: multiple single fields)
  const whatMatters = Array.isArray(data.whatMattersMost) ? data.whatMattersMost : [data.whatMattersMost || ''];

  return {
    currentBroker,
    executionIssues,
    toolsSatisfaction: whatMatters.includes('tools') ? 'unsatisfied' : data.toolsSatisfaction || 'neutral',
    supportExperience: whatMatters.includes('support') ? 'poor' : data.supportExperience || 'neutral',
    chargesConcern: whatMatters.includes('cost') || whatMatters.includes('charges') ? 'high' : data.chargesConcern || 'moderate'
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: SubmissionData = await request.json();

    // Clean up old tracking data (replaces setInterval for serverless)
    cleanupOldTracking();

    // Get client IP for spam protection
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // 🛡️ SPAM PROTECTION - Rate limiting
    const now = Date.now();
    const trackingKey = `${ip}_${data.mobile || 'unknown'}`;
    const existing = submissionTracker.get(trackingKey);

    if (existing) {
      // Check if too many submissions in window
      if (existing.count >= MAX_SUBMISSIONS_PER_MINUTE &&
          now - existing.lastSubmission < RATE_LIMIT_WINDOW) {
        console.warn(`🛡️ Rate limit exceeded for ${trackingKey}:`, {
          ip,
          mobile: data.mobile,
          attempts: existing.count,
          timestamp: new Date().toISOString()
        });
        return NextResponse.json(
          { error: 'Too many submissions. Please wait a minute before trying again.' },
          { status: 429 }
        );
      }

      // Check minimum time between submissions
      if (now - existing.lastSubmission < MIN_TIME_BETWEEN_SUBMISSIONS) {
        console.warn(`🛡️ Submission too fast for ${trackingKey}:`, {
          ip,
          mobile: data.mobile,
          timeBetween: now - existing.lastSubmission,
          timestamp: new Date().toISOString()
        });
        return NextResponse.json(
          { error: 'Please wait a few seconds before submitting again.' },
          { status: 429 }
        );
      }
    }

    // Update tracking
    submissionTracker.set(trackingKey, {
      count: existing ? (now - existing.lastSubmission > RATE_LIMIT_WINDOW ? 1 : existing.count + 1) : 1,
      lastSubmission: now
    });

    // 🛡️ BASIC DATA VALIDATION - Detect obvious spam patterns
    const spamIndicators = [
      data.name.length < 2 || data.name.length > 50,
      /^test|admin|spam|bot/i.test(data.name),
      data.mobile && !/^[6-9]\d{9}$/.test(data.mobile.replace(/[\s\-\+]/g, '').replace(/^91/, '')),
      data.sessionId && data.sessionId.length < 5
    ];

    const spamScore = spamIndicators.filter(Boolean).length;
    if (spamScore >= 2) {
      console.warn(`🛡️ Potential spam detected for ${trackingKey}:`, {
        ip,
        name: data.name,
        mobile: data.mobile,
        sessionId: data.sessionId,
        spamScore,
        timestamp: new Date().toISOString()
      });
      // Still process but flag it
    }

    // Validate required fields
    if (!data.name || !data.mobile || !data.sessionId || !data.recommended_broker) {
      return NextResponse.json(
        { error: 'Missing required fields (name, mobile, sessionId, recommended_broker)' },
        { status: 400 }
      );
    }

    // Validate mobile number (relaxed - accepts various formats)
    // Remove spaces, dashes, and country code before validation
    const cleanMobile = data.mobile.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format. Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // Use cleaned mobile number for storage
    data.mobile = cleanMobile;

    // Initialize database table if it doesn't exist
    await initializeDatabase();

    // 🔄 FIELD MAPPING: Convert new multi-select to old single fields
    const mappedData = mapNewFieldsToOld(data);

    // Save to database (with BOTH old mapped fields AND new complete quiz data)
    const submissionData = {
      name: data.name,
      mobile: data.mobile,
      // OLD MAPPED FIELDS (for backward compatibility)
      current_broker: mappedData.currentBroker,
      execution_issues: mappedData.executionIssues,
      tools_satisfaction: mappedData.toolsSatisfaction,
      support_experience: mappedData.supportExperience,
      charges_concern: mappedData.chargesConcern,
      // NEW COMPLETE QUIZ DATA (stored as JSONB)
      has_account: data.hasAccount,
      broker_info: data.brokerInfo,
      user_type: data.userType,
      main_challenge: data.mainChallenge,
      trading_frequency: data.tradingFrequency,
      what_matters_most: data.whatMattersMost,
      investment_amount: data.investmentAmount,
      experience_level: data.experienceLevel,
      // TRACKING DATA
      session_id: data.sessionId,
      recommended_broker: data.recommended_broker,
      user_agent: data.user_agent,
      ip_address: ip,
      fb_click_id: data.fb_click_id,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign
    };

    const dbResult = await saveUserSubmission(submissionData);

    if (!dbResult.success) {
      // 🚨 CRITICAL ERROR MONITORING - Database save failed
      const error = dbResult.error as { message?: string; code?: string } | undefined;
      const errorDetails = {
        error_type: 'database_save_failed',
        error_message: error?.message || 'Unknown database error',
        error_code: error?.code || 'unknown',
        user_data: {
          sessionId: data.sessionId,
          recommendedBroker: data.recommended_broker,
          mobile: data.mobile?.slice(-4), // Last 4 digits only for privacy
          ip: ip
        },
        timestamp: new Date().toISOString(),
        severity: 'critical'
      };

      console.error('🚨 CRITICAL: Database save failed:', errorDetails);

      // Log full data as backup for manual recovery
      console.log('📋 BACKUP LOG - User submission (DB failed):', {
        ...submissionData,
        timestamp: new Date().toISOString()
      });

      // In production, you could send this to external monitoring service:
      // await sendToMonitoringService(errorDetails);

      // RETURN ERROR - Don't pretend success when data wasn't saved
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save your information. Please try again or contact support.',
          errorId: data.sessionId // For support tracking
        },
        { status: 500 }
      );
    }

    // 📊 SUCCESS MONITORING - Track successful conversions
    const successDetails = {
      event_type: 'successful_submission',
      user_data: {
        id: dbResult.data?.id,
        sessionId: data.sessionId,
        recommendedBroker: data.recommended_broker
      },
      timestamp: new Date().toISOString(),
      ip: ip
    };

    console.log('✅ SUCCESS: User submission saved to database:', successDetails);

    // Only return success if DB save actually succeeded
    return NextResponse.json({
      success: true,
      sessionId: data.sessionId,
      message: 'Data submitted successfully'
    });

  } catch (error) {
    // 🚨 CRITICAL ERROR MONITORING - Unexpected server errors
    const errorDetails = {
      error_type: 'unexpected_server_error',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_stack: error instanceof Error ? error.stack : 'No stack trace',
      request_data: {
        method: request.method,
        url: request.url,
        user_agent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      },
      timestamp: new Date().toISOString(),
      severity: 'critical'
    };

    console.error('🚨 CRITICAL: Unexpected server error:', errorDetails);

    // In production, you could send this to external monitoring service:
    // await sendToMonitoringService(errorDetails);

    return NextResponse.json(
      {
        error: 'Internal server error',
        // Include timestamp for debugging in development
        ...(process.env.NODE_ENV === 'development' && {
          debug_timestamp: errorDetails.timestamp
        })
      },
      { status: 500 }
    );
  }
}

// GET method removed - production ready