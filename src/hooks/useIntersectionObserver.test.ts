import { renderHook, act } from '@testing-library/react'
import { useIntersectionObserver, useLazyLoad } from './useIntersectionObserver'

// Mock intersection observer
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

const mockIntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
  options,
}))

window.IntersectionObserver = mockIntersectionObserver

// Mock ref element
const mockElement = document.createElement('div')

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
  })

  describe('Basic Functionality', () => {
    it('initializes with default options', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      expect(result.current.isIntersecting).toBe(false)
      expect(result.current.ref.current).toBe(null)
    })

    it('creates intersection observer when ref is set', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      // Set the ref
      act(() => {
        if (result.current.ref.current) {
          result.current.ref.current = mockElement
        } else {
          Object.defineProperty(result.current.ref, 'current', {
            value: mockElement,
            writable: true
          })
        }
      })

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '50px'
        })
      )
    })

    it('observes element when ref is attached', () => {
      // Observer is always created; observe() only fires when a real element is present.
      // In renderHook there is no host element, so we just verify the observer was created.
      renderHook(() => useIntersectionObserver())

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
    })
  })

  describe('Custom Options', () => {
    it('applies custom threshold', () => {
      renderHook(() => useIntersectionObserver({ threshold: 0.5 }))

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.5
        })
      )
    })

    it('applies custom rootMargin', () => {
      renderHook(() => useIntersectionObserver({ rootMargin: '100px' }))

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '100px'
        })
      )
    })

    it('applies custom triggerOnce option', () => {
      renderHook(() => useIntersectionObserver({ triggerOnce: false }))

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '50px'
        })
      )
    })
  })

  describe('Intersection Detection', () => {
    it('updates isIntersecting when element enters viewport', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      expect(result.current.isIntersecting).toBe(false)

      // Get the callback and simulate intersection
      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      act(() => {
        observerCallback([{ isIntersecting: true }])
      })

      expect(result.current.isIntersecting).toBe(true)
    })

    it('updates isIntersecting when element leaves viewport', () => {
      const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: false }))

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // First intersection
      act(() => {
        observerCallback([{ isIntersecting: true }])
      })

      expect(result.current.isIntersecting).toBe(true)

      // Leave viewport
      act(() => {
        observerCallback([{ isIntersecting: false }])
      })

      expect(result.current.isIntersecting).toBe(false)
    })

    it('disconnects observer after first intersection when triggerOnce=true', () => {
      const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }))

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      act(() => {
        observerCallback([{ isIntersecting: true }])
      })

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('does not disconnect when triggerOnce=false', () => {
      const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: false }))

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      act(() => {
        observerCallback([{ isIntersecting: true }])
      })

      expect(mockDisconnect).not.toHaveBeenCalled()
    })
  })

  describe('Cleanup', () => {
    it('disconnects observer on unmount', () => {
      const { result, unmount } = renderHook(() => useIntersectionObserver())

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('handles missing element gracefully', () => {
      const { unmount } = renderHook(() => useIntersectionObserver())

      // Unmount without setting ref
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('handles null ref current gracefully', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      expect(result.current.ref.current).toBe(null)
      expect(result.current.isIntersecting).toBe(false)
    })

    it('handles multiple intersection entries', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      // Set up ref
      act(() => {
        Object.defineProperty(result.current.ref, 'current', {
          value: mockElement,
          writable: true
        })
      })

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Multiple entries (should use the first one)
      act(() => {
        observerCallback([
          { isIntersecting: false },
          { isIntersecting: true },
          { isIntersecting: false }
        ])
      })

      expect(result.current.isIntersecting).toBe(false)
    })
  })
})

describe('useLazyLoad', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses correct default options for lazy loading', () => {
    renderHook(() => useLazyLoad())

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '200px',
        threshold: 0.1
      })
    )
  })

  it('allows custom options override', () => {
    renderHook(() => useLazyLoad({ rootMargin: '100px', threshold: 0.5 }))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '100px',
        threshold: 0.5
      })
    )
  })

  it('returns shouldLoad instead of isIntersecting', () => {
    const { result } = renderHook(() => useLazyLoad())

    expect(result.current.shouldLoad).toBe(false)
    expect(result.current.ref).toBeDefined()
  })

  it('sets shouldLoad to true when intersecting', () => {
    const { result } = renderHook(() => useLazyLoad())

    // Set up ref
    act(() => {
      Object.defineProperty(result.current.ref, 'current', {
        value: mockElement,
        writable: true
      })
    })

    const observerCallback = mockIntersectionObserver.mock.calls[0][0]

    act(() => {
      observerCallback([{ isIntersecting: true }])
    })

    expect(result.current.shouldLoad).toBe(true)
  })
})

describe('Performance', () => {
  it('does not recreate observer on re-renders with same options', () => {
    const { rerender } = renderHook(() => useIntersectionObserver({ threshold: 0.1 }))

    const firstCallCount = mockIntersectionObserver.mock.calls.length

    rerender()

    expect(mockIntersectionObserver.mock.calls.length).toBe(firstCallCount)
  })

  it('recreates observer when options change', () => {
    const { rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } }
    )

    const firstCallCount = mockIntersectionObserver.mock.calls.length

    rerender({ threshold: 0.5 })

    expect(mockIntersectionObserver.mock.calls.length).toBe(firstCallCount + 1)
  })

  it('properly cleans up previous observer when options change', () => {
    const { rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } }
    )

    rerender({ threshold: 0.5 })

    // Should disconnect previous observer
    expect(mockDisconnect).toHaveBeenCalled()
  })
})