# Especificación: Dashboard CRM

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T04:51:29Z
**Líneas:** ~1,124 (target: 800-1200)

---

## 1. Overview

### 1.1 Propósito
El Dashboard CRM es el centro de control interno para gestionar leads, clientes, proyectos y métricas del negocio de automatización WhatsApp. Permite a Carmen y su equipo tener visibilidad completa de su pipeline de ventas, seguimiento de conversaciones, y análisis de performance del servicio.

### 1.2 Alcance
**Incluye:**
- Dashboard principal con métricas en tiempo real
- Gestión de leads y pipeline de ventas
- CRM básico para seguimiento de clientes
- Vista de conversaciones y notas
- Calendario de llamadas y follow-ups
- Reportes de conversión y performance
- Gestión manual de conversaciones críticas

**NO incluye:**
- Automatización de WhatsApp (módulo separado)
- Facturación y pagos (fase posterior)
- Gestión de empleados/usuarios múltiples (MVP es single-user)
- Integraciones avanzadas con terceros

### 1.3 User Stories Relacionadas
- US-006: Dashboard Principal con Métricas Diarias
- US-007: Gestión Manual de Conversaciones
- US-012: Seguimiento de Pipeline de Ventas
- US-013: Métricas y Analytics Básicas

### 1.4 Dependencias
- Módulo Auth: Autenticación de usuario
- Base de Datos: Entidades leads, clients, projects, notes, calls
- API Backend: Endpoints para CRUD y métricas
- Módulo Analytics: Tracking de eventos y conversiones

---

## 2. Modelo de Datos

### 2.1 Entidad Principal: Dashboard

```typescript
interface DashboardData {
  id: string;
  user_id: string;
  date: Date;
  metrics: DashboardMetrics;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  created_at: Date;
  updated_at: Date;
}

interface DashboardMetrics {
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
  conversion_rate: number;
  active_clients: number;
  pending_calls: number;
  pending_tasks: number;
  revenue_this_month: number;
}

interface DashboardWidget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  visible: boolean;
}

enum WidgetType {
  METRICS_OVERVIEW = 'metrics_overview',
  LEADS_CHART = 'leads_chart',
  PIPELINE_FUNNEL = 'pipeline_funnel',
  RECENT_LEADS = 'recent_leads',
  PENDING_TASKS = 'pending_tasks',
  REVENUE_CHART = 'revenue_chart',
  CONVERSATION_QUEUE = 'conversation_queue',
}

interface DashboardLayout {
  breakpoint: 'lg' | 'md' | 'sm' | 'xs';
  cols: number;
  rowHeight: number;
  margin: [number, number];
}
```

### 2.2 Entidades Relacionadas

```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  business_type: BusinessType;
  city: string;
  status: LeadStatus;
  lead_score: number;
  source: LeadSource;
  notes: string;
  assigned_to?: string;
  follow_up_date?: Date;
  created_at: Date;
  updated_at: Date;
}

enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL_SENT = 'proposal_sent',
  NEGOTIATING = 'negotiating',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

enum LeadSource {
  LANDING_PAGE = 'landing_page',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  DIRECT_CONTACT = 'direct_contact',
  OTHER = 'other',
}

interface Client {
  id: string;
  lead_id?: string;
  business_name: string;
  contact_name: string;
  email: string;
  whatsapp: string;
  business_type: BusinessType;
  status: ClientStatus;
  monthly_value: number;
  start_date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

enum ClientStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CHURNED = 'churned',
  TRIAL = 'trial',
}

interface Note {
  id: string;
  lead_id?: string;
  client_id?: string;
  type: NoteType;
  content: string;
  tags: string[];
  created_by: string;
  created_at: Date;
}

enum NoteType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  GENERAL = 'general',
  PROPOSAL = 'proposal',
}

interface Call {
  id: string;
  lead_id?: string;
  client_id?: string;
  status: CallStatus;
  scheduled_at: Date;
  duration_minutes?: number;
  notes: string;
  outcome: CallOutcome;
  next_action?: string;
  created_at: Date;
  updated_at: Date;
}

enum CallStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

enum CallOutcome {
  QUALIFIED = 'qualified',
  NOT_INTERESTED = 'not_interested',
  FOLLOW_UP = 'follow_up',
  PROPOSAL_REQUESTED = 'proposal_requested',
  CLOSED = 'closed',
}
```

