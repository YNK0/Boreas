/**
 * API Middleware for Performance Monitoring
 * Automatically tracks API performance for all Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { APIPerformanceMonitor } from './performance-monitor'

export interface APIMiddlewareOptions {
  enablePerformanceTracking?: boolean
  enableErrorTracking?: boolean
  excludeRoutes?: string[]
  slowApiThreshold?: number
}

const defaultOptions: APIMiddlewareOptions = {
  enablePerformanceTracking: true,
  enableErrorTracking: true,
  excludeRoutes: ['/api/health'],
  slowApiThreshold: 2000, // 2 seconds
}

/**
 * Middleware wrapper for API routes to add automatic performance tracking
 */
export function withAnalytics<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  options: APIMiddlewareOptions = {}
) {
  const config = { ...defaultOptions, ...options }

  return async (...args: T): Promise<R> => {
    // Extract route information from arguments
    const route = extractRouteFromArgs(args)
    const method = extractMethodFromArgs(args)

    // Skip tracking for excluded routes
    if (config.excludeRoutes?.includes(route)) {
      return handler(...args)
    }

    if (!config.enablePerformanceTracking) {
      return handler(...args)
    }

    // Use APIPerformanceMonitor to track the call
    const monitor = APIPerformanceMonitor.getInstance()

    return monitor.trackAPICall(route, method, () => handler(...args))
  }
}

/**
 * Next.js API route wrapper
 */
export function withAPIAnalytics(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: APIMiddlewareOptions
) {
  return withAnalytics(handler, options)
}

/**
 * Express-style middleware function (Note: Limited use in Next.js App Router)
 */
export function createAPIMiddleware(options?: APIMiddlewareOptions) {
  const config = { ...defaultOptions, ...options }

  return async (req: NextRequest) => {
    if (!config.enablePerformanceTracking) {
      return
    }

    const startTime = Date.now()
    const route = req.url || 'unknown'
    const method = req.method || 'GET'

    // This is a simplified version for Next.js compatibility
    // Full middleware functionality requires integration at the framework level
    console.log(`API middleware tracking: ${method} ${route}`)
  }
}

/**
 * Higher-order component for API route handlers
 */
export function createMonitoredAPIHandler<T>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>,
  routeName?: string,
  options?: APIMiddlewareOptions
) {
  const config = { ...defaultOptions, ...options }

  return async (req: NextRequest): Promise<NextResponse<T>> => {
    const route = routeName || req.url || 'api-route'
    const method = req.method || 'GET'

    // Skip monitoring for excluded routes
    if (config.excludeRoutes?.includes(route)) {
      return handler(req)
    }

    if (!config.enablePerformanceTracking) {
      return handler(req)
    }

    try {
      const monitor = APIPerformanceMonitor.getInstance()

      return await monitor.trackAPICall(route, method, () => handler(req))
    } catch (error) {
      // Error is already tracked by the monitor
      throw error
    }
  }
}

/**
 * Utility to extract route information from handler arguments
 */
function extractRouteFromArgs(args: any[]): string {
  // Try to extract route from different argument patterns
  if (args[0]?.url) {
    return new URL(args[0].url).pathname
  }

  if (args[0]?.route) {
    return args[0].route
  }

  // Default fallback
  return 'unknown-route'
}

/**
 * Utility to extract HTTP method from handler arguments
 */
function extractMethodFromArgs(args: any[]): string {
  if (args[0]?.method) {
    return args[0].method.toUpperCase()
  }

  // Default to GET
  return 'GET'
}

/**
 * Custom error class for API monitoring
 */
export class APIError extends Error {
  public status: number
  public endpoint: string

  constructor(message: string, status: number, endpoint: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.endpoint = endpoint
  }
}

/**
 * Error handler for monitored APIs
 */
export function handleAPIError(error: any, req: NextRequest): NextResponse {
  const status = error.status || 500
  const message = error.message || 'Internal Server Error'
  const endpoint = req.url || 'unknown'

  // Track the error
  const monitor = APIPerformanceMonitor.getInstance()
  monitor.trackAPICall(endpoint, req.method || 'GET', async () => {
    throw new APIError(message, status, endpoint)
  }).catch(() => {
    // Error already logged
  })

  return NextResponse.json(
    {
      error: message,
      status,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Rate limiting middleware that also tracks performance
 */
export function createRateLimitedHandler<T = any>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (req: NextRequest): Promise<NextResponse<T>> => {
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'

    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }

    // Check current request count
    const current = requests.get(ip) || { count: 0, resetTime: now + windowMs }

    if (current.count >= limit && current.resetTime > now) {
      // Rate limited - track this
      const monitor = APIPerformanceMonitor.getInstance()
      monitor.trackAPICall(req.url || 'rate-limited', req.method || 'GET', async () => {
        throw new APIError('Rate limit exceeded', 429, req.url || 'unknown')
      }).catch(() => {
        // Error already logged
      })

      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: Math.ceil((current.resetTime - now) / 1000) },
        { status: 429, headers: { 'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString() } }
      ) as NextResponse<T>
    }

    // Update request count
    requests.set(ip, { count: current.count + 1, resetTime: current.resetTime })

    // Process the request with monitoring
    return createMonitoredAPIHandler(handler)(req)
  }
}

/**
 * Health check utilities
 */
export const healthCheck = {
  /**
   * Get API performance summary
   */
  getPerformanceSummary: () => {
    const monitor = APIPerformanceMonitor.getInstance()
    return {
      averageResponseTime: monitor.getAverageResponseTime(),
      errorRate: monitor.getErrorRate(),
      requestCount: monitor.getMetrics().length,
      timestamp: new Date().toISOString(),
    }
  },

  /**
   * Check if API performance is healthy
   */
  isHealthy: () => {
    const monitor = APIPerformanceMonitor.getInstance()
    const avgResponseTime = monitor.getAverageResponseTime()
    const errorRate = monitor.getErrorRate()

    return {
      healthy: avgResponseTime < 2000 && errorRate < 5,
      metrics: {
        averageResponseTime: avgResponseTime,
        errorRate: errorRate,
        thresholds: {
          maxResponseTime: 2000,
          maxErrorRate: 5,
        },
      },
    }
  },
}