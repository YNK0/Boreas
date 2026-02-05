'use client'

import React, { useState, useRef } from 'react'
import { addTouchFeedback } from '@/lib/utils/mobile-optimizations'

interface TouchOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  hapticFeedback?: boolean
  children: React.ReactNode
}

export function TouchOptimizedButton({
  variant = 'primary',
  size = 'md',
  hapticFeedback = false,
  className = '',
  children,
  onClick,
  ...props
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (buttonRef.current) {
      addTouchFeedback(buttonRef.current)
    }
  }, [])

  const handleTouchStart = () => {
    setIsPressed(true)

    // Haptic feedback for supported devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10) // Very short vibration
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add visual feedback for non-touch devices
    if (!('ontouchstart' in window)) {
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 150)
    }

    onClick?.(e)
  }

  const baseClasses = 'touch-target transition-all duration-200 ease-out font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const pressedClasses = isPressed ? 'transform scale-95' : ''

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${pressedClasses} ${className}`

  return (
    <button
      ref={buttonRef}
      className={combinedClasses}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default TouchOptimizedButton