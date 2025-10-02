import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';

/**
 * GET /api/admin/review-queue
 *
 * Fetch all pending manual review items
 */
export async function GET(request: NextRequest) {
  try {
    const { data: reviewItems, error } = await supabaseAdmin
      .from('manual_review_queue')
      .select('*')
      .eq('review_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching review queue:', error);
      return NextResponse.json(
        { error: 'Failed to fetch review queue' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      items: reviewItems || []
    });

  } catch (error) {
    console.error('Review queue error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
