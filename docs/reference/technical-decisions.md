# Technical Decisions - Boreas

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T04:23:40Z

---

## 1. Visión General

### 1.1 Descripción
**Boreas** es un servicio B2B de automatización de procesos de contacto con clientes para pequeños negocios. Automatizamos comunicaciones como WhatsApp, agendar citas, seguimiento de clientes, y workflows de ventas para negocios como salones de belleza, restaurantes, clínicas, tiendas locales, etc.

**Ejemplo caso de uso:** Salón de uñas que quiere automatizar mensajes de WhatsApp para agendar citas de manera más rápida y eficiente, con confirmaciones automáticas, recordatorios, y seguimiento post-servicio.

### 1.2 Objetivo Principal
**Vender el servicio** - Crear una landing page profesional que presente nuestro servicio de automatización, genere leads, y convierta visitantes en clientes del servicio B2B.

### 1.3 Scope
**Modalidad:** MVP (Minimum Viable Product)
**Timeline estimado:** 6-8 semanas
**Target:** Landing page de ventas + dashboard básico para gestionar clientes

---

## 2. Stack Tecnológico

### 2.1 Frontend
- **Framework Web:** Next.js (enfoque principal)
- **Framework App:** React Native + Expo (opcional para fase 2)
- **Justificación:**
  - Next.js para SEO crítico - clientes deben encontrar nuestro servicio
  - Landing page optimizada para conversión de leads
  - Dashboard para gestión interna de clientes del servicio
  - SSR para carga rápida y mejor ranking en Google

### 2.2 Backend
- **Plataforma:** Supabase
- **Database:** PostgreSQL
- **Auth:** Supabase Auth (email, social login)
- **Realtime:** Supabase Realtime para actualizaciones en vivo
- **Justificación:** Backend completo, ideal para automatización y gestión de datos

### 2.3 Hosting y Deployment
- **Web:** Vercel (optimizado para Next.js, SSR, edge functions)
- **App:** Expo EAS (updates OTA, proceso estándar de tiendas)
- **Backend:** Supabase Cloud
- **Storage:** Supabase Storage

### 2.4 Desarrollo
- **Lenguaje:** TypeScript (type safety, mejor DX)
- **Styling:** Tailwind CSS (rapidez, consistencia)
- **State Management:** Zustand (ligero, simple para MVP)

---

## 3. Features V1 (MVP)

### 3.1 Core Features - Landing Page de Ventas
- [x] **Hero Section** - Propuesta de valor clara del servicio
- [x] **Casos de uso** - Ejemplos específicos (salón, restaurante, clínica)
- [x] **Testimonials/Social Proof** - Casos de éxito (aunque sean proyectados)
- [x] **CTA principal** - Formulario de contacto/demo
- [x] **FAQ** - Preguntas frecuentes sobre el servicio

### 3.2 Core Features - Dashboard Interno
- [x] **Gestión de leads** - Prospectos que llegan por la web
- [x] **CRM básico** - Seguimiento de clientes potenciales
- [x] **Pipeline de ventas** - Estados del proceso de venta
- [x] **Métricas** - Conversión, leads, clientes activos

### 3.3 Features Técnicas
- [x] **Formularios optimizados** - Captura de leads efectiva
- [x] **Email automation** - Secuencias de follow-up
- [x] **Analytics** - Tracking de conversión y comportamiento
- [x] **SEO optimization** - Rankear para términos relevantes

---

## 4. Integraciones V1

### 4.1 Analytics
- **Herramienta:** PostHog o Mixpanel
- **Propósito:** Seguimiento de usuarios, métricas de descubrimiento
- **Integración:** JavaScript SDK, eventos custom

### 4.2 Futuras Integraciones
- Email marketing (Resend)
- Storage avanzado (Cloudinary)
- Payments (Stripe) - post-MVP

---

## 5. Competidores a Analizar

### 5.1 Referencias Principales
- **ManyChat** - Automatización de WhatsApp y Facebook Messenger
- **Zapier** - Automatización de procesos entre aplicaciones
- **Calendly** - Agendamiento automático de citas
- **Intercom** - Customer communication platform

### 5.2 Competidores Locales/Regionales
- **Woztell** - WhatsApp Business automatizado
- **Botmaker** - Chatbots para América Latina
- **Soluciones locales** específicas del mercado objetivo

### 5.3 Análisis Pendiente
- Pricing de servicios de automatización
- Features que ofrecen vs. lo que necesitan pequeños negocios
- Gaps en el mercado (especialmente para habla hispana)
- Diferenciadores de Boreas (enfoque en pequeños negocios locales)

---

## 6. Arquitectura

### 6.1 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                            USUARIOS                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │ Visitantes Web  │    │   Clientes B2B  │    │  Equipo Boreas  │  │
│  │ (leads)         │    │ (usuarios del   │    │  (operadores)   │  │
│  │                 │    │  servicio)      │    │                 │  │
│  └─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘  │
└────────────┼─────────────────────┼─────────────────────┼────────────┘
             │                     │                     │
             ▼                     ▼                     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  LANDING PAGE   │    │ CLIENT PORTAL   │    │   ADMIN CRM     │
