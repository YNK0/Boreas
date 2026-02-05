/**
 * Performance Monitoring Utilities for Boreas
 * Comprehensive performance tracking and alerting system
 */

import { PERFORMANCE_THRESHOLDS, TRACKING_EVENTS } from './posthog-config'
import { getServerPostHog } from './posthog-config'

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  threshold: number
  timestamp: string
  url: string
  userAgent?: string
  connectionType?: string
}

export interface APIPerformanceData {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  success: boolean
  errorMessage?: string
  timestamp: string
}

/**
 * Client-side performance monitor
 */
export class ClientPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private observers: PerformanceObserver[] = []

  constructor(private trackingCallback?: (metric: PerformanceMetric) => void) {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Navigation timing observer
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processNavigationEntry(entry as PerformanceNavigationTiming)
          }
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)

        // Resource timing observer (for monitoring API calls)
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processResourceEntry(entry as PerformanceResourceTiming)
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)

        // Paint timing observer
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processPaintEntry(entry)
          }
        })
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.push(paintObserver)

        // Layout shift observer
        const layoutObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processLayoutShiftEntry(entry)
          }
        })
        layoutObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(layoutObserver)

      } catch (error) {
        console.warn('Failed to initialize performance observers:', error)
      }
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming) {
    // DNS lookup time
    const dnsTime = entry.domainLookupEnd - entry.domainLookupStart
    this.recordMetric('dns_lookup', dnsTime, PERFORMANCE_THRESHOLDS.API_RESPONSE_GOOD)

    // Connection time
    const connectionTime = entry.connectEnd - entry.connectStart
    this.recordMetric('connection_time', connectionTime, PERFORMANCE_THRESHOLDS.API_RESPONSE_GOOD)

    // Time to First Byte
    const ttfb = entry.responseStart - entry.requestStart
    this.recordMetric('ttfb', ttfb, 800)

    // DOM content loaded
    const domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart
    this.recordMetric('dom_content_loaded', domContentLoaded, PERFORMANCE_THRESHOLDS.PAGE_LOAD_GOOD)

    // Full page load
    const pageLoad = entry.loadEventEnd - entry.loadEventStart
    this.recordMetric('page_load', pageLoad, PERFORMANCE_THRESHOLDS.PAGE_LOAD_GOOD)
  }

  private processResourceEntry(entry: PerformanceResourceTiming) {
    // Monitor API calls (fetch requests to our API)
    if (entry.name.includes('/api/') && entry.responseEnd > 0) {
      const responseTime = entry.responseEnd - entry.requestStart

      this.recordMetric('api_response', responseTime, PERFORMANCE_THRESHOLDS.API_RESPONSE_GOOD, {
        endpoint: entry.name,
      })

      // Check for slow API calls
      if (responseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE_POOR) {
        this.trackingCallback?.({
          name: 'slow_api_call',
          value: responseTime,
          rating: 'poor',
          threshold: PERFORMANCE_THRESHOLDS.API_RESPONSE_POOR,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
        })
      }
    }

    // Monitor large resource downloads
    if (entry.transferSize > 1024 * 1024) { // > 1MB
      this.recordMetric('large_resource', entry.transferSize, 1024 * 1024, {
        resource_url: entry.name,
        resource_type: this.getResourceType(entry.name),
      })
    }
  }

  private processPaintEntry(entry: PerformanceEntry) {
    if (entry.name === 'first-contentful-paint') {
      this.recordMetric('fcp', entry.startTime, 1800)
    } else if (entry.name === 'first-paint') {
      this.recordMetric('fp', entry.startTime, 1000)
    }
  }

  private processLayoutShiftEntry(entry: any) {
    // Cumulative Layout Shift tracking
    if (entry.value > 0) {
      this.recordMetric('cls_individual', entry.value, PERFORMANCE_THRESHOLDS.CLS_GOOD)
    }
  }

  private recordMetric(
    name: string,
    value: number,
    threshold: number,
    additionalData?: Record<string, any>
  ) {
    const rating = this.getRating(value, threshold, name)
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      threshold,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      connectionType: (navigator as any)?.connection?.effectiveType,
      ...additionalData,
    }

    this.metrics.set(name, metric)
    this.trackingCallback?.(metric)

    // Alert for poor performance
    if (rating === 'poor') {
      this.handlePerformanceAlert(metric)
    }
  }

  private getRating(value: number, threshold: number, metricName: string): 'good' | 'needs-improvement' | 'poor' {
    // Special handling for CLS (lower is better)
    if (metricName.includes('cls')) {
      if (value <= PERFORMANCE_THRESHOLDS.CLS_GOOD) return 'good'
      if (value <= PERFORMANCE_THRESHOLDS.CLS_POOR) return 'needs-improvement'
      return 'poor'
    }

    // For time-based metrics (lower is better)
    if (value <= threshold) return 'good'
    if (value <= threshold * 1.5) return 'needs-improvement'
    return 'poor'
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript'
    if (url.includes('.css')) return 'stylesheet'
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) return 'image'
    if (url.includes('/api/')) return 'api'
    return 'other'
  }

  private handlePerformanceAlert(metric: PerformanceMetric) {
    console.warn('Performance alert:', metric)

    // Send to PostHog
    this.trackingCallback?.({
      ...metric,
      name: TRACKING_EVENTS.PERFORMANCE_ISSUE,
    })
  }

  public getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  public getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name)
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

