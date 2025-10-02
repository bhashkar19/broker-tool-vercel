import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';
import { sendPurchaseEvent } from '@/lib/facebook-conversions-api';

/**
 * POST /api/admin/sync-facebook
 *
 * Sync pending conversions to Facebook Conversions API
 * Can be triggered manually or via cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Fetch all submissions with pending Facebook sync
    const { data: pendingSubmissions, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .eq('conversion_status', 'converted')
      .eq('fb_sync_status', 'pending')
      .not('broker_client_id', 'is', null)
      .not('conversion_date', 'is', null)
      .limit(100); // Process max 100 at a time

    if (error) {
      console.error('Error fetching pending submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch pending submissions' },
        { status: 500 }
      );
    }

    if (!pendingSubmissions || pendingSubmissions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending conversions to sync',
        synced: 0,
        failed: 0
      });
    }

    // Sync each submission to Facebook
    let synced = 0;
    let failed = 0;
    const errors: Array<{ id: number; name: string; error: string }> = [];

    for (const submission of pendingSubmissions) {
      try {
        const result = await sendPurchaseEvent({
          name: submission.name,
          phone: submission.mobile,
          brokerId: submission.recommended_broker,
          brokerClientId: submission.broker_client_id!,
          conversionDate: new Date(submission.conversion_date!),
          fbclid: submission.fb_click_id || undefined,
          value: 500 // Estimated commission value
        });

        if (result.success) {
          // Update sync status to 'synced'
          await supabaseAdmin
            .from('user_submissions')
            .update({
              fb_sync_status: 'synced',
              fb_sync_date: new Date().toISOString()
            })
            .eq('id', submission.id);

          synced++;
        } else {
          // Mark as failed
          await supabaseAdmin
            .from('user_submissions')
            .update({
              fb_sync_status: 'failed',
              notes: result.error
            })
            .eq('id', submission.id);

          failed++;
          errors.push({
            id: submission.id,
            name: submission.name,
            error: result.error || 'Unknown error'
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (syncError) {
        failed++;
        errors.push({
          id: submission.id,
          name: submission.name,
          error: syncError instanceof Error ? syncError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} conversions, ${failed} failed`,
      synced,
      failed,
      total: pendingSubmissions.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Sync Facebook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/sync-facebook
 *
 * Get sync status
 */
export async function GET(request: NextRequest) {
  try {
    // Count pending, synced, and failed
    const { data: stats, error } = await supabaseAdmin
      .from('user_submissions')
      .select('fb_sync_status, conversion_status')
      .eq('conversion_status', 'converted');

    if (error) {
      console.error('Error fetching sync stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sync stats' },
        { status: 500 }
      );
    }

    const pending = stats?.filter(s => s.fb_sync_status === 'pending').length || 0;
    const synced = stats?.filter(s => s.fb_sync_status === 'synced').length || 0;
    const failed = stats?.filter(s => s.fb_sync_status === 'failed').length || 0;

    return NextResponse.json({
      success: true,
      stats: {
        pending,
        synced,
        failed,
        total: stats?.length || 0
      }
    });

  } catch (error) {
    console.error('Get sync stats error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
