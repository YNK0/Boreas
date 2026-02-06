'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'
import { TrackableCTA, SectionTracker } from '@/components/analytics/tracking-components'
import { useCTATracking, useAnalytics } from '@/hooks/use-analytics'
import { HeroDashboardCTA } from '@/components/common/dashboard-cta-button'

// Hero section variant types for A/B testing
export interface HeroVariant {
  type: 'control' | 'testimonial' | 'roi'
  title: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
  trustIndicators: string[]
  socialProof?: string
  urgency?: string
}

// Hero section props interface
export interface HeroSectionProps {
  variant?: HeroVariant
  className?: string
}

// Default control variant
const defaultVariant: HeroVariant = {
  type: 'control',
  title: 'Automatiza WhatsApp y convierte más visitantes en clientes',
  subtitle: '¿Pierdes clientes por responder WhatsApp hasta la madrugada? Boreas automatiza respuestas, agenda citas y cobra depósitos mientras duermes.',
  ctaPrimary: 'Ver Demo Gratis',
  ctaSecondary: 'Casos de Éxito',
  trustIndicators: ['Setup en 15 min', 'Sin permanencia', 'Soporte 24/7'],
  socialProof: '+200 negocios ya automatizados'
}

export default function HeroSection({ variant = defaultVariant, className = '' }: HeroSectionProps) {
  const { track } = useAnalytics()
  const { trackCTAClick } = useCTATracking()

  // Track hero section view
  useEffect(() => {
    track('hero_view', {
      variant_type: variant.type,
      section: 'hero',
      page: 'landing',
    })
  }, [track, variant.type])

  // Handle CTA clicks with analytics
  const handlePrimaryCTA = () => {
    trackCTAClick('hero', variant.ctaPrimary, 'primary')
    track('hero_primary_cta_click', {
      variant_type: variant.type,
      cta_text: variant.ctaPrimary,
      conversion_stage: 'awareness'
    })
  }

  const handleSecondaryCTA = () => {
    track('hero_secondary_cta_click', {
      variant_type: variant.type,
      cta_text: variant.ctaSecondary,
      conversion_stage: 'interest'
    })
  }
  return (
    <SectionTracker sectionName="hero" threshold={0.3}>
      <section
        className={`bg-gradient-to-br from-blue-600 via-primary-600 to-secondary-600 min-h-screen flex items-center relative overflow-hidden ${className}`}
        role="banner"
        aria-label="Hero section with WhatsApp automation services"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        </div>

      <div className="container-boreas py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-white order-2 lg:order-1">
            {/* Social proof badge */}
            {variant.socialProof && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
                <Users className="w-4 h-4 text-green-300" aria-hidden="true" />
                <span>{variant.socialProof}</span>
              </div>
            )}

            {/* Main headline - optimized for conversion */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-balance">
                {variant.title.includes('convierte más') ? (
                  <>
                    Automatiza WhatsApp y
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100">
                      {" "}convierte más{" "}
                    </span>
                    visitantes en clientes
                  </>
                ) : (
                  variant.title
                )}
              </span>
            </h1>

            {/* Value proposition - problem-focused */}
            <p className="text-lg md:text-xl mb-8 text-blue-50 leading-relaxed">
              <strong className="font-semibold">
                {variant.subtitle.includes('¿Pierdes')
                  ? '¿Pierdes clientes por responder WhatsApp hasta la madrugada?'
                  : variant.subtitle.split('.')[0] + (variant.subtitle.includes('.') ? '.' : '')
                }
              </strong>
              {variant.subtitle.includes('¿Pierdes') && (
                <>
                  <br />
                  Boreas automatiza respuestas, agenda citas y cobra depósitos mientras duermes.
                </>
              )}
            </p>

            {/* CTAs with analytics tracking */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8" role="group" aria-label="Call to action buttons">
              {/* Primary CTA: Smart Dashboard Button */}
              <HeroDashboardCTA className="w-full sm:w-auto" />

              <Link href="#contact" className="group">
                <TrackableCTA
                  trackingType="hero"
                  label={variant.ctaPrimary}
                  position="primary"
                  onClick={handlePrimaryCTA}
                  className="w-full sm:w-auto btn-primary bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl min-h-[48px] flex items-center justify-center gap-2"
                  aria-label={`${variant.ctaPrimary} - Opens contact form`}
                >
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  {variant.ctaPrimary}
                </TrackableCTA>
              </Link>

              <Link href="#cases" className="group">
                <TrackableCTA
                  trackingType="hero"
                  label={variant.ctaSecondary}
                  position="secondary"
                  onClick={handleSecondaryCTA}
                  className="w-full sm:w-auto btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[48px] flex items-center justify-center gap-2"
                  aria-label={`${variant.ctaSecondary} - View success stories`}

                >
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                  {variant.ctaSecondary}
                </TrackableCTA>
              </Link>
            </div>

            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm" role="list" aria-label="Trust indicators">
              {variant.trustIndicators.map((indicator, index) => {
                const icons = [CheckCircle, Clock, MessageSquare]
                const Icon = icons[index % icons.length]
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                    role="listitem"
                  >
                    <Icon className="w-5 h-5 text-green-300 flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium">{indicator}</span>
                  </div>
                )
              })}
            </div>

            {/* Urgency indicator for specific variants */}
            {variant.urgency && (
              <div className="mt-6 p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg" role="alert" aria-live="polite">
                <p className="text-orange-100 text-sm">
                  🔥 <strong>Oferta limitada:</strong> {variant.urgency}
                </p>
              </div>
            )}
          </div>

          {/* Visual/Demo - Enhanced mobile experience */}
          <div className="order-1 lg:order-2" role="img" aria-label="WhatsApp automation demo">
            <div className="relative">
              {/* Phone mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Phone header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Salón Bella</h3>
                      <p className="text-xs text-green-600" aria-label="Status: Online">En línea</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">WhatsApp Business</div>
                </div>

                {/* Enhanced conversation */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto mobile-carousel" role="log" aria-label="WhatsApp conversation demo">
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]" role="article">
                    <strong className="text-gray-600">María:</strong><br />
                    &ldquo;Hola! Necesito cita para corte y color para mañana&rdquo;
                  </div>
                  <div className="bg-primary-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto" role="article">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      &ldquo;¡Hola María! 😊 Perfecto, tengo disponibilidad mañana. ¿Prefieres por la mañana o tarde?&rdquo;
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]" role="article">
                    <strong className="text-gray-600">María:</strong><br />
                    &ldquo;Por la mañana&rdquo;
                  </div>
                  <div className="bg-primary-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto" role="article">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      &ldquo;Genial! Tengo estas opciones:<br />
                      🕙 10:00 AM con Ana<br />
                      🕚 11:00 AM con Sofia<br />
                      ¿Cuál prefieres?&rdquo;
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]" role="article">
                    <strong className="text-gray-600">María:</strong><br />
                    &ldquo;11:00 con Sofia&rdquo;
                  </div>
                  <div className="bg-green-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto" role="article">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      &ldquo;¡Reservado! 🎉<br />
                      📅 Mañana 11:00 AM<br />
                      💇‍♀️ Corte + Color con Sofia<br />
                      💰 Deposito: $300<br />
                      [Pagar Ahora]&rdquo;
                    </div>
                  </div>
                </div>

                {/* Results metrics */}
                <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-gray-100" role="list" aria-label="Key metrics">
                  <div role="listitem">
                    <div className="text-xl font-bold text-green-600" aria-label="40% increase in appointments">+40%</div>
                    <div className="text-xs text-gray-600">Citas</div>
                  </div>
                  <div role="listitem">
                    <div className="text-xl font-bold text-blue-600" aria-label="Available 24/7">24/7</div>
                    <div className="text-xs text-gray-600">Disponible</div>
                  </div>
                  <div role="listitem">
                    <div className="text-xl font-bold text-purple-600" aria-label="15 second response time">15s</div>
                    <div className="text-xs text-gray-600">Respuesta</div>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual appeal */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3 shadow-lg animate-bounce" aria-hidden="true">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full p-3 shadow-lg animate-pulse" aria-hidden="true">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white" role="list" aria-label="Company statistics">
          <div role="listitem">
            <div className="text-2xl md:text-3xl font-bold text-green-300" aria-label="Over 200 active businesses">+200</div>
            <div className="text-sm opacity-90">Negocios activos</div>
          </div>
          <div role="listitem">
            <div className="text-2xl md:text-3xl font-bold text-blue-300" aria-label="95% client satisfaction">95%</div>
            <div className="text-sm opacity-90">Satisfacción cliente</div>
          </div>
          <div role="listitem">
            <div className="text-2xl md:text-3xl font-bold text-purple-300" aria-label="24/7 automation">24/7</div>
            <div className="text-sm opacity-90">Automatización</div>
          </div>
          <div role="listitem">
            <div className="text-2xl md:text-3xl font-bold text-yellow-300" aria-label="15 minute average setup">15min</div>
            <div className="text-sm opacity-90">Setup promedio</div>
          </div>
        </div>
      </div>
      </section>
    </SectionTracker>
  )
}

// Export variants for A/B testing
export const heroVariants = {
  control: defaultVariant,
  testimonial: {
    type: 'testimonial' as const,
    title: '"Boreas duplicó nuestras citas en 30 días" - María, Salón Luna',
    subtitle: 'Únete a +200 negocios que ya automatizan WhatsApp para vender más sin trabajar 24/7.',
    ctaPrimary: 'Obtener Demo Gratuita',
    ctaSecondary: 'Ver Testimonios',
    trustIndicators: ['Resultados garantizados', 'Sin riesgo - 30 días', 'Soporte premium'],
    socialProof: '9.2/10 ⭐ en satisfacción',
  },
  roi: {
    type: 'roi' as const,
    title: 'Recupera tu inversión en 15 días o te devolvemos tu dinero',
    subtitle: 'Garantizamos que Boreas aumentará tus ventas en 40% durante el primer mes, o reembolso completo.',
    ctaPrimary: 'Ver Garantía',
    ctaSecondary: 'Calculadora ROI',
    trustIndicators: ['Garantía 100%', 'ROI promedio 300%', 'Sin permanencia'],
    socialProof: '98% recuperan inversión en 15 días',
    urgency: 'Garantía disponible solo hasta el 28 de febrero'
  }
} as const