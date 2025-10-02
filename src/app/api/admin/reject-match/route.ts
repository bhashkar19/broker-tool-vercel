import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';

/**
 * POST /api/admin/reject-match
 *
 * Reject a manual review item (no match found)
 */
export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Missing reviewId' },
        { status: 400 }
      );
    }

    // Mark the review item as rejected
    const { error: updateError } = await supabaseAdmin
      .from('manual_review_queue')
      .update({
        review_status: 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reviewId);

    if (updateError) {
      console.error('Error updating review item:', updateError);
      return NextResponse.json(
        { error: 'Failed to update review item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Match rejected successfully'
    });

  } catch (error) {
    console.error('Reject match error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
