# Especificación: Landing Page de Conversión

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T04:46:05Z
**Líneas:** ~1,100 (target: 800-1200)

---

## 1. Overview

### 1.1 Propósito
La Landing Page es el punto de entrada principal para generar leads cualificados de pequeños negocios interesados en automatizar su comunicación con clientes vía WhatsApp. Debe convertir visitantes en leads con una propuesta de valor clara y casos de uso específicos por industria.

### 1.2 Alcance
**Incluye:**
- Hero section con propuesta de valor única
- Casos de uso específicos por industria (salón, restaurante, clínica)
- Testimoniales y social proof
- Formulario de contacto optimizado para conversión
- FAQ section respondiendo objeciones comunes
- SEO optimization para términos clave
- Analytics tracking completo del funnel

**NO incluye:**
- Dashboard de administración (módulo separado)
- Sistema de autenticación (no requerido para landing)
- Funcionalidades de la aplicación principal
- Checkout o payments (se manejan post-lead)

### 1.3 User Stories Relacionadas
- **US-015:** Formulario de Contacto Optimizado (Score: 18, MVP)
- **US-016:** Casos de Uso Específicos por Industria (Score: 16, MVP)

### 1.4 Dependencias
- **Analytics Service:** PostHog para tracking de conversión
- **Email Service:** Resend para automation sequences
- **Lead Management:** Email de notificación al equipo via Resend
- **SEO Requirements:** Next.js SSR para optimization

---

## 2. Modelo de Datos

### 2.1 Entidad Principal: ContactLead

```typescript
interface ContactLead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  company?: string;
  business_type: BusinessType;
  city: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  status: LeadStatus;
  lead_score: number;
  created_at: Date;
  updated_at: Date;
  first_contact_at?: Date;
  demo_scheduled_at?: Date;
}

enum BusinessType {
  SALON = 'salon',
  RESTAURANT = 'restaurant',
  CLINIC = 'clinic',
  DENTIST = 'dentist',
  SPA = 'spa',
  GYM = 'gym',
  RETAIL = 'retail',
  OTHER = 'other',
}

enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  DEMO_SCHEDULED = 'demo_scheduled',
  DEMO_COMPLETED = 'demo_completed',
  PROPOSAL_SENT = 'proposal_sent',
  WON = 'won',
  LOST = 'lost',
  NURTURING = 'nurturing',
}
```

### 2.2 Detalle de Campos

| Campo | Tipo | Requerido | Default | Validación | Descripción |
|-------|------|-----------|---------|------------|-------------|
| id | UUID | ✅ | auto | - | Identificador único |
| name | string | ✅ | - | 2-100 chars | Nombre completo |
| email | string | ✅ | - | email válido | Email de contacto |
| whatsapp | string | ✅ | - | phone format | Número WhatsApp |
| company | string | ❌ | null | 2-100 chars | Nombre del negocio |
| business_type | enum | ✅ | - | valid enum | Tipo de negocio |
| city | string | ✅ | - | 2-50 chars | Ciudad |
| message | string | ❌ | null | max 500 chars | Mensaje adicional |
| utm_* | string | ❌ | null | max 100 chars | UTM tracking |
| status | enum | ✅ | 'new' | valid enum | Estado del lead |
| lead_score | number | ✅ | 0 | 0-100 | Score de calificación |

### 2.3 Entidad Secundaria: LandingAnalytics

```typescript
interface LandingAnalytics {
  id: string;
  session_id: string;
  visitor_ip: string; // hashed for privacy
  user_agent: string;
  page_path: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  time_on_page: number; // seconds
  scroll_depth: number; // percentage 0-100
  form_started: boolean;
  form_completed: boolean;
  cta_clicked: string[]; // array of CTA buttons clicked
  created_at: Date;
}
```

### 2.4 Relaciones

```
ContactLead 1────────* LandingAnalytics (via session tracking)
     │
     └──* EmailLog (follow-up sequences)
```

---

## 3. Estados y Transiciones - Lead Lifecycle

### 3.1 Diagrama de Estados

```
    ┌─────────┐      contact_attempt()     ┌─────────────┐
    │   NEW   │─────────────────────────▶  │  CONTACTED  │
    └────┬────┘                           └──────┬──────┘
         │                                       │
         │ demo_schedule()                       │ demo_schedule()
         │                                       │
         └───────────────┬───────────────────────┘
                         ▼
                   ┌─────────────────┐     demo_complete()    ┌──────────────────┐
                   │ DEMO_SCHEDULED  │─────────────────────▶  │  DEMO_COMPLETED  │
                   └─────────────────┘                        └────────┬─────────┘
                                                                       │
                                                                       │ send_proposal()
                                                                       ▼
         ┌─────────────┐                                        ┌─────────────────┐
         │   LOST      │                                        │ PROPOSAL_SENT   │
         └─────────────┘                                        └────────┬────────┘
                   ▲                                                     │
                   │                                                     │ close_deal()
                   │ mark_lost()                     ┌─────────┐         │
                   └─────────────────────────────────│   WON   │◀────────┘
                                                     └─────────┘
                   ┌─────────────┐
                   │  NURTURING  │ ◀──── nurture() (from any state)
                   └─────────────┘
```

### 3.2 Tabla de Transiciones