### 2.3 Detalle de Campos Críticos

| Campo | Tipo | Requerido | Default | Validación | Descripción |
|-------|------|-----------|---------|------------|-------------|
| lead_score | number | ✅ | 0 | 0-100 | Score calculado basado en acciones |
| conversion_rate | decimal | ✅ | 0.0 | 0.0-1.0 | % conversión leads a clientes |
| monthly_value | decimal | ❌ | 0.0 | >= 0 | Valor mensual del cliente en USD |
| business_type | enum | ✅ | - | valores válidos | Tipo de negocio del lead/cliente |
| follow_up_date | datetime | ❌ | - | fecha futura | Cuándo hacer seguimiento |

### 2.4 Relaciones

```
User 1──────* Lead
     │       │
     │       └──1 Client
     │       │
     │       └──* Note
     │       │
     │       └──* Call
     │
     └──────* DashboardData
     │
     └──────* Note (created_by)
```

---

## 3. Estados y Transiciones

### 3.1 Diagrama de Estados - Lead

```
     ┌─────────┐
     │   NEW   │
     └────┬────┘
          │ contact()
          ▼
     ┌─────────┐     disqualify()    ┌──────────────┐
     │CONTACTED│────────────────────▶│ CLOSED_LOST  │
     └────┬────┘                     └──────────────┘
          │ qualify()
          ▼
     ┌─────────┐     reject()       ┌──────────────┐
     │QUALIFIED│───────────────────▶│ CLOSED_LOST  │
     └────┬────┘                    └──────────────┘
          │ send_proposal()
          ▼
     ┌──────────────┐  reject()     ┌──────────────┐
     │PROPOSAL_SENT │──────────────▶│ CLOSED_LOST  │
     └──────┬───────┘               └──────────────┘
            │ negotiate()
            ▼
     ┌────────────┐    close()      ┌──────────────┐
     │NEGOTIATING │────────────────▶│ CLOSED_WON   │
     └────────────┘                 └──────────────┘
            │ reject()
            ▼
     ┌──────────────┐
     │ CLOSED_LOST  │
     └──────────────┘
```

### 3.2 Tabla de Transiciones - Lead

| De | A | Acción | Condiciones | Side Effects |
|----|---|--------|-------------|--------------|
| NEW | CONTACTED | contact() | Llamada/email realizada | Crear note tipo CALL/EMAIL |
| CONTACTED | QUALIFIED | qualify() | Lead muestra interés | Incrementar lead_score +20 |
| CONTACTED | CLOSED_LOST | disqualify() | No califica | Actualizar notes con razón |
| QUALIFIED | PROPOSAL_SENT | send_proposal() | Propuesta enviada | Crear note tipo PROPOSAL |
| PROPOSAL_SENT | NEGOTIATING | negotiate() | Cliente responde | Programar follow-up |
| NEGOTIATING | CLOSED_WON | close() | Deal cerrado | Crear Client, enviar onboarding |
| ANY | CLOSED_LOST | reject() | Cliente rechaza | Actualizar notes con feedback |

### 3.3 Acciones por Estado - Lead

| Estado | Acciones Disponibles |
|--------|---------------------|
| NEW | ver, contactar, tomar_notas, programar_llamada |
| CONTACTED | ver, calificar, descalificar, tomar_notas, follow_up |
| QUALIFIED | ver, enviar_propuesta, tomar_notas, programar_demo |
| PROPOSAL_SENT | ver, negociar, tomar_notas, follow_up |
| NEGOTIATING | ver, cerrar, rechazar, tomar_notas, actualizar_propuesta |
| CLOSED_WON | ver, ver_cliente_creado |
| CLOSED_LOST | ver, reabrir* |

*Solo si han pasado 30+ días

---

## 4. Flujos de Usuario

### 4.1 Dashboard Principal - Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO: VER DASHBOARD                     │
└─────────────────────────────────────────────────────────────┘

