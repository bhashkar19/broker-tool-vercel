import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, getSubmissionsByBroker, getAnalyticsSummary } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const broker = searchParams.get('broker');
    const analytics = searchParams.get('analytics');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Return analytics summary
    if (analytics === 'true') {
      const result = await getAnalyticsSummary();
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to fetch analytics' },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        analytics: result.data
      });
    }

    // Filter by broker if specified
    if (broker) {
      const result = await getSubmissionsByBroker(broker);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to fetch submissions by broker' },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        submissions: result.data,
        broker,
        count: result.data?.length || 0
      });
    }

    // Get all submissions with pagination
    const result = await getAllSubmissions(limit, offset);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submissions: result.data,
      count: result.data?.length || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in admin submissions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}