| De | A | Acción | Trigger | Side Effects |
|----|---|--------|---------|--------------|
| NEW | CONTACTED | contact_attempt() | Admin action | Log first contact time |
| NEW | DEMO_SCHEDULED | demo_schedule() | Calendar booking | Send calendar invite |
| CONTACTED | DEMO_SCHEDULED | demo_schedule() | Calendar booking | Update lead score +20 |
| DEMO_SCHEDULED | DEMO_COMPLETED | demo_complete() | Admin marks done | Update lead score +30 |
| DEMO_COMPLETED | PROPOSAL_SENT | send_proposal() | Admin sends proposal | Email automation trigger |
| PROPOSAL_SENT | WON | close_deal() | Deal closed | Convert to client |
| ANY | LOST | mark_lost() | Admin marks lost | Archive, stop automation |
| ANY | NURTURING | nurture() | Low priority | Longer email sequences |

### 3.3 Lead Scoring Algorithm

| Factor | Points | Condition |
|--------|--------|-----------|
| Business Type | 0-30 | salon(30), restaurant(25), clinic(20), other(10) |
| Form Completion | 20 | All required fields completed |
| Time on Page | 0-15 | >2min(15), >1min(10), >30s(5) |
| Scroll Depth | 0-10 | >80%(10), >50%(5) |
| CTA Interaction | 0-15 | Multiple CTAs(15), Single CTA(10) |
| UTM Source | 0-10 | Paid ads(10), organic(5), direct(0) |

---

## 4. Flujos de Usuario

### 4.1 Flujo Principal: Lead Conversion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO: CONVERSIÓN DE LEAD                         │
└─────────────────────────────────────────────────────────────────────────────┘

Visitante                           Sistema                              Admin
    │                                 │                                   │
    │──[Llega a landing page]────────▶│                                   │
    │                                 │                                   │
    │                        ┌────────│[Track pageview]                  │
    │                        │        │[Identify UTM params]             │
    │                        │        │[Start session tracking]          │
    │                        │        │                                   │
    │◀─[Muestra landing]─────┘        │                                   │
    │                                 │                                   │
    │──[Scroll, interactúa]──────────▶│                                   │
    │                                 │                                   │
    │                        ┌────────│[Track scroll depth]              │
    │                        │        │[Track time on page]              │
    │                        │        │[Track CTA clicks]                │
    │                        │        │                                   │
    │──[Ve caso de uso específico]───▶│                                   │
    │                                 │                                   │
    │                        ┌────────│[Track section view]              │
    │                        │        │[Increase lead score]             │
    │                        │        │                                   │
    │──[Click "Demo Gratuita"]───────▶│                                   │
    │                                 │                                   │
    │                        ┌────────│[Show contact form]               │
    │                        │        │[Pre-fill known data]             │
    │                        │        │                                   │
    │◀─[Muestra formulario]──┘        │                                   │
    │                                 │                                   │
    │──[Completa formulario]─────────▶│                                   │
    │                                 │                                   │
    │                        ┌────────│[Validate fields]                 │
    │                        │        │[Calculate lead score]            │
    │                        │        │[Save to database]               │
    │                        │        │[Trigger automations]            │
    │                        │        │                                   │
    │◀─[Confirmación + redirect]──────│────[Notify admin]───────────────▶│
    │                                 │                                   │
    │                        ┌────────│[Send welcome email]              │
    │                        │        │[Start nurture sequence]          │
    │                        │        │                                   │
    │                                 │◀───[Reviews lead]─────────────────│
    │                                 │                                   │
    │                                 │────[Schedules follow-up]─────────▶│
    │                                 │                                   │
    │◀─[Follow-up email]─────────────│                                   │
    │                                 │                                   │
```

### 4.2 Flujo de Recuperación de Formularios Abandonados

```
Visitante                          Sistema
    │                                │
    │──[Empieza formulario]─────────▶│
    │                                │
    │              ┌─────────────────│[Track form_started]
    │              │                 │[Start abandon timer: 2min]
    │              │                 │
    │──[Abandona página]────────────▶│
    │                                │
    │              ┌─────────────────│[Detect page exit]
    │              │                 │[Save partial data]
    │              │                 │[Trigger abandon sequence]
    │              │                 │
    │◀─[Email 1 hr después]─────────│
    │  "¡Casi listo! Completa tu     │
    │   solicitud de demo"           │
    │                                │
    │◀─[Email 24 hr después]────────│
    │  "¿Preguntas sobre WhatsApp    │
    │   automation?"                 │
