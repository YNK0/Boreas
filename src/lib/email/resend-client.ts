import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'Boreas <hello@boreas.mx>'
export const SUPPORT_EMAIL = 'soporte@boreas.mx'

// Email configuration
export const EMAIL_CONFIG = {
  // From address for different email types
  addresses: {
    welcome: FROM_EMAIL,
    followup: FROM_EMAIL,
    support: `Soporte ${SUPPORT_EMAIL}`,
    sales: `Ventas ${FROM_EMAIL}`
  },

  // Email timing (in hours)
  timing: {
    welcome: 0,        // Immediate
    followup1: 24,     // 24 hours after welcome
    followup2: 48,     // 48 hours after welcome
    followup3: 168,    // 1 week after welcome
  },

  // Business type specific content keys
  businessTypes: {
    salon: {
      industry: 'salones de belleza',
      useCase: 'automatizar citas de uñas, cabello y tratamientos',
      benefit: 'reducir no-shows y llenar más espacios'
    },
    restaurant: {
      industry: 'restaurantes',
      useCase: 'automatizar reservaciones y pedidos',
      benefit: 'optimizar mesas y aumentar ventas por mesa'
    },
    clinic: {
      industry: 'clínicas médicas',
      useCase: 'automatizar citas médicas y recordatorios',
      benefit: 'reducir no-shows y mejorar atención al paciente'
    },
    dentist: {
      industry: 'consultorios dentales',
      useCase: 'automatizar citas y seguimiento post-tratamiento',
      benefit: 'aumentar retención de pacientes y tratamientos'
    },
    veterinary: {
      industry: 'veterinarias',
      useCase: 'automatizar citas y recordatorios de vacunación',
      benefit: 'mejorar salud de mascotas y ingresos recurrentes'
    },
    spa: {
      industry: 'spas y wellness',
      useCase: 'automatizar reservas de tratamientos y membresías',
      benefit: 'aumentar frecuencia de visitas y ventas adicionales'
    },
    gym: {
      industry: 'gimnasios',
      useCase: 'automatizar inscripciones y seguimiento de clientes',
      benefit: 'reducir churn y aumentar renovaciones'
    },
    retail: {
      industry: 'tiendas locales',
      useCase: 'automatizar seguimiento post-compra y promociones',
      benefit: 'aumentar compras repetidas y valor por cliente'
    },
    other: {
      industry: 'negocios locales',
      useCase: 'automatizar comunicación con clientes',
      benefit: 'mejorar experiencia del cliente y eficiencia operativa'
    }
  }
} as const

export type BusinessType = keyof typeof EMAIL_CONFIG.businessTypes