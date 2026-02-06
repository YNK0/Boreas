'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { TrackableCTA } from '@/components/analytics/tracking-components'
import { useAnalytics } from '@/hooks/use-analytics'

interface DashboardCTAButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export default function DashboardCTAButton({
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  children
}: DashboardCTAButtonProps) {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { track } = useAnalytics()

  // Handle click with smart routing
  const handleClick = () => {
    if (loading) return

    // Track the CTA click
    track('dashboard_cta_click', {
      user_authenticated: !!user,
      intended_destination: user ? 'dashboard' : 'auth',
      source_location: 'landing_page',
      user_journey_stage: user ? 'returning_user' : 'new_user'
    })

    // Smart routing based on auth state
    if (user) {
      // User is authenticated, go to dashboard
      router.push('/dashboard')
    } else {
      // User not authenticated, go to login
      router.push('/login')
    }
  }

  // Determine button text based on auth state
  const getButtonText = () => {
    if (children) return children

    if (loading) return 'Cargando...'

    if (user) {
      return 'Ir al Dashboard'
    } else {
      return 'Acceder al Panel'
    }
  }

  // Style variants
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg focus:ring-gray-500',
    outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 focus:ring-white'
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
    loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
  }`

  return (
    <TrackableCTA
      trackingType="dashboard"
      label={getButtonText() as string}
      position="cta"
      onClick={handleClick}
      className={combinedClassName}
      disabled={loading}
      aria-label={`${getButtonText()} - ${user ? 'Access your dashboard' : 'Login to access dashboard'}`}
    >
      {showIcon && <BarChart3 className="w-5 h-5" aria-hidden="true" />}
      <span>{getButtonText()}</span>
      <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
    </TrackableCTA>
  )
}

// Specialized variant for hero section
export function HeroDashboardCTA({ className = '' }: { className?: string }) {
  return (
    <DashboardCTAButton
      variant="primary"
      size="lg"
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      showIcon={true}
    >
      Mi Dashboard
    </DashboardCTAButton>
  )
}

// Specialized variant for header/navbar
export function HeaderDashboardCTA({ className = '' }: { className?: string }) {
  const { user } = useAuthStore()

  return (
    <DashboardCTAButton
      variant={user ? 'secondary' : 'primary'}
      size="sm"
      className={className}
      showIcon={false}
    >
      {user ? 'Dashboard' : 'Iniciar Sesión'}
    </DashboardCTAButton>
  )
}

// Specialized variant for floating action button
export function FloatingDashboardCTA({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <DashboardCTAButton
        variant="primary"
        size="md"
        className="shadow-2xl rounded-full px-6 py-3"
        showIcon={true}
      />
    </div>
  )
}