```

### 4.3 Flujo Mobile vs Desktop

**Mobile First Design:**
```
Mobile (Primary)                   Desktop (Enhanced)
┌────────────────┐                ┌─────────────────────────────┐
│ Hero + CTA     │                │ Hero + Video Demo (right)   │
│ ▼              │                │ ▼                           │
│ Problem        │                │ Problem + Solution (2-col)  │
│ ▼              │                │ ▼                           │
│ Solution       │                │ Case Studies (3-col)       │
│ ▼              │                │ ▼                           │
│ Case Study 1   │                │ Testimonials (carousel)    │
│ ▼              │                │ ▼                           │
│ Case Study 2   │                │ Pricing (comparison)       │
│ ▼              │                │ ▼                           │
│ Testimonials   │                │ FAQ (collapsible)          │
│ ▼              │                │ ▼                           │
│ CTA            │                │ CTA (sticky)               │
│ ▼              │                │                             │
│ FAQ            │                │                             │
└────────────────┘                └─────────────────────────────┘
```

---

## 5. Validaciones

### 5.1 Validaciones de Frontend (React Hook Form + Zod)

```typescript
const contactFormSchema = z.object({
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
    .optional(),

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
});
```

### 5.2 Validaciones de Backend

| Campo | Regla | Código | Mensaje (ES) | HTTP Status |
|-------|-------|--------|--------------|-------------|
| name | Required | REQUIRED | "El nombre es requerido" | 400 |
| name | Duplicated email | DUPLICATE | "Este email ya está registrado" | 409 |
| email | Valid format | INVALID_FORMAT | "Email no válido" | 400 |
| whatsapp | Valid phone | INVALID_PHONE | "Número WhatsApp inválido" | 400 |
| business_type | Valid enum | INVALID_ENUM | "Tipo de negocio no válido" | 400 |
| rate_limit | Too many requests | RATE_LIMIT | "Demasiadas solicitudes, intenta en 15 minutos" | 429 |

### 5.3 Validaciones de Negocio

| Código | Regla | Mensaje | Acción |
|--------|-------|---------|---------|
| BR001 | No más de 3 leads por IP por día | "Has alcanzado el límite de solicitudes diarias" | Block + log |
| BR002 | No leads con emails obviamente falsos | "Email no válido para contacto comercial" | Reject |
| BR003 | Detectar bots/spam | "Error procesando solicitud" | Honeypot + captcha |

### 5.4 Sanitización de Datos

```typescript
// Sanitización automática
const sanitizeInput = (data: ContactFormData): ContactFormData => ({
  name: data.name.trim().replace(/\s+/g, ' '),
  email: data.email.toLowerCase().trim(),
  whatsapp: data.whatsapp.replace(/\D/g, ''), // Solo números
  company: data.company?.trim().replace(/\s+/g, ' '),
  city: data.city.trim().replace(/\s+/g, ' '),
  message: data.message?.trim().substring(0, 500), // Truncate
  business_type: data.business_type,
});
```

---

## 6. API Endpoints

### 6.1 Lista de Endpoints

| Método | Endpoint | Descripción | Rate Limit | Auth |
|--------|----------|-------------|------------|------|
| POST | /api/contact | Crear lead | 3/15min per IP | ❌ |
| POST | /api/analytics/track | Track event | 100/min per IP | ❌ |
| GET | /api/content/testimonials | Get testimonials | 60/min per IP | ❌ |
| GET | /api/content/case-studies | Get case studies | 60/min per IP | ❌ |
| GET | /api/content/faq | Get FAQ items | 60/min per IP | ❌ |

### 6.2 POST /api/contact

**Descripción:** Crear nuevo contact lead desde formulario

**Rate Limiting:**
- 3 requests per 15 minutes per IP
- 5 requests per hour per IP
- Honeypot field detection
- reCAPTCHA validation

**Request:**
```typescript
interface ContactRequest {
  name: string;
  email: string;
  whatsapp: string;
  company?: string;
  business_type: BusinessType;
  city: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // Honeypot field (must be empty)
  website?: string;
  // reCAPTCHA token
  recaptcha_token: string;
}
```

**Response 201 - Success:**
```json
{
  "success": true,
  "message": "¡Solicitud enviada exitosamente!",
  "data": {
    "id": "uuid-4",
    "lead_score": 85,
    "next_steps": "Recibirás un email de confirmación en los próximos minutos. Te contactaremos dentro de las próximas 2 horas."
  }
}
```

**Response 400 - Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email no válido"
      },
      {
        "field": "whatsapp",
        "code": "INVALID_PHONE",
        "message": "Número WhatsApp inválido"
      }
    ]
  }
}
```

**Response 409 - Duplicate Lead:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_LEAD",
    "message": "Este email ya está registrado",
    "data": {
      "existing_lead_created": "2024-01-15T10:30:00Z",
      "suggestion": "Si no has recibido respuesta, contáctanos directamente al WhatsApp +52 123 456 7890"
    }
  }
}
```

**Response 429 - Rate Limited:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas solicitudes. Intenta nuevamente en 15 minutos.",
    "retry_after": 900
  }
}
```

### 6.3 POST /api/analytics/track

**Descripción:** Track user behavior events

**Request:**
```typescript
interface AnalyticsEvent {
  event: string;
  properties: {
    session_id: string;
    page_path: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    // Event-specific properties
    [key: string]: any;
  };
}
```

**Events Tracked:**
- `page_view`
- `form_started`
- `form_field_completed`
- `form_submitted`
- `form_error`
- `cta_clicked`
- `section_viewed`
- `video_played`

**Response 200:**
```json
{
  "success": true,
  "event_id": "uuid-4"
}
```

### 6.4 GET /api/content/testimonials

