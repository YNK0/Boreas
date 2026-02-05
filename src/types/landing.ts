// Landing page specific types based on landing-spec.md

import { Database } from './database'

// Contact form data
export interface ContactFormData {
  name: string
  email: string
  whatsapp: string
  company?: string
  business_type: Database['public']['Enums']['business_type']
  city: string
  message?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// Use case data structure
export interface UseCase {
  id: string
  title: string
  subtitle: string
  description: string
  business_type: Database['public']['Enums']['business_type']
  features: string[]
  metrics: {
    time_saved: string
    efficiency_gain: string
    cost_reduction: string
  }
  image_url: string
  cta_text: string
}

// Testimonial data structure
export interface Testimonial {
  id: string
  name: string
  company: string
  business_type: Database['public']['Enums']['business_type']
  quote: string
  avatar_url?: string
  rating: number
  results?: {
    metric: string
    before: string
    after: string
    improvement: string
  }
  featured: boolean
}

// FAQ data structure
export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'pricing' | 'technical' | 'support'
  order: number
}

// Pricing plan structure
export interface PricingPlan {
  id: string
  name: string
  price: number
  billing: 'monthly' | 'annual'
  description: string
  features: string[]
  limitations?: string[]
  setup_fee?: number
  popular?: boolean
  cta_text: string
}

// UTM parameters
export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// Contact form props
export interface ContactFormProps {
  variant: 'hero' | 'inline' | 'modal'
  prefilledData?: Partial<ContactFormData>
  utmParams?: UTMParams
  onSuccess?: (leadId: string) => void
  onError?: (error: any) => void
}

// Analytics events
export interface AnalyticsEvent {
  event: string
  properties: {
    session_id: string
    page_path: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    [key: string]: any
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string> | string[]
  field?: string
}

// Contact form API response
export interface ContactResponse {
  id: string
  lead_score: number
  next_steps: string
}

// Business type options for forms
export const businessTypeOptions = [
  { value: 'salon', label: 'Salón de Belleza' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'clinic', label: 'Clínica Médica' },
  { value: 'dentist', label: 'Consultorio Dental' },
  { value: 'veterinary', label: 'Veterinaria' },
  { value: 'spa', label: 'Spa' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'retail', label: 'Tienda' },
  { value: 'other', label: 'Otro' },
] as const

// Form validation errors
export interface FormFieldError {
  field: string
  code: string
  message: string
}

// Case study data
export interface CaseStudy {
  id: string
  industry: Database['public']['Enums']['business_type']
  company_name: string
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  quote: string
  image_url: string
  featured: boolean
  order: number
}

// Landing page content structure
export interface LandingPageContent {
  hero: {
    title: string
    subtitle: string
    cta_primary: string
    cta_secondary: string
    trust_indicators: string[]
  }
  case_studies: CaseStudy[]
  testimonials: Testimonial[]
  faq: FAQ[]
  pricing: PricingPlan[]
}