│                 │    │                 │    │                 │
│ • Hero section  │    │ • Service setup │    │ • Lead mgmt     │
│ • Use cases     │    │ • Automation    │    │ • Sales pipeline│
│ • Testimonials  │    │ • Analytics     │    │ • Metrics       │
│ • Contact form  │    │ • Billing       │    │ • Operations    │
│ • SEO optimized │    │ • Support       │    │ • Admin tools   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
              ┌─────────────────────────────────────┐
              │           NEXT.JS WEB APP           │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │   Routing   │ │   Components    │ │
              │ │ /landing    │ │ • LandingHero   │ │
              │ │ /dashboard  │ │ • ContactForm   │ │
              │ │ /client     │ │ • LeadTable     │ │
              │ │ /api/*      │ │ • Analytics     │ │
              │ └─────────────┘ └─────────────────┘ │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │   Services  │ │   State Mgmt    │ │
              │ │ • LeadAPI   │ │ • Zustand       │ │
              │ │ • EmailAPI  │ │ • React Query   │ │
              │ │ • Analytics │ │ • Form state    │ │
              │ └─────────────┘ └─────────────────┘ │
              └─────────────┬───────────────────────┘
                            │
                            ▼
              ┌─────────────────────────────────────┐
              │            SUPABASE BaaS            │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │ PostgreSQL  │ │     Auth        │ │
              │ │ • leads     │ │ • JWT tokens    │ │
              │ │ • clients   │ │ • Row-level     │ │
              │ │ • projects  │ │   security      │ │
              │ │ • analytics │ │ • Social login  │ │
              │ └─────────────┘ └─────────────────┘ │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │   Storage   │ │    Realtime     │ │
              │ │ • Assets    │ │ • Live updates  │ │
              │ │ • Documents │ │ • Notifications │ │
              │ │ • Backups   │ │ • Sync          │ │
              │ └─────────────┘ └─────────────────┘ │
              └─────────────┬───────────────────────┘
                            │
                            ▼
              ┌─────────────────────────────────────┐
              │         EXTERNAL SERVICES           │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │   Vercel    │ │    PostHog      │ │
              │ │ • Hosting   │ │ • Analytics     │ │
              │ │ • CDN       │ │ • A/B testing   │ │
              │ │ • Edge      │ │ • Funnels       │ │
              │ └─────────────┘ └─────────────────┘ │
              │                                     │
              │ ┌─────────────┐ ┌─────────────────┐ │
              │ │   Resend    │ │    Stripe       │ │
              │ │ • Emails    │ │ • Payments      │ │
              │ │ • Templates │ │ • Subscriptions │ │
              │ │ • Sequences │ │ • Billing       │ │
              │ └─────────────┘ └─────────────────┘ │
              └─────────────────────────────────────┘
```

### 6.2 Flujo de Datos Principal

#### A. Flujo de Captura de Leads
```
Usuario visita landing → Completa formulario → Lead se guarda en DB
→ Email automático enviado → Admin notificado → Follow-up programado
```

#### B. Flujo de Conversión a Cliente
```
Admin contacta lead → Demo realizada → Propuesta enviada
→ Cliente acepta → Onboarding iniciado → Facturación activada
```

#### C. Flujo de Gestión de Cliente
```
Cliente accede portal → Configura automatización → Sistema activo
→ Métricas generadas → Reportes enviados → Feedback recolectado
```

### 6.3 Estructura de Carpetas

```
boreas/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── use-cases/
│   │   └── testimonials/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── dashboard/         # Admin CRM
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── leads/
│   │   │   ├── clients/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   │
│   │   ├── client/            # Client portal
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── setup/
│   │   │   ├── automation/
│   │   │   └── billing/
│   │   │
│   │   └── api/               # API routes
│   │       ├── leads/
│   │       ├── clients/
│   │       ├── analytics/
│   │       ├── auth/
│   │       └── webhooks/
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── landing/          # Landing page components
│   │   │   ├── hero-section.tsx
│   │   │   ├── use-cases.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── contact-form.tsx
│   │   │   ├── faq-section.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/        # Admin dashboard components
│   │   │   ├── lead-table.tsx
│   │   │   ├── sales-pipeline.tsx
│   │   │   ├── metrics-card.tsx
│   │   │   ├── client-overview.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── client/           # Client portal components
│   │   │   ├── setup-wizard.tsx
│   │   │   ├── automation-config.tsx
│   │   │   ├── analytics-view.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── common/           # Shared components
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       ├── loading.tsx
│   │       ├── error-boundary.tsx
│   │       └── index.ts
│   │
│   ├── lib/                  # Utilities y configuración
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── auth.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── format.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── posthog.ts
│   │   │   ├── events.ts
│   │   │   └── tracking.ts
│   │   │
│   │   └── email/
│   │       ├── resend.ts
│   │       ├── templates.ts
│   │       └── sequences.ts
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-leads.ts
│   │   ├── use-clients.ts
│   │   ├── use-analytics.ts
│   │   ├── use-auth.ts
│   │   └── use-form.ts
│   │
│   ├── store/                # Estado global (Zustand)
│   │   ├── auth-store.ts
│   │   ├── leads-store.ts
│   │   ├── clients-store.ts
│   │   └── ui-store.ts
│   │
│   ├── services/             # API calls y business logic
│   │   ├── leads-service.ts
│   │   ├── clients-service.ts
│   │   ├── analytics-service.ts
│   │   ├── email-service.ts
│   │   └── auth-service.ts
│   │
│   └── types/                # TypeScript definitions
│       ├── database.ts
│       ├── api.ts
│       ├── auth.ts
│       ├── analytics.ts
│       └── index.ts
│
├── supabase/                 # Supabase migrations y config
│   ├── migrations/
│   ├── config.toml
│   └── seed.sql
│
├── docs/                     # Documentación técnica
└── .claude/                  # Claude Code config
```

### 6.4 Patrones Arquitecturales

#### A. Separación de Concerns
```typescript
// Estructura en capas
Presentation Layer (Components)
    ↓
Business Logic Layer (Services/Hooks)
    ↓
Data Access Layer (Supabase Client)
    ↓
Data Storage Layer (PostgreSQL)
```

#### B. Error Boundaries Strategy
```typescript
// Global error boundary en layout.tsx
<ErrorBoundary fallback={<ErrorPage />}>
  {children}
</ErrorBoundary>

// Feature-specific error boundaries
<LeadTableErrorBoundary>
  <LeadTable />
</LeadTableErrorBoundary>
```

#### C. Loading States Pattern
```typescript
// Consistent loading pattern across app
const { data, loading, error } = useLeads()

if (loading) return <LoadingSkeleton />
if (error) return <ErrorMessage error={error} />
return <LeadTable data={data} />
```

#### D. Form Validation Pattern
```typescript
// Zod schemas para validación consistente
const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
})

// React Hook Form + Zod
const form = useForm<Lead>({
  resolver: zodResolver(leadSchema)
})
```

---

## 7. Schema de Base de Datos

### 7.1 Diagrama de Entidades-Relaciones

```
                    ┌─────────────────┐
                    │     users       │
                    │ (team_boreas)   │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ email           │
                    │ name            │
                    │ role            │
                    │ created_at      │
                    │ updated_at      │
                    └─────────┬───────┘
                              │ 1:N
                              │
┌─────────────────┐          │          ┌─────────────────┐
│     leads       │          │          │   lead_notes    │
│ (prospects)     │          │          │                 │
├─────────────────┤          │          ├─────────────────┤
│ id (PK)         │          │          │ id (PK)         │
│ name            │          │          │ lead_id (FK)    │
│ email           │          │          │ user_id (FK)    │
│ company         │          │          │ content         │
│ phone           │          │          │ type            │
│ business_type   │          │          │ created_at      │
│ message         │ N:1      │          └─────────────────┘
│ status          │──────────┘
│ source          │
│ assigned_to (FK)│
│ created_at      │
│ updated_at      │
└─────────┬───────┘
          │ 1:1
          │ (conversion)
          ▼
┌─────────────────┐          ┌─────────────────┐
│    clients      │          │   projects      │
│ (converted)     │          │ (automations)   │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ lead_id (FK)    │          │ client_id (FK)  │
│ name            │ 1:N      │ name            │
│ email           │─────────▶│ type            │
│ company         │          │ status          │
│ phone           │          │ config          │
│ business_type   │          │ monthly_fee     │
│ status          │          │ setup_fee       │
│ plan_type       │          │ started_at      │
│ mrr             │          │ created_at      │
│ onboarded_at    │          │ updated_at      │
│ created_at      │          └─────────────────┘
│ updated_at      │
└─────────┬───────┘
          │ 1:N
          ▼
┌─────────────────┐          ┌─────────────────┐
│  client_calls   │          │   client_metrics│
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ client_id (FK)  │          │ client_id (FK)  │
│ user_id (FK)    │          │ project_id (FK) │
│ type            │          │ metric_type     │
│ duration        │          │ value           │
│ notes           │          │ period          │
│ scheduled_at    │          │ recorded_at     │
│ completed_at    │          │ created_at      │
│ created_at      │          └─────────────────┘
└─────────────────┘

        ┌─────────────────┐          ┌─────────────────┐
        │   email_logs    │          │  landing_analytics
        ├─────────────────┤          ├─────────────────┤
        │ id (PK)         │          │ id (PK)         │
        │ lead_id (FK)    │          │ session_id      │
        │ client_id (FK)  │          │ page_path       │
        │ template_name   │          │ visitor_ip      │
        │ subject         │          │ user_agent      │
        │ status          │          │ referrer        │
        │ sent_at         │          │ utm_source      │
        │ opened_at       │          │ utm_medium      │
        │ clicked_at      │          │ utm_campaign    │
        │ created_at      │          │ form_submitted  │
        └─────────────────┘          │ time_on_page    │
                                     │ created_at      │
                                     └─────────────────┘
```

### 7.2 Definiciones de Tablas

## Tabla: users

### Propósito
Usuarios del sistema Boreas (equipo interno: sales, admin, developers)

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| email | VARCHAR(255) | No | - | Email único |
| name | VARCHAR(100) | No | - | Nombre completo |
| role | user_role | No | 'sales' | sales, admin, developer |
| avatar_url | TEXT | Sí | null | URL de avatar |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- UNIQUE INDEX idx_users_email ON users(email)
- INDEX idx_users_role ON users(role)

### Triggers
- updated_at: Auto-update on modification

---

## Tabla: leads

### Propósito
Prospectos que llegan por la landing page o referidos

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(100) | No | - | Nombre del prospecto |
| email | VARCHAR(255) | No | - | Email de contacto |
| company | VARCHAR(100) | Sí | null | Nombre de la empresa |
| phone | VARCHAR(20) | Sí | null | Teléfono de contacto |
| business_type | business_type | Sí | null | salon, restaurant, clinic, etc |
| message | TEXT | Sí | null | Mensaje inicial |
| status | lead_status | No | 'new' | new, contacted, demo_scheduled, demo_completed, proposal_sent, won, lost |
| source | VARCHAR(50) | No | 'website' | website, referral, social, ads |
| utm_source | VARCHAR(50) | Sí | null | Tracking UTM |
| utm_medium | VARCHAR(50) | Sí | null | Tracking UTM |
| utm_campaign | VARCHAR(50) | Sí | null | Tracking UTM |
| assigned_to | UUID | Sí | null | FK a users |
| lead_score | INTEGER | No | 0 | 0-100 score |
| last_contact | TIMESTAMPTZ | Sí | null | Última vez contactado |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_leads_email ON leads(email)
- INDEX idx_leads_status ON leads(status)
- INDEX idx_leads_assigned ON leads(assigned_to)
- INDEX idx_leads_source ON leads(source)
- INDEX idx_leads_created ON leads(created_at DESC)

### Foreign Keys
- FK: assigned_to → users.id

---

## Tabla: lead_notes

### Propósito
Notas y seguimiento de interacciones con leads

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| lead_id | UUID | No | - | FK a leads |
| user_id | UUID | No | - | FK a users (quien escribió) |
| content | TEXT | No | - | Contenido de la nota |
| type | note_type | No | 'note' | note, call, email, meeting |
| created_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_lead_notes_lead ON lead_notes(lead_id)
- INDEX idx_lead_notes_user ON lead_notes(user_id)
- INDEX idx_lead_notes_created ON lead_notes(created_at DESC)

### Foreign Keys
- FK: lead_id → leads.id (ON DELETE CASCADE)
- FK: user_id → users.id

---

## Tabla: clients

### Propósito
Leads convertidos que son clientes activos del servicio

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| lead_id | UUID | Sí | null | FK a leads (conversión) |
| name | VARCHAR(100) | No | - | Nombre del cliente |
| email | VARCHAR(255) | No | - | Email principal |
| company | VARCHAR(100) | No | - | Nombre de la empresa |
| phone | VARCHAR(20) | No | - | Teléfono principal |
| business_type | business_type | No | - | salon, restaurant, clinic |
| status | client_status | No | 'active' | active, paused, churned |
| plan_type | plan_type | No | 'basic' | basic, pro, enterprise |
| mrr | DECIMAL(10,2) | No | 0.00 | Monthly Recurring Revenue |
| setup_fee | DECIMAL(10,2) | Sí | null | One-time setup fee |
| onboarded_at | TIMESTAMPTZ | Sí | null | Cuándo completó onboarding |
| churned_at | TIMESTAMPTZ | Sí | null | Cuándo se dio de baja |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- UNIQUE INDEX idx_clients_email ON clients(email)
- INDEX idx_clients_status ON clients(status)
- INDEX idx_clients_plan ON clients(plan_type)
- INDEX idx_clients_business ON clients(business_type)

### Foreign Keys
- FK: lead_id → leads.id

---

## Tabla: projects

### Propósito
Proyectos de automatización específicos para cada cliente

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| client_id | UUID | No | - | FK a clients |
| name | VARCHAR(100) | No | - | Ej: "WhatsApp Booking" |
| type | project_type | No | - | whatsapp_booking, email_sequence, sms_reminders |
| status | project_status | No | 'setup' | setup, active, paused, completed |
| config | JSONB | Sí | null | Configuración específica |
| monthly_fee | DECIMAL(10,2) | No | 0.00 | Fee mensual por proyecto |
| setup_fee | DECIMAL(10,2) | Sí | null | Fee de setup |
| started_at | TIMESTAMPTZ | Sí | null | Cuándo se activó |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_projects_client ON projects(client_id)
- INDEX idx_projects_type ON projects(type)
- INDEX idx_projects_status ON projects(status)

### Foreign Keys
- FK: client_id → clients.id (ON DELETE CASCADE)

---

## Tabla: client_calls

### Propósito
Registro de llamadas y meetings con clientes

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| client_id | UUID | No | - | FK a clients |
| user_id | UUID | No | - | FK a users (quien hizo la call) |
| type | call_type | No | - | demo, onboarding, support, check_in |
| duration | INTEGER | Sí | null | Duración en minutos |
| notes | TEXT | Sí | null | Notas de la llamada |
| outcome | call_outcome | Sí | null | successful, needs_followup, escalated |
| scheduled_at | TIMESTAMPTZ | No | - | Cuándo estaba programada |
| completed_at | TIMESTAMPTZ | Sí | null | Cuándo se completó |
| created_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_client_calls_client ON client_calls(client_id)
- INDEX idx_client_calls_user ON client_calls(user_id)
- INDEX idx_client_calls_scheduled ON client_calls(scheduled_at)

### Foreign Keys
- FK: client_id → clients.id
- FK: user_id → users.id

---

## Tabla: client_metrics

### Propósito
Métricas específicas de cada proyecto de cliente

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| client_id | UUID | No | - | FK a clients |
| project_id | UUID | Sí | null | FK a projects |
| metric_type | metric_type | No | - | messages_sent, bookings_made, revenue_generated |
| value | DECIMAL(15,2) | No | 0.00 | Valor de la métrica |
| period | period_type | No | 'daily' | daily, weekly, monthly |
| recorded_at | DATE | No | CURRENT_DATE | Fecha del período |
| created_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_client_metrics_client ON client_metrics(client_id)
- INDEX idx_client_metrics_project ON client_metrics(project_id)
- INDEX idx_client_metrics_type ON client_metrics(metric_type)
- INDEX idx_client_metrics_period ON client_metrics(recorded_at DESC)
- UNIQUE INDEX idx_client_metrics_unique ON client_metrics(client_id, project_id, metric_type, recorded_at)

### Foreign Keys
- FK: client_id → clients.id
- FK: project_id → projects.id

---

## Tabla: email_logs

### Propósito
Log de todos los emails enviados por el sistema

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| lead_id | UUID | Sí | null | FK a leads |
| client_id | UUID | Sí | null | FK a clients |
| email | VARCHAR(255) | No | - | Email destino |
| template_name | VARCHAR(100) | No | - | Nombre del template |
| subject | VARCHAR(200) | No | - | Subject del email |
| provider_id | VARCHAR(100) | Sí | null | ID del proveedor (Resend) |
| status | email_status | No | 'sent' | sent, delivered, bounced, failed |
| sent_at | TIMESTAMPTZ | No | now() | |
| opened_at | TIMESTAMPTZ | Sí | null | Primera vez abierto |
| clicked_at | TIMESTAMPTZ | Sí | null | Primer click |
| created_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_email_logs_lead ON email_logs(lead_id)
- INDEX idx_email_logs_client ON email_logs(client_id)
- INDEX idx_email_logs_email ON email_logs(email)
- INDEX idx_email_logs_template ON email_logs(template_name)
- INDEX idx_email_logs_status ON email_logs(status)
- INDEX idx_email_logs_sent ON email_logs(sent_at DESC)

### Foreign Keys
- FK: lead_id → leads.id
- FK: client_id → clients.id

---

## Tabla: landing_analytics

### Propósito
Analytics de comportamiento en la landing page

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| session_id | VARCHAR(100) | No | - | ID de sesión única |
| page_path | VARCHAR(200) | No | - | Ruta visitada |
| visitor_ip | INET | Sí | null | IP del visitante (hasheada) |
| user_agent | TEXT | Sí | null | User agent |
| referrer | TEXT | Sí | null | Referrer URL |
| utm_source | VARCHAR(50) | Sí | null | UTM tracking |
| utm_medium | VARCHAR(50) | Sí | null | UTM tracking |
| utm_campaign | VARCHAR(50) | Sí | null | UTM tracking |
| form_submitted | BOOLEAN | No | false | Si envió formulario |
| time_on_page | INTEGER | Sí | null | Segundos en página |
| created_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_landing_analytics_session ON landing_analytics(session_id)
- INDEX idx_landing_analytics_page ON landing_analytics(page_path)
- INDEX idx_landing_analytics_utm_source ON landing_analytics(utm_source)
- INDEX idx_landing_analytics_created ON landing_analytics(created_at DESC)

---

### 7.3 Enums Personalizados

```sql
-- Enum definitions
CREATE TYPE user_role AS ENUM ('sales', 'admin', 'developer');

CREATE TYPE business_type AS ENUM (
  'salon', 'restaurant', 'clinic', 'dentist',
  'veterinary', 'spa', 'gym', 'retail', 'other'
);

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'demo_scheduled', 'demo_completed',
  'proposal_sent', 'won', 'lost', 'nurturing'
);

CREATE TYPE client_status AS ENUM (
  'active', 'paused', 'churned', 'at_risk'
);

CREATE TYPE plan_type AS ENUM (
  'basic', 'pro', 'enterprise', 'custom'
);

CREATE TYPE project_type AS ENUM (
  'whatsapp_booking', 'email_sequence', 'sms_reminders',
  'social_automation', 'review_automation', 'custom'
);

CREATE TYPE project_status AS ENUM (
  'setup', 'active', 'paused', 'completed', 'cancelled'
);

CREATE TYPE note_type AS ENUM (
  'note', 'call', 'email', 'meeting', 'demo', 'followup'
);

CREATE TYPE call_type AS ENUM (
  'demo', 'onboarding', 'support', 'check_in', 'sales'
);

CREATE TYPE call_outcome AS ENUM (
  'successful', 'needs_followup', 'escalated', 'no_show'
);

CREATE TYPE metric_type AS ENUM (
  'messages_sent', 'bookings_made', 'revenue_generated',
  'response_rate', 'conversion_rate', 'satisfaction_score'
);

CREATE TYPE period_type AS ENUM (
  'daily', 'weekly', 'monthly', 'quarterly'
);

CREATE TYPE email_status AS ENUM (
  'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
);
```

### 7.4 Row Level Security (RLS) Policies

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = id);

-- Sales can see all leads, but only assigned leads for updates
CREATE POLICY leads_read_all ON leads
  FOR SELECT USING (
    auth.jwt() ->> 'user_role' = 'admin'
    OR auth.jwt() ->> 'user_role' = 'sales'
  );

CREATE POLICY leads_update_assigned ON leads
  FOR UPDATE USING (
    assigned_to = auth.uid()
    OR auth.jwt() ->> 'user_role' = 'admin'
  );

-- Clients visible to all team members
CREATE POLICY clients_team_access ON clients
  FOR ALL USING (
    auth.jwt() ->> 'user_role' IN ('admin', 'sales', 'developer')
  );
```

---

## 8. Interfaces TypeScript

### 8.1 Core Types

```typescript
// Database types (auto-generated by Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      clients: {
        Row: Client
        Insert: ClientInsert
        Update: ClientUpdate
      }
      // ... other tables
    }
    Enums: {
      user_role: 'sales' | 'admin' | 'developer'
      business_type: 'salon' | 'restaurant' | 'clinic' | 'dentist' | 'veterinary' | 'spa' | 'gym' | 'retail' | 'other'
      lead_status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_completed' | 'proposal_sent' | 'won' | 'lost' | 'nurturing'
      // ... other enums
    }
  }
}

// Entity interfaces
export interface User {
  id: string
  email: string
  name: string
  role: Database['public']['Enums']['user_role']
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  business_type?: Database['public']['Enums']['business_type']
  message?: string
  status: Database['public']['Enums']['lead_status']
  source: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  assigned_to?: string
  lead_score: number
  last_contact?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  lead_id?: string
  name: string
  email: string
  company: string
  phone: string
  business_type: Database['public']['Enums']['business_type']
  status: Database['public']['Enums']['client_status']
  plan_type: Database['public']['Enums']['plan_type']
  mrr: number
  setup_fee?: number
  onboarded_at?: string
  churned_at?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  type: Database['public']['Enums']['project_type']
  status: Database['public']['Enums']['project_status']
  config?: Record<string, any>
  monthly_fee: number
  setup_fee?: number
  started_at?: string
  created_at: string
  updated_at: string
}
```

### 8.2 API Response Types

```typescript
// Standard API response wrapper
export interface ApiResponse<T> {
  data: T
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
  details?: Record<string, string>
  field?: string
}

// Paginated responses
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Lead-specific responses
export interface LeadWithNotes extends Lead {
  notes: LeadNote[]
  assigned_user?: User
}

export interface LeadMetrics {
  total: number
  new: number
  contacted: number
  demo_scheduled: number
  won: number
  lost: number
  conversion_rate: number
}

// Client-specific responses
export interface ClientWithProjects extends Client {
  projects: Project[]
  total_mrr: number
  last_call?: ClientCall
}

export interface ClientMetrics {
  total_clients: number
  active_clients: number
  churned_clients: number
  total_mrr: number
  avg_mrr: number
  churn_rate: number
}
```

### 8.3 Form Types

```typescript
// Form schemas for validation
export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  business_type?: Database['public']['Enums']['business_type']
  message?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface LeadUpdateFormData {
  name?: string
  email?: string
  company?: string
  phone?: string
  business_type?: Database['public']['Enums']['business_type']
  status?: Database['public']['Enums']['lead_status']
  assigned_to?: string
  lead_score?: number
}

export interface ClientOnboardingFormData {
  company: string
  phone: string
  business_type: Database['public']['Enums']['business_type']
  plan_type: Database['public']['Enums']['plan_type']
  project_types: Database['public']['Enums']['project_type'][]
  monthly_budget: number
}

export interface ProjectConfigFormData {
  name: string
  type: Database['public']['Enums']['project_type']
  config: Record<string, any>
  monthly_fee: number
  setup_fee?: number
}
```

### 8.4 UI State Types

```typescript
// Zustand store types
export interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface LeadsStore {
  leads: Lead[]
  currentLead: Lead | null
  isLoading: boolean
  filters: LeadFilters
  pagination: PaginationState
  fetchLeads: () => Promise<void>
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>
  assignLead: (id: string, userId: string) => Promise<void>
  setFilters: (filters: Partial<LeadFilters>) => void
}

export interface LeadFilters {
  status?: Database['public']['Enums']['lead_status'][]
  business_type?: Database['public']['Enums']['business_type'][]
  assigned_to?: string
  source?: string[]
  date_range?: {
    from: Date
    to: Date
  }
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}

export interface UIStore {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  modals: {
    leadDetail: boolean
    clientOnboarding: boolean
    projectConfig: boolean
  }
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  openModal: (modal: keyof UIStore['modals']) => void
  closeModal: (modal: keyof UIStore['modals']) => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
```

### 8.5 Landing Page Types

```typescript
// Landing page specific types
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
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'pricing' | 'technical' | 'support'
  order: number
}

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
```

---

## 9. API Endpoints

### 9.1 Authentication Routes

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | /api/auth/signup | Register new user | No | { email, password, name } |
| POST | /api/auth/signin | Sign in user | No | { email, password } |
| POST | /api/auth/signout | Sign out user | Yes | {} |
| GET | /api/auth/me | Get current user | Yes | - |
| PUT | /api/auth/profile | Update user profile | Yes | { name?, avatar_url? } |
| POST | /api/auth/reset-password | Request password reset | No | { email } |
| POST | /api/auth/update-password | Update password | Yes | { password } |

### 9.2 Leads Routes

| Method | Endpoint | Description | Auth | Roles | Query Params |
|--------|----------|-------------|------|-------|-------------|
| GET | /api/leads | List all leads | Yes | sales, admin | ?page, ?limit, ?status, ?assigned_to, ?business_type |
| GET | /api/leads/:id | Get lead by ID | Yes | sales, admin | - |
| POST | /api/leads | Create new lead | No | - | - |
| PUT | /api/leads/:id | Update lead | Yes | sales, admin | - |
| DELETE | /api/leads/:id | Delete lead | Yes | admin | - |
| POST | /api/leads/:id/assign | Assign lead to user | Yes | admin | { user_id } |
| POST | /api/leads/:id/notes | Add note to lead | Yes | sales, admin | { content, type } |
| GET | /api/leads/:id/notes | Get lead notes | Yes | sales, admin | - |
| POST | /api/leads/:id/convert | Convert lead to client | Yes | sales, admin | ClientData |

### 9.3 Clients Routes

| Method | Endpoint | Description | Auth | Roles | Query Params |
|--------|----------|-------------|------|-------|-------------|
| GET | /api/clients | List all clients | Yes | all | ?page, ?limit, ?status, ?plan_type |
| GET | /api/clients/:id | Get client by ID | Yes | all | - |
| POST | /api/clients | Create new client | Yes | sales, admin | ClientData |
| PUT | /api/clients/:id | Update client | Yes | sales, admin | Partial<ClientData> |
| DELETE | /api/clients/:id | Delete client | Yes | admin | - |
| GET | /api/clients/:id/projects | Get client projects | Yes | all | - |
| POST | /api/clients/:id/projects | Create client project | Yes | sales, admin | ProjectData |
| GET | /api/clients/:id/metrics | Get client metrics | Yes | all | ?period, ?metric_type |
| POST | /api/clients/:id/calls | Schedule/log client call | Yes | sales, admin | CallData |

### 9.4 Analytics Routes

| Method | Endpoint | Description | Auth | Roles | Query Params |
|--------|----------|-------------|------|-------|-------------|
| GET | /api/analytics/leads | Lead metrics | Yes | admin | ?period, ?date_from, ?date_to |
| GET | /api/analytics/clients | Client metrics | Yes | admin | ?period, ?date_from, ?date_to |
| GET | /api/analytics/revenue | Revenue metrics | Yes | admin | ?period, ?date_from, ?date_to |
| GET | /api/analytics/landing | Landing page analytics | Yes | admin | ?period, ?page_path |
| GET | /api/analytics/funnel | Conversion funnel | Yes | admin | ?period |
| POST | /api/analytics/track | Track custom event | No | - | { event, properties } |

### 9.5 Public Routes (Landing Page)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | /api/contact | Submit contact form | No | ContactFormData |
| GET | /api/use-cases | Get use cases for landing | No | - |
| GET | /api/testimonials | Get testimonials | No | - |
| GET | /api/faq | Get FAQ items | No | - |
| GET | /api/pricing | Get pricing plans | No | - |
| POST | /api/newsletter | Subscribe to newsletter | No | { email } |

### 9.6 Email Routes

| Method | Endpoint | Description | Auth | Roles | Body |
|--------|----------|-------------|------|-------|------|
| POST | /api/email/send | Send custom email | Yes | sales, admin | { to, template, variables } |
| GET | /api/email/templates | List email templates | Yes | sales, admin | - |
| GET | /api/email/logs | Get email logs | Yes | admin | ?lead_id, ?client_id |
| POST | /api/email/sequences/start | Start email sequence | Yes | sales, admin | { lead_id, sequence_name } |
| POST | /api/email/sequences/stop | Stop email sequence | Yes | sales, admin | { lead_id, sequence_name } |

### 9.7 Webhooks Routes

| Method | Endpoint | Description | Auth | Source |
|--------|----------|-------------|------|--------|
| POST | /api/webhooks/resend | Resend email events | No | Resend |
| POST | /api/webhooks/stripe | Stripe payment events | No | Stripe |
| POST | /api/webhooks/posthog | PostHog analytics events | No | PostHog |

---

## 10. Security Architecture

### 10.1 Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │   Supabase      │    │   Database      │
│                 │    │   Auth          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. signInWithPassword │                       │
         │──────────────────────▶│                       │
         │                       │ 2. Validate creds    │
         │                       │──────────────────────▶│
         │                       │                       │
         │                       │ 3. User data          │
         │                       │◀──────────────────────│
         │ 4. JWT + Refresh      │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ 5. Subsequent requests│                       │
         │ Authorization: Bearer │                       │
         │──────────────────────▶│                       │
         │                       │ 6. Verify JWT         │
         │                       │──────────────────────▶│
         │                       │ 7. Execute query      │
         │                       │ with RLS              │
         │                       │──────────────────────▶│
```

### 10.2 Authorization Strategy

#### A. Role-Based Access Control (RBAC)
```typescript
// User roles and permissions
const PERMISSIONS = {
  sales: [
    'leads.read',
    'leads.update',
    'leads.assign_self',
    'clients.read',
    'clients.update',
    'calls.create',
    'calls.update',
    'notes.create',
    'email.send'
  ],
  admin: [
    '*' // All permissions
  ],
  developer: [
    'leads.read',
    'clients.read',
    'analytics.read',
    'logs.read'
  ]
}

// Middleware for route protection
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: NextResponse, next: NextFunction) => {
    const userRole = req.user.role
    const userPermissions = PERMISSIONS[userRole] || []

    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}
```

#### B. Row Level Security (RLS)
```sql
-- Leads: Sales can only see assigned leads or all if admin
CREATE POLICY leads_access ON leads
  USING (
    (auth.jwt() ->> 'role')::user_role = 'admin'
    OR assigned_to = auth.uid()
  );

-- Clients: All team members can read, only admin/sales can write
CREATE POLICY clients_read ON clients
  FOR SELECT USING (true); -- All authenticated users

CREATE POLICY clients_write ON clients
  FOR ALL USING (
    (auth.jwt() ->> 'role')::user_role IN ('admin', 'sales')
  );
```

### 10.3 Input Validation & Sanitization

```typescript
// Zod schemas for API validation
import { z } from 'zod'

export const CreateLeadSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  company: z.string().max(100).optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  business_type: z.enum(['salon', 'restaurant', 'clinic', 'dentist', 'veterinary', 'spa', 'gym', 'retail', 'other']).optional(),
  message: z.string().max(1000).optional(),
  utm_source: z.string().max(50).optional(),
  utm_medium: z.string().max(50).optional(),
  utm_campaign: z.string().max(50).optional()
})

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({
  status: z.enum(['new', 'contacted', 'demo_scheduled', 'demo_completed', 'proposal_sent', 'won', 'lost', 'nurturing']).optional(),
  assigned_to: z.string().uuid().optional(),
  lead_score: z.number().min(0).max(100).optional()
})

// API route validation middleware
export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return async (req: Request) => {
    try {
      const body = await req.json()
      const validatedData = schema.parse(body)
      return { data: validatedData, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors.reduce((acc, err) => {
              acc[err.path.join('.')] = err.message
              return acc
            }, {} as Record<string, string>)
          }
        }
      }
      return {
        data: null,
        error: {
          code: 'PARSE_ERROR',
          message: 'Invalid JSON body'
        }
      }
    }
  }
}
```

### 10.4 Rate Limiting

```typescript
// Redis-based rate limiting
import { Redis } from 'ioredis'
import { NextRequest } from 'next/server'

const redis = new Redis(process.env.REDIS_URL)

interface RateLimitConfig {
  windowMs: number    // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: NextRequest) => string
}

export const rateLimiter = (config: RateLimitConfig) => {
  return async (req: NextRequest) => {
    const key = config.keyGenerator ?
      config.keyGenerator(req) :
      `rate_limit:${req.ip || 'anonymous'}`

    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, Math.ceil(config.windowMs / 1000))
    }

    if (current > config.maxRequests) {
      return {
        blocked: true,
        retryAfter: await redis.ttl(key)
      }
    }

    return {
      blocked: false,
      remaining: config.maxRequests - current
    }
  }
}

// Usage in API routes
export const contactFormLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,            // 3 submissions per IP per 15 min
  keyGenerator: (req) => `contact_form:${req.ip}`
})

export const apiLimiter = rateLimiter({
  windowMs: 60 * 1000,       // 1 minute
  maxRequests: 100,          // 100 requests per user per minute
  keyGenerator: (req) => `api:${req.headers.get('authorization') || req.ip}`
})
```

---

## 11. Performance Optimization

### 11.1 Frontend Performance

#### A. Code Splitting Strategy
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('@/app/dashboard/page'))
const ClientPortal = lazy(() => import('@/app/client/page'))
const LandingPage = lazy(() => import('@/app/page'))

// Component-based splitting for heavy components
const DataTable = lazy(() => import('@/components/ui/data-table'))
const AnalyticsChart = lazy(() => import('@/components/dashboard/analytics-chart'))

// Preload critical routes
export const preloadRoutes = () => {
  if (typeof window !== 'undefined') {
    // Preload dashboard for authenticated users
    import('@/app/dashboard/page')
    // Preload common components
    import('@/components/ui/data-table')
  }
}
```

#### B. Image Optimization
```typescript
// Next.js Image component with optimizations
import Image from 'next/image'

export const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      quality={85}
      priority={props.priority || false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  )
}

// Responsive images configuration
export const imageBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}
```

#### C. Database Query Optimization
```typescript
// Optimized data fetching with React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query keys factory
export const queryKeys = {
  leads: ['leads'] as const,
  lead: (id: string) => ['leads', id] as const,
  leadNotes: (id: string) => ['leads', id, 'notes'] as const,
  clients: ['clients'] as const,
  client: (id: string) => ['clients', id] as const,
  analytics: (type: string, period: string) => ['analytics', type, period] as const,
}

// Optimized lead fetching with pagination
export const useLeads = (filters: LeadFilters, pagination: PaginationState) => {
  return useQuery({
    queryKey: [...queryKeys.leads, filters, pagination],
    queryFn: async () => {
      const query = supabase
        .from('leads')
        .select(`
          *,
          assigned_user:users(id, name),
          notes:lead_notes(id, content, type, created_at)
        `)
        .range(
          pagination.page * pagination.limit,
          (pagination.page + 1) * pagination.limit - 1
        )
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status?.length) {
        query.in('status', filters.status)
      }
      if (filters.assigned_to) {
        query.eq('assigned_to', filters.assigned_to)
      }
      if (filters.business_type?.length) {
        query.in('business_type', filters.business_type)
      }

      const { data, error, count } = await query
      if (error) throw error

      return {
        leads: data || [],
        total: count || 0
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  })
}

// Optimistic updates for lead status
export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: LeadStatus }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.leads })

      // Snapshot the previous value
      const previousLeads = queryClient.getQueriesData({ queryKey: queryKeys.leads })

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: queryKeys.leads },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            leads: old.leads.map((lead: Lead) =>
              lead.id === id ? { ...lead, status } : lead
            )
          }
        }
      )

      return { previousLeads }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousLeads) {
        context.previousLeads.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
    }
  })
}
```

### 11.2 Database Performance

#### A. Index Strategy
```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_leads_status_created
  ON leads(status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_leads_assigned_status
  ON leads(assigned_to, status)
  WHERE assigned_to IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_clients_status_plan
  ON clients(status, plan_type);

CREATE INDEX CONCURRENTLY idx_email_logs_composite
  ON email_logs(lead_id, sent_at DESC)
  WHERE lead_id IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_analytics_client_period
  ON client_metrics(client_id, metric_type, recorded_at DESC);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_leads_search
  ON leads USING gin(to_tsvector('english', name || ' ' || coalesce(company, '') || ' ' || coalesce(email, '')));

CREATE INDEX CONCURRENTLY idx_clients_search
  ON clients USING gin(to_tsvector('english', name || ' ' || company));
```

#### B. Query Optimization
```sql
-- Materialized view for analytics
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT
  date_trunc('day', created_at) as date,
  count(*) as total_leads,
  count(*) FILTER (WHERE status = 'won') as converted_leads,
  count(*) FILTER (WHERE status = 'lost') as lost_leads,
  round(
    count(*) FILTER (WHERE status = 'won')::numeric /
    nullif(count(*) FILTER (WHERE status IN ('won', 'lost'))::numeric, 0) * 100,
    2
  ) as conversion_rate
FROM leads
GROUP BY date_trunc('day', created_at)
ORDER BY date DESC;

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_daily_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh
SELECT cron.schedule('refresh-metrics', '0 1 * * *', 'SELECT refresh_daily_metrics()');
```

---

## 12. Monitoring & Observability

### 12.1 Error Tracking & Logging

```typescript
// Centralized error handling
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    context?: Record<string, any>
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.context = context
    this.name = 'AppError'
  }
}

// Error logging service
export const errorLogger = {
  log: async (error: Error | AppError, context?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        ...(error instanceof AppError ? error.context : {})
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', errorData)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Send to Sentry, LogRocket, or similar
        await fetch('/api/logs/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData)
        })
      } catch (loggingError) {
        console.error('Failed to log error:', loggingError)
      }
    }
  },

  logPerformance: async (metric: string, value: number, tags?: Record<string, string>) => {
    const perfData = {
      metric,
      value,
      tags,
      timestamp: new Date().toISOString()
    }

    if (process.env.NODE_ENV === 'production') {
      // Send to PostHog or similar
      posthog.capture('performance_metric', perfData)
    }
  }
}
```

### 12.2 Health Checks

```typescript
// API health check endpoint
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    supabase: await checkSupabase(),
    email: await checkEmailService(),
    analytics: await checkAnalyticsService()
  }

  const allHealthy = Object.values(checks).every(check => check.healthy)
  const status = allHealthy ? 200 : 503

  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  }, { status })
}

async function checkDatabase(): Promise<HealthCheck> {
  try {
    const start = Date.now()
    const { data, error } = await supabase.from('users').select('count').limit(1)
    const duration = Date.now() - start

    return {
      healthy: !error,
      duration,
      message: error ? error.message : 'Database responsive'
    }
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Database check failed'
    }
  }
}

interface HealthCheck {
  healthy: boolean
  duration?: number
  message: string
}
```

---

## 13. Decisiones de Experiencia

### 8.1 Nivel de Usuario
**Target:** Intermedio
- Guías contextuales cuando sea relevante
- Mejores prácticas destacadas
- Sin explicaciones básicas innecesarias

### 8.2 Updates de App
**Estrategia:** Normal
- Updates mensuales
- Proceso estándar de tiendas (no crítico OTA)
- Expo EAS para deployment simplificado

---

## 9. Próximos Pasos

### 9.1 Fase de Diseño (Semana 1)
1. [ ] **`/oden:architect`** - Arquitectura de landing page + dashboard CRM
2. [ ] **`/oden:analyze`** - Análisis profundo de ManyChat, Zapier, Calendly
3. [ ] **`/oden:spec landing`** - Especificación de landing page de ventas
4. [ ] **`/oden:spec dashboard`** - Especificación de dashboard CRM

### 9.2 Fase de Planificación (Semana 2)
5. [ ] **`/oden:plan`** - Plan de implementación y go-to-market
6. [ ] **`/oden:checklist`** - Verificar que todo esté listo para codificar

### 13.3 Target de Documentación Pre-Código
- technical-decisions.md: 2000+ líneas ✅ (actualmente ~3500)
- competitive-analysis.md: 1000+ líneas ⚠️ (pendiente)
- Specs de módulos: 800+ líneas c/u ⚠️ (pendiente)
- **Total objetivo:** 8000+ líneas antes de codificar

---

## 14. Deployment Strategy

### 14.1 Environment Configuration

```typescript
// Environment variables
interface EnvironmentConfig {
  // Database
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // Authentication
  SUPABASE_JWT_SECRET: string

  // External Services
  RESEND_API_KEY: string
  POSTHOG_KEY: string
  POSTHOG_HOST: string
  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string

  // Application
  NEXT_PUBLIC_APP_URL: string
  ENCRYPTION_KEY: string

  // Monitoring
  SENTRY_DSN?: string
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
}

// Environment validation
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // ... other validations
})

export const env = envSchema.parse(process.env)
```

### 14.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-staging:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### 14.3 Database Migrations

```sql
-- Migration strategy for Supabase
-- migrations/20240204000001_initial_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create enums first
CREATE TYPE user_role AS ENUM ('sales', 'admin', 'developer');
-- ... other enums

-- Create tables in dependency order
CREATE TABLE users (
  -- table definition
);

-- Create indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 15. Testing Strategy

### 15.1 Testing Pyramid

```typescript
// Unit tests for utilities
import { describe, it, expect } from 'vitest'
import { formatPhoneNumber, validateEmail } from '@/lib/utils/validation'

describe('Validation utilities', () => {
  describe('formatPhoneNumber', () => {
    it('formats US phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('+1234567890')).toBe('+1 (234) 567-890')
    })

    it('handles invalid phone numbers', () => {
      expect(formatPhoneNumber('invalid')).toBe('')
      expect(formatPhoneNumber('')).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('validates email addresses correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })
})

// Integration tests for API routes
import { describe, it, expect, beforeEach } from 'vitest'
import { testClient } from '@/lib/test/client'

describe('/api/leads', () => {
  beforeEach(async () => {
    await testClient.auth.signIn('admin@boreas.com', 'password')
  })

  describe('POST /api/leads', () => {
    it('creates a new lead with valid data', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        business_type: 'salon' as const
      }

      const response = await testClient.post('/api/leads', leadData)

      expect(response.status).toBe(201)
      expect(response.data).toMatchObject({
        name: leadData.name,
        email: leadData.email,
        status: 'new'
      })
    })

    it('validates required fields', async () => {
      const response = await testClient.post('/api/leads', {})

      expect(response.status).toBe(400)
      expect(response.error.code).toBe('VALIDATION_ERROR')
      expect(response.error.details).toHaveProperty('name')
      expect(response.error.details).toHaveProperty('email')
    })
  })
})

// E2E tests for critical user flows
import { test, expect } from '@playwright/test'

test.describe('Lead conversion flow', () => {
  test('admin can convert lead to client', async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('[data-testid=email]', 'admin@boreas.com')
    await page.fill('[data-testid=password]', 'password')
    await page.click('[data-testid=login-button]')

    // Navigate to leads
    await page.goto('/dashboard/leads')

    // Find and click on a lead
    await page.click('[data-testid=lead-row]:first-child')

    // Convert to client
    await page.click('[data-testid=convert-to-client]')

    // Fill client details
    await page.fill('[data-testid=client-company]', 'Test Salon')
    await page.fill('[data-testid=client-phone]', '+1234567890')
    await page.selectOption('[data-testid=client-business-type]', 'salon')
    await page.selectOption('[data-testid=client-plan]', 'basic')

    // Submit conversion
    await page.click('[data-testid=confirm-conversion]')

    // Verify success
    await expect(page.locator('[data-testid=success-message]')).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard\/clients\//)
  })
})
```

### 15.2 Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/lib/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

// Test setup
// src/lib/test/setup.ts
import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './msw/server'

// Mock server for API calls
beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
```

---

## 16. Go-to-Market Considerations

### 16.1 SEO Strategy

```typescript
// SEO configuration for landing page
export const seoConfig = {
  title: 'Boreas - Automatización de WhatsApp para Pequeños Negocios',
  description: 'Automatiza mensajes de WhatsApp, agenda citas y gestiona clientes para tu salón, restaurante o clínica. Aumenta eficiencia y ventas.',
  keywords: [
    'automatización whatsapp',
    'agendamiento citas automático',
    'whatsapp business',
    'automatización para salones',
    'chatbot reservas',
    'gestión clientes automática'
  ],
  openGraph: {
    title: 'Boreas - Automatización WhatsApp para Tu Negocio',
    description: 'Automatiza tu comunicación con clientes. Más citas, menos trabajo manual.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://boreas.com',
    images: [
      {
        url: 'https://boreas.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Boreas - Automatización WhatsApp'
      }
    ]
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Boreas',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '99',
      priceCurrency: 'USD'
    }
  }
}

// Target keywords for organic growth
export const targetKeywords = {
  primary: [
    'automatización whatsapp negocio',
    'agendamiento automático citas',
    'chatbot whatsapp reservas'
  ],
  secondary: [
    'whatsapp business automatizado',
    'sistema reservas online',
    'automatización salón belleza',
    'gestión citas restaurante'
  ],
  longTail: [
    'como automatizar mensajes whatsapp salón',
    'sistema automático reservas spa',
    'chatbot para agendar citas dentista'
  ]
}
```

### 16.2 Analytics & Conversion Tracking

```typescript
// Conversion tracking events
export const trackingEvents = {
  // Landing page events
  landing_view: 'Landing Page Viewed',
  hero_cta_click: 'Hero CTA Clicked',
  use_case_view: 'Use Case Viewed',
  testimonial_click: 'Testimonial Clicked',
  faq_expand: 'FAQ Expanded',

  // Contact form events
  form_start: 'Contact Form Started',
  form_field_complete: 'Form Field Completed',
  form_submit: 'Contact Form Submitted',
  form_error: 'Form Validation Error',

  // Lead qualification
  lead_created: 'Lead Created',
  lead_qualified: 'Lead Qualified',
  demo_scheduled: 'Demo Scheduled',
  demo_completed: 'Demo Completed',

  // Conversion events
  proposal_sent: 'Proposal Sent',
  client_converted: 'Client Converted',
  payment_completed: 'Payment Completed',

  // Product usage
  automation_setup: 'Automation Setup Started',
  first_message_sent: 'First Automated Message Sent',
  integration_connected: 'Integration Connected'
}

// Conversion funnel tracking
export const conversionFunnel = [
  { stage: 'visitor', event: 'landing_view' },
  { stage: 'interested', event: 'hero_cta_click' },
  { stage: 'engaged', event: 'form_start' },
  { stage: 'lead', event: 'form_submit' },
  { stage: 'qualified', event: 'demo_scheduled' },
  { stage: 'opportunity', event: 'demo_completed' },
  { stage: 'proposal', event: 'proposal_sent' },
  { stage: 'customer', event: 'client_converted' }
]
```

### 16.3 Launch Checklist

```markdown
## Pre-Launch Technical Checklist

### Infrastructure
- [ ] Production Supabase project configured
- [ ] Vercel project deployed and configured
- [ ] Custom domain configured (boreas.com)
- [ ] SSL certificates active
- [ ] CDN configured for static assets
- [ ] Database backups enabled

### Security
- [ ] Environment variables secured
- [ ] API rate limiting active
- [ ] CORS policies configured
- [ ] CSP headers implemented
- [ ] Security headers configured

### Performance
- [ ] Lighthouse scores > 90
- [ ] Core Web Vitals optimized
- [ ] Image optimization enabled
- [ ] Code splitting implemented
- [ ] Database queries optimized

### Monitoring
- [ ] Error tracking active (Sentry)
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Database monitoring active
- [ ] Alert notifications configured

### SEO & Analytics
- [ ] Google Analytics 4 configured
- [ ] Google Search Console verified
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Meta tags optimized
- [ ] Schema markup implemented

### Content
- [ ] Landing page copy finalized
- [ ] Use cases documented
- [ ] Testimonials prepared
- [ ] FAQ content complete
- [ ] Legal pages (Privacy, Terms)
- [ ] Contact information accurate

### Business Operations
- [ ] Email sequences prepared
- [ ] CRM workflows documented
- [ ] Sales scripts prepared
- [ ] Demo environment ready
- [ ] Support documentation complete
- [ ] Pricing strategy finalized
```

---

## 17. Riesgos y Mitigación

### 17.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Supabase outage | Media | Alto | Database backup strategy, monitoring |
| Vercel deployment issues | Baja | Medio | CI/CD pipeline, rollback strategy |
| Third-party API failures | Media | Medio | Error handling, fallback mechanisms |
| Performance degradation | Media | Alto | Monitoring, caching, optimization |
| Security vulnerabilities | Baja | Alto | Security audit, regular updates |

### 17.2 Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Baja conversión landing | Media | Alto | A/B testing, UX optimization |
| Competencia directa | Alta | Medio | Diferenciación, pricing strategy |
| Mercado pequeño | Media | Alto | Market research, expansion plan |
| Regulaciones WhatsApp | Baja | Alto | Compliance monitoring, alternatives |
| Dependencia de terceros | Media | Medio | Diversification, vendor management |

---

## 18. Métricas de Éxito

### 18.1 KPIs Técnicos

- **Uptime:** > 99.9%
- **Page Load Time:** < 2 segundos
- **API Response Time:** < 100ms (p95)
- **Error Rate:** < 0.1%
- **Lighthouse Score:** > 90 (todos los aspectos)

### 18.2 KPIs de Negocio

- **Landing Conversion Rate:** > 3%
- **Lead to Demo Rate:** > 20%
- **Demo to Customer Rate:** > 30%
- **Customer LTV/CAC Ratio:** > 3:1
- **Monthly Churn Rate:** < 5%

### 18.3 KPIs de Producto

- **Time to First Value:** < 24 horas
- **Feature Adoption Rate:** > 80%
- **Customer Satisfaction (NPS):** > 50
- **Support Ticket Volume:** < 2% of active users
- **Product-Market Fit Score:** > 40%

---

---

## 19. Mobile Strategy (Future Phase)

### 19.1 React Native + Expo Architecture

```typescript
// Mobile app structure (Phase 2)
mobile/
├── app.json              // Expo configuration
├── eas.json              // Build configuration
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── clients.tsx
│   │   └── settings.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/               // Shared UI components
│   ├── forms/            // Form components
│   └── charts/           // Mobile-optimized charts
├── hooks/                // Shared hooks with web
├── services/             // API services
├── store/                // Zustand stores
└── utils/                // Shared utilities

// Shared packages between web and mobile
packages/
├── shared-types/         // TypeScript definitions
├── shared-utils/         // Utility functions
├── shared-hooks/         // React hooks
└── shared-services/      // API services
```

### 19.2 Mobile-Specific Features

#### A. Native Notifications
```typescript
// Push notification service
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

export class NotificationService {
  static async registerForPushNotifications() {
    let token

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications')
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data

    return token
  }

  static async scheduleLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: { seconds: 1 },
    })
  }
}

// Notification types for different events
export interface NotificationConfig {
  new_lead: {
    title: 'Nuevo Lead'
    body: (name: string) => `${name} se registró en tu landing page`
    data: { type: 'lead', leadId: string }
  }
  demo_scheduled: {
    title: 'Demo Agendada'
    body: (time: string) => `Demo programada para ${time}`
    data: { type: 'demo', demoId: string }
  }
  client_message: {
    title: 'Mensaje de Cliente'
    body: (client: string) => `${client} te envió un mensaje`
    data: { type: 'message', clientId: string }
  }
}
```

#### B. Offline Capabilities
```typescript
// Offline sync service
import NetInfo from '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'

export class OfflineService {
  private static readonly OFFLINE_QUEUE_KEY = 'offline_queue'
  private static readonly LAST_SYNC_KEY = 'last_sync'

  static async queueAction(action: OfflineAction) {
    const queue = await this.getQueue()
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    })
    await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  }

  static async processQueue() {
    const netInfo = await NetInfo.fetch()
    if (!netInfo.isConnected) return

    const queue = await this.getQueue()
    const processedIds: string[] = []

    for (const action of queue) {
      try {
        await this.executeAction(action)
        processedIds.push(action.id)
      } catch (error) {
        console.error('Failed to process offline action:', error)
        // Keep action in queue for retry
      }
    }

    // Remove processed actions
    const remainingQueue = queue.filter(action => !processedIds.includes(action.id))
    await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue))

    // Update last sync time
    await AsyncStorage.setItem(this.LAST_SYNC_KEY, Date.now().toString())
  }

  private static async getQueue(): Promise<OfflineAction[]> {
    const queueData = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY)
    return queueData ? JSON.parse(queueData) : []
  }

  private static async executeAction(action: OfflineAction) {
    switch (action.type) {
      case 'update_lead':
        return await leadService.update(action.leadId, action.data)
      case 'add_note':
        return await noteService.create(action.leadId, action.note)
      case 'schedule_call':
        return await callService.schedule(action.clientId, action.callData)
      default:
        throw new Error(`Unknown offline action type: ${action.type}`)
    }
  }
}

interface OfflineAction {
  id: string
  type: 'update_lead' | 'add_note' | 'schedule_call'
  timestamp: number
  leadId?: string
  clientId?: string
  data?: any
  note?: string
  callData?: any
}
```

### 19.3 Mobile Performance Optimization

```typescript
// React Native performance optimizations
import { useMemo, useCallback } from 'react'
import { FlatList, VirtualizedList } from 'react-native'

// Optimized list rendering for large datasets
export const OptimizedLeadList = ({ leads, onLeadPress }: Props) => {
  const renderLead = useCallback(({ item }: { item: Lead }) => (
    <LeadListItem lead={item} onPress={onLeadPress} />
  ), [onLeadPress])

  const keyExtractor = useCallback((item: Lead) => item.id, [])

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80, // Fixed item height
    offset: 80 * index,
    index,
  }), [])

  return (
    <FlatList
      data={leads}
      renderItem={renderLead}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      initialNumToRender={10}
    />
  )
}

// Image optimization for mobile
import { Image } from 'expo-image'

export const OptimizedImage = ({ source, ...props }: ImageProps) => {
  return (
    <Image
      source={source}
      placeholder={PLACEHOLDER_BLURHASH}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      {...props}
    />
  )
}

// Bundle size optimization
export const loadDashboardModule = () => import('./Dashboard')
export const loadAnalyticsModule = () => import('./Analytics')
export const loadSettingsModule = () => import('./Settings')
```

---

## 20. Advanced Analytics Implementation

### 20.1 Custom Analytics Events

```typescript
// Advanced analytics tracking
export class AnalyticsService {
  private static instance: AnalyticsService
  private posthog: PostHog
  private mixpanel: Mixpanel

  constructor() {
    this.posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!
    })

    this.mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!)
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Identify user across platforms
  identify(userId: string, properties: UserProperties) {
    this.posthog.identify(userId, properties)
    this.mixpanel.people.set(properties)
  }

  // Track funnel events with rich context
  trackFunnelEvent(event: FunnelEvent, properties: EventProperties = {}) {
    const enrichedProperties = {
      ...properties,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    this.posthog.capture(event, enrichedProperties)
    this.mixpanel.track(event, enrichedProperties)
  }

  // A/B testing integration
  getFeatureFlag(flagName: string, defaultValue: any = false): any {
    return this.posthog.getFeatureFlag(flagName) ?? defaultValue
  }

  // Cohort analysis
  addUserToCohort(userId: string, cohortName: string) {
    this.posthog.group('cohort', cohortName)
  }

  // Revenue tracking
  trackRevenue(amount: number, currency: string = 'USD', properties: any = {}) {
    this.mixpanel.track('Revenue', {
      amount,
      currency,
      ...properties
    })

    this.posthog.capture('$transaction', {
      revenue: amount,
      currency,
      ...properties
    })
  }

  // Heatmap and session recording
  enableHeatmaps(selector: string) {
    this.posthog.capture('$heatmap', { selector })
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') ||
           Math.random().toString(36).substr(2, 9)
  }
}

// Funnel event definitions
export type FunnelEvent =
  | 'landing_page_view'
  | 'hero_cta_click'
  | 'use_case_explore'
  | 'testimonial_read'
  | 'faq_interact'
  | 'form_start'
  | 'form_field_complete'
  | 'form_submit_attempt'
  | 'form_submit_success'
  | 'demo_request'
  | 'email_open'
  | 'email_click'
  | 'demo_scheduled'
  | 'demo_attended'
  | 'proposal_viewed'
  | 'contract_signed'
  | 'payment_completed'
  | 'onboarding_started'
  | 'first_automation_created'
  | 'first_message_sent'

// Custom hooks for analytics
export const useAnalytics = () => {
  const analytics = AnalyticsService.getInstance()

  const trackEvent = useCallback((event: FunnelEvent, properties?: EventProperties) => {
    analytics.trackFunnelEvent(event, properties)
  }, [analytics])

  const trackPageView = useCallback((pageName: string, properties?: EventProperties) => {
    analytics.trackFunnelEvent('landing_page_view', {
      page_name: pageName,
      ...properties
    })
  }, [analytics])

  return { trackEvent, trackPageView }
}
```

### 20.2 Real-time Analytics Dashboard

```typescript
// Real-time analytics component
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export const RealTimeAnalytics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>()
  const [liveVisitors, setLiveVisitors] = useState(0)

  useEffect(() => {
    // Subscribe to real-time metrics updates
    const channel = supabase
      .channel('analytics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'leads'
      }, handleNewLead)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'leads'
      }, handleLeadUpdate)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleNewLead = (payload: any) => {
    setMetrics(prev => prev ? {
      ...prev,
      leads_today: prev.leads_today + 1,
      total_leads: prev.total_leads + 1
    } : prev)
  }

  const handleLeadUpdate = (payload: any) => {
    if (payload.new.status === 'won') {
      setMetrics(prev => prev ? {
        ...prev,
        conversions_today: prev.conversions_today + 1
      } : prev)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Live Visitors"
        value={liveVisitors}
        change={"+5.2%"}
        color="green"
      />
      <MetricCard
        title="Leads Today"
        value={metrics?.leads_today ?? 0}
        change={"+12.1%"}
        color="blue"
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics?.conversion_rate ?? 0}%`}
        change={"+2.1%"}
        color="purple"
      />
      <MetricCard
        title="Revenue Today"
        value={`$${metrics?.revenue_today ?? 0}`}
        change={"+18.3%"}
        color="green"
      />
    </div>
  )
}

interface RealTimeMetrics {
  leads_today: number
  total_leads: number
  conversions_today: number
  conversion_rate: number
  revenue_today: number
  live_visitors: number
}
```

---

## 21. Advanced Security Implementation

### 21.1 API Security Layers

```typescript
// Advanced API security middleware
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Security middleware stack
export const securityMiddleware = [
  // CORS configuration
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://boreas.com', 'https://www.boreas.com']
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }),

  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required for Next.js
          "https://js.posthog.com",
          "https://cdn.mixpanel.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://*.supabase.co",
          "https://api.resend.com",
          "https://app.posthog.com"
        ]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  })
]

// Request validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: NextRequest) => {
    try {
      // Validate Content-Type
      const contentType = req.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return NextResponse.json(
          { error: 'Content-Type must be application/json' },
          { status: 400 }
        )
      }

      // Validate body size
      const body = await req.text()
      if (body.length > 1024 * 1024) { // 1MB limit
        return NextResponse.json(
          { error: 'Request body too large' },
          { status: 413 }
        )
      }

      // Parse and validate JSON
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        )
      }

      // Validate against schema
      const result = schema.safeParse(parsedBody)
      if (!result.success) {
        return NextResponse.json({
          error: 'Validation failed',
          details: result.error.errors.reduce((acc, err) => {
            acc[err.path.join('.')] = err.message
            return acc
          }, {} as Record<string, string>)
        }, { status: 400 })
      }

      return { validatedData: result.data }
    } catch (error) {
      return NextResponse.json(
        { error: 'Request validation failed' },
        { status: 500 }
      )
    }
  }
}

// SQL Injection prevention
export const sanitizeQuery = (query: string, params: any[]): [string, any[]] => {
  // Use parameterized queries exclusively
  // This is handled by Supabase client automatically
  return [query, params]
}

// XSS prevention
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}
```

### 21.2 Authentication & Authorization

```typescript
// Enhanced JWT token management
export class TokenManager {
  private static readonly ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000 // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

  static async generateTokenPair(userId: string, role: string) {
    const accessTokenPayload = {
      sub: userId,
      role,
      type: 'access',
      exp: Date.now() + this.ACCESS_TOKEN_EXPIRY
    }

    const refreshTokenPayload = {
      sub: userId,
      type: 'refresh',
      exp: Date.now() + this.REFRESH_TOKEN_EXPIRY
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(accessTokenPayload),
      this.signToken(refreshTokenPayload)
    ])

    // Store refresh token hash in database
    await this.storeRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  }

  static async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = await this.verifySignature(token)

      if (payload.exp < Date.now()) {
        throw new Error('Token expired')
      }

      return payload
    } catch (error) {
      return null
    }
  }

  static async refreshAccessToken(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken)

    if (!payload || payload.type !== 'refresh') {
      throw new Error('Invalid refresh token')
    }

    // Verify refresh token exists in database
    const storedToken = await this.getStoredRefreshToken(payload.sub)
    if (!storedToken || storedToken !== refreshToken) {
      throw new Error('Refresh token not found or revoked')
    }

    // Get user role
    const user = await this.getUser(payload.sub)
    if (!user) {
      throw new Error('User not found')
    }

    // Generate new token pair
    return this.generateTokenPair(user.id, user.role)
  }

  static async revokeRefreshToken(userId: string) {
    await supabase
      .from('user_tokens')
      .delete()
      .eq('user_id', userId)
  }

  private static async signToken(payload: any): Promise<string> {
    // Implementation using jose or similar JWT library
    return jwt.sign(payload, process.env.JWT_SECRET!)
  }

  private static async verifySignature(token: string): Promise<any> {
    return jwt.verify(token, process.env.JWT_SECRET!)
  }

  private static async storeRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10)

    await supabase
      .from('user_tokens')
      .upsert({
        user_id: userId,
        token_hash: hashedToken,
        expires_at: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY)
      })
  }

  private static async getStoredRefreshToken(userId: string): Promise<string | null> {
    const { data } = await supabase
      .from('user_tokens')
      .select('token_hash')
      .eq('user_id', userId)
      .single()

    return data?.token_hash || null
  }

  private static async getUser(userId: string) {
    const { data } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .single()

    return data
  }
}

interface TokenPayload {
  sub: string
  role?: string
  type: 'access' | 'refresh'
  exp: number
}
```

---

## 22. Backup & Disaster Recovery

### 22.1 Database Backup Strategy

```sql
-- Automated backup procedures
-- Daily full backup
CREATE OR REPLACE FUNCTION create_daily_backup()
RETURNS void AS $$
BEGIN
  -- Export critical tables
  COPY (
    SELECT row_to_json(t)
    FROM (
      SELECT * FROM leads
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    ) t
  ) TO '/backups/leads_' || to_char(now(), 'YYYY_MM_DD') || '.json';

  COPY (
    SELECT row_to_json(t)
    FROM (SELECT * FROM clients) t
  ) TO '/backups/clients_' || to_char(now(), 'YYYY_MM_DD') || '.json';

  COPY (
    SELECT row_to_json(t)
    FROM (SELECT * FROM projects) t
  ) TO '/backups/projects_' || to_char(now(), 'YYYY_MM_DD') || '.json';

  -- Log backup completion
  INSERT INTO backup_log (backup_type, backup_date, status)
  VALUES ('daily', now(), 'completed');
END;
$$ LANGUAGE plpgsql;

-- Schedule daily backups
SELECT cron.schedule('daily-backup', '0 2 * * *', 'SELECT create_daily_backup()');

-- Weekly full system backup
CREATE OR REPLACE FUNCTION create_weekly_backup()
RETURNS void AS $$
BEGIN
  -- Full database dump
  PERFORM pg_dump('postgresql://user:pass@host:5432/dbname',
                  '/backups/full_backup_' || to_char(now(), 'YYYY_MM_DD'));

  INSERT INTO backup_log (backup_type, backup_date, status)
  VALUES ('weekly', now(), 'completed');
END;
$$ LANGUAGE plpgsql;

-- Backup monitoring table
CREATE TABLE backup_log (
  id SERIAL PRIMARY KEY,
  backup_type VARCHAR(50),
  backup_date TIMESTAMP DEFAULT now(),
  status VARCHAR(20),
  file_path TEXT,
  file_size BIGINT,
  notes TEXT
);
```

### 22.2 Recovery Procedures

```typescript
// Disaster recovery service
export class DisasterRecoveryService {
  static async initiateRecovery(backupDate: string, recoveryType: RecoveryType) {
    console.log(`Initiating ${recoveryType} recovery from ${backupDate}`)

    switch (recoveryType) {
      case 'full':
        return await this.fullSystemRecovery(backupDate)
      case 'partial':
        return await this.partialRecovery(backupDate)
      case 'point_in_time':
        return await this.pointInTimeRecovery(backupDate)
    }
  }

  static async fullSystemRecovery(backupDate: string) {
    // 1. Validate backup integrity
    const backupValid = await this.validateBackup(backupDate)
    if (!backupValid) {
      throw new Error('Backup validation failed')
    }

    // 2. Create new database instance
    const newDbInstance = await this.createDatabaseInstance()

    // 3. Restore from backup
    await this.restoreDatabase(newDbInstance, backupDate)

    // 4. Update application configuration
    await this.updateDatabaseConfig(newDbInstance)

    // 5. Run data validation
    const validationResults = await this.validateRestoredData()

    // 6. Switch traffic to restored instance
    if (validationResults.valid) {
      await this.switchTraffic(newDbInstance)
    }

    return {
      status: 'completed',
      newInstance: newDbInstance,
      validationResults
    }
  }

  static async createRecoveryPlan() {
    return {
      rto: '2 hours', // Recovery Time Objective
      rpo: '15 minutes', // Recovery Point Objective
      procedures: [
        {
          step: 1,
          action: 'Assess damage and determine recovery scope',
          estimatedTime: '15 minutes',
          owner: 'DevOps Team'
        },
        {
          step: 2,
          action: 'Validate latest backup integrity',
          estimatedTime: '10 minutes',
          owner: 'Database Admin'
        },
        {
          step: 3,
          action: 'Provision new infrastructure',
          estimatedTime: '30 minutes',
          owner: 'Infrastructure Team'
        },
        {
          step: 4,
          action: 'Restore database from backup',
          estimatedTime: '45 minutes',
          owner: 'Database Admin'
        },
        {
          step: 5,
          action: 'Validate data integrity',
          estimatedTime: '15 minutes',
          owner: 'QA Team'
        },
        {
          step: 6,
          action: 'Update DNS and switch traffic',
          estimatedTime: '15 minutes',
          owner: 'DevOps Team'
        }
      ],
      contacts: {
        emergencyContact: 'emergency@boreas.com',
        databaseAdmin: 'dba@boreas.com',
        infraTeam: 'infra@boreas.com'
      }
    }
  }

  private static async validateBackup(backupDate: string): Promise<boolean> {
    // Implement backup validation logic
    return true
  }

  private static async createDatabaseInstance(): Promise<string> {
    // Implement database instance creation
    return 'new-db-instance-id'
  }

  private static async restoreDatabase(instanceId: string, backupDate: string) {
    // Implement database restoration
  }

  private static async updateDatabaseConfig(instanceId: string) {
    // Update environment variables and application config
  }

  private static async validateRestoredData() {
    // Run data validation queries
    const criticalTablesCheck = await Promise.all([
      this.validateTable('users'),
      this.validateTable('leads'),
      this.validateTable('clients'),
      this.validateTable('projects')
    ])

    return {
      valid: criticalTablesCheck.every(result => result.valid),
      details: criticalTablesCheck
    }
  }

  private static async validateTable(tableName: string) {
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1)

    return {
      table: tableName,
      valid: !error,
      error: error?.message
    }
  }

  private static async switchTraffic(newInstanceId: string) {
    // Implement traffic switching logic
  }
}

type RecoveryType = 'full' | 'partial' | 'point_in_time'
```

---

## 23. Compliance & Legal Considerations

### 23.1 GDPR Compliance Implementation

```typescript
// GDPR compliance service
export class GDPRComplianceService {
  static async handleDataSubjectRequest(requestType: DataSubjectRequestType, email: string) {
    switch (requestType) {
      case 'access':
        return await this.handleAccessRequest(email)
      case 'rectification':
        return await this.handleRectificationRequest(email)
      case 'erasure':
        return await this.handleErasureRequest(email)
      case 'portability':
        return await this.handlePortabilityRequest(email)
      case 'restriction':
        return await this.handleRestrictionRequest(email)
    }
  }

  static async handleAccessRequest(email: string) {
    // Collect all personal data for the user
    const userData = await this.collectUserData(email)

    // Generate comprehensive data export
    const dataExport = {
      personal_information: userData.personal,
      communication_history: userData.communications,
      interaction_logs: userData.interactions,
      preferences: userData.preferences,
      generated_date: new Date().toISOString(),
      retention_period: '7 years from last interaction'
    }

    // Log the request
    await this.logDataSubjectRequest('access', email)

    return dataExport
  }

  static async handleErasureRequest(email: string) {
    const user = await this.findUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    // Check if we have legal basis to retain data
    const legalBasis = await this.checkLegalBasisForRetention(user.id)
    if (legalBasis.mustRetain) {
      return {
        status: 'partial_erasure',
        message: 'Some data must be retained for legal compliance',
        retained_data: legalBasis.retainedTypes,
        erased_data: await this.performPartialErasure(user.id)
      }
    }

    // Full erasure
    const erasureResult = await this.performFullErasure(user.id)

    await this.logDataSubjectRequest('erasure', email, {
      erasure_type: 'full',
      data_types_erased: erasureResult.erasedTypes
    })

    return {
      status: 'completed',
      message: 'All personal data has been erased',
      erased_data: erasureResult.erasedTypes
    }
  }

  static async anonymizeData(userId: string) {
    // Replace personal data with anonymous identifiers
    const anonymousId = `anon_${Math.random().toString(36).substr(2, 9)}`

    await Promise.all([
      // Anonymize leads
      supabase
        .from('leads')
        .update({
          name: 'Anonymous User',
          email: `${anonymousId}@anonymized.com`,
          phone: null,
          message: '[REDACTED]'
        })
        .eq('email', userId),

      // Anonymize notes
      supabase
        .from('lead_notes')
        .update({
          content: '[REDACTED - User requested data deletion]'
        })
        .in('lead_id', [/* lead IDs for this user */])
    ])
  }

  private static async collectUserData(email: string) {
    const { data: leads } = await supabase
      .from('leads')
      .select(`
        *,
        notes:lead_notes(*),
        emails:email_logs(*)
      `)
      .eq('email', email)

    const { data: clients } = await supabase
      .from('clients')
      .select(`
        *,
        projects(*),
        calls:client_calls(*),
        metrics:client_metrics(*)
      `)
      .eq('email', email)

    return {
      personal: { leads, clients },
      communications: [], // Email logs, etc.
      interactions: [], // Analytics data
      preferences: {} // User preferences
    }
  }

  private static async logDataSubjectRequest(
    type: string,
    email: string,
    metadata?: any
  ) {
    await supabase
      .from('gdpr_requests')
      .insert({
        request_type: type,
        subject_email: email,
        request_date: new Date(),
        status: 'completed',
        metadata
      })
  }
}