**Descripción:** Get testimonials for landing page

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| business_type | string | - | Filter by business type |
| limit | number | 6 | Max testimonials to return |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Carmen Rodríguez",
      "company": "Salón Carmen",
      "business_type": "salon",
      "quote": "Con Boreas automaticé mi WhatsApp y aumenté mis citas 40% en 2 meses",
      "avatar_url": "https://...",
      "rating": 5,
      "results": {
        "metric": "Aumento en citas",
        "before": "20 citas/semana",
        "after": "28 citas/semana",
        "improvement": "+40%"
      },
      "featured": true
    }
  ],
  "meta": {
    "total": 12,
    "filtered": 6
  }
}
```

---

## 7. UI/UX Especificación

### 7.1 Layout Sections

#### A. Hero Section
```html
<section class="hero bg-gradient-to-r from-blue-600 to-purple-600">
  <div class="container mx-auto px-4 py-20">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="text-white">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Automatiza tu WhatsApp y duplica tus citas
        </h1>
        <p class="text-xl mb-8">
          Para salones, restaurantes y clínicas que quieren crecer sin dedicar 4 horas al día a WhatsApp
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button class="cta-primary">Demo Gratuita</button>
          <button class="cta-secondary">Ver Casos de Éxito</button>
        </div>
        <div class="mt-8 flex items-center gap-4 text-sm">
          <span>✓ Sin contratos largos</span>
          <span>✓ Setup en 15 minutos</span>
          <span>✓ Soporte en español</span>
        </div>
      </div>
      <div class="hero-media">
        <!-- Video demo o screenshot animado -->
      </div>
    </div>
  </div>
</section>
```

#### B. Problem-Solution Section
```html
<section class="problem-solution py-20">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold mb-4">
        ¿Pasas 4 horas al día respondiendo WhatsApp?
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Los dueños de pequeños negocios pierden tiempo valioso en tareas repetitivas
        que pueden automatizarse
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-12 mb-16">
      <!-- Problems -->
      <div class="problems">
        <h3 class="text-2xl font-bold mb-8 text-red-600">Sin Boreas</h3>
        <div class="space-y-6">
          <div class="problem-item">
            <div class="icon">😩</div>
            <div>
              <h4>4+ horas diarias en WhatsApp</h4>
              <p>Respondiendo lo mismo una y otra vez</p>
            </div>
          </div>
          <!-- More problem items -->
        </div>
      </div>

      <!-- Solutions -->
      <div class="solutions">
        <h3 class="text-2xl font-bold mb-8 text-green-600">Con Boreas</h3>
        <div class="space-y-6">
          <div class="solution-item">
            <div class="icon">⚡</div>
            <div>
              <h4>Respuestas automáticas 24/7</h4>
              <p>El bot responde al instante</p>
            </div>
          </div>
          <!-- More solution items -->
        </div>
      </div>
    </div>
  </div>
</section>
```

#### C. Case Studies Section
```html
<section class="case-studies py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-16">
      Casos de éxito reales
    </h2>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="case-study-card salon">
        <div class="industry-icon">💄</div>
        <h3>Salón Carmen</h3>
        <p class="business-type">Salón de belleza</p>

        <div class="results-grid">
          <div class="metric">
            <div class="before">20 citas/semana</div>
            <div class="arrow">→</div>
            <div class="after">28 citas/semana</div>
          </div>
          <div class="improvement">+40% más citas</div>
        </div>

        <blockquote>
          "Con Boreas automaticé mi WhatsApp y dejé de perder citas.
          Ahora tengo tiempo para enfocarme en mis clientas"
        </blockquote>

        <div class="cta">
          <button>Ver caso completo</button>
        </div>
      </div>

      <!-- Restaurant case study -->
      <div class="case-study-card restaurant">
        <!-- Similar structure -->
      </div>

      <!-- Clinic case study -->
      <div class="case-study-card clinic">
        <!-- Similar structure -->
      </div>
    </div>
  </div>
</section>
```

### 7.2 Contact Form Component

```typescript
interface ContactFormProps {
  variant: 'hero' | 'inline' | 'modal';
  prefilledData?: Partial<ContactFormData>;
  utmParams?: UTMParams;
}

const ContactForm: React.FC<ContactFormProps> = ({
  variant,
  prefilledData,
  utmParams
}) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...prefilledData,
      business_type: prefilledData?.business_type || 'salon'
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="contact-form">
      <div className="form-header">
        <h3>Solicita tu demo gratuita</h3>
        <p>Te contactamos en menos de 2 horas</p>
      </div>

      <div className="form-grid">
        <FormField
          label="Nombre completo"
          {...form.register('name')}
          error={form.formState.errors.name}
          required
        />

        <FormField
          label="WhatsApp"
          placeholder="+52 123 456 7890"
          {...form.register('whatsapp')}
          error={form.formState.errors.whatsapp}
          required
        />

        <FormField
          label="Email"
          type="email"
          {...form.register('email')}
          error={form.formState.errors.email}
          required
        />

        <FormSelect
          label="Tipo de negocio"
          {...form.register('business_type')}
          error={form.formState.errors.business_type}
          options={businessTypeOptions}
          required
        />

        <FormField
          label="Ciudad"
          {...form.register('city')}
          error={form.formState.errors.city}
          required
        />

        <FormField
          label="Nombre del negocio"
          {...form.register('company')}
          error={form.formState.errors.company}
        />
      </div>

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="form-footer">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="submit-button"
        >
          {form.formState.isSubmitting
            ? 'Enviando...'
            : 'Solicitar Demo Gratuita'
          }
        </button>

        <p className="privacy-notice">
          Al enviar aceptas nuestros <a href="/privacy">términos de privacidad</a>
        </p>
      </div>
    </form>
  );
};
```

### 7.3 Estados de UI

**Loading States:**
```css
.contact-form.loading {
  .submit-button {
    opacity: 0.7;
    cursor: not-allowed;

    &::after {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 10px;
    }
  }
}
```

**Success State:**
```html
<div class="form-success">
  <div class="success-icon">✅</div>
  <h3>¡Solicitud enviada!</h3>
  <p>Te contactaremos por WhatsApp en las próximas 2 horas</p>
  <div class="next-steps">
    <p>Mientras tanto:</p>
    <ul>
      <li>Revisa tu email para la confirmación</li>
      <li>Guarda nuestro WhatsApp: +52 123 456 7890</li>
      <li>Prepara 3 preguntas sobre automatización</li>
    </ul>
  </div>
