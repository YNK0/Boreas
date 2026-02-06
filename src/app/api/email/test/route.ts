import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/email-service'

// Test endpoint for email system - only works in development
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    return NextResponse.json({ error: 'Test endpoint not available in production' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { emailType, recipient, sequence } = body

    if (!emailType || !recipient || !recipient.name || !recipient.email) {
      return NextResponse.json({
        error: 'emailType and recipient (with name and email) are required'
      }, { status: 400 })
    }

    let result

    switch (emailType) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(recipient)
        break

      case 'followup':
        if (!sequence || ![1, 2, 3].includes(sequence)) {
          return NextResponse.json({
            error: 'sequence (1, 2, or 3) is required for followup emails'
          }, { status: 400 })
        }
        result = await emailService.sendFollowupEmail(recipient, sequence)
        break

      case 'admin':
        result = await emailService.sendAdminNotification({
          name: recipient.name,
          email: recipient.email,
          company: recipient.company || 'Test Company',
          phone: recipient.phone || '+52 123 456 7890',
          businessType: recipient.businessType || 'salon',
          message: 'This is a test lead from the email test endpoint',
          leadScore: 85,
          source: 'test'
        })
        break

      default:
        return NextResponse.json({
          error: 'Invalid emailType. Use: welcome, followup, or admin'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error
    })

  } catch (error) {
    console.error('Error in email test endpoint:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to show test email examples
export async function GET() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    return NextResponse.json({ error: 'Test endpoint not available in production' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'Email Test Endpoint',
    examples: {
      welcome: {
        method: 'POST',
        body: {
          emailType: 'welcome',
          recipient: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            businessType: 'salon',
            company: 'Salón Bella Vista'
          }
        }
      },
      followup1: {
        method: 'POST',
        body: {
          emailType: 'followup',
          sequence: 1,
          recipient: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            businessType: 'salon',
            company: 'Salón Bella Vista'
          }
        }
      },
      followup2: {
        method: 'POST',
        body: {
          emailType: 'followup',
          sequence: 2,
          recipient: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            businessType: 'restaurant',
            company: 'Restaurante La Mesa'
          }
        }
      },
      followup3: {
        method: 'POST',
        body: {
          emailType: 'followup',
          sequence: 3,
          recipient: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            businessType: 'clinic',
            company: 'Clínica Dental'
          }
        }
      },
      adminNotification: {
        method: 'POST',
        body: {
          emailType: 'admin',
          recipient: {
            name: 'Test Lead',
            email: 'test@example.com',
            businessType: 'salon',
            company: 'Test Business',
            phone: '+52 123 456 7890'
          }
        }
      }
    },
    supportedBusinessTypes: [
      'salon', 'restaurant', 'clinic', 'dentist',
      'veterinary', 'spa', 'gym', 'retail', 'other'
    ]
  })
}