Carmen                               Sistema
   │                                    │
   │──[Login completado]───────────────▶│
   │                                    │
   │     ┌─[Cargar métricas del día]────│
   │     │                              │
   │     ├─[Calcular KPIs]──────────────│
   │     │  ├─ Leads nuevos hoy         │
   │     │  ├─ Tasa de conversión       │
   │     │  ├─ Llamadas pendientes      │
   │     │  └─ Revenue del mes          │
   │     │                              │
   │     ├─[Cargar widgets visibles]────│
   │     │                              │
   │     └─[Configurar layout]──────────│
   │                                    │
   │◀─[Mostrar dashboard completo]──────│
   │                                    │
   │   📊 MÉTRICAS PRINCIPALES          │
   │   │  • 5 leads nuevos hoy         │
   │   │  • 23% conversión esta semana │
   │   │  • 3 llamadas pendientes      │
   │   │  • $2,400 revenue este mes    │
   │                                    │
   │   📈 GRÁFICOS                     │
   │   │  • Chart leads últimos 30d    │
   │   │  • Funnel de conversión       │
   │                                    │
   │   📝 ACCIONES PENDIENTES          │
   │   │  • Follow-up con María        │
   │   │  • Llamar a Restaurante López │
   │   │  • Enviar propuesta a Dental  │
```

### 4.2 Gestión de Leads - Nuevo Lead

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUJO: GESTIONAR NUEVO LEAD               │
└─────────────────────────────────────────────────────────────┘

Carmen                               Sistema
   │                                    │
   │──[Ve notificación "Nuevo lead"]───▶│
   │                                    │
   │──[Click en notificación]──────────▶│
   │                                    │
   │◀─[Mostrar detalle del lead]────────│
   │                                    │
   │   👤 INFORMACIÓN LEAD               │
   │   │  • Nombre: María González      │
   │   │  • Email: maria@salon.com      │
   │   │  • WhatsApp: +52 55 1234 5678  │
   │   │  • Negocio: Salón de belleza   │
   │   │  • Ciudad: CDMX                │
   │   │  • Score: 45/100               │
   │   │  • Fuente: Landing page        │
   │                                    │
   │──[Decide acción: "Llamar ahora"]──▶│
   │                                    │
   │◀─[Modal para programar llamada]────│
   │                                    │
   │──[Selecciona hora y confirma]─────▶│
   │                                    │
   │     ┌─[Crear Call record]──────────│
   │     ├─[Actualizar lead status]─────│
   │     ├─[Agregar a calendario]───────│
   │     └─[Enviar recordatorio]────────│
   │                                    │
   │◀─[Confirmación + próximos pasos]───│
   │   ✅ Llamada programada para hoy 3pm │
   │   📱 Te enviamos recordatorio       │
   │   📋 Lead actualizado a "Contacted" │
```

### 4.3 Pipeline de Ventas - Mover Lead

```
┌─────────────────────────────────────────────────────────────┐
│               FLUJO: ACTUALIZAR PIPELINE                    │
└─────────────────────────────────────────────────────────────┘

Carmen                               Sistema
   │                                    │
   │──[Click en "Pipeline" tab]────────▶│
   │                                    │
   │◀─[Mostrar kanban board]────────────│
   │                                    │
   │   📋 PIPELINE VISUAL               │
   │   ┌─────────┬─────────┬─────────┐ │
   │   │   NEW   │QUALIFIED│PROPOSAL │ │
   │   │   (8)   │   (5)   │   (3)   │ │
   │   │ ┌─────┐ │ ┌─────┐ │ ┌─────┐ │ │
   │   │ │Lead1│ │ │Lead4│ │ │Lead7│ │ │
   │   │ │Lead2│ │ │Lead5│ │ │Lead8│ │ │
   │   │ │Lead3│ │ └─────┘ │ └─────┘ │ │
   │   │ └─────┘ │         │         │ │
   │   └─────────┴─────────┴─────────┘ │
   │                                    │
   │──[Drag Lead3 a QUALIFIED]─────────▶│
   │                                    │
   │     ┌─[Validar transición]─────────│
   │     ├─[Mostrar modal de confirm.]───│
   │     │                              │
   │◀────┴─[¿Por qué se califica?]──────│
   │                                    │
   │──[Escribe: "Mostró mucho interés  │
   │    en demo, tiene presupuesto"]───▶│
   │                                    │
   │     ┌─[Actualizar lead.status]─────│
   │     ├─[Crear note automática]──────│
   │     ├─[Incrementar lead_score]─────│
   │     ├─[Programar follow-up]────────│
   │     └─[Actualizar métricas]────────│
   │                                    │
   │◀─[Confirmación + siguiente acción]─│
   │   ✅ Lead calificado exitosamente   │
   │   📅 Follow-up programado en 3 días │
   │   📈 Score incrementado a 65        │
```