</div>
```

### 7.4 Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| <640px (mobile) | Single column, stacked elements, larger touch targets |
| 640-768px (tablet) | 2-column forms, condensed hero |
| 768-1024px (small desktop) | 3-column case studies, sidebar form |
| >1024px (desktop) | Full layout, sticky CTA |

### 7.5 Accessibility (WCAG 2.1 AA)

**Form Accessibility:**
```html
<!-- Proper labeling -->
<label for="name" class="required">
  Nombre completo
  <span class="sr-only">(requerido)</span>
</label>
<input
  id="name"
  name="name"
  aria-describedby="name-error"
  aria-invalid={!!errors.name}
  required
/>
<div id="name-error" role="alert">
  {errors.name?.message}
</div>

<!-- Focus management -->
<fieldset>
  <legend>Tipo de negocio</legend>
  <div role="radiogroup" aria-labelledby="business-type-label">
    <!-- Radio options -->
  </div>
</fieldset>
```

**Keyboard Navigation:**
- Tab order: Logo → Nav → Hero CTA → Form → Footer
- Skip to main content link
- Focus indicators on all interactive elements
- Arrow key navigation in select dropdowns

**Screen Reader Support:**
- Semantic HTML structure (h1→h2→h3)
- Alt text for all images
- ARIA labels for complex interactions
- Live regions for form validation messages

---

## 8. SEO Optimization

### 8.1 Meta Tags y Estructura

```html
<head>
  <!-- Primary Meta Tags -->
  <title>Boreas - Automatización WhatsApp para Salones, Restaurantes y Clínicas</title>
  <meta name="description" content="Automatiza tu WhatsApp Business y duplica tus citas en 30 días. Solución especializada para salones de belleza, restaurantes y clínicas en México. Demo gratuita." />
  <meta name="keywords" content="automatización whatsapp, whatsapp business, salón de belleza automatización, restaurante reservas whatsapp, clínica citas automáticas" />

  <!-- Open Graph -->
  <meta property="og:title" content="Boreas - Duplica tus citas con WhatsApp automático" />
  <meta property="og:description" content="Salones aumentan 40% sus citas, restaurantes reducen 50% las llamadas. Automatización WhatsApp hecha simple." />
  <meta property="og:image" content="https://boreas.mx/og-image.jpg" />
  <meta property="og:url" content="https://boreas.mx" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_MX" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Automatiza WhatsApp y duplica tus citas - Boreas" />
  <meta name="twitter:description" content="Casos reales: Salón Carmen +40% citas, Restaurante Miguel +60% reservas" />
  <meta name="twitter:image" content="https://boreas.mx/twitter-card.jpg" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Boreas",
    "description": "Automatización de WhatsApp para pequeños negocios",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "99",
      "priceCurrency": "USD",
      "priceValidUntil": "2024-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  }
  </script>
</head>
```

### 8.2 Palabras Clave Objetivo

**Primary Keywords:**
- automatización whatsapp negocio
- whatsapp business automático
- agendar citas whatsapp
- automatizar mensajes whatsapp

**Long-tail Keywords:**
- como automatizar whatsapp para salón de belleza
- sistema automático reservas restaurante whatsapp
- automatización citas médicas whatsapp
- bot whatsapp para pequeños negocios méxico

**Local Keywords:**
- automatización whatsapp mexico
- whatsapp business ciudad de méxico
- automatización negocios locales méxico

### 8.3 Content Strategy for SEO

**H1 Structure:**
```html
<h1>Automatiza tu WhatsApp y duplica tus citas en 30 días</h1>

<h2>¿Por qué los salones eligen Boreas?</h2>
  <h3>Casos de éxito reales</h3>
  <h3>ROI comprobado</h3>

<h2>Automatización simple para restaurantes</h2>
  <h3>Reservas sin llamadas</h3>
  <h3>Menú digital integrado</h3>

<h2>Solución especializada para clínicas</h2>
  <h3>Agendamiento médico inteligente</h3>
  <h3>Recordatorios que funcionan</h3>
```

### 8.4 Technical SEO

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

**Implementation:**
```typescript
// Image optimization
import Image from 'next/image'

<Image
  src="/hero-salon.jpg"
  alt="Salón de belleza usando automatización WhatsApp Boreas"
  width={600}
  height={400}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Font optimization
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})
```

**Sitemap Generation:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://boreas.mx/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://boreas.mx/casos-exito/salon-carmen</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 9. Analytics & Conversion Tracking

### 9.1 PostHog Events Configuration

```typescript
// Event tracking setup
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  posthog.capture(eventName, {
    ...properties,
    page_path: window.location.pathname,
    utm_source: getUtmParam('utm_source'),
    utm_medium: getUtmParam('utm_medium'),
    utm_campaign: getUtmParam('utm_campaign'),
    session_id: getSessionId(),
    timestamp: new Date().toISOString()
  });
};

