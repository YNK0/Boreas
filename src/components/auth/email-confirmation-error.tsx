'use client'

import React, { useState } from 'react'
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthActions } from '@/store/auth-store'

interface EmailConfirmationErrorProps {
  email: string
  onClose?: () => void
  className?: string
}

export default function EmailConfirmationError({
  email,
  onClose,
  className = ''
}: EmailConfirmationErrorProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')
  const { resendConfirmation } = useAuthActions()

  const handleResendConfirmation = async () => {
    setIsResending(true)
    setResendStatus('idle')

    try {
      const result = await resendConfirmation(email)

      if (result.error) {
        setResendStatus('error')
        setResendMessage(result.error.user_message || 'Error al reenviar confirmación')
      } else {
        setResendStatus('success')
        setResendMessage(result.user_message || 'Email enviado exitosamente')
      }
    } catch (error) {
      setResendStatus('error')
      setResendMessage('Error inesperado. Intenta más tarde.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <Mail className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">
            Confirma tu email para continuar
          </h3>
          <p className="text-yellow-700 text-sm">
            Enviamos un email de confirmación a <strong>{email}</strong>
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-yellow-600 transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-4">
        <p className="text-yellow-700 text-sm mb-3">
          Para acceder a tu cuenta:
        </p>
        <ol className="text-yellow-700 text-sm space-y-1 ml-4">
          <li>1. Revisa tu bandeja de entrada</li>
          <li>2. También verifica tu carpeta de spam</li>
          <li>3. Haz clic en el enlace de confirmación</li>
          <li>4. Regresa aquí e intenta iniciar sesión</li>
        </ol>
      </div>

      {/* Resend section */}
      <div className="border-t border-yellow-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-yellow-700 text-sm font-medium">
            ¿No recibiste el email?
          </p>
        </div>

        {/* Resend button */}
        <button
          onClick={handleResendConfirmation}
          disabled={isResending || resendStatus === 'success'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Reenviando...
            </>
          ) : resendStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Email enviado ✓
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Reenviar email de confirmación
            </>
          )}
        </button>

        {/* Status message */}
        {resendMessage && (
          <div className={`mt-3 p-3 rounded-lg text-sm flex items-start gap-2 ${
            resendStatus === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {resendStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{resendMessage}</span>
          </div>
        )}
      </div>

      {/* Additional help */}
      <div className="mt-4 pt-4 border-t border-yellow-200">
        <p className="text-yellow-600 text-xs">
          ¿Sigues teniendo problemas?{' '}
          <a
            href="#contact"
            className="font-medium hover:underline"
          >
            Contacta nuestro soporte
          </a>
        </p>
      </div>
    </div>
  )
}

// Compact version for use in forms
export function EmailConfirmationAlert({
  email,
  className = ''
}: {
  email: string
  className?: string
}) {
  const [showResend, setShowResend] = useState(false)
  const { resendConfirmation } = useAuthActions()

  const handleResend = async () => {
    await resendConfirmation(email)
    setShowResend(false)
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-yellow-800 text-sm font-medium mb-1">
            Email no confirmado
          </p>
          <p className="text-yellow-700 text-xs mb-2">
            Revisa tu email y confirma tu cuenta para continuar.
          </p>
          {!showResend ? (
            <button
              onClick={() => setShowResend(true)}
              className="text-yellow-700 text-xs font-medium hover:underline"
            >
              Reenviar confirmación
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResend}
                className="text-yellow-700 text-xs font-medium hover:underline"
              >
                Confirmar reenvío
              </button>
              <button
                onClick={() => setShowResend(false)}
                className="text-yellow-600 text-xs hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}