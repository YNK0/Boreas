'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ArrowLeft, ArrowRight, MessageSquare, BarChart3, Settings, Users } from 'lucide-react'

interface TourStep {
  id: string
  title: string
  description: string
  target: string // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right'
  icon?: React.ReactNode
  highlight?: boolean
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido a tu Dashboard',
    description: 'Desde aquí puedes monitorear y controlar toda tu automatización de WhatsApp. Te mostraremos las funciones principales.',
    target: '[data-tour="dashboard-header"]',
    position: 'bottom',
    icon: <BarChart3 className="w-5 h-5" />,
    highlight: true
  },
  {
    id: 'messages',
    title: 'Centro de Mensajes',
    description: 'Aquí verás todas las conversaciones automatizadas, respuestas enviadas y métricas de engagement.',
    target: '[data-tour="messages-section"]',
    position: 'top',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    id: 'analytics',
    title: 'Analytics en Tiempo Real',
    description: 'Monitorea conversiones, respuestas exitosas y ROI de tu automatización WhatsApp.',
    target: '[data-tour="analytics-section"]',
    position: 'left',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'clients',
    title: 'Gestión de Clientes',
    description: 'Administra contactos, segmenta audiencias y personaliza mensajes automáticos.',
    target: '[data-tour="clients-section"]',
    position: 'top',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'settings',
    title: 'Configuración',
    description: 'Conecta tu WhatsApp Business, configura horarios y personaliza respuestas automáticas.',
    target: '[data-tour="settings-section"]',
    position: 'left',
    icon: <Settings className="w-5 h-5" />
  }
]

interface DashboardTourProps {
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
}

export default function DashboardTour({ isActive, onComplete, onSkip }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      calculateTooltipPosition()
    } else {
      setIsVisible(false)
    }
  }, [isActive, currentStep])

  const calculateTooltipPosition = () => {
    const step = tourSteps[currentStep]
    const targetElement = document.querySelector(step.target)

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      const tooltipWidth = 320
      const tooltipHeight = 200
      let top = rect.bottom + 16
      let left = rect.left + (rect.width / 2) - (tooltipWidth / 2)

      // Adjust position based on step preference
      switch (step.position) {
        case 'top':
          top = rect.top - tooltipHeight - 16
          break
        case 'bottom':
          top = rect.bottom + 16
          break
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
          left = rect.left - tooltipWidth - 16
          break
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
          left = rect.right + 16
          break
      }

      // Keep tooltip within viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      if (left < 16) left = 16
      if (left + tooltipWidth > viewport.width - 16) {
        left = viewport.width - tooltipWidth - 16
      }
      if (top < 16) top = 16
      if (top + tooltipHeight > viewport.height - 16) {
        top = viewport.height - tooltipHeight - 16
      }

      setTooltipPosition({ top, left })

      // Highlight target element
      if (step.highlight) {
        targetElement.classList.add('tour-highlight')
      }
    }
  }

  const handleNext = () => {
    // Remove highlight from current element
    const currentTarget = document.querySelector(tourSteps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    // Remove highlight from current element
    const currentTarget = document.querySelector(tourSteps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Clean up highlights
    tourSteps.forEach(step => {
      const element = document.querySelector(step.target)
      if (element) {
        element.classList.remove('tour-highlight')
      }
    })

    setIsVisible(false)
    onComplete()
  }

  const handleSkip = () => {
    // Clean up highlights
    tourSteps.forEach(step => {
      const element = document.querySelector(step.target)
      if (element) {
        element.classList.remove('tour-highlight')
      }
    })

    setIsVisible(false)
    onSkip()
  }

  if (!isVisible) return null

  const step = tourSteps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-w-sm"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step.icon && (
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                {step.icon}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{step.title}</h3>
              <p className="text-xs text-gray-500">
                Paso {currentStep + 1} de {tourSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Progreso del tour</span>
              <span className="text-xs text-gray-500">
                {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Omitir
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {currentStep === tourSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </>
  )
}