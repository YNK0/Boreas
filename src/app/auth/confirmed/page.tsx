'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Sparkles, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export default function EmailConfirmedPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [countdown, setCountdown] = useState(5)

  // Auto redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Celebration header */}
        <div className="text-center">
          {/* Animated success icon */}
          <div className="relative mx-auto h-24 w-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            <div className="relative h-full w-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Sparkles className="w-4 h-4 text-pink-400 animate-bounce delay-75" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ¡Email confirmado!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Bienvenido a Boreas {user?.email?.split('@')[0] || ''}
          </p>
        </div>

        {/* Welcome content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Success message */}
          <div className="text-center space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                🎉 Tu cuenta ha sido verificada exitosamente
              </p>
              <p className="text-green-700 text-sm mt-1">
                Ya puedes acceder a todas las funcionalidades de Boreas
              </p>
            </div>
          </div>

          {/* What's next */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              ¿Qué sigue?
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full p-2 flex-shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Explora tu dashboard</h3>
                  <p className="text-blue-700 text-sm">
                    Descubre todas las herramientas para automatizar tu negocio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="bg-purple-600 text-white rounded-full p-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Configura WhatsApp</h3>
                  <p className="text-purple-700 text-sm">
                    Conecta tu WhatsApp Business y empieza a automatizar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-600 text-white rounded-full p-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">Primera automatización</h3>
                  <p className="text-green-700 text-sm">
                    Crea tu primera respuesta automática en minutos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto redirect notice */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">
              Te redirigiremos automáticamente al dashboard en <strong>{countdown}</strong> segundos
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Manual action */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              Ir al Dashboard ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Additional help */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda para empezar?{' '}
            <a
              href="#contact"
              className="font-medium text-blue-600 hover:underline"
            >
              Ver guías de inicio
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}