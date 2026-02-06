import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroSection, { heroVariants } from './hero-section'

// Mock the analytics hooks
jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
  }),
  useCTATracking: () => ({
    trackCTAClick: jest.fn(),
  }),
}))

// Mock the analytics components
jest.mock('@/components/analytics/tracking-components', () => ({
  TrackableCTA: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SectionTracker: ({ children }: any) => <div>{children}</div>,
}))

describe('HeroSection', () => {
  it('renders the default hero section', () => {
    render(<HeroSection />)

    // Check if the main headline is present
    expect(screen.getByText(/Automatiza WhatsApp y/)).toBeInTheDocument()
    expect(screen.getByText(/convierte más/)).toBeInTheDocument()

    // Check for CTAs
    expect(screen.getByText('Ver Demo Gratis')).toBeInTheDocument()
    expect(screen.getByText('Casos de Éxito')).toBeInTheDocument()

    // Check for trust indicators
    expect(screen.getByText('Setup en 15 min')).toBeInTheDocument()
    expect(screen.getByText('Sin permanencia')).toBeInTheDocument()
    expect(screen.getByText('Soporte 24/7')).toBeInTheDocument()
  })

  it('renders the testimonial variant correctly', () => {
    render(<HeroSection variant={heroVariants.testimonial} />)

    // Check for testimonial-specific content
    expect(screen.getByText(/Boreas duplicó nuestras citas/)).toBeInTheDocument()
    expect(screen.getByText('Obtener Demo Gratuita')).toBeInTheDocument()
    expect(screen.getByText('Ver Testimonios')).toBeInTheDocument()
  })

  it('renders the ROI variant correctly', () => {
    render(<HeroSection variant={heroVariants.roi} />)

    // Check for ROI-specific content
    expect(screen.getByText(/Recupera tu inversión en 15 días/)).toBeInTheDocument()
    expect(screen.getByText('Ver Garantía')).toBeInTheDocument()
    expect(screen.getByText('Calculadora ROI')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<HeroSection />)

    // Check for proper ARIA labels and roles
    const section = screen.getByRole('banner')
    expect(section).toHaveAttribute('aria-label', 'Hero section with WhatsApp automation services')

    // Check for proper button accessibility
    const ctaButtons = screen.getAllByRole('button')
    ctaButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label')
    })
  })

  it('renders the conversation demo', () => {
    render(<HeroSection />)

    // Check for conversation elements
    expect(screen.getByText('Salón Bella')).toBeInTheDocument()
    expect(screen.getByText(/Hola! Necesito cita/)).toBeInTheDocument()
    expect(screen.getByText(/Boreas Bot/)).toBeInTheDocument()
  })

  it('shows performance metrics', () => {
    render(<HeroSection />)

    // Check for the metrics display
    expect(screen.getByText('+40%')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
    expect(screen.getByText('15s')).toBeInTheDocument()
  })

  it('shows company statistics', () => {
    render(<HeroSection />)

    // Check for bottom statistics
    expect(screen.getByText('+200')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('15min')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class'
    render(<HeroSection className={customClass} />)

    const section = screen.getByRole('banner')
    expect(section).toHaveClass(customClass)
  })

  it('renders urgency message for ROI variant', () => {
    render(<HeroSection variant={heroVariants.roi} />)

    // Check for urgency message
    expect(screen.getByText(/Oferta limitada/)).toBeInTheDocument()
    expect(screen.getByText(/Garantía disponible solo hasta el 28 de febrero/)).toBeInTheDocument()
  })
})