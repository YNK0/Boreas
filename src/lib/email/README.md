# Boreas Email Automation System

Sistema completo de automatización de emails para leads de Boreas usando Resend.

## 🏗️ Arquitectura

```
src/lib/email/
├── resend-client.ts          # Cliente Resend y configuración
├── email-service.ts          # Servicio principal de envío
├── templates/
│   ├── welcome-email.tsx     # Template email bienvenida
│   └── followup-email.tsx    # Template emails seguimiento
└── README.md                # Esta documentación
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```bash
RESEND_API_KEY=your_resend_api_key
CRON_SECRET=your_secure_random_string
```

### Configuración del Cliente

El archivo `resend-client.ts` contiene:
- Cliente Resend configurado
- Direcciones de email por tipo
- Configuración de timing de seguimiento
- Contenido personalizado por tipo de negocio

## 📧 Tipos de Email

### 1. Email de Bienvenida
- **Trigger:** Inmediato al completar formulario de contacto
- **Template:** `welcome-email.tsx`
- **Contenido:** Saludo personalizado, propuesta de valor, próximos pasos
- **Personalización:** Según tipo de negocio (salon, restaurant, clinic, etc.)

### 2. Secuencia de Seguimiento
- **Email 1 (24h):** Caso de éxito relevante al tipo de negocio
- **Email 2 (48h):** Demo personalizada y automatización específica
- **Email 3 (1 semana):** Oferta especial con urgencia

### 3. Notificación Admin
- **Trigger:** Inmediato al recibir nuevo lead
- **Destinatario:** francisco@boreas.mx
- **Contenido:** Información completa del lead + acciones tomadas

## 🚀 Uso

### Envío Manual (para testing)

```typescript
import { emailService } from '@/lib/email/email-service'

// Email de bienvenida
const result = await emailService.sendWelcomeEmail({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  businessType: 'salon',
  company: 'Salón Bella Vista'
}, 'lead-id-optional')

// Email de seguimiento
const followupResult = await emailService.sendFollowupEmail({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  businessType: 'salon',
  company: 'Salón Bella Vista'
}, 2, 'lead-id') // sequence: 1, 2, o 3

// Notificación admin
const adminResult = await emailService.sendAdminNotification({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  company: 'Salón Bella Vista',
  phone: '+52 123 456 7890',
  businessType: 'salon',
  message: 'Mensaje del formulario',
  leadScore: 85,
  source: 'website'
})
```

### Integración Automática

El sistema se integra automáticamente con:
- **API de Contacto:** `/api/contact` envía bienvenida + notificación admin
- **Logging:** Todos los emails se registran en tabla `email_logs`
- **Programación:** Función para programar seguimientos (pendiente cron jobs)

## 🔗 APIs

### `/api/email/test` (Solo desarrollo)
Endpoint para probar emails manualmente.

```bash
POST /api/email/test
{
  "emailType": "welcome",
  "recipient": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "businessType": "salon",
    "company": "Salón Bella Vista"
  }
}
```

### `/api/email/followup`
Enviar seguimientos específicos (para cron jobs).

```bash
POST /api/email/followup
Authorization: Bearer YOUR_CRON_SECRET
{
  "leadId": "uuid-del-lead",
  "sequence": 1
}
```

### `/api/email/trigger-scheduled`
Procesar todos los emails programados (para cron job diario).

```bash
POST /api/email/trigger-scheduled
Authorization: Bearer YOUR_CRON_SECRET
```

## 🎨 Personalización por Tipo de Negocio

El sistema personaliza contenido según `business_type`:

```typescript
const businessTypes = {
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
  }
  // ... más tipos
}
```

## 📊 Tracking y Analytics

### Logging en Base de Datos
Todos los emails se registran en `email_logs`:
- `template_name`: Tipo de email (welcome, followup_1, etc.)
- `status`: sent, delivered, opened, clicked, bounced, failed
- `provider_id`: ID de Resend para tracking
- `sent_at`, `opened_at`, `clicked_at`: Timestamps

### Métricas de Resend
Los emails incluyen tags para segmentación:
- `email_type`: welcome, followup, admin
- `business_type`: salon, restaurant, clinic, etc.
- `sequence`: 1, 2, 3 (para seguimientos)

## 🔄 Automatización Futura

### Cron Jobs Recomendados
```bash
# Procesar emails programados cada hora
0 * * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://boreas.mx/api/email/trigger-scheduled

# Alternativa: Usar Vercel Cron Jobs o Upstash
```

### Job Queue (Recomendado)
Para producción, considera:
- **Inngest:** Para workflows complejos
- **Trigger.dev:** Para jobs programados
- **Upstash QStash:** Para delays simples
- **Vercel Cron:** Para triggers periódicos

## 🧪 Testing

### Development
```bash
# Test welcome email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "welcome",
    "recipient": {
      "name": "Test User",
      "email": "test@example.com",
      "businessType": "salon"
    }
  }'
```

### Verificar Logs
```sql
SELECT * FROM email_logs
WHERE email = 'test@example.com'
ORDER BY sent_at DESC;
```

## 📋 Checklist de Implementación

- [x] ✅ Cliente Resend configurado
- [x] ✅ Templates HTML responsivos
- [x] ✅ Personalización por tipo de negocio
- [x] ✅ Integración con API de contacto
- [x] ✅ Logging en base de datos
- [x] ✅ API de testing
- [x] ✅ Seguimientos programables
- [ ] ⏳ Cron job para automatización
- [ ] ⏳ Webhooks de Resend para tracking avanzado
- [ ] ⏳ A/B testing de subject lines

## 🚨 Troubleshooting

### Email no se envía
1. Verificar `RESEND_API_KEY` en variables de entorno
2. Verificar dominio verificado en Resend
3. Revisar logs en console/database
4. Verificar rate limits de Resend

### Templates no se ven bien
1. Verificar HTML válido en templates
2. Probar en diferentes clientes de email
3. Verificar CSS inline
4. Usar herramientas como Litmus/Email on Acid

### Logs no aparecen
1. Verificar conexión a Supabase
2. Verificar permisos en tabla `email_logs`
3. Revisar errores en console del servidor

---

**Creado:** 2026-02-05
**Última actualización:** 2026-02-05
**Maintainer:** Francisco Magaña <francisco@boreas.mx>