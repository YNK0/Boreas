'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallbackSrc?: string
  placeholder?: 'blur' | 'empty' | 'data:image/...'
  lazy?: boolean
  webp?: boolean
  sizes?: string
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  placeholder = 'empty',
  lazy = true,
  webp = true,
  sizes,
  quality = 85,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isInView])

  // Generate WebP source if enabled
  const getOptimizedSrc = (originalSrc: string) => {
    if (!webp) return originalSrc

    // Check if it's an external URL or already optimized
    if (originalSrc.startsWith('http') || originalSrc.includes('.webp')) {
      return originalSrc
    }

    // For local images, Next.js will handle WebP conversion automatically
    return originalSrc
  }

  const handleError = () => {
    if (fallbackSrc && !imageError) {
      setImageSrc(fallbackSrc)
      setImageError(true)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: props.height || 'auto' }}
    >
      {isInView ? (
        <>
          {/* Loading placeholder */}
          {!isLoaded && (
            <div
              className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
              style={{
                width: props.width || '100%',
                height: props.height || '100%'
              }}
            >
              <div className="text-gray-400 text-sm">Cargando...</div>
            </div>
          )}

          {/* Optimized Image */}
          <Image
            src={getOptimizedSrc(imageSrc)}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            quality={quality}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            placeholder={placeholder}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            {...props}
          />
        </>
      ) : (
        // Lazy loading placeholder
        <div
          className="bg-gray-100 flex items-center justify-center"
          style={{
            width: props.width || '100%',
            height: props.height || '200px'
          }}
        >
          <div className="text-gray-400 text-sm">📷</div>
        </div>
      )}
    </div>
  )
}

// Avatar component with optimized images
interface OptimizedAvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallbackText?: string
}

export function OptimizedAvatar({
  src,
  name,
  size = 'md',
  className = '',
  fallbackText
}: OptimizedAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  }

  const initials = fallbackText || name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {src ? (
        <OptimizedImage
          src={src}
          alt={`Avatar de ${name}`}
          width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
          height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
          className="rounded-full object-cover"
          fallbackSrc="/images/avatars/default-avatar.webp"
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}>
          {initials}
        </div>
      )}
    </div>
  )
}

// Company logo component with optimization
interface OptimizedLogoProps {
  src: string
  company: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function OptimizedLogo({
  src,
  company,
  size = 'md',
  className = ''
}: OptimizedLogoProps) {
  const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 }
  }

  return (
    <OptimizedImage
      src={src}
      alt={`Logo de ${company}`}
      width={sizeMap[size].width}
      height={sizeMap[size].height}
      className={`object-contain ${className}`}
      fallbackSrc="/images/logos/default-company.webp"
      quality={90}
    />
  )
}