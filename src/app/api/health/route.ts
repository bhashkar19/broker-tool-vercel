import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // 1. Check Database Connection
  try {
    const dbStart = Date.now();
    const { error } = await supabaseAdmin
      .from('user_submissions')
      .select('id')
      .limit(1);

    checks.database = {
      status: error ? 'unhealthy' : 'healthy',
      latency: Date.now() - dbStart,
      ...(error && { error: error.message })
    };
  } catch (err) {
    checks.database = {
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }

  // 2. Check Environment Variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    key => !process.env[key] || process.env[key]?.trim() === ''
  );

  checks.environment = {
    status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
    ...(missingEnvVars.length > 0 && {
      error: `Missing: ${missingEnvVars.join(', ')}`
    })
  };

  // 3. Check Facebook Pixel Config (optional)
  checks.facebook_pixel = {
    status: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ? 'configured' : 'not_configured'
  };

  // 4. Check Facebook Conversion API (optional)
  checks.facebook_conversion_api = {
    status: process.env.FACEBOOK_CONVERSION_API_ACCESS_TOKEN ? 'configured' : 'not_configured'
  };

  // Overall health status
  const isHealthy = checks.database.status === 'healthy' &&
                    checks.environment.status === 'healthy';

  const totalLatency = Date.now() - startTime;

  const response = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    latency: totalLatency,
    checks
  };

  // Return 503 if unhealthy, 200 if healthy
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
