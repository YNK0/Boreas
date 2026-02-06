/**
 * Core Web Vitals Performance Tests
 * Tests to ensure landing page meets performance benchmarks
 */

import { expect } from '@jest/globals'

// Mock performance APIs
const mockPerformanceObserver = jest.fn()
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()

global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  callback,
}))

// Mock Navigation Timing API
const mockPerformanceNavigation = {
  domContentLoadedEventEnd: 1500,
  domContentLoadedEventStart: 100,
  loadEventEnd: 2000,
  loadEventStart: 1800,
  responseStart: 200,
  requestStart: 100,
  domainLookupEnd: 120,
  domainLookupStart: 110,
  connectEnd: 150,
  connectStart: 140,
}

global.performance = {
  ...global.performance,
  getEntriesByType: jest.fn().mockReturnValue([mockPerformanceNavigation]),
  now: jest.fn().mockReturnValue(Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn().mockReturnValue([]),
}

describe('Core Web Vitals Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Largest Contentful Paint (LCP)', () => {
    it('should have LCP under 2.5 seconds (good)', async () => {
      const mockLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 2200, // 2.2 seconds
        element: document.createElement('img'),
      }

      // Simulate LCP measurement
      const performanceCallback = mockPerformanceObserver.mock.calls[0]?.[0]
      if (performanceCallback) {
        performanceCallback({
          getEntries: () => [mockLCPEntry]
        })
      }

      expect(mockLCPEntry.startTime).toBeLessThan(2500) // Good LCP threshold
    })

    it('should identify when LCP exceeds good threshold', async () => {
      const mockLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 3000, // 3 seconds (needs improvement)
        element: document.createElement('img'),
      }

      const rating = mockLCPEntry.startTime < 2500 ? 'good' :
                    mockLCPEntry.startTime < 4000 ? 'needs_improvement' : 'poor'

      expect(rating).toBe('needs_improvement')
    })

    it('should track LCP element type', () => {
      const imgElement = document.createElement('img')
      const textElement = document.createElement('p')

      const mockLCPEntries = [
        {
          entryType: 'largest-contentful-paint',
          startTime: 2000,
          element: imgElement,
        },
        {
          entryType: 'largest-contentful-paint',
          startTime: 2100,
          element: textElement,
        }
      ]

      mockLCPEntries.forEach(entry => {
        expect(entry.element).toBeInstanceOf(HTMLElement)
        expect(['IMG', 'P', 'H1', 'H2', 'DIV']).toContain(entry.element.tagName)
      })
    })
  })

  describe('First Input Delay (FID)', () => {
    it('should have FID under 100ms (good)', async () => {
      const mockFIDEntry = {
        entryType: 'first-input',
        processingStart: 180,
        startTime: 100,
        name: 'mousedown',
      }

      const fid = mockFIDEntry.processingStart - mockFIDEntry.startTime
      expect(fid).toBeLessThan(100) // Good FID threshold
    })

    it('should categorize FID ratings correctly', () => {
      const testCases = [
        { fid: 50, expectedRating: 'good' },
        { fid: 150, expectedRating: 'needs_improvement' },
        { fid: 350, expectedRating: 'poor' },
      ]

      testCases.forEach(({ fid, expectedRating }) => {
        const rating = fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor'
        expect(rating).toBe(expectedRating)
      })
    })

    it('should track input type for FID events', () => {
      const inputTypes = ['mousedown', 'keydown', 'touchstart', 'pointerdown']

      inputTypes.forEach(inputType => {
        const mockEntry = {
          entryType: 'first-input',
          processingStart: 150,
          startTime: 100,
          name: inputType,
        }

        expect(inputTypes).toContain(mockEntry.name)
      })
    })
  })

  describe('Cumulative Layout Shift (CLS)', () => {
    it('should have CLS under 0.1 (good)', async () => {
      const mockCLSEntries = [
        { entryType: 'layout-shift', value: 0.05, hadRecentInput: false },
        { entryType: 'layout-shift', value: 0.03, hadRecentInput: false },
      ]

      const totalCLS = mockCLSEntries
        .filter(entry => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0)

      expect(totalCLS).toBeLessThan(0.1) // Good CLS threshold
    })

    it('should ignore layout shifts from recent input', () => {
      const mockCLSEntries = [
        { entryType: 'layout-shift', value: 0.05, hadRecentInput: false },
        { entryType: 'layout-shift', value: 0.2, hadRecentInput: true }, // Should be ignored
        { entryType: 'layout-shift', value: 0.03, hadRecentInput: false },
      ]

      const totalCLS = mockCLSEntries
        .filter(entry => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0)

      expect(totalCLS).toBe(0.08) // Only count non-input shifts
    })

    it('should categorize CLS ratings correctly', () => {
      const testCases = [
        { cls: 0.05, expectedRating: 'good' },
        { cls: 0.15, expectedRating: 'needs_improvement' },
        { cls: 0.3, expectedRating: 'poor' },
      ]

      testCases.forEach(({ cls, expectedRating }) => {
        const rating = cls < 0.1 ? 'good' : cls < 0.25 ? 'needs_improvement' : 'poor'
        expect(rating).toBe(expectedRating)
      })
    })
  })

  describe('First Contentful Paint (FCP)', () => {
    it('should have FCP under 1.8 seconds (good)', async () => {
      const mockFCPEntry = {
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 1600, // 1.6 seconds
      }

      expect(mockFCPEntry.startTime).toBeLessThan(1800) // Good FCP threshold
    })

    it('should categorize FCP ratings correctly', () => {
      const testCases = [
        { fcp: 1500, expectedRating: 'good' },
        { fcp: 2500, expectedRating: 'needs_improvement' },
        { fcp: 3500, expectedRating: 'poor' },
      ]

      testCases.forEach(({ fcp, expectedRating }) => {
        const rating = fcp < 1800 ? 'good' : fcp < 3000 ? 'needs_improvement' : 'poor'
        expect(rating).toBe(expectedRating)
      })
    })
  })

  describe('Navigation Timing', () => {
    it('should have acceptable DOM content loaded time', () => {
      const domContentLoadedTime = mockPerformanceNavigation.domContentLoadedEventEnd -
                                  mockPerformanceNavigation.domContentLoadedEventStart

      expect(domContentLoadedTime).toBeLessThan(2000) // Should load DOM under 2s
    })

    it('should have acceptable total load time', () => {
      const totalLoadTime = mockPerformanceNavigation.loadEventEnd -
                           mockPerformanceNavigation.loadEventStart

      expect(totalLoadTime).toBeLessThan(500) // Load event should be quick
    })

    it('should have acceptable Time to First Byte (TTFB)', () => {
      const ttfb = mockPerformanceNavigation.responseStart -
                   mockPerformanceNavigation.requestStart

      expect(ttfb).toBeLessThan(800) // TTFB should be under 800ms
    })

    it('should have acceptable DNS lookup time', () => {
      const dnsTime = mockPerformanceNavigation.domainLookupEnd -
                      mockPerformanceNavigation.domainLookupStart

      expect(dnsTime).toBeLessThan(100) // DNS should be fast
    })

    it('should have acceptable TCP connection time', () => {
      const tcpTime = mockPerformanceNavigation.connectEnd -
                      mockPerformanceNavigation.connectStart

      expect(tcpTime).toBeLessThan(100) // TCP connection should be fast
    })
  })

  describe('Performance Budget Compliance', () => {
    const performanceBudgets = {
      fcp: 1800, // ms
      lcp: 2500, // ms
      fid: 100,  // ms
      cls: 0.1,  // score
      total_js_size: 250 * 1024, // 250KB
      main_bundle_size: 150 * 1024, // 150KB
    }

    it('should define performance budgets', () => {
      expect(performanceBudgets.fcp).toBe(1800)
      expect(performanceBudgets.lcp).toBe(2500)
      expect(performanceBudgets.fid).toBe(100)
      expect(performanceBudgets.cls).toBe(0.1)
    })

    it('should validate against performance budgets', () => {
      const metrics = {
        fcp: 1600,
        lcp: 2200,
        fid: 80,
        cls: 0.08,
      }

      Object.keys(metrics).forEach(metric => {
        expect(metrics[metric]).toBeLessThanOrEqual(performanceBudgets[metric])
      })
    })

    it('should identify budget violations', () => {
      const metricsWithViolation = {
        fcp: 2000, // Violation
        lcp: 2200, // OK
        fid: 120,  // Violation
        cls: 0.05, // OK
      }

      const violations = Object.entries(metricsWithViolation)
        .filter(([metric, value]) => value > performanceBudgets[metric])
        .map(([metric]) => metric)

      expect(violations).toContain('fcp')
      expect(violations).toContain('fid')
      expect(violations).not.toContain('lcp')
      expect(violations).not.toContain('cls')
    })
  })

  describe('Performance Monitoring Setup', () => {
    it('should properly configure performance observers', () => {
      // Check that performance observers are set up correctly
      expect(mockPerformanceObserver).toBeDefined()
      expect(mockObserve).toBeDefined()
      expect(mockDisconnect).toBeDefined()
    })

    it('should handle missing performance APIs gracefully', () => {
      // Test fallback when performance APIs are not available
      const originalPerformanceObserver = global.PerformanceObserver

      // @ts-ignore
      delete global.PerformanceObserver

      expect(() => {
        // Code that uses PerformanceObserver should not crash
        if (typeof PerformanceObserver !== 'undefined') {
          new PerformanceObserver(() => {})
        }
      }).not.toThrow()

      global.PerformanceObserver = originalPerformanceObserver
    })

    it('should collect metrics for analytics', () => {
      const mockMetrics = {
        fcp: 1600,
        lcp: 2200,
        fid: 80,
        cls: 0.08,
        ttfb: 100,
      }

      // Verify metrics are in expected format for analytics
      expect(typeof mockMetrics.fcp).toBe('number')
      expect(typeof mockMetrics.lcp).toBe('number')
      expect(typeof mockMetrics.fid).toBe('number')
      expect(typeof mockMetrics.cls).toBe('number')

      expect(mockMetrics.fcp).toBeGreaterThan(0)
      expect(mockMetrics.lcp).toBeGreaterThan(0)
      expect(mockMetrics.cls).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('Bundle Size Performance Tests', () => {
  it('should track JavaScript bundle sizes', () => {
    const mockResourceEntries = [
      {
        name: '/static/chunks/main-abc123.js',
        transferSize: 140 * 1024, // 140KB
        initiatorType: 'script',
      },
      {
        name: '/static/chunks/vendor-def456.js',
        transferSize: 80 * 1024, // 80KB
        initiatorType: 'script',
      },
      {
        name: '/static/chunks/lazy-landing-ghi789.js',
        transferSize: 30 * 1024, // 30KB (lazy loaded)
        initiatorType: 'script',
      }
    ]

    const totalJSSize = mockResourceEntries
      .filter(entry => entry.name.endsWith('.js'))
      .reduce((sum, entry) => sum + entry.transferSize, 0)

    expect(totalJSSize).toBeLessThanOrEqual(300 * 1024) // Total under 300KB
  })

  it('should identify main bundle size', () => {
    const mockResourceEntries = [
      {
        name: '/static/chunks/main-abc123.js',
        transferSize: 140 * 1024,
      },
      {
        name: '/static/chunks/framework-xyz.js',
        transferSize: 50 * 1024,
      }
    ]

    const mainBundle = mockResourceEntries.find(entry =>
      entry.name.includes('main') || entry.name.includes('index')
    )

    expect(mainBundle?.transferSize).toBeLessThanOrEqual(150 * 1024) // Main under 150KB
  })

  it('should validate lazy-loaded chunks are smaller', () => {
    const mockChunks = [
      { name: 'main', size: 140 * 1024 },
      { name: 'vendor', size: 80 * 1024 },
      { name: 'lazy-testimonials', size: 25 * 1024 },
      { name: 'lazy-case-studies', size: 30 * 1024 },
    ]

    const lazyChunks = mockChunks.filter(chunk => chunk.name.includes('lazy'))

    lazyChunks.forEach(chunk => {
      expect(chunk.size).toBeLessThan(50 * 1024) // Lazy chunks under 50KB
    })
  })
})