'use client'

import { useState } from 'react'
import { Clock, Info } from 'lucide-react'

interface ComingSoonProps {
  children: React.ReactNode
  message?: string
  feature?: string
  className?: string
  showTooltip?: boolean
}

export default function ComingSoon({
  children,
  message = "Próximamente disponible",
  feature,
  className = "",
  showTooltip = true
}: ComingSoonProps) {
  const [showInfo, setShowInfo] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowInfo(true)
    setTimeout(() => setShowInfo(false), 3000)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onClick={handleClick}
        className="cursor-not-allowed opacity-60 relative coming-soon-pulse"
        title={showTooltip ? message : undefined}
      >
        {children}
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <Clock className="w-3 h-3 text-amber-500" />
        </div>
      </div>

      {showInfo && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 coming-soon-tooltip">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg max-w-xs">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-normal">{message}</span>
            </div>
            {feature && (
              <div className="text-gray-300 mt-1 text-xs whitespace-normal">
                {feature}
              </div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Specialized version for links
interface ComingSoonLinkProps {
  href?: string
  children: React.ReactNode
  message?: string
  feature?: string
  className?: string
}

export function ComingSoonLink({
  href,
  children,
  message = "Esta página estará disponible pronto",
  feature,
  className = ""
}: ComingSoonLinkProps) {
  return (
    <ComingSoon message={message} feature={feature} className={className}>
      <span className={className}>
        {children}
      </span>
    </ComingSoon>
  )
}

// Badge component for features not ready
export function ComingSoonBadge({
  text = "Próximamente",
  className = ""
}: {
  text?: string
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 ${className}`}>
      <Clock className="w-3 h-3" />
      {text}
    </span>
  )
}