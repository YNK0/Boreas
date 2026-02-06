'use client'

/**
 * Tracking Components for Boreas
 * Reusable components that automatically track user interactions
 */

import React, { forwardRef, useEffect } from 'react'
import {
  useCTATracking,
  useFormTracking,
  useNavigationTracking,
  useScrollTracking,
  useAnalytics,
} from '@/hooks/use-analytics'
import { TRACKING_EVENTS } from '@/lib/analytics/posthog-config'

// Track scroll depth and time on page automatically
export function ScrollTracker() {
  useScrollTracking()
  return null
}

// Trackable button component
interface TrackableCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingType: 'hero' | 'features' | 'pricing' | 'contact' | 'dashboard'
  label: string
  position?: string
  children: React.ReactNode
}

export const TrackableCTA = forwardRef<HTMLButtonElement, TrackableCTAProps>(
  ({ trackingType, label, position, onClick, children, ...props }, ref) => {
    const { trackCTAClick } = useCTATracking()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      trackCTAClick(trackingType, label, position)
      onClick?.(event)
    }

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)

TrackableCTA.displayName = 'TrackableCTA'

// Trackable link component
interface TrackableLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  location?: 'navbar' | 'footer'
  children: React.ReactNode
}

export const TrackableLink = forwardRef<HTMLAnchorElement, TrackableLinkProps>(
  ({ location = 'navbar', onClick, children, href, ...props }, ref) => {
    const { trackNavClick } = useNavigationTracking()

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const linkText = typeof children === 'string' ? children : href || 'Unknown'
      trackNavClick(linkText, href || '', location)
      onClick?.(event)
    }

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    )
  }
)

TrackableLink.displayName = 'TrackableLink'

// Phone number tracking component
interface TrackablePhoneProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  source: string
  phoneNumber: string
  children: React.ReactNode
}

export const TrackablePhone = forwardRef<HTMLAnchorElement, TrackablePhoneProps>(
  ({ source, phoneNumber, onClick, children, ...props }, ref) => {
    const { trackPhoneClick } = useCTATracking()

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      trackPhoneClick(source)
      onClick?.(event)
    }

    return (
      <a
        ref={ref}
        href={`tel:${phoneNumber}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    )
  }
)

TrackablePhone.displayName = 'TrackablePhone'

// Form wrapper with automatic tracking
interface TrackableFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formType: 'contact' | 'lead'
  formId?: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export const TrackableForm = forwardRef<HTMLFormElement, TrackableFormProps>(
  ({ formType, formId, onSubmit, children, ...props }, ref) => {
    const { trackFormStart, trackFormSubmit } = useFormTracking()

    useEffect(() => {
      // Track form start when component mounts and becomes visible
      const timer = setTimeout(() => {
        trackFormStart(formType, formId)
      }, 1000) // Delay to ensure user is actually engaging

      return () => clearTimeout(timer)
    }, [formType, formId, trackFormStart])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      // Note: Actual success/failure tracking should be done in the form's submit handler
      // This just tracks the submission attempt
      onSubmit?.(event)
    }

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    )
  }
)

TrackableForm.displayName = 'TrackableForm'

// Input field with interaction tracking
interface TrackableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string
}

export const TrackableInput = forwardRef<HTMLInputElement, TrackableInputProps>(
  ({ fieldName, onFocus, onBlur, onChange, ...props }, ref) => {
    const { trackFieldInteraction } = useFormTracking()

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      trackFieldInteraction(fieldName, 'focus')
      onFocus?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      trackFieldInteraction(fieldName, 'blur')
      onBlur?.(event)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Only track significant changes (not every keystroke)
      if (event.target.value.length === 1 || event.target.value.length % 10 === 0) {
        trackFieldInteraction(fieldName, 'change')
      }
      onChange?.(event)
    }

    return (
      <input
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

TrackableInput.displayName = 'TrackableInput'

// Section view tracker (for tracking when sections become visible)
interface SectionTrackerProps {
  sectionName: string
  children: React.ReactNode
  threshold?: number
}

export function SectionTracker({ sectionName, children, threshold = 0.5 }: SectionTrackerProps) {
  const { track } = useAnalytics()
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Track section view
            track('section_viewed', {
              section_name: sectionName,
              intersection_ratio: entry.intersectionRatio,
              scroll_y: window.scrollY,
            })

            // Special tracking for specific sections
            if (sectionName === 'case-studies') {
              track(TRACKING_EVENTS.CASE_STUDY_VIEWED, {
                section: sectionName,
              })
            } else if (sectionName === 'testimonials') {
              track(TRACKING_EVENTS.TESTIMONIAL_VIEWED, {
                section: sectionName,
              })
            } else if (sectionName === 'features') {
              track(TRACKING_EVENTS.FEATURE_VIEWED, {
                section: sectionName,
              })
            } else if (sectionName === 'pricing') {
              track(TRACKING_EVENTS.PRICING_VIEWED, {
                section: sectionName,
              })
            }

            // Unobserve after first view to avoid duplicate tracking
            observer.unobserve(element)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px', // Only trigger when section is well into view
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [sectionName, track, threshold])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}

// Video tracking component
interface TrackableVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  videoName: string
  source: string
}

export const TrackableVideo = forwardRef<HTMLVideoElement, TrackableVideoProps>(
  ({ videoName, source, onPlay, onPause, onEnded, onLoadedData, ...props }, ref) => {
    const { track } = useAnalytics()

    const handlePlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      track('video_played', {
        video_name: videoName,
        source,
        current_time: event.currentTarget.currentTime,
      })
      onPlay?.(event)
    }

    const handlePause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      track('video_paused', {
        video_name: videoName,
        source,
        current_time: event.currentTarget.currentTime,
        duration: event.currentTarget.duration,
        completion_percentage: (event.currentTarget.currentTime / event.currentTarget.duration) * 100,
      })
      onPause?.(event)
    }

    const handleEnded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      track('video_completed', {
        video_name: videoName,
        source,
        duration: event.currentTarget.duration,
      })
      onEnded?.(event)
    }

    const handleLoadedData = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      track('video_loaded', {
        video_name: videoName,
        source,
        duration: event.currentTarget.duration,
      })
      onLoadedData?.(event)
    }

    return (
      <video
        ref={ref}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedData={handleLoadedData}
        {...props}
      />
    )
  }
)

TrackableVideo.displayName = 'TrackableVideo'

// Error boundary with tracking
interface AnalyticsErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class AnalyticsErrorBoundary extends React.Component<
  AnalyticsErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track the error
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('react_error_boundary', {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        error_boundary: 'AnalyticsErrorBoundary',
      })
    }

    console.error('AnalyticsErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      return Fallback ? <Fallback error={this.state.error!} /> : (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Algo salió mal
          </h2>
          <p className="text-gray-600 mt-2">
            Por favor recarga la página o contacta soporte si el problema persiste.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}