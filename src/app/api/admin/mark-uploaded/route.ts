import { NextRequest, NextResponse } from 'next/server';
import { markBrokerAsUploaded } from '@/lib/supabase-database';

export async function POST(request: NextRequest) {
  try {
    const { brokerId } = await request.json();

    if (!brokerId) {
      return NextResponse.json(
        { success: false, error: 'Broker ID is required' },
        { status: 400 }
      );
    }

    const result = await markBrokerAsUploaded(brokerId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${brokerId} marked as uploaded`
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to mark broker as uploaded' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in mark-uploaded API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