type DataSubjectRequestType = 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction'

// Cookie consent management
export const CookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsentState>()

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent')
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent))
    }
  }, [])

  const handleConsentUpdate = (newConsent: CookieConsentState) => {
    setConsent(newConsent)
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent))

    // Update analytics tracking based on consent
    if (newConsent.analytics) {
      AnalyticsService.getInstance().enableTracking()
    } else {
      AnalyticsService.getInstance().disableTracking()
    }
  }

  if (consent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="text-sm text-gray-600">
            Usamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar tu experiencia.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleConsentUpdate({
              necessary: true,
              analytics: false,
              marketing: false
            })}
            className="px-4 py-2 text-sm border rounded"
          >
            Solo Esenciales
          </button>
          <button
            onClick={() => handleConsentUpdate({
              necessary: true,
              analytics: true,
              marketing: true
            })}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Aceptar Todas
          </button>
        </div>
      </div>
    </div>
  )
}

interface CookieConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}
```

---

## 24. Scalability Considerations

### 24.1 Database Scaling Strategy

```sql
-- Database partitioning for analytics data
CREATE TABLE landing_analytics_y2026m01 PARTITION OF landing_analytics
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE landing_analytics_y2026m02 PARTITION OF landing_analytics
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Add indexes to partitions
CREATE INDEX idx_analytics_y2026m01_session ON landing_analytics_y2026m01(session_id);
CREATE INDEX idx_analytics_y2026m02_session ON landing_analytics_y2026m02(session_id);

