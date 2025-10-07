import { NextRequest, NextResponse } from 'next/server';
import { getQuizAnalytics } from '@/lib/supabase-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = await getQuizAnalytics(limit);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch quiz analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analytics: result.data
    });

  } catch (error) {
    console.error('Error in quiz analytics API:', error);
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
