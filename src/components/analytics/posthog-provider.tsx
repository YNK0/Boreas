'use client'

/**
 * PostHog Analytics Provider for Boreas
 * Handles client-side analytics initialization and context
 */

import { createContext, useContext, useEffect, useState } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogReactProvider } from 'posthog-js/react'
import {
  POSTHOG_CONFIG,
  POSTHOG_CLIENT_OPTIONS,
  isPostHogConfigured,
  isDevelopment
} from '@/lib/analytics/posthog-config'

interface PostHogContextType {
  isReady: boolean
  posthog: typeof posthog | null
}

const PostHogContext = createContext<PostHogContextType>({
  isReady: false,
  posthog: null,
})

export const usePostHog = () => {
  const context = useContext(PostHogContext)
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider')
  }
  return context
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if PostHog is configured and we're in the browser
    if (typeof window === 'undefined' || !isPostHogConfigured()) {
      if (isDevelopment()) {
        console.warn('PostHog not configured properly. Set NEXT_PUBLIC_POSTHOG_KEY environment variable.')
      }
      return
    }

    // Initialize PostHog if not already initialized
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_CONFIG.apiKey, POSTHOG_CLIENT_OPTIONS)
    }

    // Set ready state
    setIsReady(true)

    // Track initial page view
    posthog.capture('$pageview')

    // Set up performance monitoring
    setupPerformanceMonitoring()

    // GDPR compliance setup
    setupGDPRCompliance()

    return () => {
      // Cleanup on unmount
      if (posthog.__loaded) {
        posthog.reset()
      }
    }
  }, [])

  const contextValue: PostHogContextType = {
    isReady,
    posthog: isReady ? posthog : null,
  }

  // If PostHog is not configured, render children without analytics
  if (!isPostHogConfigured()) {
    return <>{children}</>
  }

  return (
    <PostHogContext.Provider value={contextValue}>
      <PostHogReactProvider client={posthog}>
        {children}
      </PostHogReactProvider>
    </PostHogContext.Provider>
  )
}

/**
 * Set up performance monitoring for Core Web Vitals
 */
function setupPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor Core Web Vitals
  import('web-vitals').then((webVitals) => {
    const { getCLS, getFID, getLCP, getFCP, getTTFB } = webVitals as any;
    // Largest Contentful Paint
    getLCP((metric) => {
      posthog.capture('performance_metric', {
        metric_name: 'LCP',
        value: metric.value,
        rating: getRating(metric.value, 'LCP'),
        url: window.location.pathname,
      })
    })

    // First Input Delay
    getFID((metric) => {
      posthog.capture('performance_metric', {
        metric_name: 'FID',
        value: metric.value,
        rating: getRating(metric.value, 'FID'),
        url: window.location.pathname,
      })
    })

    // Cumulative Layout Shift
    getCLS((metric) => {
      posthog.capture('performance_metric', {
        metric_name: 'CLS',
        value: metric.value,
        rating: getRating(metric.value, 'CLS'),
        url: window.location.pathname,
      })
    })

    // First Contentful Paint
    getFCP((metric) => {
      posthog.capture('performance_metric', {
        metric_name: 'FCP',
        value: metric.value,
        rating: getRating(metric.value, 'FCP'),
        url: window.location.pathname,
      })
    })

    // Time to First Byte
    getTTFB((metric) => {
      posthog.capture('performance_metric', {
        metric_name: 'TTFB',
        value: metric.value,
        rating: getRating(metric.value, 'TTFB'),
        url: window.location.pathname,
      })
    })
  }).catch((error) => {
    if (isDevelopment()) {
      console.warn('Failed to load web-vitals library:', error)
    }
  })

  // Monitor page load time
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart

      posthog.capture('performance_metric', {
        metric_name: 'page_load_time',
        value: pageLoadTime,
        rating: getRating(pageLoadTime, 'PAGE_LOAD'),
        url: window.location.pathname,
        connection_type: (navigator as any)?.connection?.effectiveType || 'unknown',
      })
    }
  })

  // Monitor unhandled errors
  window.addEventListener('error', (event) => {
    posthog.capture('javascript_error', {
      error_message: event.message,
      error_source: event.filename,
      error_line: event.lineno,
      error_column: event.colno,
      url: window.location.pathname,
      user_agent: navigator.userAgent,
    })
  })

  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    posthog.capture('promise_rejection', {
      error_message: event.reason?.toString() || 'Unknown promise rejection',
      url: window.location.pathname,
    })
  })
}

/**
 * Set up GDPR compliance features
 */
function setupGDPRCompliance() {
  // Check for DNT (Do Not Track) header
  if (navigator.doNotTrack === '1') {
    posthog.opt_out_capturing()
    return
  }

  // Check for stored consent preferences
  const consent = localStorage.getItem('analytics-consent')
  if (consent === 'false') {
    posthog.opt_out_capturing()
  } else if (consent === 'true') {
    posthog.opt_in_capturing()
  }

  // Set up consent management
  window.addEventListener('analytics-consent-changed', (event: any) => {
    const { consent } = event.detail
    if (consent) {
      posthog.opt_in_capturing()
      localStorage.setItem('analytics-consent', 'true')
    } else {
      posthog.opt_out_capturing()
      localStorage.setItem('analytics-consent', 'false')
    }
  })
}

/**
 * Get performance rating based on thresholds
 */
function getRating(value: number, metric: string): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
    PAGE_LOAD: { good: 3000, poor: 5000 },
  } as const

  type MetricKey = keyof typeof thresholds
  const threshold = thresholds[metric as MetricKey]

  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Consent banner component
 */
export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent')
    if (consent === null) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('analytics-consent', 'true')
    window.dispatchEvent(new CustomEvent('analytics-consent-changed', { detail: { consent: true } }))
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('analytics-consent', 'false')
    window.dispatchEvent(new CustomEvent('analytics-consent-changed', { detail: { consent: false } }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            Usamos cookies y análisis para mejorar tu experiencia.
            <a href="/privacy" className="underline hover:no-underline ml-1">
              Ver política de privacidad
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-gray-600 hover:border-gray-500 rounded-md transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}