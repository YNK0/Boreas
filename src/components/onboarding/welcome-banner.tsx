'use client'

import React, { useState } from 'react'
import { X, Sparkles, ArrowRight, Play, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

interface WelcomeBannerProps {
  onStartTour?: () => void
  onDismiss?: () => void
}

export default function WelcomeBanner({ onStartTour, onDismiss }: WelcomeBannerProps) {
  const { user } = useAuthStore()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const handleStartTour = () => {
    onStartTour?.()
  }

  const userName = user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-pink-300 rounded-full"></div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        aria-label="Cerrar bienvenida"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-white/20 rounded-full p-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Bienvenido a Boreas, {userName}! 🎉
            </h2>
            <p className="text-white/90 text-lg">
              Tu plataforma de automatización WhatsApp está lista.
              Vamos a configurar tu primera automatización.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">15 min</div>
            <div className="text-white/80 text-sm">Setup promedio</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">+40%</div>
            <div className="text-white/80 text-sm">Más citas</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-white/80 text-sm">Automatización</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartTour}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex-1"
          >
            <Play className="w-5 h-5" />
            Tour del Dashboard (2 min)
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold border border-white/30 flex-1">
            <BookOpen className="w-5 h-5" />
            Guía de inicio rápido
          </button>
        </div>

        {/* Quick tip */}
        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <p className="text-white/90 text-sm">
            💡 <strong>Tip:</strong> Conecta tu WhatsApp Business primero para activar todas las funcionalidades.
          </p>
        </div>
      </div>
    </div>
  )
}

// Simplified version for mobile or compact spaces
export function WelcomeCard({ className = '' }: { className?: string }) {
  const { user } = useAuthStore()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const userName = user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white relative ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="pr-6">
        <h3 className="font-bold mb-1">¡Hola {userName}! 👋</h3>
        <p className="text-white/90 text-sm mb-3">
          Empieza automatizando tu WhatsApp en 15 minutos.
        </p>
        <button className="flex items-center gap-2 text-white text-sm font-medium hover:underline">
          <Play className="w-4 h-4" />
          Ver tour rápido
        </button>
      </div>
    </div>
  )
}