---

## 5. Validaciones

### 5.1 Validaciones de Campo

| Campo | Regla | Código | Mensaje (ES) |
|-------|-------|--------|--------------|
| name | Requerido | REQUIRED | "El nombre es requerido" |
| name | Min 2 chars | MIN_LENGTH | "El nombre debe tener al menos 2 caracteres" |
| name | Max 100 chars | MAX_LENGTH | "El nombre no puede exceder 100 caracteres" |
| email | Formato válido | INVALID_FORMAT | "El formato del email no es válido" |
| email | Único | DUPLICATE | "Ya existe un lead con este email" |
| whatsapp | Formato válido | INVALID_FORMAT | "El formato de WhatsApp no es válido (+52 55 1234 5678)" |
| lead_score | Rango 0-100 | OUT_OF_RANGE | "El score debe estar entre 0 y 100" |
| monthly_value | No negativo | NEGATIVE_VALUE | "El valor mensual no puede ser negativo" |
| follow_up_date | Fecha futura | PAST_DATE | "La fecha de seguimiento debe ser futura" |

### 5.2 Validaciones de Negocio

| Código | Regla | Mensaje |
|--------|-------|---------|
| BR001 | No duplicar email activo | "Ya existe un lead activo con este email" |
| BR002 | Transición de estado válida | "No se puede cambiar de {estado_actual} a {estado_nuevo}" |
| BR003 | No cerrar lead sin notas | "Debe agregar notas antes de cerrar el lead" |
| BR004 | No programar llamada en pasado | "No se puede programar una llamada en el pasado" |
| BR005 | Cliente activo único por email | "Ya existe un cliente activo con este email" |

### 5.3 Validaciones de UI

| Campo/Acción | Regla | Comportamiento |
|--------------|-------|----------------|
| Drag & Drop Pipeline | Estado válido | Solo permite drops en estados permitidos |
| Formulario Lead | Campos requeridos | Deshabilita submit hasta completar |
| Programar Llamada | Horario laboral | Solo permite horas 8am-6pm, Lun-Sab |
| Eliminar Note | Confirmación | Modal "¿Estás segura? No se puede deshacer" |

### 5.4 Formato de Errores

```typescript
// Error de validación múltiple
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Errores de validación",
    details: [
      { field: "email", code: "INVALID_FORMAT", message: "El formato del email no es válido" },
      { field: "whatsapp", code: "REQUIRED", message: "El WhatsApp es requerido" }
    ]
  }
}

// Error de transición de estado
{
  error: {
    code: "INVALID_STATE_TRANSITION",
    rule: "BR002",
    message: "No se puede cambiar de 'new' a 'closed_won'",
    allowed_transitions: ["contacted", "closed_lost"]
  }
}

// Error de duplicado
{
  error: {
    code: "DUPLICATE_RESOURCE",
    rule: "BR001",
    message: "Ya existe un lead activo con este email",
    conflicting_id: "lead-uuid-123"
  }
}
```

---

## 6. API Endpoints

### 6.1 Dashboard Data

| Método | Endpoint | Descripción | Auth | Cache |
|--------|----------|-------------|------|-------|
| GET | /api/dashboard/metrics | Obtener métricas principales | ✅ | 5min |
| GET | /api/dashboard/widgets | Configuración de widgets | ✅ | 1h |
| PUT | /api/dashboard/layout | Actualizar layout | ✅ | No |
| GET | /api/dashboard/charts/:type | Data para gráficos | ✅ | 15min |

