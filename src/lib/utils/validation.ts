import { z } from 'zod'

// Contact form validation schema from landing-spec.md
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúñÑ\s]+$/, "Solo letras y espacios permitidos"),

  email: z.string()
    .email("Formato de email inválido")
    .max(255, "Email demasiado largo"),

  whatsapp: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Número de WhatsApp inválido")
    .min(10, "Número muy corto")
    .max(15, "Número muy largo"),

  company: z.string()
    .min(2, "Nombre de empresa muy corto")
    .max(100, "Nombre de empresa muy largo")
    .optional()
    .or(z.literal("")),

  business_type: z.enum([
    'salon', 'restaurant', 'clinic', 'dentist',
    'spa', 'gym', 'retail', 'other'
  ], { required_error: "Selecciona el tipo de negocio" }),

  city: z.string()
    .min(2, "Nombre de ciudad muy corto")
    .max(50, "Nombre de ciudad muy largo")
    .regex(/^[a-zA-ZáéíóúñÑ\s]+$/, "Solo letras y espacios permitidos"),

  message: z.string()
    .max(500, "Mensaje muy largo")
    .optional()
    .or(z.literal("")),

  // UTM parameters (optional)
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional()
})

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 0) return ''

  // Format Mexican phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // Format international numbers
  if (digits.length > 10 && digits.startsWith('52')) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`
  }

  return phone
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ')
}

export const generateLeadScore = (data: {
  business_type?: string
  timeOnPage?: number
  scrollDepth?: number
  ctaInteractions?: number
  utmSource?: string
}): number => {
  let score = 0

  // Business type scoring (0-30 points)
  const businessTypeScores = {
    salon: 30,
    restaurant: 25,
    clinic: 20,
    dentist: 20,
    spa: 15,
    gym: 15,
    retail: 10,
    other: 10
  }

  if (data.business_type && data.business_type in businessTypeScores) {
    score += businessTypeScores[data.business_type as keyof typeof businessTypeScores]
  }

  // Form completion (20 points)
  score += 20

  // Time on page (0-15 points)
  if (data.timeOnPage) {
    if (data.timeOnPage >= 120) score += 15        // >2min
    else if (data.timeOnPage >= 60) score += 10    // >1min
    else if (data.timeOnPage >= 30) score += 5     // >30s
  }

  // Scroll depth (0-10 points)
  if (data.scrollDepth) {
    if (data.scrollDepth >= 80) score += 10        // >80%
    else if (data.scrollDepth >= 50) score += 5    // >50%
  }

  // CTA interactions (0-15 points)
  if (data.ctaInteractions) {
    if (data.ctaInteractions >= 3) score += 15     // Multiple CTAs
    else if (data.ctaInteractions >= 1) score += 10 // Single CTA
  }

  // UTM source (0-10 points)
  if (data.utmSource) {
    if (['google-ads', 'facebook-ads', 'paid'].includes(data.utmSource)) {
      score += 10 // Paid traffic
    } else if (['google', 'organic'].includes(data.utmSource)) {
      score += 5  // Organic traffic
    }
    // Direct traffic gets 0 points
  }

  return Math.min(score, 100) // Cap at 100
}