/**
 * API Performance Monitor for server-side tracking
 */
export class APIPerformanceMonitor {
  private static instance: APIPerformanceMonitor
  private metrics: APIPerformanceData[] = []

  static getInstance(): APIPerformanceMonitor {
    if (!APIPerformanceMonitor.instance) {
      APIPerformanceMonitor.instance = new APIPerformanceMonitor()
    }
    return APIPerformanceMonitor.instance
  }

  public async trackAPICall<T>(
    endpoint: string,
    method: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()
    let statusCode = 200
    let success = true
    let errorMessage: string | undefined

    try {
      const result = await apiCall()
      return result
    } catch (error: any) {
      success = false
      statusCode = error.status || 500
      errorMessage = error.message || 'Unknown error'
      throw error
    } finally {
      const responseTime = Date.now() - startTime

      const performanceData: APIPerformanceData = {
        endpoint,
        method,
        responseTime,
        statusCode,
        success,
        errorMessage,
        timestamp: new Date().toISOString(),
      }

      this.recordAPIMetric(performanceData)
    }
  }

  private recordAPIMetric(data: APIPerformanceData) {
    this.metrics.push(data)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Track to PostHog if configured
    try {
      const serverPostHog = getServerPostHog()
      if (serverPostHog) {
        serverPostHog.capture({
          distinctId: 'server',
          event: 'api_performance',
          properties: {
            ...data,
            rating: this.getAPIRating(data.responseTime),
          },
        })

        // Track errors separately
        if (!data.success) {
          serverPostHog.capture({
            distinctId: 'server',
            event: TRACKING_EVENTS.API_ERROR,
            properties: data,
          })
        }

        // Track slow APIs
        if (data.responseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE_POOR) {
          serverPostHog.capture({
            distinctId: 'server',
            event: TRACKING_EVENTS.PERFORMANCE_ISSUE,
            properties: {
              ...data,
              metric: 'api_response_time',
              threshold: PERFORMANCE_THRESHOLDS.API_RESPONSE_POOR,
            },
          })
        }
      }
    } catch (error) {
      console.error('Failed to track API performance to PostHog:', error)
    }
  }

  private getAPIRating(responseTime: number): 'good' | 'needs-improvement' | 'poor' {
    if (responseTime <= PERFORMANCE_THRESHOLDS.API_RESPONSE_GOOD) return 'good'
    if (responseTime <= PERFORMANCE_THRESHOLDS.API_RESPONSE_POOR) return 'needs-improvement'
    return 'poor'
  }

  public getMetrics(): APIPerformanceData[] {
    return [...this.metrics]
  }

  public getAverageResponseTime(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? this.metrics.filter(m => m.endpoint.includes(endpoint))
      : this.metrics

    if (relevantMetrics.length === 0) return 0

    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.responseTime, 0)
    return sum / relevantMetrics.length
  }

  public getErrorRate(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? this.metrics.filter(m => m.endpoint.includes(endpoint))
      : this.metrics

    if (relevantMetrics.length === 0) return 0

    const errorCount = relevantMetrics.filter(m => !m.success).length
    return (errorCount / relevantMetrics.length) * 100
  }
}

/**
 * Utility functions for performance monitoring
 */
export const performanceUtils = {
  // Monitor a specific function's performance
  monitorFunction: <T extends any[], R>(
    fn: (...args: T) => R,
    functionName: string
  ) => {
    return (...args: T): R => {
      const startTime = performance.now()

      try {
        const result = fn(...args)

        // If it's a promise, monitor async completion
        if (result instanceof Promise) {
          result.finally(() => {
            const endTime = performance.now()
            performanceUtils.recordCustomMetric(
              `function_${functionName}`,
              endTime - startTime
            )
          })
        } else {
          const endTime = performance.now()
          performanceUtils.recordCustomMetric(
            `function_${functionName}`,
            endTime - startTime
          )
        }

        return result
      } catch (error) {
        const endTime = performance.now()
        performanceUtils.recordCustomMetric(
          `function_${functionName}_error`,
          endTime - startTime
        )
        throw error
      }
    }
  },

  // Record a custom performance metric
  recordCustomMetric: (name: string, value: number, unit: 'ms' | 'bytes' | 'count' = 'ms') => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('custom_performance_metric', {
        metric_name: name,
        value,
        unit,
        url: window.location.pathname,
        timestamp: new Date().toISOString(),
      })
    }
  },

  // Check if current performance is within acceptable limits
  isPerformanceHealthy: (): boolean => {
    if (typeof window === 'undefined') return true

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return true

    const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
    const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

    return (
      pageLoadTime <= PERFORMANCE_THRESHOLDS.PAGE_LOAD_GOOD &&
      domContentLoadedTime <= PERFORMANCE_THRESHOLDS.PAGE_LOAD_GOOD
    )
  },

  // Get current page performance summary
  getPagePerformanceSummary: () => {
    if (typeof window === 'undefined') return null

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return null

    return {
      pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstByte: navigation.responseStart - navigation.requestStart,
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      connection: navigation.connectEnd - navigation.connectStart,
    }
  },
}