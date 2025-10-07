import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';

interface ClickData {
  session_id: string;
  broker_id: string;
  user_mobile?: string;
  user_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  fb_click_id?: string;
}

/**
 * Track CTA Button Clicks
 * Records when user clicks "Click For {Broker} Free A/C" button
 * This happens BEFORE redirect to broker website
 */
export async function POST(request: NextRequest) {
  try {
    const data: ClickData = await request.json();

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate required fields
    if (!data.session_id || !data.broker_id) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id and broker_id' },
        { status: 400 }
      );
    }

    // Check if already clicked (prevent duplicates)
    const { data: existing } = await supabaseAdmin
      .from('broker_clicks')
      .select('id')
      .eq('session_id', data.session_id)
      .eq('broker_id', data.broker_id)
      .single();

    if (existing) {
      // Already tracked, return success (idempotent)
      return NextResponse.json({
        success: true,
        message: 'Click already tracked',
        duplicate: true
      });
    }

    // Save click to database
    const { data: result, error } = await supabaseAdmin
      .from('broker_clicks')
      .insert([{
        session_id: data.session_id,
        broker_id: data.broker_id,
        user_mobile: data.user_mobile,
        user_name: data.user_name,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        fb_click_id: data.fb_click_id,
        user_agent: userAgent,
        ip_address: ip,
        clicked_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving click:', error);
      // Don't block user redirect even if tracking fails
      return NextResponse.json({
        success: false,
        error: 'Failed to save click',
        details: error.message
      }, { status: 500 });
    }

    // Also update user_submissions table with click flag
    await supabaseAdmin
      .from('user_submissions')
      .update({
        cta_clicked: true,
        cta_clicked_at: new Date().toISOString()
      })
      .eq('session_id', data.session_id);

    console.log('✅ Click tracked:', {
      session_id: data.session_id,
      broker: data.broker_id,
      mobile: data.user_mobile
    });

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      click_id: result.id
    });

  } catch (error) {
    console.error('Error in track-click API:', error);
    // Don't block user even if tracking fails
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve click stats (for testing/debugging)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('broker_id');
    const sessionId = searchParams.get('session_id');

    let query = supabaseAdmin
      .from('broker_clicks')
      .select('*')
      .order('clicked_at', { ascending: false });

    if (brokerId) {
      query = query.eq('broker_id', brokerId);
    }

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch clicks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clicks: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error fetching clicks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
