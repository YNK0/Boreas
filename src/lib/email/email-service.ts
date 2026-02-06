import { resend, EMAIL_CONFIG, BusinessType } from './resend-client'
import { getWelcomeEmailHtml } from './templates/welcome-email'
import { getFollowupEmailHtml } from './templates/followup-email'
import { createClient } from '@/lib/supabase/server'

export interface EmailRecipient {
  name: string
  email: string
  businessType?: BusinessType
  company?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Email sending service
class EmailService {
  private async logEmail(params: {
    leadId?: string
    clientId?: string
    email: string
    templateName: string
    subject: string
    providerId?: string
    status: 'sent' | 'failed'
  }) {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('email_logs')
        // @ts-ignore - Supabase types are complex, but this is the correct format
        .insert({
          lead_id: params.leadId,
          client_id: params.clientId,
          email: params.email,
          template_name: params.templateName,
          subject: params.subject,
          provider_id: params.providerId,
          status: params.status,
          sent_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error logging email:', error)
      }
    } catch (error) {
      console.error('Error logging email:', error)
    }
  }

  async sendWelcomeEmail(recipient: EmailRecipient, leadId?: string): Promise<EmailResult> {
    try {
      const firstName = recipient.name.split(' ')[0]
      const businessConfig = EMAIL_CONFIG.businessTypes[recipient.businessType || 'other']

      const subject = `¡Hola ${firstName}! Tu automatización de WhatsApp para ${businessConfig.industry} te espera 🚀`
      const htmlContent = getWelcomeEmailHtml({
        name: recipient.name,
        businessType: recipient.businessType,
        company: recipient.company
      })

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.addresses.welcome,
        to: [recipient.email],
        subject: subject,
        html: htmlContent,
        // Add tags for tracking
        tags: [
          { name: 'email_type', value: 'welcome' },
          { name: 'business_type', value: recipient.businessType || 'other' }
        ]
      })

      if (error) {
        console.error('Error sending welcome email:', error)

        await this.logEmail({
          leadId,
          email: recipient.email,
          templateName: 'welcome',
          subject,
          status: 'failed'
        })

        return {
          success: false,
          error: error.message
        }
      }

      // Log successful email
      await this.logEmail({
        leadId,
        email: recipient.email,
        templateName: 'welcome',
        subject,
        providerId: data?.id,
        status: 'sent'
      })

      return {
        success: true,
        messageId: data?.id
      }

    } catch (error) {
      console.error('Unexpected error sending welcome email:', error)

      await this.logEmail({
        leadId,
        email: recipient.email,
        templateName: 'welcome',
        subject: 'Welcome email (failed)',
        status: 'failed'
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async sendFollowupEmail(
    recipient: EmailRecipient,
    sequence: 1 | 2 | 3,
    leadId?: string
  ): Promise<EmailResult> {
    try {
      const firstName = recipient.name.split(' ')[0]

      const subjectMap = {
        1: `${firstName}, caso de éxito real que te va a inspirar 📈`,
        2: `${firstName}, ¿15 minutos para ver tu automatización personalizada? 📱`,
        3: `${firstName}, oferta especial solo para ti (expira pronto) 🎯`
      }

      const subject = subjectMap[sequence]
      const htmlContent = getFollowupEmailHtml({
        name: recipient.name,
        businessType: recipient.businessType,
        company: recipient.company,
        sequence
      })

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.addresses.followup,
        to: [recipient.email],
        subject: subject,
        html: htmlContent,
        tags: [
          { name: 'email_type', value: 'followup' },
          { name: 'sequence', value: sequence.toString() },
          { name: 'business_type', value: recipient.businessType || 'other' }
        ]
      })

      if (error) {
        console.error(`Error sending followup email ${sequence}:`, error)

        await this.logEmail({
          leadId,
          email: recipient.email,
          templateName: `followup_${sequence}`,
          subject,
          status: 'failed'
        })

        return {
          success: false,
          error: error.message
        }
      }

      // Log successful email
      await this.logEmail({
        leadId,
        email: recipient.email,
        templateName: `followup_${sequence}`,
        subject,
        providerId: data?.id,
        status: 'sent'
      })

      return {
        success: true,
        messageId: data?.id
      }

    } catch (error) {
      console.error(`Unexpected error sending followup email ${sequence}:`, error)

      await this.logEmail({
        leadId,
        email: recipient.email,
        templateName: `followup_${sequence}`,
        subject: `Followup ${sequence} (failed)`,
        status: 'failed'
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async sendAdminNotification(leadData: {
    name: string
    email: string
    company?: string
    phone?: string
    businessType?: string
    message?: string
    leadScore: number
    source: string
  }): Promise<EmailResult> {
    try {
      const subject = `🚨 Nuevo Lead: ${leadData.name} (${leadData.businessType || 'otro'}) - Score: ${leadData.leadScore}`

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Nuevo Lead Capturado</h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Información del Lead</h3>
            <p><strong>Nombre:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Empresa:</strong> ${leadData.company || 'No especificada'}</p>
            <p><strong>Teléfono:</strong> ${leadData.phone || 'No especificado'}</p>
            <p><strong>Tipo de negocio:</strong> ${leadData.businessType || 'Otro'}</p>
            <p><strong>Lead Score:</strong> ${leadData.leadScore}/100</p>
            <p><strong>Fuente:</strong> ${leadData.source}</p>
          </div>

          ${leadData.message ? `
            <div style="background-color: #e5f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3>Mensaje:</h3>
              <p>${leadData.message}</p>
            </div>
          ` : ''}

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px;">
            <h3>Acciones Automatizadas</h3>
            <p>✅ Email de bienvenida enviado</p>
            <p>📅 Secuencia de seguimiento iniciada</p>
            <p>📊 Lead agregado al CRM</p>
          </div>
        </div>
      `

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.addresses.sales,
        to: ['francisco@boreas.mx'], // Admin email
        subject: subject,
        html: htmlContent,
        tags: [
          { name: 'email_type', value: 'admin_notification' },
          { name: 'lead_score', value: leadData.leadScore.toString() }
        ]
      })

      if (error) {
        console.error('Error sending admin notification:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        messageId: data?.id
      }

    } catch (error) {
      console.error('Unexpected error sending admin notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Utility function to schedule follow-up emails (for future implementation with a job queue)
export function scheduleFollowupEmails(leadId: string, recipient: EmailRecipient) {
  // For now, we'll just log the schedule
  // In production, you'd use a job queue like Inngest, Trigger.dev, or cron jobs
  console.log(`Scheduling follow-up emails for lead ${leadId}:`)
  console.log(`- Followup 1: ${EMAIL_CONFIG.timing.followup1} hours from now`)
  console.log(`- Followup 2: ${EMAIL_CONFIG.timing.followup2} hours from now`)
  console.log(`- Followup 3: ${EMAIL_CONFIG.timing.followup3} hours from now`)

  // TODO: Implement actual scheduling with your preferred job queue system
  // Example pseudo-code:
  // await scheduleJob({
  //   name: 'send_followup_email',
  //   data: { leadId, recipient, sequence: 1 },
  //   runAt: new Date(Date.now() + EMAIL_CONFIG.timing.followup1 * 60 * 60 * 1000)
  // })
}