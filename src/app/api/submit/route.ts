import { NextRequest, NextResponse } from 'next/server';
import { saveUserSubmission, initializeDatabase } from '@/lib/supabase-database';

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
    if (typeof brokerData === 'string') {
      try {
        brokerData = JSON.parse(brokerData);
      } catch {
        brokerData = { brokers: [] };
      }
    }
    if (brokerData.brokers && brokerData.brokers.length > 0) {
      currentBroker = brokerData.brokers[0]; // Take first broker
    }
  }

  // Handle challenges (new: mainChallenge array, old: executionIssues string)
  let executionIssues = data.executionIssues || 'none';
  if (data.mainChallenge) {
    const challenges = Array.isArray(data.mainChallenge) ? data.mainChallenge : [data.mainChallenge];
    executionIssues = challenges.join(', ');
  }

  // Handle what matters most (new: whatMattersMost array, old: multiple single fields)
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

    // Validate required fields
    if (!data.name || !data.mobile || !data.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mobile number (basic Indian mobile number validation)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(data.mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Initialize database table if it doesn't exist
    await initializeDatabase();

    // 🔄 FIELD MAPPING: Convert new multi-select to old single fields
    const mappedData = mapNewFieldsToOld(data);

    // Save to database
    const submissionData = {
      name: data.name,
      mobile: data.mobile,
      current_broker: mappedData.currentBroker,
      execution_issues: mappedData.executionIssues,
      tools_satisfaction: mappedData.toolsSatisfaction,
      support_experience: mappedData.supportExperience,
      charges_concern: mappedData.chargesConcern,
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
      console.error('Failed to save to database:', dbResult.error);
      // Still log to console as backup
      console.log('User submission received (database save failed):', {
        ...data,
        ip,
        submittedAt: new Date().toISOString()
      });
    } else {
      console.log('User submission saved to database successfully:', {
        id: dbResult.data?.id,
        sessionId: data.sessionId,
        recommendedBroker: data.recommended_broker
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: data.sessionId,
      message: 'Data submitted successfully'
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For debugging - remove in production
export async function GET() {
  return NextResponse.json({
    message: 'Submit API endpoint is active',
    timestamp: new Date().toISOString()
  });
}