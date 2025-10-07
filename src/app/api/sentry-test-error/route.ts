import { NextResponse } from 'next/server';

export async function GET() {
  // This error will be caught by Sentry server-side
  throw new Error('🧪 Sentry Test Error - Server Side (API Route)');

  // This line will never execute
  return NextResponse.json({ message: 'This should not be reached' });
}
