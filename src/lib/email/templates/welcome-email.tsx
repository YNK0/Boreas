import React from 'react'
import { EMAIL_CONFIG, BusinessType } from '../resend-client'

interface WelcomeEmailProps {
  name: string
  businessType?: BusinessType
  company?: string
}

export function WelcomeEmail({ name, businessType = 'other', company }: WelcomeEmailProps) {
  const businessConfig = EMAIL_CONFIG.businessTypes[businessType]
  const firstName = name.split(' ')[0]

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
          Boreas
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '16px', opacity: '0.9' }}>
          Automatización de WhatsApp para {businessConfig.industry}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px', backgroundColor: '#ffffff' }}>
        <h2 style={{
          color: '#1e40af',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          ¡Hola {firstName}! 👋
        </h2>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '20px' }}>
          Gracias por tu interés en automatizar WhatsApp para {company ? company : `tu ${businessConfig.industry.slice(0, -1)}`}.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '24px' }}>
          Me da mucho gusto saber que estás buscando maneras de {businessConfig.useCase}
          y {businessConfig.benefit}. ¡Estás en el lugar correcto!
        </p>

        {/* Value Proposition Box */}
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            color: '#1e40af',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            ¿Qué hace Boreas por {businessConfig.industry}?
          </h3>

          <ul style={{ margin: '0', paddingLeft: '20px', color: '#374151', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Automatización 100% en español</strong> diseñada para negocios mexicanos
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Setup en menos de 2 horas</strong> (sin conocimientos técnicos)
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Soporte humano en México</strong> cuando lo necesites
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Resultados desde el día 1:</strong> {businessConfig.benefit}
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #d1fae5',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            color: '#059669',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            📅 Próximos pasos
          </h3>

          <p style={{ margin: '0 0 12px 0', color: '#374151', lineHeight: '1.6' }}>
            Te contactaremos en las <strong>próximas 2 horas</strong> para:
          </p>

          <ol style={{ margin: '0', paddingLeft: '20px', color: '#374151', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '8px' }}>
              Entender exactamente cómo funcionas ahora con WhatsApp
            </li>
            <li style={{ marginBottom: '8px' }}>
              Mostrarte casos de éxito de otros {businessConfig.industry}
            </li>
            <li style={{ marginBottom: '8px' }}>
              Diseñar tu automatización personalizada (sin compromiso)
            </li>
          </ol>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '20px' }}>
          Mientras tanto, estaré preparando algunos ejemplos específicos para {company ? company : `tu ${businessConfig.industry.slice(0, -1)}`}.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '32px' }}>
          ¡Nos vemos muy pronto! 🚀
        </p>

        {/* Signature */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
            Francisco Magaña
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            Founder & CEO, Boreas
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            📱 WhatsApp: +52 (662) 123-4567 | 📧 francisco@boreas.mx
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0 0 8px 0'
        }}>
          Este email fue enviado porque solicitaste información sobre automatización de WhatsApp.
        </p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
          Boreas - Automatización inteligente para negocios mexicanos
        </p>
      </div>
    </div>
  )
}

export function getWelcomeEmailHtml(props: WelcomeEmailProps): string {
  // For now, return a simplified HTML version
  // In production, you might want to use a proper React to HTML renderer
  const businessConfig = EMAIL_CONFIG.businessTypes[props.businessType || 'other']
  const firstName = props.name.split(' ')[0]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido a Boreas!</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background-color: #1e40af; color: white; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Boreas</h1>
      <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Automatización de WhatsApp para ${businessConfig.industry}</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <h2 style="color: #1e40af; font-size: 24px; font-weight: bold; margin-bottom: 16px;">¡Hola ${firstName}! 👋</h2>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
        Gracias por tu interés en automatizar WhatsApp para ${props.company ? props.company : `tu ${businessConfig.industry.slice(0, -1)}`}.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
        Me da mucho gusto saber que estás buscando maneras de ${businessConfig.useCase} y ${businessConfig.benefit}. ¡Estás en el lugar correcto!
      </p>

      <!-- Value Proposition -->
      <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 12px;">¿Qué hace Boreas por ${businessConfig.industry}?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
          <li style="margin-bottom: 8px;"><strong>Automatización 100% en español</strong> diseñada para negocios mexicanos</li>
          <li style="margin-bottom: 8px;"><strong>Setup en menos de 2 horas</strong> (sin conocimientos técnicos)</li>
          <li style="margin-bottom: 8px;"><strong>Soporte humano en México</strong> cuando lo necesites</li>
          <li style="margin-bottom: 8px;"><strong>Resultados desde el día 1:</strong> ${businessConfig.benefit}</li>
        </ul>
      </div>

      <!-- Next Steps -->
      <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #059669; font-size: 18px; font-weight: bold; margin-bottom: 12px;">📅 Próximos pasos</h3>
        <p style="margin: 0 0 12px 0; color: #374151; line-height: 1.6;">Te contactaremos en las <strong>próximas 2 horas</strong> para:</p>
        <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
          <li style="margin-bottom: 8px;">Entender exactamente cómo funcionas ahora con WhatsApp</li>
          <li style="margin-bottom: 8px;">Mostrarte casos de éxito de otros ${businessConfig.industry}</li>
          <li style="margin-bottom: 8px;">Diseñar tu automatización personalizada (sin compromiso)</li>
        </ol>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
        Mientras tanto, estaré preparando algunos ejemplos específicos para ${props.company ? props.company : `tu ${businessConfig.industry.slice(0, -1)}`}.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 32px;">¡Nos vemos muy pronto! 🚀</p>

      <!-- Signature -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 4px;">Francisco Magaña</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Founder & CEO, Boreas</p>
        <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">📱 WhatsApp: +52 (662) 123-4567 | 📧 francisco@boreas.mx</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">Este email fue enviado porque solicitaste información sobre automatización de WhatsApp.</p>
      <p style="font-size: 12px; color: #6b7280; margin: 0;">Boreas - Automatización inteligente para negocios mexicanos</p>
    </div>

  </div>
</body>
</html>
  `.trim()
}