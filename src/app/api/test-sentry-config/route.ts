import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    dsn_configured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    dsn_length: process.env.NEXT_PUBLIC_SENTRY_DSN?.length || 0,
    dsn_starts_with: process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 20) || 'not set',
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
  };

  return NextResponse.json(config);
}
