import React from 'react'
import { EMAIL_CONFIG, BusinessType } from '../resend-client'

interface FollowupEmailProps {
  name: string
  businessType?: BusinessType
  company?: string
  sequence: 1 | 2 | 3 // Which follow-up email this is
}

// Case studies data for different business types
const CASE_STUDIES = {
  salon: {
    name: 'Nails & Beauty Studio (Guadalajara)',
    problem: 'Perdían 30% de citas por no-shows y no tenían tiempo para confirmar manualmente',
    solution: 'Automatización de confirmación 24hrs antes + recordatorio 2hrs antes',
    results: ['85% menos no-shows', '3 horas diarias ahorradas', '$45,000 MXN extra al mes']
  },
  restaurant: {
    name: 'Restaurante La Mesa (CDMX)',
    problem: 'Mesas vacías por cancelaciones de último minuto y mal manejo de lista de espera',
    solution: 'Sistema automático de confirmación + lista de espera inteligente',
    results: ['95% ocupación promedio', '20% más ventas los fines de semana', 'Tiempo de respuesta 2 minutos']
  },
  clinic: {
    name: 'Clínica Dental Sonríe (Monterrey)',
    problem: '40% de pacientes no asistían a citas de seguimiento',
    solution: 'Secuencia automática post-consulta + recordatorios de tratamiento',
    results: ['70% asistencia a seguimientos', '35% más tratamientos completados', 'Mejor salud dental de pacientes']
  },
  other: {
    name: 'Negocio Local Exitoso',
    problem: 'Comunicación manual con clientes tomaba demasiado tiempo',
    solution: 'Automatización personalizada de comunicación',
    results: ['50% menos tiempo en admin', '30% más ventas', 'Clientes más satisfechos']
  }
} as const

export function getFollowupEmailHtml({ name, businessType = 'other', company, sequence }: FollowupEmailProps): string {
  const businessConfig = EMAIL_CONFIG.businessTypes[businessType]
  const firstName = name.split(' ')[0]
  const caseStudy = CASE_STUDIES[businessType] || CASE_STUDIES.other

  // Different content based on sequence number
  const getSequenceContent = () => {
    switch (sequence) {
      case 1:
        return {
          subject: `${firstName}, caso de éxito: ${caseStudy.name}`,
          mainHeading: 'Te comparto un caso real de éxito 📈',
          intro: 'Como prometí, aquí tienes un ejemplo real de cómo otro negocio como el tuyo está usando automatización de WhatsApp.',
          cta: {
            text: 'Quiero mi automatización personalizada',
            url: 'https://calendly.com/boreas-demo'
          }
        }

      case 2:
        return {
          subject: `${firstName}, ¿15 minutos para ver tu automatización?`,
          mainHeading: '¿Te mostrar tu automatización en 15 minutos? 📱',
          intro: 'He estado pensando en tu caso específico y ya tengo algunas ideas de cómo podríamos automatizar WhatsApp para optimizar tu operación.',
          cta: {
            text: 'Sí, quiero ver mi demo personalizada',
            url: 'https://calendly.com/boreas-demo'
          }
        }

      case 3:
        return {
          subject: `${firstName}, última oportunidad - descuento especial`,
          mainHeading: '🎯 Oferta especial solo para ti',
          intro: 'Como no hemos podido conectar, quiero ofrecerte algo especial para que puedas probar Boreas sin riesgo.',
          cta: {
            text: 'Acepto la oferta especial',
            url: 'https://calendly.com/boreas-demo'
          }
        }
    }
  }

  const content = getSequenceContent()

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background-color: #1e40af; color: white; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Boreas</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <h2 style="color: #1e40af; font-size: 22px; font-weight: bold; margin-bottom: 16px;">${content.mainHeading}</h2>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
        Hola ${firstName},
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
        ${content.intro}
      </p>

      ${sequence === 1 ? `
        <!-- Case Study -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Caso de Éxito: ${caseStudy.name}</h3>

          <div style="margin-bottom: 16px;">
            <h4 style="color: #dc2626; font-size: 16px; font-weight: bold; margin-bottom: 8px;">❌ Problema:</h4>
            <p style="font-size: 14px; line-height: 1.5; color: #374151; margin: 0;">${caseStudy.problem}</p>
          </div>

          <div style="margin-bottom: 16px;">
            <h4 style="color: #059669; font-size: 16px; font-weight: bold; margin-bottom: 8px;">✅ Solución:</h4>
            <p style="font-size: 14px; line-height: 1.5; color: #374151; margin: 0;">${caseStudy.solution}</p>
          </div>

          <div>
            <h4 style="color: #7c3aed; font-size: 16px; font-weight: bold; margin-bottom: 8px;">📊 Resultados:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              ${caseStudy.results.map(result => `<li style="font-size: 14px; line-height: 1.5; margin-bottom: 4px;">${result}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      ${sequence === 2 ? `
        <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #059669; font-size: 18px; font-weight: bold; margin-bottom: 12px;">Lo que podríamos automatizar para ${company || 'tu negocio'}:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
            <li style="margin-bottom: 8px;">Confirmación automática de citas/reservas</li>
            <li style="margin-bottom: 8px;">Recordatorios 24hrs y 2hrs antes</li>
            <li style="margin-bottom: 8px;">Seguimiento post-servicio automático</li>
            <li style="margin-bottom: 8px;">Recolección de reseñas en Google/Facebook</li>
            <li style="margin-bottom: 8px;">Promociones personalizadas a clientes frecuentes</li>
          </ul>
        </div>
      ` : ''}

      ${sequence === 3 ? `
        <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #92400e; font-size: 18px; font-weight: bold; margin-bottom: 12px;">🎁 Oferta Especial - Solo por esta semana:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>50% descuento</strong> en setup (valor normal: $2,999 MXN)</li>
            <li style="margin-bottom: 8px;"><strong>Primer mes GRATIS</strong> para probar sin riesgo</li>
            <li style="margin-bottom: 8px;"><strong>Setup completo en 24hrs</strong> (normalmente 3-5 días)</li>
            <li style="margin-bottom: 8px;"><strong>Soporte VIP</strong> los primeros 3 meses</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          <strong>¿Por qué esta oferta?</strong> Porque creo mucho en el potencial que tiene ${company || 'tu negocio'}
          y quiero asegurarme de que puedas experimentar los beneficios sin ningún riesgo.
        </p>
      ` : ''}

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${content.cta.url}" style="display: inline-block; background-color: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          ${content.cta.text}
        </a>
      </div>

      ${sequence === 3 ? `
        <p style="font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center; margin-bottom: 20px;">
          Esta oferta expira el viernes. Solo para los primeros 10 negocios.
        </p>
      ` : ''}

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
        ${sequence === 1 ? `¿Te gustaría que te muestre cómo podríamos lograr resultados similares para ${company || 'tu negocio'}?` : ''}
        ${sequence === 2 ? 'Solo serían 15 minutos para mostrarte exactamente cómo funcionaría en tu caso específico.' : ''}
        ${sequence === 3 ? 'Si esta oferta no es para ti, está perfectamente bien. Solo responde este email y te elimino de la lista.' : ''}
      </p>

      <!-- Signature -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 32px;">
        <p style="font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 4px;">Francisco Magaña</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Founder & CEO, Boreas</p>
        <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">📱 WhatsApp: +52 (662) 123-4567</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        <a href="#" style="color: #6b7280; text-decoration: underline;">Cancelar suscripción</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}