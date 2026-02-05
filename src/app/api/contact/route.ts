import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/utils/validation'
import { generateLeadScore } from '@/lib/utils/validation'
import { createClient } from '@/lib/supabase/server'
import { createMonitoredAPIHandler } from '@/lib/analytics/api-middleware'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  maxRequests: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const key = `contact:${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  rateLimitStore.set(key, record)
  return { allowed: true }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'anonymous'
}

async function handleContactFormSubmission(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request)
    const rateLimitResult = checkRateLimit(clientIp)

    if (!rateLimitResult.allowed) {
      const retryAfter = rateLimitResult.resetTime
        ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        : RATE_LIMIT.windowMs / 1000

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Demasiadas solicitudes. Intenta nuevamente en 15 minutos.',
            retry_after: retryAfter
          }
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString()
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Datos inválidos',
            details: validationResult.error.errors.reduce((acc, err) => {
              acc[err.path.join('.')] = err.message
              return acc
            }, {} as Record<string, string>)
          }
        },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // Initialize Supabase client
    const supabase = await createClient()

    // Check for duplicate email
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, created_at')
      .eq('email', formData.email)
      .maybeSingle() as { data: { id: string; created_at: string } | null; error: any }

    if (checkError) {
      console.error('Database check error:', checkError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Error interno del servidor. Intenta nuevamente.'
          }
        },
        { status: 500 }
      )
    }

    if (existingLead) {
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(existingLead.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_LEAD',
            message: 'Este email ya está registrado',
            data: {
              existing_lead_created: existingLead.created_at,
              suggestion: daysSinceCreated < 7
                ? 'Te contactaremos pronto con la información solicitada.'
                : 'Si no has recibido respuesta, contáctanos directamente al WhatsApp +52 123 456 7890'
            }
          }
        },
        { status: 409 }
      )
    }

    // Extract UTM parameters from headers if not in body
    const utmSource = formData.utm_source || request.nextUrl.searchParams.get('utm_source') || 'direct'

    // Generate lead score
    const leadScore = generateLeadScore({
      business_type: formData.business_type,
      utmSource: utmSource
    })

    const utmMedium = formData.utm_medium || request.nextUrl.searchParams.get('utm_medium') || null
    const utmCampaign = formData.utm_campaign || request.nextUrl.searchParams.get('utm_campaign') || null

    // Create lead in database
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      // @ts-ignore
      .insert({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        phone: formData.whatsapp,
        business_type: formData.business_type,
        message: formData.message || null,
        status: 'new',
        source: 'website',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        lead_score: leadScore
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Error al guardar la información. Intenta nuevamente.'
          }
        },
        { status: 500 }
      )
    }

    // Log analytics event
    try {
      await supabase
        .from('landing_analytics')
        // @ts-ignore
        .insert({
          session_id: request.headers.get('x-session-id') || `session_${Date.now()}`,
          page_path: '/contact-form',
          visitor_ip: clientIp,
          user_agent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          form_submitted: true,
          time_on_page: null
        })
    } catch (analyticsError) {
      // Analytics failure shouldn't block the main flow
      console.warn('Analytics insert error:', analyticsError)
    }

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to lead
    // TODO: Trigger automation sequences

    return NextResponse.json(
      {
        success: true,
        message: '¡Solicitud enviada exitosamente!',
        data: {
          id: (newLead as any)?.id || 'unknown',
          lead_score: leadScore,
          next_steps: 'Recibirás un email de confirmación en los próximos minutos. Te contactaremos dentro de las próximas 2 horas.'
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error in contact API:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error interno del servidor. Intenta nuevamente más tarde.'
        }
      },
      { status: 500 }
    )
  }
}

// Export the monitored version of the handler
export const POST = createMonitoredAPIHandler(handleContactFormSubmission as any, '/api/contact');