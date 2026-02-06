'use client'

/**
 * Analytics hooks for Boreas
 * Provides easy-to-use hooks for tracking user interactions
 */

import { useCallback, useEffect, useRef } from 'react'
import { usePostHog } from '@/components/analytics/posthog-provider'
import {
  TRACKING_EVENTS,
  CONVERSION_FUNNEL,
  USER_PROPERTIES,
  BUSINESS_TYPES,
  type TrackingEvent,
  type ConversionStage,
  type UserProperty,
  type BusinessType,
} from '@/lib/analytics/posthog-config'

export interface TrackingProperties {
  [key: string]: any
}

/**
 * Main analytics hook
 */
export function useAnalytics() {
  const { posthog, isReady } = usePostHog()

  const track = useCallback((event: string, properties?: TrackingProperties) => {
    if (!isReady || !posthog) return

    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    })
  }, [posthog, isReady])

  const identify = useCallback((userId: string, properties?: TrackingProperties) => {
    if (!isReady || !posthog) return

    posthog.identify(userId, properties)
  }, [posthog, isReady])

  const alias = useCallback((alias: string) => {
    if (!isReady || !posthog) return

    posthog.alias(alias)
  }, [posthog, isReady])

  const setUserProperties = useCallback((properties: TrackingProperties) => {
    if (!isReady || !posthog) return

    posthog.setPersonProperties(properties)
  }, [posthog, isReady])

  const reset = useCallback(() => {
    if (!isReady || !posthog) return

    posthog.reset()
  }, [posthog, isReady])

  const isFeatureEnabled = useCallback((flag: string): boolean => {
    if (!isReady || !posthog) return false

    return posthog.isFeatureEnabled(flag) || false
  }, [posthog, isReady])

  return {
    track,
    identify,
    alias,
    setUserProperties,
    reset,
    isFeatureEnabled,
    isReady,
  }
}

/**
 * Page view tracking hook
 */
export function usePageTracking() {
  const { track } = useAnalytics()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  useEffect(() => {
    if (!pathname) return

    track(TRACKING_EVENTS.PAGE_VIEW, {
      page: pathname,
      title: document.title,
    })
  }, [pathname, track])
}

/**
 * CTA button tracking hook
 */
export function useCTATracking() {
  const { track } = useAnalytics()

  const trackCTAClick = useCallback((
    type: 'hero' | 'features' | 'pricing' | 'contact',
    label: string,
    position?: string
  ) => {
    const eventMap = {
      hero: TRACKING_EVENTS.HERO_CTA_CLICK,
      features: TRACKING_EVENTS.FEATURES_CTA_CLICK,
      pricing: TRACKING_EVENTS.PRICING_CTA_CLICK,
      contact: TRACKING_EVENTS.CONTACT_FORM_STARTED,
    }

    track(eventMap[type], {
      cta_type: type,
      cta_label: label,
      cta_position: position,
      conversion_stage: getConversionStage(type),
    })
  }, [track])

  const trackPhoneClick = useCallback((source: string) => {
    track(TRACKING_EVENTS.HERO_PHONE_CLICK, {
      source,
      conversion_stage: CONVERSION_FUNNEL.INTENT,
    })
  }, [track])

  return { trackCTAClick, trackPhoneClick }
}

/**
 * Form tracking hook
 */
export function useFormTracking() {
  const { track } = useAnalytics()

  const trackFormStart = useCallback((formType: string, formId?: string) => {
    if (formType === 'contact') {
      track(TRACKING_EVENTS.CONTACT_FORM_STARTED, {
        form_type: formType,
        form_id: formId,
        conversion_stage: CONVERSION_FUNNEL.INTENT,
      })
    } else if (formType === 'lead') {
      track(TRACKING_EVENTS.LEAD_CAPTURE_STARTED, {
        form_type: formType,
        form_id: formId,
        conversion_stage: CONVERSION_FUNNEL.INTEREST,
      })
    }
  }, [track])

  const trackFormSubmit = useCallback((
    formType: string,
    success: boolean,
    formData?: any,
    formId?: string
  ) => {
    const baseProperties = {
      form_type: formType,
      form_id: formId,
      success,
    }

    if (success) {
      if (formType === 'contact') {
        track(TRACKING_EVENTS.CONTACT_FORM_SUBMITTED, {
          ...baseProperties,
          business_type: formData?.businessType,
          message_length: formData?.message?.length || 0,
          conversion_stage: CONVERSION_FUNNEL.EVALUATION,
        })
      } else if (formType === 'lead') {
        track(TRACKING_EVENTS.LEAD_CAPTURE_SUBMITTED, {
          ...baseProperties,
          email_domain: formData?.email?.split('@')[1] || '',
          conversion_stage: CONVERSION_FUNNEL.CONSIDERATION,
        })
      }
    } else {
      track(TRACKING_EVENTS.CONTACT_FORM_ERROR, baseProperties)
    }
  }, [track])

  const trackFieldInteraction = useCallback((
    fieldName: string,
    action: 'focus' | 'blur' | 'change'
  ) => {
    // Only track significant interactions to avoid spam
    if (action === 'focus') {
      track('form_field_focused', {
        field_name: fieldName,
      })
    }
  }, [track])

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction,
  }
}

