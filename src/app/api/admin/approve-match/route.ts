import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';

/**
 * POST /api/admin/approve-match
 *
 * Approve a manual review match and update user_submissions
 */
export async function POST(request: NextRequest) {
  try {
    const { reviewId, submissionId } = await request.json();

    if (!reviewId || !submissionId) {
      return NextResponse.json(
        { error: 'Missing reviewId or submissionId' },
        { status: 400 }
      );
    }

    // Get the review item details
    const { data: reviewItem, error: reviewError } = await supabaseAdmin
      .from('manual_review_queue')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (reviewError || !reviewItem) {
      return NextResponse.json(
        { error: 'Review item not found' },
        { status: 404 }
      );
    }

    // Find the approved match confidence
    const approvedMatch = reviewItem.potential_matches?.find(
      (m: { submission_id: number }) => m.submission_id === submissionId
    );

    if (!approvedMatch) {
      return NextResponse.json(
        { error: 'Invalid submission ID for this review' },
        { status: 400 }
      );
    }

    // Update the user_submissions table
    const { error: updateError } = await supabaseAdmin
      .from('user_submissions')
      .update({
        broker_client_id: reviewItem.broker_client_id,
        conversion_status: 'converted',
        conversion_date: reviewItem.broker_conversion_date,
        match_confidence: approvedMatch.confidence,
        fb_sync_status: 'pending' // Will be synced to Facebook later
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    // Mark the review item as approved
    const { error: reviewUpdateError } = await supabaseAdmin
      .from('manual_review_queue')
      .update({
        matched_submission_id: submissionId,
        match_confidence: approvedMatch.confidence,
        review_status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reviewId);

    if (reviewUpdateError) {
      console.error('Error updating review item:', reviewUpdateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Match approved successfully'
    });

  } catch (error) {
    console.error('Approve match error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