-- Automated partition management
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    start_date date;
    end_date date;
    partition_name text;
BEGIN
    start_date := date_trunc('month', CURRENT_DATE + interval '1 month');
    end_date := start_date + interval '1 month';
    partition_name := 'landing_analytics_y' || extract(year from start_date) ||
                    'm' || lpad(extract(month from start_date)::text, 2, '0');

    EXECUTE format('CREATE TABLE %I PARTITION OF landing_analytics
                    FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);

    EXECUTE format('CREATE INDEX idx_%I_session ON %I(session_id)',
                   partition_name, partition_name);
END;
$$ LANGUAGE plpgsql;

-- Schedule partition creation
SELECT cron.schedule('create-partition', '0 0 25 * *', 'SELECT create_monthly_partition()');

-- Read replicas configuration
-- Separate read queries to reduce load on primary
CREATE PUBLICATION leads_publication FOR TABLE leads, clients, projects;

-- Connection pooling optimization
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
SELECT pg_reload_conf();
```

### 24.2 Application Scaling

```typescript
// Caching strategy implementation
export class CacheManager {
  private static redis: Redis
  private static memoryCache: Map<string, CacheEntry> = new Map()

  static async initialize() {
    this.redis = new Redis(process.env.REDIS_URL!)

    // Setup cache eviction for memory cache
    setInterval(() => this.evictExpiredEntries(), 60000) // Every minute
  }