// Key events to track
const events = {
  page_view: 'Landing Page Viewed',
  hero_cta_click: 'Hero CTA Clicked',
  case_study_view: 'Case Study Viewed',
  testimonial_click: 'Testimonial Clicked',
  faq_expand: 'FAQ Item Expanded',
  form_start: 'Contact Form Started',
  form_field_complete: 'Form Field Completed',
  form_submit: 'Contact Form Submitted',
  form_success: 'Lead Generated Successfully',
  form_error: 'Form Validation Error',
  scroll_milestone: 'Page Scroll Milestone', // 25%, 50%, 75%, 100%
  time_milestone: 'Time on Page Milestone', // 30s, 60s, 120s
  video_play: 'Demo Video Played',
  video_complete: 'Demo Video Completed'
};
```

### 9.2 Conversion Funnel Definition

```typescript
// Funnel steps
const conversionFunnel = [
  {
    step: 1,
    name: 'Page View',
    event: 'page_view',
    description: 'User lands on page'
  },
  {
    step: 2,
    name: 'Engaged',
    event: 'scroll_milestone',
    properties: { milestone: '50%' },
    description: 'User scrolls past 50%'
  },
  {
    step: 3,
    name: 'Interested',
    event: 'case_study_view',
    description: 'User views case study'
  },
  {
    step: 4,
    name: 'Intent',
    event: 'form_start',
    description: 'User starts contact form'
  },
  {
    step: 5,
    name: 'Lead',
    event: 'form_success',
    description: 'Form submitted successfully'
  }
];

// Conversion goals
const conversionGoals = {
  primary: {
    name: 'Lead Generation',
    target_rate: 3.5, // 3.5% of visitors
    events: ['form_success']
  },
  secondary: {
    name: 'Engagement',
    target_rate: 25, // 25% engagement rate
    events: ['case_study_view', 'testimonial_click', 'faq_expand']
  }
};
```

### 9.3 A/B Testing Framework

```typescript
// Feature flags for A/B testing
const experiments = {
  hero_variant: {
    name: 'Hero Section Variant',
    variants: ['control', 'testimonial_focus', 'roi_focus'],
    traffic_allocation: [40, 30, 30], // %
    success_metric: 'form_start_rate'
  },

  cta_button_text: {
    name: 'CTA Button Text',
    variants: [
      'Demo Gratuita',
      'Ver Casos de Éxito',
      'Duplicar Mis Citas',
      'Automatizar WhatsApp'
    ],
    traffic_allocation: [25, 25, 25, 25],
    success_metric: 'cta_click_rate'
  },

  form_fields: {
    name: 'Form Field Count',
    variants: ['minimal', 'standard', 'detailed'],
    descriptions: [
      'Solo nombre, email, WhatsApp',
      'Agregar empresa y tipo de negocio',
      'Agregar ciudad y mensaje'
    ],
    traffic_allocation: [33, 34, 33],
    success_metric: 'form_completion_rate'
  }
};
```

### 9.4 Performance Monitoring

```typescript
// Core Web Vitals tracking
const trackWebVitals = () => {
  // LCP - Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      posthog.capture('web_vital_lcp', {
        value: entry.startTime,
        rating: entry.startTime < 2500 ? 'good' :
                entry.startTime < 4000 ? 'needs_improvement' : 'poor'
      });
    }
  }).observe({entryTypes: ['largest-contentful-paint']});

  // FID - First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      posthog.capture('web_vital_fid', {
        value: entry.processingStart - entry.startTime,
        rating: entry.processingStart - entry.startTime < 100 ? 'good' :
                entry.processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
      });
    }
  }).observe({entryTypes: ['first-input']});

  // CLS - Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    let clsValue = 0;
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    posthog.capture('web_vital_cls', {
      value: clsValue,
      rating: clsValue < 0.1 ? 'good' :
              clsValue < 0.25 ? 'needs_improvement' : 'poor'
    });
  }).observe({entryTypes: ['layout-shift']});
};
```

---

## 10. Edge Cases y Error Handling

### 10.1 Form Edge Cases

| Escenario | Comportamiento | Test Case |
|-----------|----------------|-----------|
| Doble click en submit | Prevenir envío duplicado | ✅ |
| Pérdida de conexión | Guardar en localStorage | ✅ |
| Sesión expirada | Reautenticar silenciosamente | ✅ |
| JavaScript deshabilitado | Fallback a HTML form | ✅ |
| Ad blockers | Detectar y mostrar mensaje | ✅ |
| Bot detection | Honeypot + reCAPTCHA | ✅ |
| Caracteres especiales | Sanitizar pero permitir acentos | ✅ |
| Copiar/pegar números | Formatear WhatsApp automáticamente | ✅ |
| Campos prellenados | Validar datos de URL params | ✅ |
| Formulario abandonado | Email recovery sequence | ✅ |

### 10.2 Analytics Edge Cases

| Escenario | Fallback | Implementation |
|-----------|----------|----------------|
| PostHog bloqueado | Enviar a endpoint propio | Server-side proxy |
| Local storage lleno | Enviar inmediatamente | Queue management |
| Navegador incógnito | No persistir data | Session-only tracking |
| iOS safari tracking | First-party cookies only | Subdomain setup |

### 10.3 Performance Edge Cases

```typescript
// Lazy loading for non-critical content
const LazyTestimonials = lazy(() => import('./Testimonials'));
const LazyFAQ = lazy(() => import('./FAQ'));

