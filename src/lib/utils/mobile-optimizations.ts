/**
 * Mobile Optimization Utilities for Boreas
 * Performance and UX optimizations specifically for mobile devices
 */

import React from 'react'

// Detect if user is on mobile device
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'iphone', 'ipod', 'android', 'blackberry', 'opera mini', 'iemobile', 'mobile safari']

  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         window.innerWidth <= 768
}

// Touch event utilities
export function addTouchFeedback(element: HTMLElement) {
  if (!element) return

  element.addEventListener('touchstart', () => {
    element.style.transform = 'scale(0.98)'
    element.style.transition = 'transform 0.1s ease'
  }, { passive: true })

  element.addEventListener('touchend', () => {
    element.style.transform = 'scale(1)'
  }, { passive: true })

  element.addEventListener('touchcancel', () => {
    element.style.transform = 'scale(1)'
  }, { passive: true })
}

// Optimize images for mobile
export function optimizeImageForMobile(
  src: string,
  sizes: { mobile: number, tablet: number, desktop: number }
): string {
  if (typeof window === 'undefined') return src

  const devicePixelRatio = window.devicePixelRatio || 1
  const screenWidth = window.innerWidth

  let targetSize = sizes.mobile
  if (screenWidth >= 1024) targetSize = sizes.desktop
  else if (screenWidth >= 768) targetSize = sizes.tablet

  const optimizedSize = Math.round(targetSize * devicePixelRatio)

  // Add image optimization parameters (would work with a service like Cloudinary)
  return `${src}?w=${optimizedSize}&f_auto&q_auto&dpr_${devicePixelRatio}`
}

// Lazy loading utility
export function setupLazyLoading(selector: string = 'img[data-lazy]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  const images = document.querySelectorAll(selector)

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.lazy) {
          img.src = img.dataset.lazy
          img.removeAttribute('data-lazy')
          imageObserver.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px 0px' // Start loading 50px before image comes into view
  })

  images.forEach(img => imageObserver.observe(img))
}

// Smooth scrolling for anchor links
export function enableSmoothScrolling() {
  if (typeof window === 'undefined') return

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href')!)
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

// Viewport height fix for mobile browsers
export function fixMobileViewportHeight() {
  if (typeof window === 'undefined') return

  function setViewportHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  setViewportHeight()
  window.addEventListener('resize', setViewportHeight)
  window.addEventListener('orientationchange', setViewportHeight)
}

// Prevent zoom on input focus (iOS Safari)
export function preventZoomOnInputFocus() {
  if (typeof window === 'undefined') return

  const viewport = document.querySelector('meta[name=viewport]')
  if (viewport) {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select')

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        viewport.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1')
      }, { passive: true })

      input.addEventListener('blur', () => {
        viewport.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=5')
      }, { passive: true })
    })
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  const criticalResources = [
    // Add your critical fonts, images, etc.
    '/fonts/inter-var.woff2',
    '/images/logo.svg'
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource

    if (resource.includes('.woff')) {
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
    } else if (resource.includes('.svg') || resource.includes('.png') || resource.includes('.jpg')) {
      link.as = 'image'
    }

    document.head.appendChild(link)
  })
}

// Optimize touch scrolling
export function optimizeTouchScrolling() {
  if (typeof window === 'undefined') return

  // Add momentum scrolling for iOS
  document.body.style.webkitOverflowScrolling = 'touch'

  // Optimize scroll containers
  const scrollContainers = document.querySelectorAll('.mobile-carousel, .overflow-auto')
  scrollContainers.forEach(container => {
    const element = container as HTMLElement
    element.style.webkitOverflowScrolling = 'touch'
    element.style.scrollBehavior = 'smooth'
  })
}

// Reduce animations on low-end devices
export function adaptAnimationsForDevice() {
  if (typeof window === 'undefined') return

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Check for low-end device indicators
  const lowEndDevice = (
    navigator.hardwareConcurrency <= 2 || // 2 or fewer CPU cores
    (navigator as any).deviceMemory <= 4 || // 4GB or less RAM
    navigator.userAgent.includes('Android 4') || // Old Android
    navigator.userAgent.includes('iPhone OS 9') // Old iOS
  )

  if (prefersReducedMotion || lowEndDevice) {
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `
    document.head.appendChild(style)
  }
}

// Network-aware loading
export function setupNetworkAwareLoading() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return

  const connection = (navigator as any).connection
  if (!connection) return

  const slowConnection = (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  )

  if (slowConnection) {
    // Reduce quality for slow connections
    document.documentElement.setAttribute('data-connection', 'slow')

    // Disable non-critical animations and effects
    const style = document.createElement('style')
    style.textContent = `
      [data-connection="slow"] .hover\\:shadow-lg,
      [data-connection="slow"] .hover\\:scale-105,
      [data-connection="slow"] .animate-bounce,
      [data-connection="slow"] .animate-pulse {
        animation: none !important;
        transform: none !important;
        box-shadow: none !important;
      }
    `
    document.head.appendChild(style)
  }
}

// Initialize all mobile optimizations
export function initializeMobileOptimizations() {
  if (typeof window === 'undefined') return

  // Run immediately
  fixMobileViewportHeight()
  preloadCriticalResources()

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupLazyLoading()
      enableSmoothScrolling()
      preventZoomOnInputFocus()
      optimizeTouchScrolling()
      adaptAnimationsForDevice()
      setupNetworkAwareLoading()
    })
  } else {
    setupLazyLoading()
    enableSmoothScrolling()
    preventZoomOnInputFocus()
    optimizeTouchScrolling()
    adaptAnimationsForDevice()
    setupNetworkAwareLoading()
  }
}

// React hook for mobile optimizations
export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setIsMobile(isMobileDevice())
    initializeMobileOptimizations()

    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile }
}