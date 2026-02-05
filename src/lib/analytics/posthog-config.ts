/**
 * PostHog Analytics Configuration for Boreas
 * B2B automation platform analytics setup
 */

import posthog from 'posthog-js'

// PostHog configuration
export const POSTHOG_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  uiHost: 'https://us.posthog.com',
  serverKey: process.env.POSTHOG_PROJECT_API_KEY || '',
}

// Client-side PostHog configuration options
export const POSTHOG_CLIENT_OPTIONS = {
  api_host: POSTHOG_CONFIG.apiHost,
  ui_host: POSTHOG_CONFIG.uiHost,
  person_profiles: 'identified_only' as const,
  capture_pageview: false, // We'll manually capture pageviews
  capture_pageleave: true, // Track when users leave pages
  disable_session_recording: false, // Enable session recordings

  // GDPR compliance
  opt_out_capturing_by_default: false,
  respect_dnt: true,

  // Performance optimizations
  loaded: (posthog: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PostHog loaded successfully')
    }
  },

  // Advanced tracking options
  property_denylist: [
    // Exclude sensitive data
    '$password',
    '$email',
    '$phone'
  ],

  // Enable advanced features
  capture_performance: true,
  enable_recording_console_log: true,
  mask_all_element_attributes: false,
  mask_all_text: false,

  // Session replay configuration
  session_recording: {
    maskAllInputs: true,
    maskInputOptions: {
      password: true,
      email: false,
      tel: true,
    },
    maskInputFn: (text: string, element: HTMLElement | null) => {
      // Custom masking logic for sensitive fields
      if (element?.getAttribute('data-sensitive')) {
        return '*'.repeat(text.length)
      }
      return text
    },
  },
}

// Server-side PostHog instance (only for server-side usage)
// Note: Server-side PostHog should be imported dynamically only in server contexts
export const getServerPostHog = async () => {
  // Only import on server side
  if (typeof window !== 'undefined') {
    throw new Error('getServerPostHog should only be called on the server side')
  }

  const { PostHog } = await import('posthog-node')

  if (!POSTHOG_CONFIG.serverKey) {
    throw new Error('PostHog server key not configured')
  }

  return new PostHog(
    POSTHOG_CONFIG.serverKey,
    {
      host: POSTHOG_CONFIG.apiHost,
    }
  )
}

// Feature flags configuration
export const FEATURE_FLAGS = {
  NEW_HERO_DESIGN: 'new-hero-design',
  A_B_TEST_PRICING: 'ab-test-pricing',
  MOBILE_OPTIMIZATION: 'mobile-optimization',
  ADVANCED_ANALYTICS: 'advanced-analytics',
} as const

// Event tracking configuration
export const TRACKING_EVENTS = {
  // Page tracking
  PAGE_VIEW: '$pageview',
  PAGE_LEAVE: '$pageleave',

  // User actions - Hero section
  HERO_CTA_CLICK: 'hero_cta_clicked',
  HERO_SECONDARY_CTA_CLICK: 'hero_secondary_cta_clicked',
  HERO_PHONE_CLICK: 'hero_phone_clicked',

  // User actions - Features
  FEATURE_VIEWED: 'feature_viewed',
  FEATURES_CTA_CLICK: 'features_cta_clicked',

  // User actions - Pricing
  PRICING_VIEWED: 'pricing_viewed',
  PRICING_CTA_CLICK: 'pricing_cta_clicked',

  // User actions - Forms
  CONTACT_FORM_STARTED: 'contact_form_started',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  CONTACT_FORM_ERROR: 'contact_form_error',
  LEAD_CAPTURE_STARTED: 'lead_capture_started',
  LEAD_CAPTURE_SUBMITTED: 'lead_capture_submitted',

  // Engagement
  SCROLL_DEPTH_25: 'scroll_depth_25',
  SCROLL_DEPTH_50: 'scroll_depth_50',
  SCROLL_DEPTH_75: 'scroll_depth_75',
  SCROLL_DEPTH_100: 'scroll_depth_100',
  TIME_ON_PAGE_30S: 'time_on_page_30s',
  TIME_ON_PAGE_60S: 'time_on_page_60s',
  TIME_ON_PAGE_120S: 'time_on_page_120s',

  // Case studies & testimonials
  CASE_STUDY_VIEWED: 'case_study_viewed',
  TESTIMONIAL_VIEWED: 'testimonial_viewed',

  // Navigation
  NAVBAR_LINK_CLICKED: 'navbar_link_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',

  // B2B specific events
  DEMO_REQUESTED: 'demo_requested',
  CONSULTATION_SCHEDULED: 'consultation_scheduled',
  BUSINESS_TYPE_SELECTED: 'business_type_selected',

  // Performance events
  PERFORMANCE_ISSUE: 'performance_issue',
  API_ERROR: 'api_error',
  FORM_VALIDATION_ERROR: 'form_validation_error',
} as const

// Conversion funnel stages
export const CONVERSION_FUNNEL = {
  AWARENESS: 'awareness', // Landing page visit
  INTEREST: 'interest',   // Feature exploration, scroll depth
  CONSIDERATION: 'consideration', // Case studies, testimonials
  INTENT: 'intent',      // Contact form start, demo request
  EVALUATION: 'evaluation', // Form completion, consultation
  PURCHASE: 'purchase',  // Deal closed (tracked via CRM integration)
} as const

// User properties for segmentation
export const USER_PROPERTIES = {
  BUSINESS_TYPE: 'business_type',
  BUSINESS_SIZE: 'business_size',
  CURRENT_SOLUTION: 'current_solution',
  PAIN_POINTS: 'pain_points',
  BUDGET_RANGE: 'budget_range',
  DECISION_TIMELINE: 'decision_timeline',
  ROLE: 'role',
  REFERRAL_SOURCE: 'referral_source',
  DEVICE_TYPE: 'device_type',
  PREFERRED_LANGUAGE: 'preferred_language',
} as const

// Business types for B2B segmentation
export const BUSINESS_TYPES = {
  SALON: 'salon',
  RESTAURANT: 'restaurant',
  CLINIC: 'clinic',
  RETAIL: 'retail',
  SERVICES: 'services',
  OTHER: 'other',
} as const

// Performance thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals thresholds
  LCP_GOOD: 2500,     // Largest Contentful Paint (ms)
  LCP_POOR: 4000,
  FID_GOOD: 100,      // First Input Delay (ms)
  FID_POOR: 300,
  CLS_GOOD: 0.1,      // Cumulative Layout Shift
  CLS_POOR: 0.25,

  // Custom thresholds
  PAGE_LOAD_GOOD: 3000,    // Total page load time
  PAGE_LOAD_POOR: 5000,
  API_RESPONSE_GOOD: 500,  // API response time
  API_RESPONSE_POOR: 2000,

  // Engagement thresholds
  BOUNCE_RATE_GOOD: 40,    // Percentage
  SESSION_DURATION_GOOD: 120, // Seconds
} as const

// Check if PostHog is properly configured
export const isPostHogConfigured = (): boolean => {
  return Boolean(POSTHOG_CONFIG.apiKey && POSTHOG_CONFIG.apiHost)
}

// Check if we're in development environment
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

// Export types for TypeScript
export type TrackingEvent = keyof typeof TRACKING_EVENTS
export type ConversionStage = keyof typeof CONVERSION_FUNNEL
export type UserProperty = keyof typeof USER_PROPERTIES
export type BusinessType = keyof typeof BUSINESS_TYPES