// Progressive image loading
const OptimizedImage = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="image-container">
      {!loaded && !error && <ImageSkeleton />}
      {error && <ImageFallback />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        {...props}
      />
    </div>
  );
};

// Graceful degradation for animations
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

```typescript
// Form validation tests
describe('ContactForm', () => {
  test('validates required fields', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /solicitar demo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
      expect(screen.getByText('El WhatsApp es requerido')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Email no válido')).toBeInTheDocument();
    });
  });

  test('validates WhatsApp number format', async () => {
    render(<ContactForm />);

    const whatsappInput = screen.getByLabelText(/whatsapp/i);
    fireEvent.change(whatsappInput, { target: { value: '123' } });
    fireEvent.blur(whatsappInput);

    await waitFor(() => {
      expect(screen.getByText('Número muy corto')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ success: true });
    render(<ContactForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Carmen Rodriguez' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'carmen@salon.com' }
    });
    fireEvent.change(screen.getByLabelText(/whatsapp/i), {
      target: { value: '+52 123 456 7890' }
    });

    fireEvent.click(screen.getByRole('button', { name: /solicitar demo/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Carmen Rodriguez',
          email: 'carmen@salon.com',
          whatsapp: '+52 123 456 7890'
        })
      );
    });
  });
});
```

### 11.2 Integration Tests

```typescript
// API integration tests
describe('/api/contact', () => {
  test('creates lead successfully', async () => {
    const leadData = {
      name: 'Carmen Rodriguez',
      email: 'carmen@test.com',
      whatsapp: '+52 123 456 7890',
      business_type: 'salon',
      city: 'Mexico City'
    };

    const response = await request(app)
      .post('/api/contact')
      .send(leadData)
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        id: expect.any(String),
        lead_score: expect.any(Number)
      }
    });
  });

  test('prevents duplicate email submissions', async () => {
    const leadData = {
      name: 'Carmen Rodriguez',
      email: 'duplicate@test.com',
      whatsapp: '+52 123 456 7890',
      business_type: 'salon',
      city: 'Mexico City'
    };

    // First submission
    await request(app).post('/api/contact').send(leadData).expect(201);

    // Duplicate submission
    const response = await request(app)
      .post('/api/contact')
      .send(leadData)
      .expect(409);

    expect(response.body.error.code).toBe('DUPLICATE_LEAD');
  });

  test('enforces rate limiting', async () => {
    const leadData = {
      name: 'Test User',
      email: 'test@example.com',
      whatsapp: '+52 123 456 7890',
      business_type: 'salon',
      city: 'Mexico City'
    };

    // Submit 3 requests (rate limit)
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/contact')
        .send({ ...leadData, email: `test${i}@example.com` })
        .expect(201);
    }

    // 4th request should be rate limited
    const response = await request(app)
      .post('/api/contact')
      .send({ ...leadData, email: 'test4@example.com' })
      .expect(429);

    expect(response.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
```

### 11.3 E2E Tests (Playwright)

```typescript
// Conversion flow E2E test
test.describe('Lead Conversion Flow', () => {
  test('complete lead generation journey', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('Automatiza tu WhatsApp');

    // Track analytics
    await page.evaluate(() => {
      window.posthog = { capture: jest.fn() };
    });

    // Scroll to see case studies (engagement)
    await page.locator('.case-studies').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Time on section

    // Click on salon case study
    await page.locator('.case-study-card.salon').click();

    // Verify case study modal opens
    await expect(page.locator('.case-study-modal')).toBeVisible();

    // Close modal and click main CTA
    await page.locator('.modal-close').click();
    await page.locator('.cta-primary').first().click();

    // Fill contact form
    await page.fill('[name="name"]', 'Carmen Rodriguez');
    await page.fill('[name="email"]', 'carmen@salon.com');
    await page.fill('[name="whatsapp"]', '+52 123 456 7890');
    await page.selectOption('[name="business_type"]', 'salon');
    await page.fill('[name="city"]', 'Mexico City');
    await page.fill('[name="company"]', 'Salon Carmen');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success state
    await expect(page.locator('.form-success')).toBeVisible();
    await expect(page.locator('.form-success h3')).toContainText('¡Solicitud enviada!');

    // Verify analytics events
    await page.evaluate(() => {
      expect(window.posthog.capture).toHaveBeenCalledWith('form_success', expect.any(Object));
    });
  });

  test('mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify mobile layout
    await expect(page.locator('.hero .grid')).toHaveCSS('grid-template-columns', 'none');

    // Test mobile form interaction
    await page.locator('.cta-primary').click();
    await expect(page.locator('.contact-form')).toBeVisible();

    // Fill form on mobile
    await page.fill('[name="name"]', 'Mobile User');
    await page.fill('[name="email"]', 'mobile@test.com');
    await page.fill('[name="whatsapp"]', '5551234567');

    // Verify form submission works on mobile
    await page.click('button[type="submit"]');
    await expect(page.locator('.form-success')).toBeVisible();
  });
});
```

### 11.4 Performance Tests