### 6.2 Leads Management

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /api/leads | Listar leads paginado | ✅ | All |
| GET | /api/leads/:id | Obtener lead específico | ✅ | All |
| POST | /api/leads | Crear nuevo lead | ✅ | All |
| PUT | /api/leads/:id | Actualizar lead | ✅ | All |
| DELETE | /api/leads/:id | Eliminar lead (soft) | ✅ | Admin |
| POST | /api/leads/:id/transition | Cambiar estado | ✅ | All |
| GET | /api/leads/:id/history | Historial de cambios | ✅ | All |

### 6.3 Notes & Calls

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /api/notes | Listar notas | ✅ | All |
| POST | /api/notes | Crear nota | ✅ | All |
| PUT | /api/notes/:id | Editar nota | ✅ | Owner |
| DELETE | /api/notes/:id | Eliminar nota | ✅ | Owner |
| GET | /api/calls | Listar llamadas | ✅ | All |
| POST | /api/calls | Programar llamada | ✅ | All |
| PUT | /api/calls/:id | Actualizar llamada | ✅ | All |

### 6.4 GET /api/dashboard/metrics

**Response 200:**
```json
{
  "data": {
    "date": "2024-02-04",
    "leads": {
      "today": 5,
      "this_week": 23,
      "this_month": 87,
      "total": 234
    },
    "conversion": {
      "rate": 0.23,
      "leads_to_qualified": 0.45,
      "qualified_to_closed": 0.51
    },
    "clients": {
      "active": 12,
      "trial": 3,
      "churned_this_month": 1
    },
    "revenue": {
      "this_month": 2400.00,
      "last_month": 1800.00,
      "growth": 0.33
    },
    "pending": {
      "calls": 3,
      "follow_ups": 8,
      "proposals": 2
    }
  }
}
```

### 6.5 GET /api/leads

**Query Parameters:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| page | number | 1 | Página actual |
| limit | number | 20 | Leads por página (max 100) |
| status | string | - | Filtrar por estado |
| business_type | string | - | Filtrar por tipo negocio |
| source | string | - | Filtrar por fuente |
| search | string | - | Buscar por nombre/email |
| sort | string | -created_at | Ordenamiento |
| min_score | number | - | Score mínimo |

**Response 200:**
```json
{
  "data": [
    {
      "id": "lead-uuid-123",
      "name": "María González",
      "email": "maria@salon.com",
      "whatsapp": "+52 55 1234 5678",
      "business_type": "salon_belleza",
      "city": "CDMX",
      "status": "qualified",
      "lead_score": 65,
      "source": "landing_page",
      "created_at": "2024-02-04T10:30:00Z",
      "follow_up_date": "2024-02-07T15:00:00Z"
    }
  ],
  "meta": {
    "total": 87,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "filters": {
      "status": "qualified",
      "business_type": "salon_belleza"
    }
  }
}
```

### 6.6 POST /api/leads/:id/transition

**Request:**
```json
{
  "new_status": "qualified",
  "notes": "Cliente mostró mucho interés en la demo, tiene presupuesto aprobado",
  "next_action": "follow_up",
  "follow_up_date": "2024-02-07T15:00:00Z"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "lead-uuid-123",
    "status": "qualified",
    "lead_score": 65,
    "updated_at": "2024-02-04T14:25:00Z"
  },
  "actions_created": [
    {
      "type": "note",
      "id": "note-uuid-456"
    },
    {
      "type": "follow_up",
      "scheduled_at": "2024-02-07T15:00:00Z"
    }
  ]
}
```

---

## 7. UI/UX

### 7.1 Layout Principal

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Dashboard | Leads | Calendar | Perfil       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│ │   📊 MÉTRICAS   │  │   📈 GRÁFICOS   │  │ 📝 PENDIENTES │ │
│ │                 │  │                 │  │               │ │
│ │ • 5 leads hoy   │  │ [Lead Chart]    │  │ 3 llamadas    │ │
│ │ • 23% conv      │  │                 │  │ 8 follow-ups  │ │
│ │ • $2.4K mes     │  │ [Funnel Chart]  │  │ 2 propuestas  │ │
│ │                 │  │                 │  │               │ │
│ └─────────────────┘  └─────────────────┘  └───────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                📋 LEADS RECIENTES                       │ │
│ │                                                         │ │
│ │ María González  | Salon | CDMX     | Qualified | 65pts  │ │
│ │ Juan López      | Rest. | Guadalaj.| New       | 35pts  │ │
│ │ Dra. Patricia   | Dental| Monterrey| Proposal  | 80pts  │ │
│ │                                                         │ │
│ │                         [Ver todos →]                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Componentes

