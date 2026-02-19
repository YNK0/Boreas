import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { OptimizedImage, OptimizedAvatar, OptimizedLogo } from './optimized-image'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        data-testid="next-image"
        {...props}
      />
    )
  }
})

describe('OptimizedImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })

    it('applies custom className', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          className="custom-class"
          lazy={false}
        />
      )

      const container = screen.getByTestId('optimized-image-container')
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('Lazy Loading', () => {
    it('enables lazy loading by default', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
        />
      )

      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    it('disables lazy loading when lazy=false', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
      // Should render immediately without intersection observer
    })

    it('shows placeholder while lazy loading', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          placeholder="blur"
        />
      )

      // Should show some kind of loading state initially
      const container = screen.getByTestId('optimized-image-container')
      expect(container).toBeInTheDocument()
    })
  })

  describe('WebP Support', () => {
    it('enables WebP by default', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          lazy={false}
        />
      )

      // Should attempt WebP format
      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
    })

    it('disables WebP when webp=false', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          webp={false}
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })
  })

  describe('Error Handling', () => {
    it('shows fallback image on error', async () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          fallbackSrc="/fallback.jpg"
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')

      // Simulate image load error
      fireEvent.error(image)

      await waitFor(() => {
        expect(image).toHaveAttribute('src', '/fallback.jpg')
      })
    })

    it('shows error state when no fallback provided', async () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')

      // Simulate image load error
      fireEvent.error(image)

      await waitFor(() => {
        expect(screen.getByText('Error al cargar imagen')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Sizes', () => {
    it('generates responsive sizes string', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          height={200}
          responsive={true}
          lazy={false}
        />
      )

      const image = screen.getByAltText('Test image')
      expect(image).toHaveAttribute('sizes')
    })
  })
})

describe('OptimizedAvatar', () => {
  it('renders avatar with fallback text', () => {
    render(
      <OptimizedAvatar
        src="/avatar.jpg"
        name="John Doe"
        size="md"
        fallbackText="JD"
      />
    )

    // Avatar renders with alt equal to name
    const avatar = screen.getByAltText('John Doe')
    expect(avatar).toBeInTheDocument()
  })

  it('shows fallback text on image error', async () => {
    render(
      <OptimizedAvatar
        src="/broken-avatar.jpg"
        name="John Doe"
        size="md"
        fallbackText="JD"
      />
    )

    const avatar = screen.getByAltText('John Doe')

    // Simulate image load error
    fireEvent.error(avatar)

    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <OptimizedAvatar
        src="/avatar.jpg"
        name="John Doe"
        size="sm"
        fallbackText="JD"
      />
    )

    let container = screen.getByTestId('avatar-container')
    expect(container).toHaveClass('w-8', 'h-8')

    rerender(
      <OptimizedAvatar
        src="/avatar.jpg"
        name="John Doe"
        size="xl"
        fallbackText="JD"
      />
    )

    container = screen.getByTestId('avatar-container')
    expect(container).toHaveClass('w-20', 'h-20')
  })
})

describe('OptimizedLogo', () => {
  it('renders logo with company name', () => {
    render(
      <OptimizedLogo
        src="/logo.svg"
        company="Test Company"
        size="md"
      />
    )

    const logo = screen.getByAltText('Test Company logo')
    expect(logo).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    render(
      <OptimizedLogo
        src="/logo.svg"
        company="Test Company"
        size="lg"
      />
    )

    const container = screen.getByTestId('logo-container')
    expect(container).toHaveClass('w-24', 'h-24')
  })

  it('handles SVG format correctly', () => {
    render(
      <OptimizedLogo
        src="/logo.svg"
        company="Test Company"
        size="md"
      />
    )

    // alt text is "{company} logo"
    const logo = screen.getByAltText('Test Company logo')
    expect(logo).toHaveAttribute('src', '/logo.svg')
  })
})

describe('Performance', () => {
  it('does not trigger unnecessary re-renders', () => {
    const mockCallback = jest.fn()

    const { rerender } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        onLoad={mockCallback}
      />
    )

    // Rerender with same props
    rerender(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        onLoad={mockCallback}
      />
    )

    // Should not cause additional setup calls
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
  })

  it('properly cleans up intersection observer', () => {
    const mockDisconnect = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: mockDisconnect,
    })

    const { unmount } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })
})