import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/analytics/api-middleware';

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Get performance metrics
    const performanceSummary = healthCheck.getPerformanceSummary();
    const isApiHealthy = healthCheck.isHealthy();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
      environment: process.env.VERCEL_ENV || 'development',
      checks: {
        environment: 'configured',
        build: 'successful',
        analytics: process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'configured' : 'not_configured'
      },
      performance: performanceSummary,
      apiHealth: isApiHealthy
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        environment: 'failed',
        build: 'check_logs'
      }
    }, { status: 503 });
  }
}