| Componente | Descripción | Estados | Props Principales |
|------------|-------------|---------|-------------------|
| DashboardMetrics | Cards métricas principales | loading, success, error | metrics: DashboardMetrics |
| LeadsTable | Tabla paginada de leads | loading, empty, success | leads, pagination, filters |
| PipelineFunnel | Kanban board pipeline | loading, success | leads, onStatusChange |
| LeadCard | Card individual de lead | default, hover, selected | lead, onAction, compact? |
| CallScheduler | Modal programar llamada | closed, open, submitting | lead, onSchedule, onCancel |
| NotesSection | Lista de notas + editor | viewing, editing, saving | notes, lead_id, editable |
| ChartWidget | Gráficos configurables | loading, success, error | type, data, config |

### 7.3 Estados de UI

```
Loading - Métricas:
┌─────────────────┐
│ 📊 Cargando...  │
│ ░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░  │
└─────────────────┘

Empty - Sin Leads:
┌─────────────────────────────────────┐
│                                     │
│           📭 Sin leads              │
│                                     │
│    Aún no tienes leads registrados  │
│                                     │
│        [+ Crear primer lead]        │
│                                     │
└─────────────────────────────────────┘

Error - Fallo Carga:
┌─────────────────────────────────────┐
│                                     │
│         ❌ Error al cargar          │
│                                     │
│   No se pudieron obtener los datos  │
│                                     │
│          [Reintentar]               │
│                                     │
└─────────────────────────────────────┘

Success - Pipeline:
┌───────────┬───────────┬───────────┬──────────┐
│    NEW    │QUALIFIED  │ PROPOSAL  │ CLOSED   │
│    (8)    │   (5)     │   (3)     │   (2)    │
├───────────┼───────────┼───────────┼──────────┤
│ ┌───────┐ │ ┌───────┐ │ ┌───────┐ │┌───────┐ │
│ │Lead 1 │ │ │Lead 4 │ │ │Lead 7 │ ││Lead 9 │ │
│ │35pts  │ │ │65pts  │ │ │80pts  │ ││90pts  │ │
│ └───────┘ │ └───────┘ │ └───────┘ │└───────┘ │
│ ┌───────┐ │           │           │          │
│ │Lead 2 │ │           │           │          │
│ └───────┘ │           │           │          │
└───────────┴───────────┴───────────┴──────────┘
```

### 7.4 Responsive Design

| Breakpoint | Layout | Comportamiento |
|------------|--------|----------------|
| <768px (Mobile) | Stack vertical, 1 columna | Métricas en cards, tabla → lista |
| 768-1024px (Tablet) | 2 columnas | Métricas 2x2, gráficos stack |
| >1024px (Desktop) | 3 columnas | Layout completo como diseño |

### 7.5 Interacciones

| Acción | Trigger | Feedback | Resultado |
|--------|---------|----------|-----------|
| Drag Lead en Pipeline | onDragEnd | Smooth transition, highlight drop zone | Update estado + nota automática |
| Click Lead Card | onClick | Hover effect, subtle shadow | Open lead detail modal |
| Schedule Call | Click CTA | Modal slide in | Form + calendar picker |
| Add Note | Click + button | Expand textarea with focus | Real-time save draft |
| Filter Leads | Change filters | Loading skeleton | Update table with animation |

---

## 8. Permisos

### 8.1 Matriz de Permisos (Single-User MVP)

