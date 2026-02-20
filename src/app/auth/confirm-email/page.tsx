'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { useAuthActions } from '@/store/auth-store'
import { useSearchParams } from 'next/navigation'

// Component that uses useSearchParams must be wrapped in Suspense
function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'tu@email.com'
  const { resendConfirmation } = useAuthActions()

  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')

  const handleResendConfirmation = async () => {
    setIsResending(true)
    setResendStatus('idle')

    try {
      const result = await resendConfirmation(email)

      if (result.error) {
        setResendStatus('error')
        setResendMessage((result.error as any)?.user_message || 'Error al reenviar confirmación')
      } else {
        setResendStatus('success')
        setResendMessage((result as any)?.user_message || 'Email enviado exitosamente')
      }
    } catch (error) {
      setResendStatus('error')
      setResendMessage('Error inesperado. Intenta más tarde.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Registro exitoso!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Confirma tu email para acceder a Boreas
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email sent confirmation */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Email de confirmación enviado
              </h2>
              <p className="text-gray-600 text-sm">
                Enviamos un enlace de confirmación a:
              </p>
              <p className="font-medium text-blue-600 break-all">
                {email}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">
              Sigue estos pasos:
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Revisa tu bandeja de entrada</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>También verifica tu carpeta de spam</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Haz clic en el enlace "Confirmar email"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>¡Listo! Ya puedes acceder a tu dashboard</span>
              </li>
            </ol>
          </div>

          {/* Resend section */}
          <div className="border-t pt-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                ¿No recibiste el email?
              </p>

              <button
                onClick={handleResendConfirmation}
                disabled={isResending || resendStatus === 'success'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Reenviando...
                  </>
                ) : resendStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Email reenviado ✓
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Reenviar email de confirmación
                  </>
                )}
              </button>

              {/* Status message */}
              {resendMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  resendStatus === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {resendMessage}
                </div>
              )}
            </div>
          </div>

          {/* Back to login */}
          <div className="border-t pt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              ¿Ya confirmaste tu email?
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Ir a iniciar sesión
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Help section */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            ¿Tienes problemas?{' '}
            <a
              href="#contact"
              className="font-medium text-blue-600 hover:underline"
            >
              Contacta nuestro soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ConfirmEmailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cargando...
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Preparando confirmación de email
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmEmailLoading />}>
      <ConfirmEmailContent />
    </Suspense>
  )
}