import { NextRequest, NextResponse } from 'next/server';

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

    // Here you would typically save to a database
    // For now, we'll just log the data and return success
    console.log('User submission received:', {
      ...data,
      ip,
      submittedAt: new Date().toISOString()
    });

    // In a real implementation, you would:
    // 1. Connect to your database (MongoDB, PostgreSQL, etc.)
    // 2. Store the user data
    // 3. Potentially send to a CRM or email service
    // 4. Store analytics data

    // Example database save (uncomment and modify for your database):
    /*
    const result = await saveToDatabase({
      ...data,
      ip,
      submittedAt: new Date().toISOString()
    });
    */

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