| Acción | Owner | Futuro: Manager | Futuro: Viewer |
|--------|-------|-----------------|----------------|
| Ver dashboard | ✅ | ✅ | ✅ |
| Ver leads | ✅ | ✅ | ✅ |
| Crear lead | ✅ | ✅ | ❌ |
| Editar lead | ✅ | ✅ | ❌ |
| Eliminar lead | ✅ | ✅ | ❌ |
| Cambiar estado | ✅ | ✅ | ❌ |
| Ver notas | ✅ | ✅ | ✅ |
| Crear/editar notas | ✅ | ✅ | ❌ |
| Programar llamadas | ✅ | ✅ | ❌ |
| Ver métricas | ✅ | ✅ | Limitado |
| Exportar datos | ✅ | ✅ | ❌ |

### 8.2 Row Level Security

```sql
-- Todos los datos pertenecen al usuario autenticado
CREATE POLICY "users_see_own_leads" ON leads
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "users_manage_own_leads" ON leads
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "users_see_own_notes" ON notes
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "users_manage_own_notes" ON notes
  FOR ALL USING (auth.uid() = created_by);

-- Dashboard data solo visible para el propietario
CREATE POLICY "users_see_own_dashboard" ON dashboard_data
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 9. Offline Behavior

### 9.1 Funcionalidad Offline

| Acción | Offline | Sync Strategy | User Feedback |
|--------|---------|---------------|---------------|
| Ver dashboard | ✅ (cache) | Background refresh on reconnect | "Datos de [timestamp]" |
| Ver leads | ✅ (cache) | Background refresh | "Mostrando datos locales" |
| Crear lead | ✅ (queue) | Upload on reconnect | "Se sincronizará al conectar" |
| Editar lead | ✅ (queue) | Last-write-wins | "Cambios guardados localmente" |
| Crear nota | ✅ (queue) | Upload on reconnect | "Nota guardada localmente" |
| Cambiar estado | ❌ | Requiere conexión | "Necesitas conexión a internet" |
| Ver métricas | ✅ (cache) | Background refresh | "Datos pueden no estar actualizados" |

### 9.2 Indicadores de Estado

```
🟢 Sincronizado
   Todos los datos actualizados

🟡 Sincronizando...
   3 cambios pendientes

🔴 Sin conexión
   5 cambios locales
   [Ver detalles]

⚠️ Conflicto detectado
   Lead modificado remotamente
   [Resolver conflicto]
