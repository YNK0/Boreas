import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LazySection, createLazySection } from './lazy-section'

// Mock intersection observer
const mockIntersect = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

const mockIntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  // Store callback for manual triggering
  callback,
}))

window.IntersectionObserver = mockIntersectionObserver

// Mock React.lazy
const mockLazyComponent = jest.fn().mockReturnValue(() => <div data-testid="lazy-component">Lazy Content</div>)
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  lazy: () => mockLazyComponent,
  Suspense: ({ children, fallback }: any) => {
    // Simulate suspense behavior
    return mockLazyComponent.mock.calls.length > 0 ? children : fallback
  }
}))

describe('LazySection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders fallback content initially', () => {
      render(
        <LazySection
          fallback={<div data-testid="fallback">Loading...</div>}
        >
          <div data-testid="content">Main Content</div>
        </LazySection>
      )

      expect(screen.getByTestId('fallback')).toBeInTheDocument()
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    it('renders children when in view', async () => {
      const { container } = render(
        <LazySection
          fallback={<div data-testid="fallback">Loading...</div>}
        >
          <div data-testid="content">Main Content</div>
        </LazySection>
      )

      // Get the observer instance and trigger intersection
      const observerInstance = mockIntersectionObserver.mock.results[0].value

      // Simulate intersection
      act(() => {
        observerInstance.callback([{ isIntersecting: true }])
      })

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })

    it('applies custom className and id', () => {
      const { container } = render(
        <LazySection
          className="custom-class"
          id="custom-id"
          fallback={<div>Loading...</div>}
        >
          <div>Content</div>
        </LazySection>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
      expect(wrapper).toHaveAttribute('id', 'custom-id')
    })
  })

  describe('Intersection Observer Behavior', () => {
    it('observes element on mount', () => {
      render(
        <LazySection fallback={<div>Loading...</div>}>
          <div>Content</div>
        </LazySection>
      )

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledTimes(1)
    })

    it('disconnects observer on unmount', () => {
      const { unmount } = render(
        <LazySection fallback={<div>Loading...</div>}>
          <div>Content</div>
        </LazySection>
      )

      unmount()

      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })

    it('only loads content once when intersecting', async () => {
      render(
        <LazySection
          fallback={<div data-testid="fallback">Loading...</div>}
        >
          <div data-testid="content">Main Content</div>
        </LazySection>
      )

      const observerInstance = mockIntersectionObserver.mock.results[0].value

      // Trigger intersection multiple times
      act(() => {
        observerInstance.callback([{ isIntersecting: true }])
        observerInstance.callback([{ isIntersecting: true }])
        observerInstance.callback([{ isIntersecting: true }])
      })

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })

      // Should only render content once
      expect(screen.getAllByTestId('content')).toHaveLength(1)
    })
  })

  describe('Loading States', () => {
    it('shows fallback when not intersecting', () => {
      render(
        <LazySection
          fallback={<div data-testid="fallback">Loading...</div>}
        >
          <div data-testid="content">Main Content</div>
        </LazySection>
      )

      expect(screen.getByTestId('fallback')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('handles missing fallback gracefully', () => {
      render(
        <LazySection>
          <div data-testid="content">Main Content</div>
        </LazySection>
      )

      // Should not crash without fallback
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })
})

describe('createLazySection', () => {
  const MockComponent = () => <div data-testid="mock-component">Mock Component</div>
  const MockLoadingComponent = () => <div data-testid="mock-loading">Loading Component</div>

  it('creates a lazy section component', () => {
    const LazyComponent = createLazySection(
      () => Promise.resolve({ default: MockComponent }),
      MockLoadingComponent
    )

    render(<LazyComponent />)

    expect(screen.getByTestId('mock-loading')).toBeInTheDocument()
  })

  it('forwards props to the lazy component', async () => {
    const MockPropsComponent = ({ title }: { title: string }) => (
      <div data-testid="props-component">{title}</div>
    )

    const LazyComponent = createLazySection(
      () => Promise.resolve({ default: MockPropsComponent }),
      MockLoadingComponent
    )

    render(<LazyComponent title="Test Title" />)

    const observerInstance = mockIntersectionObserver.mock.results[0].value

    act(() => {
      observerInstance.callback([{ isIntersecting: true }])
    })

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })

  it('applies className and id to wrapper', () => {
    const LazyComponent = createLazySection(
      () => Promise.resolve({ default: MockComponent }),
      MockLoadingComponent
    )

    const { container } = render(
      <LazyComponent className="test-class" id="test-id" />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('test-class')
    expect(wrapper).toHaveAttribute('id', 'test-id')
  })
})

describe('Performance', () => {
  it('does not create multiple observers for same component', () => {
    const { rerender } = render(
      <LazySection fallback={<div>Loading...</div>}>
        <div>Content</div>
      </LazySection>
    )

    const firstCallCount = mockIntersectionObserver.mock.calls.length

    rerender(
      <LazySection fallback={<div>Loading...</div>}>
        <div>Updated Content</div>
      </LazySection>
    )

    // Should not create additional observers
    expect(mockIntersectionObserver.mock.calls.length).toBe(firstCallCount)
  })

  it('optimizes re-renders when already loaded', async () => {
    const { rerender } = render(
      <LazySection
        fallback={<div data-testid="fallback">Loading...</div>}
      >
        <div data-testid="content">Original Content</div>
      </LazySection>
    )

    // Trigger loading
    const observerInstance = mockIntersectionObserver.mock.results[0].value
    act(() => {
      observerInstance.callback([{ isIntersecting: true }])
    })

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    // Rerender with new children
    rerender(
      <LazySection
        fallback={<div data-testid="fallback">Loading...</div>}
      >
        <div data-testid="content">Updated Content</div>
      </LazySection>
    )

    // Should show updated content immediately (already loaded)
    expect(screen.getByText('Updated Content')).toBeInTheDocument()
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument()
  })
})

describe('Integration with Intersection Observer Options', () => {
  it('uses correct default options', () => {
    render(
      <LazySection fallback={<div>Loading...</div>}>
        <div>Content</div>
      </LazySection>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '200px'
      })
    )
  })

  it('only triggers once when triggerOnce is true', async () => {
    render(
      <LazySection fallback={<div>Loading...</div>}>
        <div data-testid="content">Content</div>
      </LazySection>
    )

    const observerInstance = mockIntersectionObserver.mock.results[0].value

    // Trigger intersection
    act(() => {
      observerInstance.callback([{ isIntersecting: true }])
    })

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    // Observer should disconnect after first trigger
    expect(mockDisconnect).toHaveBeenCalled()
  })
})