/**
 * Scroll depth tracking hook
 */
export function useScrollTracking() {
  const { track } = useAnalytics()
  const scrollDepths = useRef<Set<number>>(new Set())
  const timeThresholds = useRef<Set<number>>(new Set())

  useEffect(() => {
    const startTime = Date.now()

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )

      // Track scroll depth milestones
      const depths = [25, 50, 75, 100]
      depths.forEach(depth => {
        if (scrollPercent >= depth && !scrollDepths.current.has(depth)) {
          scrollDepths.current.add(depth)

          const eventMap: Record<number, string> = {
            25: TRACKING_EVENTS.SCROLL_DEPTH_25,
            50: TRACKING_EVENTS.SCROLL_DEPTH_50,
            75: TRACKING_EVENTS.SCROLL_DEPTH_75,
            100: TRACKING_EVENTS.SCROLL_DEPTH_100,
          }

          track(eventMap[depth], {
            scroll_depth: depth,
            time_to_reach: Date.now() - startTime,
          })
        }
      })
    }

    // Track time on page milestones
    const timeTracker = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
      const times = [30, 60, 120]

      times.forEach(time => {
        if (timeOnPage >= time && !timeThresholds.current.has(time)) {
          timeThresholds.current.add(time)

          const eventMap: Record<number, string> = {
            30: TRACKING_EVENTS.TIME_ON_PAGE_30S,
            60: TRACKING_EVENTS.TIME_ON_PAGE_60S,
            120: TRACKING_EVENTS.TIME_ON_PAGE_120S,
          }

          track(eventMap[time], {
            time_on_page: time,
            scroll_depth: Math.round(
              (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            ),
          })
        }
      })
    }, 1000)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeTracker)
    }
  }, [track])

  return null // This hook doesn't return anything, it just tracks
}

/**
 * Business type tracking hook for B2B segmentation
 */
export function useBusinessTypeTracking() {
  const { track, setUserProperties } = useAnalytics()

  const setBusinessType = useCallback((businessType: BusinessType) => {
    setUserProperties({
      [USER_PROPERTIES.BUSINESS_TYPE]: businessType,
    })

    track(TRACKING_EVENTS.BUSINESS_TYPE_SELECTED, {
      business_type: businessType,
      conversion_stage: CONVERSION_FUNNEL.INTEREST,
    })
  }, [track, setUserProperties])

  const trackBusinessInfo = useCallback((info: {
    size?: string
    currentSolution?: string
    painPoints?: string[]
    budget?: string
    timeline?: string
  }) => {
    setUserProperties({
      [USER_PROPERTIES.BUSINESS_SIZE]: info.size,
      [USER_PROPERTIES.CURRENT_SOLUTION]: info.currentSolution,
      [USER_PROPERTIES.PAIN_POINTS]: info.painPoints?.join(', '),
      [USER_PROPERTIES.BUDGET_RANGE]: info.budget,
      [USER_PROPERTIES.DECISION_TIMELINE]: info.timeline,
    })
  }, [setUserProperties])

  return { setBusinessType, trackBusinessInfo }
}

/**
 * Navigation tracking hook
 */
export function useNavigationTracking() {
  const { track } = useAnalytics()

  const trackNavClick = useCallback((
    linkText: string,
    destination: string,
    location: 'navbar' | 'footer'
  ) => {
    const event = location === 'navbar'
      ? TRACKING_EVENTS.NAVBAR_LINK_CLICKED
      : TRACKING_EVENTS.FOOTER_LINK_CLICKED

    track(event, {
      link_text: linkText,
      destination,
      location,
    })
  }, [track])

  return { trackNavClick }
}

/**
 * Performance tracking hook
 */
export function usePerformanceTracking() {
  const { track } = useAnalytics()

  const trackAPIError = useCallback((
    endpoint: string,
    error: any,
    responseTime?: number
  ) => {
    track(TRACKING_EVENTS.API_ERROR, {
      endpoint,
      error_message: error.message || 'Unknown error',
      error_type: error.name || 'Error',
      response_time: responseTime,
      status_code: error.status,
    })
  }, [track])

  const trackPerformanceIssue = useCallback((
    metric: string,
    value: number,
    threshold: number
  ) => {
    track(TRACKING_EVENTS.PERFORMANCE_ISSUE, {
      metric,
      value,
      threshold,
      severity: value > threshold * 2 ? 'high' : 'medium',
    })
  }, [track])

  return { trackAPIError, trackPerformanceIssue }
}

/**
 * Helper function to determine conversion stage based on action
 */
function getConversionStage(actionType: string): string {
  const stageMap: Record<string, string> = {
    hero: CONVERSION_FUNNEL.AWARENESS,
    features: CONVERSION_FUNNEL.INTEREST,
    pricing: CONVERSION_FUNNEL.CONSIDERATION,
    contact: CONVERSION_FUNNEL.INTENT,
    demo: CONVERSION_FUNNEL.EVALUATION,
  }

  return stageMap[actionType] || CONVERSION_FUNNEL.AWARENESS
}