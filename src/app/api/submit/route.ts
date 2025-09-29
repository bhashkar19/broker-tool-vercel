import { NextRequest, NextResponse } from 'next/server';
import { saveUserSubmission, initializeDatabase } from '@/lib/database';

interface SubmissionData {
  name: string;
  mobile: string;
  currentBroker: string;
  executionIssues: string;
  toolsSatisfaction: string;
  supportExperience: string;
  chargesConcern: string;
  sessionId: string;
  recommended_broker: string;
  timestamp: string;
  user_agent: string;
  fb_click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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

    // Save to database
    const submissionData = {
      name: data.name,
      mobile: data.mobile,
      current_broker: data.currentBroker,
      execution_issues: data.executionIssues,
      tools_satisfaction: data.toolsSatisfaction,
      support_experience: data.supportExperience,
      charges_concern: data.chargesConcern,
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