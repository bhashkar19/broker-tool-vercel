import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, TrackingEvent } from '@/lib/supabase-database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.event_name || !data.session_id) {
      return NextResponse.json(
        { error: 'Missing required fields (event_name, session_id)' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Build tracking event
    const trackingEvent: TrackingEvent = {
      event_name: data.event_name,
      session_id: data.session_id,
      broker_id: data.broker_id,
      event_data: data.event_data || {},
      user_agent: userAgent,
      ip_address: ip
    };

    // Save to Supabase
    const result = await trackEvent(trackingEvent);

    if (!result.success) {
      console.error('Failed to track event:', result.error);
      // Don't fail the request - tracking is non-critical
      return NextResponse.json({
        success: false,
        message: 'Event tracking failed but request continued'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Error processing tracking event:', error);
    // Don't fail the request - tracking is non-critical
    return NextResponse.json({
      success: false,
      message: 'Event tracking failed but request continued'
    });
  }
}
