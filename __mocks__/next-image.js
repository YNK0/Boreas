// Mock Next.js Image component for testing
import React from 'react'

const NextImage = ({ src, alt, width, height, className, onLoad, onError, ...props }) => {
  React.useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      if (src.includes('broken') || src.includes('error')) {
        if (onError) {
          onError(new Error('Mock image load error'))
        }
      } else {
        if (onLoad) {
          onLoad()
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [src, onLoad, onError])

  return React.createElement('img', {
    src,
    alt,
    width,
    height,
    className,
    'data-testid': 'next-image',
    ...props
  })
}

export default NextImage