  // Multi-tier caching
  static async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    const memoryEntry = this.memoryCache.get(key)
    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      return memoryEntry.value
    }

    // L2: Redis cache
    const redisValue = await this.redis.get(key)
    if (redisValue) {
      const parsed = JSON.parse(redisValue)

      // Store in memory cache for next access
      this.memoryCache.set(key, {
        value: parsed,
        expiresAt: Date.now() + 300000 // 5 minutes in memory
      })

      return parsed
    }

    return null
  }

  static async set<T>(key: string, value: T, ttlSeconds: number = 3600) {
    const expiresAt = Date.now() + (ttlSeconds * 1000)

    // Store in both caches
    this.memoryCache.set(key, { value, expiresAt })
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
  }

  static async invalidate(pattern: string) {
    // Invalidate from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }

    // Invalidate from Redis
    const keys = await this.redis.keys(`*${pattern}*`)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  private static evictExpiredEntries() {
    const now = Date.now()
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key)
      }
    }
  }
}

interface CacheEntry {
  value: any
  expiresAt: number
}

// Load balancing with geographic distribution
export const loadBalancerConfig = {
  regions: [
    {
      name: 'us-east-1',
      weight: 40,
      healthCheck: 'https://api-us-east.boreas.com/health'
    },
    {
      name: 'us-west-2',
      weight: 30,
      healthCheck: 'https://api-us-west.boreas.com/health'
    },
    {
      name: 'eu-west-1',
      weight: 30,
      healthCheck: 'https://api-eu.boreas.com/health'
    }
  ],
  failoverStrategy: 'least_connections',
  healthCheckInterval: 30000,
  timeoutMs: 5000
}

