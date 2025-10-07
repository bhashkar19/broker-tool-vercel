import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-database';

/**
 * Check if a mobile number has already completed the quiz
 * Used to prevent users from retaking the quiz multiple times
 */
export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    // Validate mobile number
    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Clean mobile number (remove spaces, dashes, country code)
    const cleanMobile = mobile.replace(/[\s\-\+]/g, '').replace(/^91/, '');

    // Query database to check if this mobile has already completed
    const { data, error } = await supabase
      .from('user_submissions')
      .select('recommended_broker, created_at, name')
      .eq('mobile', cleanMobile)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking completion:', error);
      // Don't block user if database query fails - fail open
      return NextResponse.json({ completed: false });
    }

    // If data exists, user has already completed
    if (data && data.length > 0) {
      return NextResponse.json({
        completed: true,
        broker: data[0].recommended_broker,
        completedAt: data[0].created_at,
        name: data[0].name
      });
    }

    // User has not completed yet
    return NextResponse.json({ completed: false });

  } catch (error) {
    console.error('Error in check-completion API:', error);
    // Fail open - don't block users if API fails
    return NextResponse.json({ completed: false });
  }
}