```typescript
// Lighthouse performance testing
test.describe('Performance Tests', () => {
  test('meets Core Web Vitals targets', async ({ page }) => {
    await page.goto('/');

    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            resolve(entries[entries.length - 1].startTime);
          }
        }).observe({entryTypes: ['largest-contentful-paint']});
      });
    });

    expect(lcp).toBeLessThan(2500); // LCP < 2.5s

    // Test form interaction delay
    const startTime = Date.now();
    await page.click('.cta-primary');
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(100); // FID < 100ms
  });
});
```

---

## 12. Deployment & Monitoring

### 12.1 Environment Configuration

```typescript
// Environment variables
interface EnvironmentConfig {
  // App
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_ENVIRONMENT: 'development' | 'staging' | 'production';

  // Analytics
  NEXT_PUBLIC_POSTHOG_KEY: string;
  NEXT_PUBLIC_POSTHOG_HOST: string;

  // External Services
  RESEND_API_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;

  // Database
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;

  // Rate Limiting
  REDIS_URL?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
}

// Environment validation
const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
  // ... other validations
});

export const env = envSchema.parse(process.env);
```

### 12.2 Vercel Deployment Configuration

```json
// vercel.json
{
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://boreas.mx"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/demo",
      "destination": "/#contact",
      "permanent": false
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

### 12.3 Monitoring Setup

```typescript
// Error tracking with Sentry (if needed)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out known issues
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message && error.message.includes('Script error')) {
        return null; // Don't send script errors
      }
    }
    return event;
  }
});

// Custom monitoring for form submissions
const monitorFormSubmission = (formData: ContactFormData, result: any) => {
  posthog.capture('form_submission_monitored', {
    success: result.success,
    lead_score: result.data?.lead_score,
    business_type: formData.business_type,
    errors: result.errors || null,
    response_time: Date.now() - window.formStartTime
  });

  // Alert on high error rates
  if (!result.success) {
    console.error('Form submission failed:', result);

    // Send to monitoring service
    fetch('/api/monitoring/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'form_error',
        error: result.error,
        context: formData
      })
    });
  }
};
```

---

## 13. Content Management

### 13.1 Dynamic Content Structure

```typescript
// Content types for CMS
interface LandingPageContent {
  hero: {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_secondary: string;
    trust_indicators: string[];
  };

  case_studies: CaseStudy[];
  testimonials: Testimonial[];
  faq: FAQ[];
  pricing: PricingTier[];
}

interface CaseStudy {
  id: string;
  industry: BusinessType;
  company_name: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  quote: string;
  image_url: string;
  featured: boolean;
  order: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'implementation';
  order: number;
  helpful_count: number;
}
```

### 13.2 A/B Testing Content Variants

```typescript
// Content variants for A/B testing
const heroVariants = {
  control: {
    title: "Automatiza tu WhatsApp y duplica tus citas",
    subtitle: "Para salones, restaurantes y clínicas que quieren crecer sin dedicar 4 horas al día a WhatsApp"
  },

  testimonial_focus: {
    title: "\"Con Boreas aumenté mis citas 40% en 2 meses\" - Carmen, Salón de Belleza",
    subtitle: "Automatización WhatsApp especializada para pequeños negocios"
  },

  roi_focus: {
    title: "Recupera tu inversión en 2 semanas o te devolvemos tu dinero",
    subtitle: "Automatización garantizada para salones, restaurantes y clínicas"
  }
};

// Dynamic content loading
const useContentVariant = (experiment: string) => {
  const [variant, setVariant] = useState('control');

  useEffect(() => {
    const assignedVariant = posthog.getFeatureFlag(experiment);
    setVariant(assignedVariant || 'control');
  }, [experiment]);

  return variant;
};
```

---

## 14. Success Metrics & KPIs

### 14.1 Primary Conversion Metrics

| Metric | Target | Current | Measurement |
|--------|--------|---------|-------------|
| **Landing Page Conversion Rate** | 3.5% | - | Form submissions / Unique visitors |
| **Lead Quality Score** | 75+ avg | - | Automated scoring algorithm |
| **Form Completion Rate** | 85% | - | Form submits / Form starts |
| **Time to First Contact** | <2 hours | - | Lead creation to admin contact |
| **Demo Show Rate** | 70% | - | Demos attended / Demos scheduled |
| **Demo to Customer Rate** | 30% | - | Customers / Demos completed |

### 14.2 User Experience Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time (LCP)** | <2.5s | Core Web Vitals |
| **Time on Page** | >90s avg | Analytics tracking |
| **Scroll Depth** | >75% avg | Analytics tracking |
| **Mobile Conversion Rate** | >2.8% | Mobile-specific tracking |
| **Form Abandonment Rate** | <20% | Form analytics |

### 14.3 Business Impact Metrics

| Metric | Target | Business Impact |
|--------|--------|----------------|
| **Cost per Lead (CPL)** | <$25 | Marketing efficiency |
| **Lead to Customer LTV** | >$2,400 | Long-term value |
| **Organic Traffic Growth** | +20% monthly | SEO effectiveness |
| **Brand Search Volume** | Track trend | Brand awareness |

---

**Estado:** ✅ Especificación Completada
**Líneas de documentación:** 1,087 líneas
**Target alcanzado:** 800-1200 líneas ✅

**Próximo paso:** Implementar formulario de captura con Resend y deploy a Vercel

**Completado:** 2026-02-04T04:46:05Z
**Generado por:** Oden Forge Feature Specification Writer