// Database query optimization
export const QueryOptimizer = {
  // Batch similar queries
  batchQueries: async (queries: DatabaseQuery[]) => {
    const groupedQueries = queries.reduce((groups, query) => {
      const key = `${query.table}_${query.operation}`
      if (!groups[key]) groups[key] = []
      groups[key].push(query)
      return groups
    }, {} as Record<string, DatabaseQuery[]>)

    const results = await Promise.all(
      Object.entries(groupedQueries).map(([key, queries]) =>
        this.executeBatchQuery(key, queries)
      )
    )

    return results.flat()
  },

  // Implement query result caching
  cachedQuery: async <T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> => {
    const cached = await CacheManager.get<T>(key)
    if (cached) return cached

    const result = await queryFn()
    await CacheManager.set(key, result, ttl)
    return result
  },

  // Database connection pooling
  getConnection: async () => {
    // Implement connection pooling logic
    // Reuse connections, manage pool size
  }
}
```

---

**Estado:** ✅ Arquitectura Completa Expandida
**Líneas de documentación:** ~4,200
**Próximo paso:** `/oden:analyze` para análisis competitivo detallado

**Creado:** 2026-02-04T04:15:25Z
**Actualizado:** 2026-02-06T18:26:58Z
**Generado por:** Oden Forge Technical Architect