'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useAuth } from '@/store/auth-store'
import { LogOut, Users, TrendingUp, MessageSquare, Calendar, ExternalLink } from 'lucide-react'
import ComingSoon, { ComingSoonBadge } from '@/components/ui/coming-soon'
import WelcomeBanner from '@/components/onboarding/welcome-banner'
import DashboardTour from '@/components/onboarding/dashboard-tour'

export default function DashboardPage() {
  const { user, profile, isAuthenticated, loading } = useAuth()
  const { signOut, initialize } = useAuthStore()

  // Onboarding state
  const [showWelcome, setShowWelcome] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  // Check if user is new (registered within last 24 hours)
  useEffect(() => {
    if (profile && user) {
      const registrationDate = new Date(profile.created_at || user.created_at)
      const daysSinceRegistration = Math.floor((Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))

      // Show welcome banner for users registered within last 3 days
      if (daysSinceRegistration <= 3) {
        setShowWelcome(true)
      }
    }
  }, [profile, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Acceso no autorizado</h1>
          <p className="mt-2 text-gray-600">Por favor, inicia sesión para acceder al dashboard</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleStartTour = () => {
    setShowTour(true)
  }

  const handleCompleteTour = () => {
    setShowTour(false)
    setShowWelcome(false)
  }

  const handleSkipTour = () => {
    setShowTour(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow" data-tour="dashboard-header">
        <div className="container-boreas py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Boreas</h1>
              <p className="text-gray-600">
                Bienvenido, {profile?.name || user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-boreas py-8">
        {/* Welcome Banner for New Users */}
        {showWelcome && (
          <WelcomeBanner
            onStartTour={handleStartTour}
            onDismiss={() => setShowWelcome(false)}
          />
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-tour="messages-section">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversiones</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mensajes</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demos</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg shadow" data-tour="clients-section">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Leads Recientes</h2>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay leads aún</p>
                <p className="text-sm">Los leads aparecerán cuando alguien complete el formulario de la landing page</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow" data-tour="analytics-section">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay métricas disponibles</p>
                <p className="text-sm">Las métricas de automatización aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow" data-tour="settings-section">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Configuración Rápida</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="p-4 text-left border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Ver Landing Page</h3>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-1">Revisar cómo se ve la página de inicio</p>
              </button>

              <div className="relative">
                <ComingSoon
                  message="Configuración de WhatsApp Business API próximamente"
                  feature="Templates, flows automáticos y respuestas inteligentes"
                >
                  <div className="p-4 text-left border border-gray-300 rounded-lg opacity-60 cursor-not-allowed">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Configurar Automatización</h3>
                      <ComingSoonBadge text="Próximamente" className="ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Configurar respuestas automáticas de WhatsApp</p>
                  </div>
                </ComingSoon>
              </div>

              <div className="relative">
                <ComingSoon
                  message="Panel de métricas avanzadas en desarrollo"
                  feature="Analytics, conversiones, ROI y reporting automático"
                >
                  <div className="p-4 text-left border border-gray-300 rounded-lg opacity-60 cursor-not-allowed">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Ver Métricas</h3>
                      <ComingSoonBadge text="En desarrollo" className="ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Analizar rendimiento y conversiones</p>
                  </div>
                </ComingSoon>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Información de Perfil</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile?.name || 'No configurado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rol</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.role === 'admin' ? 'Administrador' :
                   profile?.role === 'sales' ? 'Ventas' :
                   profile?.role === 'developer' ? 'Desarrollador' : 'Usuario'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de registro</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-MX') : 'No disponible'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      {/* Dashboard Tour */}
      <DashboardTour
        isActive={showTour}
        onComplete={handleCompleteTour}
        onSkip={handleSkipTour}
      />
    </div>
  )
}