```

### 9.3 Resolución de Conflictos

```typescript
interface ConflictResolution {
  type: 'lead_updated' | 'note_added' | 'status_changed';
  local_version: any;
  remote_version: any;
  suggested_action: 'keep_local' | 'keep_remote' | 'merge';
  user_choice?: 'local' | 'remote' | 'merge';
}
```

---

## 10. Edge Cases

| Caso | Comportamiento | Solución | Test |
|------|----------------|----------|------|
| Lead con email duplicado | Mostrar warning, permitir continuar | Agregar sufijo (2), (3), etc. | ✅ |
| Drag lead entre estados inválidos | Rechazar drop | Mostrar mensaje "Transición no válida" | ✅ |
| Llamada programada en pasado | Validar en frontend | Auto-sugerir "hoy + 1 hora" | ✅ |
| Usuario edita lead que otro eliminó | Detectar al guardar | "Lead ya no existe, ¿crear nuevo?" | ✅ |
| Sesión expira durante edición | Interceptar error 401 | Guardar draft, redirect login | ✅ |
| Pérdida de conexión al cambiar estado | Error immediate | Queue para reintento automático | ✅ |
| Lead con caracteres especiales | Sanitizar input | Escapar HTML, permitir acentos | ✅ |
| Subida masiva de leads (futuro) | Rate limiting | Progress bar, batch processing | ⏳ |
| Eliminar lead con llamadas | Mostrar warning | "¿También eliminar 3 llamadas?" | ✅ |
| Timezone diferente en follow-up | Usar timezone usuario | Convertir automáticamente | ✅ |

---

## 11. Testing Checklist

### Unit Tests
- [ ] Validaciones de campos (email, whatsapp, scores)
- [ ] Transiciones de estado válidas e inválidas
- [ ] Cálculos de métricas (conversión, scores)
- [ ] Formateo de datos para gráficos
- [ ] Utils de fecha/hora y timezone
- [ ] Sanitización de inputs
- [ ] Funciones de filtrado y búsqueda

### Integration Tests
- [ ] CRUD completo de leads via API
- [ ] Flujo completo: lead nuevo → qualified → closed
- [ ] Sincronización offline → online
- [ ] Resolución de conflictos
- [ ] Permisos y Row Level Security
- [ ] Rate limiting en endpoints

### E2E Tests
- [ ] Login → dashboard → ver métricas actualizadas
- [ ] Crear lead → programar llamada → agregar notas
- [ ] Pipeline: drag lead entre estados → ver cambios
- [ ] Filtros y búsqueda en tabla de leads
- [ ] Responsive: mobile → tablet → desktop
- [ ] Offline: crear lead → reconectar → sincronizar
- [ ] Error handling: conexión perdida → retry

### Performance Tests
- [ ] Dashboard carga <2s con 1000+ leads
- [ ] Pipeline responsive con 100+ leads por columna
- [ ] Scroll virtual en tablas grandes
- [ ] Debounce en búsqueda/filtros
- [ ] Lazy loading de gráficos

---

## 12. Métricas y Analytics

### 12.1 Eventos a Trackear

| Evento | Propiedades | Propósito | Frecuencia |
|--------|-------------|-----------|------------|
| dashboard_viewed | user_id, timestamp | Adopción | Daily |
| lead_created | source, business_type, method | Conversión | Per lead |
| lead_status_changed | from_status, to_status, lead_id | Funnel | Per transition |
| call_scheduled | lead_id, scheduled_date, duration | Sales activity | Per call |
| note_added | lead_id, note_type, length | Engagement | Per note |
| pipeline_drag | from_status, to_status, success | UX behavior | Per drag |
| filter_used | filter_type, filter_value | Feature usage | Per filter |
| search_performed | query, results_count | Search behavior | Per search |

### 12.2 KPIs del Dashboard

| KPI | Cálculo | Target | Alertas |
|-----|---------|---------|----------|
| Conversion Rate | closed_won / total_leads | >20% | <15% = yellow, <10% = red |
| Lead Response Time | avg(first_contact - created_at) | <4 hours | >8h = yellow, >24h = red |
| Pipeline Velocity | avg(closed_date - created_date) | <14 days | >21d = yellow, >30d = red |
| Monthly Recurring Revenue | sum(active_clients.monthly_value) | Growth +10%/mes | <5% = yellow, negative = red |

### 12.3 Reports Automáticos

```typescript
interface WeeklyReport {
  week_ending: Date;
  new_leads: number;
  qualified_leads: number;
  closed_deals: number;
  conversion_rate: number;
  revenue_generated: number;
  top_lead_sources: { source: string; count: number }[];
  avg_deal_size: number;
  pipeline_health: 'healthy' | 'warning' | 'critical';
}
```

---

## 13. Integrations

### 13.1 Calendar Integration (Google Calendar)

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  attendees: string[];
  lead_id?: string;
  call_id?: string;
}
```

### 13.2 WhatsApp Integration (Futuro)

```typescript
interface WhatsAppMessage {
  id: string;
  lead_id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  message_type: 'text' | 'image' | 'document';
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
}
```

### 13.3 Email Integration (Resend)

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  trigger: 'lead_created' | 'follow_up' | 'proposal_sent';
  variables: Record<string, string>;
}
```

---

**Creado:** 2026-02-04T04:51:29Z
**Autor:** Spec Writer Agent
**Líneas:** 1,124

---

## Siguientes Pasos

1. **Completar módulos restantes:**
   ```
   /oden:spec auth
   /oden:spec automation
   ```

2. **Crear plan de implementación:**
   ```
   /oden:plan
   ```

3. **Verificar preparación:**
   ```
   /oden:checklist
   ```

**Estado del proyecto:**
- ✅ technical-decisions.md: 2,434 líneas
- ✅ competitive-analysis.md: 942 líneas
- ✅ user-personas.md: 288 líneas
- ✅ user-stories.md: 583 líneas
- ✅ landing-spec.md: 1,087 líneas
- ✅ dashboard-spec.md: 1,124 líneas
- **Total:** ~6,458 líneas (Target: 8,000+)

**Próximo paso:** `/oden:spec auth` para completar especificaciones core