import '@testing-library/jest-dom'

// Mock IntersectionObserver globally
global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  callback,
  options,
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock PerformanceObserver for performance tests
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  callback,
}))

// Mock performance API
global.performance = {
  ...global.performance,
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  now: jest.fn(() => Date.now()),
}

// Mock window.matchMedia (jsdom only)
if (typeof window !== 'undefined') Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock scrollIntoView and getBoundingClientRect (jsdom only)
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = jest.fn()
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  }))
}

// Mock Image loading for tests
global.Image = class MockImage {
  constructor() {
    this.onload = null
    this.onerror = null

    // Simulate successful image load after a short delay
    setTimeout(() => {
      if (this.onload) {
        this.onload()
      }
    }, 100)
  }

  set src(value) {
    // Simulate error for specific test images
    if (value.includes('broken') || value.includes('error')) {
      setTimeout(() => {
        if (this.onerror) {
          this.onerror()
        }
      }, 50)
    }
  }
}

// Mock CSS.supports for testing
global.CSS = {
  supports: jest.fn((property, value) => {
    // Mock WebP support check
    if (property === '-webkit-background-image' && value.includes('webp')) {
      return true
    }
    if (property === 'background-image' && value.includes('webp')) {
      return true
    }
    return false
  })
}

// Mock navigator for testing
Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  },
})

// Mock PostHog for analytics tests
global.posthog = {
  capture: jest.fn(),
  identify: jest.fn(),
  reset: jest.fn(),
  init: jest.fn(),
  isFeatureEnabled: jest.fn(() => false),
  onFeatureFlags: jest.fn(),
}

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock next/navigation for app router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Global test helpers
global.testHelpers = {
  // Helper to wait for async operations
  waitForAsync: (fn, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const check = () => {
        try {
          const result = fn()
          if (result) {
            resolve(result)
          } else if (Date.now() - startTime >= timeout) {
            reject(new Error('Timeout waiting for condition'))
          } else {
            setTimeout(check, 10)
          }
        } catch (error) {
          if (Date.now() - startTime >= timeout) {
            reject(error)
          } else {
            setTimeout(check, 10)
          }
        }
      }
      check()
    })
  },

  // Helper to mock intersection observer intersection
  mockIntersection: (elements, isIntersecting) => {
    const mockObserver = IntersectionObserver.mock.instances[IntersectionObserver.mock.instances.length - 1]
    if (mockObserver && mockObserver.callback) {
      const entries = elements.map(element => ({
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: isIntersecting ? element.getBoundingClientRect() : { width: 0, height: 0 },
        rootBounds: { width: 1024, height: 768 },
        time: Date.now(),
      }))
      mockObserver.callback(entries)
    }
  }
}

// Increase timeout for async tests
jest.setTimeout(10000)

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  jest.clearAllTimers()
})

// Set up fake timers for tests that need them
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})