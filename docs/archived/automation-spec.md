# Especificación: Sistema de Automatización WhatsApp

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T05:07:14Z
**Líneas:** ~1,234 (target: 800-1200)

---

## 1. Overview

### 1.1 Propósito
El Sistema de Automatización WhatsApp es el núcleo del valor propuesto por Boreas. Automatiza las comunicaciones de pequeños negocios con sus clientes a través de WhatsApp, manejando consultas comunes, agendamiento de citas, confirmaciones automáticas, recordatorios y seguimientos post-servicio. Reduce la carga manual de responder mensajes mientras mejora la experiencia del cliente.

### 1.2 Alcance
**Incluye:**
- Bot conversacional inteligente para WhatsApp Business API
- Respuestas automáticas a preguntas frecuentes
- Sistema de agendamiento de citas integrado
- Gestión de disponibilidad y calendarios
- Recordatorios automáticos de citas
- Seguimiento post-servicio
- Escalación manual para casos complejos
- Dashboard de conversaciones en tiempo real
- Métricas de automatización vs manual
- Configuración personalizable por tipo de negocio
- Templates de mensajes dinámicos
- Integración con Google Calendar

**NO incluye:**
- WhatsApp Personal (solo Business API)
- Automatización de otros canales (Telegram, SMS) - fase posterior
- Procesamiento de pagos via WhatsApp - futuro
- AI/ML avanzado para comprensión de lenguaje natural
- Chatbot con capacidades de ventas complejas
- Integración con sistemas POS externos

### 1.3 User Stories Relacionadas
- US-001: Respuestas Automáticas a Consultas Comunes
- US-002: Agendamiento de Citas por WhatsApp
- US-003: Recordatorios Automáticos de Citas
- US-004: Respuestas Fuera de Horario
- US-005: Gestión de Cancelaciones y Reprogramaciones
- US-007: Gestión Manual de Conversaciones
- US-008: Actualización de Información del Bot

### 1.4 Dependencias
- WhatsApp Business API: Envío y recepción de mensajes
- Módulo Auth: Autenticación de usuarios del sistema
- Módulo Dashboard: Visualización de métricas y conversaciones
- Google Calendar API: Gestión de disponibilidad
- Base de Datos: Almacenamiento de conversaciones y configuración
- Supabase Realtime: Actualizaciones en tiempo real

---

## 2. Modelo de Datos

### 2.1 Entidades Principales

```typescript
// Bot Configuration
interface BotConfig {
  id: string;
  client_id: string; // FK to Client
  business_type: BusinessType;
  business_name: string;
  whatsapp_number: string;
  status: BotStatus;
  settings: BotSettings;
  created_at: Date;
  updated_at: Date;
}

enum BotStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  SUSPENDED = 'suspended',
}

interface BotSettings {
  business_hours: BusinessHours;
  services: Service[];
  greeting_message: string;
  fallback_message: string;
  escalation_triggers: string[];
  language: 'es' | 'en';
  timezone: string;
  auto_confirm_appointments: boolean;
  reminder_hours: number[];
  follow_up_enabled: boolean;
}

interface BusinessHours {
  [key: string]: { // 'monday', 'tuesday', etc.
    open: string; // "09:00"
    close: string; // "18:00"
    enabled: boolean;
  };
}

interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description?: string;
  availability?: ServiceAvailability;
}

interface ServiceAvailability {
  days: string[]; // ['monday', 'tuesday']
  hours: { start: string; end: string };
  staff?: string[];
}

// Conversations
interface Conversation {
  id: string;
  bot_config_id: string;
  customer_phone: string;
  customer_name?: string;
  status: ConversationStatus;
  context: ConversationContext;
  last_message_at: Date;
  needs_human: boolean;
  escalated_at?: Date;
  escalated_reason?: string;
  created_at: Date;
  updated_at: Date;
}

enum ConversationStatus {
  ACTIVE = 'active',
  WAITING = 'waiting',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
  ARCHIVED = 'archived',
}

interface ConversationContext {
  current_flow?: string; // 'appointment_booking', 'faq', 'escalation'
  step?: string; // 'select_service', 'select_date', 'confirm'
  collected_data?: Record<string, any>;
  preferences?: Record<string, any>;
  appointment_id?: string;
}

// Messages
interface Message {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  content: MessageContent;
  message_type: MessageType;
  status: MessageStatus;
  sent_at: Date;
  delivered_at?: Date;
  read_at?: Date;
  is_automated: boolean;
  template_id?: string;
  webhook_id?: string; // WhatsApp webhook ID
}

enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  INTERACTIVE = 'interactive', // Buttons/Lists
  TEMPLATE = 'template',
  LOCATION = 'location',
}

enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

interface MessageContent {
  text?: string;
  media_url?: string;
  interactive?: InteractiveContent;
  template?: TemplateContent;
}

interface InteractiveContent {
  type: 'button' | 'list';
  body: string;
  footer?: string;
  buttons?: Array<{ id: string; title: string }>;
  list_items?: Array<{ id: string; title: string; description?: string }>;
}

// Templates
interface MessageTemplate {
  id: string;
  bot_config_id: string;
  name: string;
  type: TemplateType;
  trigger: TemplateTrigger;
  content: TemplateContent;
  variables: TemplateVariable[];
  conditions?: TemplateCondition[];
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

enum TemplateType {
  GREETING = 'greeting',
  FAQ_RESPONSE = 'faq_response',
  APPOINTMENT_CONFIRM = 'appointment_confirm',
  REMINDER = 'reminder',
  FOLLOW_UP = 'follow_up',
  OUT_OF_HOURS = 'out_of_hours',
  ESCALATION = 'escalation',
}

interface TemplateTrigger {
  keywords?: string[];
  flow_step?: string;
  schedule?: ScheduleTrigger;
  event?: EventTrigger;
}

interface ScheduleTrigger {
  type: 'reminder' | 'follow_up';
  hours_before?: number;
  hours_after?: number;
}

interface EventTrigger {
  type: 'appointment_booked' | 'appointment_cancelled' | 'first_message';
}

interface TemplateContent {
  text: string;
  interactive?: InteractiveContent;
  media_url?: string;
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'date' | 'time' | 'number' | 'currency';
  source: 'conversation' | 'appointment' | 'service' | 'business' | 'customer';
  path: string; // e.g., 'appointment.date', 'service.name'
  default_value?: string;
}

// Appointments (integración con Calendar)
interface Appointment {
  id: string;
  conversation_id?: string;
  bot_config_id: string;
  customer_phone: string;
  customer_name: string;
  service_id: string;
  scheduled_date: Date;
  duration: number; // minutes
  status: AppointmentStatus;
  notes?: string;
  calendar_event_id?: string; // Google Calendar ID
  reminder_sent: boolean;
  follow_up_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

// Analytics
interface AutomationMetrics {
  id: string;
  bot_config_id: string;
  date: Date;
  total_messages: number;
  automated_messages: number;
  manual_messages: number;
  conversations_started: number;
  conversations_resolved: number;
  escalations: number;
  appointments_booked: number;
  automation_rate: number;
  avg_response_time: number;
  customer_satisfaction?: number;
  created_at: Date;
}
```

### 2.2 Detalle de Campos Críticos

| Campo | Tipo | Requerido | Default | Validación | Descripción |
|-------|------|-----------|---------|------------|-------------|
| whatsapp_number | string | ✅ | - | E.164 format | Número WhatsApp Business |
| business_hours | object | ✅ | 9-18 L-V | valid hours | Horarios de atención |
| greeting_message | string | ✅ | template | 1-1000 chars | Mensaje inicial del bot |
| automation_rate | decimal | ✅ | 0.0 | 0.0-1.0 | % mensajes automatizados |
| response_time | number | ✅ | 0 | >= 0 | Tiempo respuesta en segundos |
| customer_phone | string | ✅ | - | E.164 format | Teléfono del cliente |
| scheduled_date | datetime | ✅ | - | fecha futura | Fecha de la cita |

### 2.3 Relaciones

```
Client 1──────1 BotConfig
       │       │
       │       └──────* Conversation
       │              │
       │              └─────* Message
       │
       └──────* Appointment
              │
              └─────1 Service

BotConfig 1──────* MessageTemplate
         │
         └──────* AutomationMetrics

Conversation 1──────* Message
            │
            └─────? Appointment
```

---

## 3. Estados y Transiciones

### 3.1 Diagrama de Estados - Conversation

```
     ┌─────────┐
     │ ACTIVE  │────────────────────┐
     └────┬────┘                    │
          │ escalate()              │ resolve()
          ▼                         ▼
     ┌─────────┐     resolve()  ┌─────────┐
     │ESCALATED│──────────────▶│RESOLVED │
     └────┬────┘               └────┬────┘
          │ continue()              │ archive()
          ▼                         ▼
     ┌─────────┐               ┌─────────┐
     │ WAITING │               │ARCHIVED │
     └────┬────┘               └─────────┘
          │ resume()
          ▼
     ┌─────────┐
     │ ACTIVE  │
     └─────────┘
```

### 3.2 Tabla de Transiciones - Conversation

| De | A | Acción | Condiciones | Side Effects |
|----|---|--------|-------------|--------------|
| ACTIVE | ESCALATED | escalate() | Trigger keywords o manual | Notificar humano |
| ACTIVE | RESOLVED | resolve() | Cliente satisfecho | Marcar auto_resolved |
| ESCALATED | RESOLVED | resolve() | Humano resuelve | Log resolution notes |
| ESCALATED | WAITING | continue() | Esperando cliente | Set waiting state |
| WAITING | ACTIVE | resume() | Cliente responde | Continue flow |
| RESOLVED | ARCHIVED | archive() | +24h inactividad | Cleanup conversation |

### 3.3 Diagrama de Estados - Appointment

```
     ┌───────────┐
     │ SCHEDULED │
     └─────┬─────┘
           │ confirm()
           ▼
     ┌───────────┐     cancel()     ┌───────────┐
     │ CONFIRMED │─────────────────▶│ CANCELLED │
     └─────┬─────┘                  └───────────┘
           │ complete()
           ▼
     ┌───────────┐     no_show()    ┌───────────┐
     │ COMPLETED │◀─────────────────│  NO_SHOW  │
     └───────────┘                  └───────────┘
```

### 3.4 Flujos de Conversación

```typescript
// Conversation Flow Engine
interface ConversationFlow {
  id: string;
  name: string;
  trigger: FlowTrigger;
  steps: FlowStep[];
  fallback_step: string;
}

interface FlowStep {
  id: string;
  type: StepType;
  content: StepContent;
  validations?: StepValidation[];
  next_steps: NextStep[];
  timeout?: number;
}

enum StepType {
  MESSAGE = 'message',
  QUESTION = 'question',
  CHOICE = 'choice',
  VALIDATION = 'validation',
  API_CALL = 'api_call',
  CONDITION = 'condition',
  ESCALATION = 'escalation',
}

interface NextStep {
  condition: string; // JS expression
  step_id: string;
  action?: StepAction;
}

interface StepAction {
  type: 'save_data' | 'book_appointment' | 'send_notification';
  params: Record<string, any>;
}
```

---

## 4. Flujos de Usuario

### 4.1 Consulta Automática - FAQ

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO: CONSULTA AUTOMÁTICA                     │
└─────────────────────────────────────────────────────────────┘

Cliente                              Sistema WhatsApp
   │                                    │
   │──["Hola, ¿cuánto cuesta corte?"]──▶│
   │                                    │
   │     ┌─[Recibir mensaje webhook]────│
   │     ├─[Buscar/crear conversación]──│
   │     ├─[Analizar intent]─────────────│
   │     │  ├─ Keywords: "cuesta, corte"│
   │     │  ├─ Match: FAQ_PRICING       │
   │     │  └─ Confidence: 95%          │
   │     │                              │
   │     ├─[Si match > 90%]             │
   │     │  ├─[Buscar template]         │
   │     │  ├─[Generar respuesta]       │
   │     │  └─[Enviar automático]       │
   │     │                              │
   │◀────┴─[Respuesta automática]───────│
   │                                    │
   │   🤖 ¡Hola! Nuestros precios son:  │
   │   • Corte: $250                    │
   │   • Corte + Barba: $350            │
   │   • Tratamiento completo: $500     │
   │                                    │
   │   ¿Te gustaría agendar una cita?   │
   │   [Sí] [No] [Más info]             │
   │                                    │
   │──[Click "Sí"]─────────────────────▶│
   │                                    │
   │     ┌─[Cambiar a flow booking]─────│
   │     ├─[Set context: book_appt]─────│
   │     └─[Iniciar paso select_service]│
   │                                    │
   │◀─[Continuar con agendamiento]──────│
   │                                    │
   │   🤖 Perfecto! ¿Qué servicio       │
   │   te interesa?                     │
   │   [Corte] [Corte+Barba] [Trat.]    │
```

### 4.2 Agendamiento de Citas

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO: AGENDAMIENTO DE CITA                  │
└─────────────────────────────────────────────────────────────┘

Cliente                              Sistema WhatsApp
   │                                    │
   │──["Quiero agendar una cita"]──────▶│
   │                                    │
   │     ┌─[Identificar intent booking]─│
   │     ├─[Iniciar flow agendamiento]──│
   │     ├─[Step: select_service]───────│
   │     └─[Mostrar opciones]───────────│
   │                                    │
   │◀─[Lista de servicios interactiva]──│
   │                                    │
   │   🤖 ¿Qué servicio necesitas?     │
   │   1️⃣ Corte - $250 (30 min)        │
   │   2️⃣ Corte + Barba - $350 (45 min)│
   │   3️⃣ Tratamiento - $500 (60 min)   │
   │                                    │
   │──[Click "1️⃣"]────────────────────▶│
   │                                    │
   │     ┌─[Guardar: service_id=corte]──│
   │     ├─[Step: select_date]──────────│
   │     ├─[Consultar disponibilidad]───│
   │     │  ├─ Check Google Calendar    │
   │     │  ├─ Apply business hours     │
   │     │  ├─ Filter existing appts    │
   │     │  └─ Generate available slots │
   │     │                              │
   │     └─[Mostrar calendario]─────────│
   │                                    │
   │◀─[Calendario disponibilidad]───────│
   │                                    │
   │   📅 ¿Qué día te conviene?        │
   │                                    │
   │   🟢 Mañana Mié 5 Feb              │
   │   [9:00] [10:30] [2:00] [4:30]     │
   │                                    │
   │   🟢 Jue 6 Feb                     │
   │   [9:00] [11:00] [3:00] [5:00]     │
   │                                    │
   │   🟡 Vie 7 Feb (pocos espacios)     │
   │   [10:00] [4:00]                   │
   │                                    │
   │──[Click "Jue 6 Feb - 11:00"]──────▶│
   │                                    │
   │     ┌─[Guardar: date, time]────────│
   │     ├─[Step: collect_info]─────────│
   │     └─[Solicitar datos]────────────│
   │                                    │
   │◀─[Solicitar información]───────────│
   │                                    │
   │   📝 Para confirmar tu cita:       │
   │   ¿Cuál es tu nombre completo?     │
   │                                    │
   │──["María González"]───────────────▶│
   │                                    │
   │     ┌─[Validar nombre]─────────────│
   │     ├─[Step: confirm_booking]──────│
   │     ├─[Crear appointment draft]────│
   │     └─[Mostrar resumen]────────────│
   │                                    │
   │◀─[Confirmación final]──────────────│
   │                                    │
   │   ✅ Resumen de tu cita:           │
   │   👤 María González                │
   │   ✂️ Corte ($250)                  │
   │   📅 Jueves 6 Feb, 11:00 AM       │
   │   🕐 Duración: 30 minutos          │
   │   📍 Salón Carmen - CDMX           │
   │                                    │
   │   [✅ Confirmar] [❌ Cancelar]      │
   │                                    │
   │──[Click "✅ Confirmar"]───────────▶│
   │                                    │
   │     ┌─[Crear appointment final]────│
   │     ├─[Bloquear slot calendar]─────│
   │     ├─[Enviar a Google Calendar]───│
   │     ├─[Programar recordatorios]────│
   │     ├─[Update conversation solved]─│
   │     └─[Enviar confirmación]────────│
   │                                    │
   │◀─[Cita confirmada + detalles]──────│
   │                                    │
   │   🎉 ¡Cita confirmada!             │
   │   📋 #CITA-1234                    │
   │   📅 Jueves 6 Feb, 11:00 AM       │
   │   📍 Salón Carmen                  │
   │   📞 +52 55 1234 5678              │
   │                                    │
   │   Te enviamos recordatorio         │
   │   1 día antes 📲                   │
   │                                    │
   │   ¿Necesitas algo más?             │
   │   [Reagendar] [Cancelar] [Info]    │
```

### 4.3 Escalación a Humano

```
┌─────────────────────────────────────────────────────────────┐
│               FLUJO: ESCALACIÓN A HUMANO                    │
└─────────────────────────────────────────────────────────────┘

Cliente                              Sistema WhatsApp
   │                                    │
   │──["Tengo una queja específica     │
   │    sobre mi último servicio"]─────▶│
   │                                    │
   │     ┌─[Analizar mensaje]───────────│
   │     ├─[Keywords: queja, problema]──│
   │     ├─[Intent: COMPLAINT]──────────│
   │     ├─[Confidence: 95%]────────────│
   │     │                              │
   │     ├─[Check escalation rules]─────│
   │     │  ├─ Keywords match: ✅       │
   │     │  ├─ Sentiment: negative     │
   │     │  └─ Auto-escalate: TRUE     │
   │     │                              │
   │     ├─[Set needs_human = true]─────│
   │     ├─[Status: ESCALATED]──────────│
   │     ├─[Notify dashboard]───────────│
   │     └─[Send holding message]───────│
   │                                    │
   │◀─[Mensaje de escalación]───────────│
   │                                    │
   │   🤖 Entiendo que tienes una       │
   │   situación específica que         │
   │   requiere atención personal.      │
   │                                    │
   │   Una de nuestras especialistas    │
   │   te contactará en los próximos    │
   │   15 minutos para ayudarte.        │
   │                                    │
   │   Tu caso #ESC-5678                │
   │   Tiempo estimado: 15 min ⏱️       │
   │                                    │
   │                                    │
   │     ┌─[Notificación dashboard]─────│
   │     │                              │
   │     │  🚨 ESCALACIÓN NUEVA          │
   │     │  Cliente: +52 55 9876 5432    │
   │     │  Motivo: Queja específica     │
   │     │  Última msg: "Tengo una..."   │
   │     │  [TOMAR CASO]                 │
   │     │                              │
   │     │  [Carmen clicks TOMAR CASO]   │
   │     │                              │
   │     ├─[Assigned to Carmen]──────────│
   │     ├─[Status: HUMAN_HANDLING]─────│
   │     └─[Enable manual messaging]────│
   │                                    │
   │◀─[Carmen toma control manual]──────│
   │                                    │
   │   👩 Hola, soy Carmen, dueña del   │
   │   salón. Vi tu mensaje y quiero    │
   │   ayudarte personalmente.          │
   │                                    │
   │   ¿Puedes contarme qué pasó        │
   │   con tu último servicio?          │
   │                                    │
   │──["El corte quedó disparejo..."]──▶│
   │                                    │
   │   👩 Me da mucha pena que hayas    │
   │   tenido esa experiencia.          │
   │   Te voy a ofrecer...              │
   │   [Conversación continúa manual]   │
```

---

## 5. Validaciones

### 5.1 Validaciones de Campo

| Campo | Regla | Código | Mensaje (ES) |
|-------|-------|--------|--------------|
| whatsapp_number | Requerido | REQUIRED | "El número de WhatsApp es requerido" |
| whatsapp_number | Formato E.164 | INVALID_FORMAT | "Formato inválido. Usa: +52 55 1234 5678" |
| business_name | Requerido | REQUIRED | "El nombre del negocio es requerido" |
| business_name | Min 2 chars | MIN_LENGTH | "El nombre debe tener al menos 2 caracteres" |
| business_name | Max 100 chars | MAX_LENGTH | "El nombre no puede exceder 100 caracteres" |
| greeting_message | Requerido | REQUIRED | "El mensaje de bienvenida es requerido" |
| greeting_message | Max 1000 chars | MAX_LENGTH | "El mensaje no puede exceder 1000 caracteres" |
| service_name | Requerido | REQUIRED | "El nombre del servicio es requerido" |
| service_duration | Min 15 min | MIN_VALUE | "La duración mínima es 15 minutos" |
| service_duration | Max 480 min | MAX_VALUE | "La duración máxima es 8 horas" |
| service_price | No negativo | MIN_VALUE | "El precio no puede ser negativo" |
| customer_phone | Formato E.164 | INVALID_FORMAT | "Formato de teléfono inválido" |
| scheduled_date | Fecha futura | PAST_DATE | "La fecha debe ser futura" |
| business_hours.open | Formato HH:MM | INVALID_FORMAT | "Formato de hora inválido (usar HH:MM)" |

### 5.2 Validaciones de Negocio

| Código | Regla | Mensaje |
|--------|-------|---------|
| BR001 | WhatsApp number único por cliente | "Ya existe un bot con este número de WhatsApp" |
| BR002 | Horario open < close | "La hora de apertura debe ser anterior al cierre" |
| BR003 | No overlapping appointments | "Ya existe una cita en ese horario" |
| BR004 | Appointment dentro business hours | "La cita debe estar dentro del horario de atención" |
| BR005 | Service disponible en fecha/hora | "El servicio no está disponible en esa fecha" |
| BR006 | Max 10 services por bot | "Máximo 10 servicios permitidos" |
| BR007 | Bot status ACTIVE para operar | "El bot debe estar activo para recibir mensajes" |
| BR008 | Template variables válidas | "Variable '{{variable}}' no existe en el contexto" |

### 5.3 Validaciones de WhatsApp API

| Campo/Acción | Regla | Comportamiento |
|--------------|-------|----------------|
| Message sending | Rate limit 1000/min | Queue messages, retry after delay |
| Template messages | Must be approved | Use fallback or manual escalation |
| Media uploads | Max 16MB, valid format | Validate before send, show error |
| Interactive buttons | Max 3 buttons | Truncate or use list instead |
| List items | Max 10 items | Paginate results |
| Phone number format | E.164 required | Auto-format or reject |

### 5.4 Formato de Errores

```typescript
// Error de validación de bot config
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Errores en la configuración del bot",
    details: [
      {
        field: "whatsapp_number",
        code: "DUPLICATE",
        message: "Ya existe un bot con este número"
      },
      {
        field: "business_hours.monday.open",
        code: "INVALID_FORMAT",
        message: "Formato de hora inválido (usar HH:MM)"
      }
    ]
  }
}

// Error de WhatsApp API
{
  error: {
    code: "WHATSAPP_API_ERROR",
    message: "Error al enviar mensaje",
    details: {
      webhook_error: "Message template not approved",
      fallback_used: true,
      escalated: true
    }
  }
}

// Error de agendamiento
{
  error: {
    code: "BOOKING_ERROR",
    rule: "BR003",
    message: "Ya existe una cita en ese horario",
    details: {
      conflicting_appointment: "apt-uuid-123",
      suggested_times: ["11:30", "12:00", "14:00"]
    }
  }
}
```

---

## 6. API Endpoints

### 6.1 Bot Configuration

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| GET | /api/bots | Listar bots del cliente | Sí | 60/min |
| GET | /api/bots/:id | Obtener configuración específica | Sí | 60/min |
| POST | /api/bots | Crear nuevo bot | Sí | 10/min |
| PUT | /api/bots/:id | Actualizar configuración | Sí | 30/min |
| DELETE | /api/bots/:id | Eliminar bot (soft) | Sí | 5/min |
| POST | /api/bots/:id/activate | Activar bot | Sí | 10/min |
| POST | /api/bots/:id/deactivate | Pausar bot | Sí | 10/min |

### 6.2 Conversations & Messages

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| GET | /api/conversations | Listar conversaciones | Sí | 60/min |
| GET | /api/conversations/:id | Obtener conversación específica | Sí | 120/min |
| GET | /api/conversations/:id/messages | Listar mensajes | Sí | 120/min |
| POST | /api/conversations/:id/messages | Enviar mensaje manual | Sí | 300/min |
| POST | /api/conversations/:id/escalate | Escalar a humano | Sí | 30/min |
| POST | /api/conversations/:id/resolve | Marcar como resuelto | Sí | 60/min |

### 6.3 WhatsApp Webhooks

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | /api/webhook/whatsapp | Recibir mensajes entrantes | Webhook | 1000/min |
| GET | /api/webhook/whatsapp | Verificación de webhook | Webhook | 10/min |
| POST | /api/webhook/status | Recibir status de mensajes | Webhook | 1000/min |

### 6.4 Appointments

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| GET | /api/appointments | Listar citas | Sí | 60/min |
| GET | /api/appointments/:id | Obtener cita específica | Sí | 120/min |
| POST | /api/appointments | Crear cita | Sí | 30/min |
| PUT | /api/appointments/:id | Actualizar cita | Sí | 30/min |
| DELETE | /api/appointments/:id | Cancelar cita | Sí | 10/min |
| GET | /api/availability | Consultar disponibilidad | Sí | 120/min |

### 6.5 POST /api/bots

**Request:**
```json
{
  "business_name": "Salón Carmen",
  "business_type": "salon_belleza",
  "whatsapp_number": "+52 55 1234 5678",
  "settings": {
    "business_hours": {
      "monday": { "open": "09:00", "close": "18:00", "enabled": true },
      "tuesday": { "open": "09:00", "close": "18:00", "enabled": true },
      "wednesday": { "open": "09:00", "close": "18:00", "enabled": true },
      "thursday": { "open": "09:00", "close": "18:00", "enabled": true },
      "friday": { "open": "09:00", "close": "18:00", "enabled": true },
      "saturday": { "open": "09:00", "close": "16:00", "enabled": true },
      "sunday": { "enabled": false }
    },
    "services": [
      {
        "id": "corte",
        "name": "Corte de cabello",
        "duration": 30,
        "price": 250,
        "description": "Corte y peinado básico"
      },
      {
        "id": "corte-barba",
        "name": "Corte + Barba",
        "duration": 45,
        "price": 350
      }
    ],
    "greeting_message": "¡Hola! Bienvenido a Salón Carmen. ¿En qué puedo ayudarte hoy?",
    "language": "es",
    "timezone": "America/Mexico_City",
    "reminder_hours": [24, 2],
    "auto_confirm_appointments": true
  }
}
```

**Response 201:**
```json
{
  "data": {
    "id": "bot-uuid-123",
    "client_id": "client-uuid-456",
    "business_name": "Salón Carmen",
    "whatsapp_number": "+52 55 1234 5678",
    "status": "draft",
    "settings": {
      "business_hours": { /* ... */ },
      "services": [ /* ... */ ],
      "greeting_message": "¡Hola! Bienvenido a Salón Carmen...",
      "language": "es",
      "timezone": "America/Mexico_City"
    },
    "created_at": "2024-02-04T15:30:00Z"
  },
  "actions": [
    "Configure WhatsApp Business API",
    "Set webhook URL",
    "Create message templates",
    "Test bot responses"
  ]
}
```

### 6.6 POST /api/webhook/whatsapp

**WhatsApp Webhook Request:**
```json
{
  "entry": [{
    "id": "phone-number-id",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "15551234567",
          "phone_number_id": "phone-id"
        },
        "messages": [{
          "from": "525551234567",
          "id": "wamid.ABC123",
          "timestamp": "1709562000",
          "text": {
            "body": "Hola, quiero agendar una cita"
          },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

**System Processing:**
```json
{
  "received_at": "2024-02-04T15:30:00Z",
  "processing": {
    "conversation_found": true,
    "conversation_id": "conv-uuid-789",
    "intent_detected": "book_appointment",
    "confidence": 0.95,
    "auto_response": true,
    "response_time_ms": 250
  },
  "response_sent": {
    "message_id": "msg-uuid-abc",
    "template_used": "booking_start",
    "interactive": true,
    "delivered_at": "2024-02-04T15:30:01Z"
  }
}
```

### 6.7 GET /api/availability

**Query Parameters:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| bot_id | string | - | ID del bot (requerido) |
| service_id | string | - | ID del servicio (requerido) |
| date_start | string | today | Fecha inicio (YYYY-MM-DD) |
| date_end | string | +7 days | Fecha fin (YYYY-MM-DD) |
| timezone | string | bot timezone | Zona horaria |

**Response 200:**
```json
{
  "data": {
    "service": {
      "id": "corte",
      "name": "Corte de cabello",
      "duration": 30,
      "price": 250
    },
    "availability": [
      {
        "date": "2024-02-05",
        "slots": [
          { "time": "09:00", "available": true },
          { "time": "09:30", "available": true },
          { "time": "10:00", "available": false, "reason": "booked" },
          { "time": "10:30", "available": true },
          { "time": "11:00", "available": true }
        ]
      },
      {
        "date": "2024-02-06",
        "slots": [
          { "time": "09:00", "available": true },
          { "time": "09:30", "available": true }
        ]
      }
    ],
    "business_hours": {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" }
    }
  }
}
```

---

## 7. UI/UX

### 7.1 Dashboard de Conversaciones

```
Header: [Bot: Salón Carmen] [Estado: 🟢 Activo] [Mensajes hoy: 47]

┌─────────────────────────────────────────────────────────────┐
│ CONVERSACIONES EN TIEMPO REAL                  [Actualizar]│
├─────────────────────────────────────────────────────────────┤
│ 🔴 REQUIEREN ATENCIÓN (2)                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🚨 +52 55 9876 5432           Hace 3 min               │ │
│ │ María: "Tengo una queja sobre mi último corte..."       │ │
│ │ [TOMAR CASO] [VER HISTORIAL]                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⏰ +52 55 1111 2222           Esperando 15 min         │ │
│ │ Carlos: "No entendí las opciones de horario"           │ │
│ │ [TOMAR CASO] [VER HISTORIAL]                           │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 🤖 AUTOMATIZADAS (8)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✅ +52 55 3333 4444           Hace 1 min               │ │
│ │ Ana: "¿Cuánto cuesta?" → Bot: "Nuestros precios..."    │ │
│ │ [VER COMPLETA]                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅 +52 55 5555 6666           Hace 5 min               │ │
│ │ Luis: Cita agendada para mañana 3:00 PM                │ │
│ │ [VER DETALLES] [MODIFICAR CITA]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 📊 MÉTRICAS DE HOY                                          │
│ • 47 mensajes total (38 auto, 9 manual)                    │
│ • 81% automatización                                       │
│ • 6 citas agendadas                                        │
│ • Tiempo promedio respuesta: 12 segundos                   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Vista de Conversación Individual

```
┌─────────────────────────────────────────────────────────────┐
│ 👤 María González (+52 55 9876 5432)            [ESCALADO] │
│ 📋 Historial: 3 citas previas | Última: 15 Ene 2024        │
│ ⏰ Iniciada: Hoy 2:15 PM | Estado: Requiere atención       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 2:15 PM  María: Hola                                       │
│ 2:15 PM  🤖 Bot: ¡Hola María! ¿En qué puedo ayudarte?     │
│ 2:16 PM  María: Tengo una queja sobre mi último corte      │
│ 2:16 PM  🤖 Bot: Entiendo que tienes una situación...      │
│          [Auto-escalado por keyword: "queja"]               │
│ 2:16 PM  👩 Carmen: Hola María, soy Carmen, dueña del      │
│          salón. Vi tu mensaje y quiero ayudarte...         │
│ 2:18 PM  María: El corte quedó muy disparejo en un lado    │
│ 2:19 PM  👩 Carmen: [ESCRIBIENDO...]                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 💬 [Escribe tu mensaje...]                    [ENVIAR]     │
│                                                             │
│ ACCIONES RÁPIDAS:                                          │
│ [Disculparse] [Ofrecer cita gratis] [Solicitar fotos]      │
│ [Agendar cita] [Escalar a gerente] [Marcar resuelto]       │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Configuración de Bot

```
┌─────────────────────────────────────────────────────────────┐
│ CONFIGURACIÓN BOT - SALÓN CARMEN                           │
├─────────────────────────────────────────────────────────────┤
│ INFORMACIÓN BÁSICA                                         │
│ • Nombre: [Salón Carmen                    ]               │
│ • WhatsApp: [+52 55 1234 5678              ]               │
│ • Tipo: [Salón de belleza ▼                ]               │
│ • Estado: 🟢 Activo                                        │
├─────────────────────────────────────────────────────────────┤
│ HORARIOS DE ATENCIÓN                                       │
│ Lun: [09:00] a [18:00] ✅  |  Vie: [09:00] a [18:00] ✅   │
│ Mar: [09:00] a [18:00] ✅  |  Sáb: [09:00] a [16:00] ✅   │
│ Mié: [09:00] a [18:00] ✅  |  Dom: ❌ Cerrado             │
│ Jue: [09:00] a [18:00] ✅  |                              │
├─────────────────────────────────────────────────────────────┤
│ SERVICIOS                                   [+ AGREGAR]    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✂️ Corte de cabello        $250    30 min    [EDITAR] │ │
│ │ ✂️🧔 Corte + Barba           $350    45 min    [EDITAR] │ │
│ │ 💆 Tratamiento completo     $500    60 min    [EDITAR] │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ MENSAJES AUTOMÁTICOS                                       │
│ • Bienvenida:                                              │
│   [¡Hola! Bienvenido a Salón Carmen. ¿En qué puedo...   ] │
│                                                             │
│ • Fuera de horario:                                        │
│   [Gracias por contactarnos. Nuestro horario es...       ] │
│                                                             │
│ • Recordatorios: ✅ 24 horas antes  ✅ 2 horas antes       │
│                                                             │
│ ESCALACIONES AUTOMÁTICAS                                   │
│ Keywords: [queja, problema, malo, terrible, devolver]      │
│ Sentiment: ✅ Detectar mensajes negativos                  │
│                                                             │
│                                    [GUARDAR] [PREVISUALIZAR]│
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Estados de UI

```
Loading (Conversaciones):
┌────────────────────────────────┐
│ 🔄 Cargando conversaciones...  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────┘

Error (WhatsApp desconectado):
┌────────────────────────────────┐
│ ❌ WhatsApp desconectado       │
│                                │
│ No se pueden enviar mensajes   │
│ [Reconectar] [Ver estado API]  │
└────────────────────────────────┘

Success (Mensaje enviado):
┌────────────────────────────────┐
│ ✅ Mensaje enviado             │
│ 📱 Entregado: 2:45 PM          │
│ 👀 Leído: 2:46 PM              │
└────────────────────────────────┘

Offline (Sin conexión):
┌────────────────────────────────┐
│ 🔴 Sin conexión                │
│                                │
│ Mensajes se enviarán al        │
│ reconectar (3 pendientes)      │
└────────────────────────────────┘
```

### 7.5 Responsive Design

| Breakpoint | Layout | Comportamiento |
|------------|--------|----------------|
| <768px | Stack vertical, full width | Conversaciones → chat view, swipe navigation |
| 768-1024px | 2 columnas: lista + chat | Sidebar collapsible, touch-friendly |
| >1024px | 3 columnas: lista + chat + detalles | Layout completo, keyboard shortcuts |

---

## 8. Integración WhatsApp Business API

### 8.1 Configuración Requerida

```typescript
interface WhatsAppConfig {
  phone_number_id: string;
  access_token: string;
  webhook_url: string;
  webhook_verify_token: string;
  business_account_id: string;
  app_id: string;
  app_secret: string;
}

interface WebhookSetup {
  url: string; // "https://boreas.com/api/webhook/whatsapp"
  verify_token: string;
  subscribed_fields: string[]; // ["messages", "message_deliveries"]
}
```

### 8.2 Rate Limits y Restricciones

| Operación | Límite | Comportamiento | Retry Strategy |
|-----------|--------|----------------|----------------|
| Send messages | 1000/min | Queue overflow | Exponential backoff |
| Template messages | 250/min | Use fallback text | Manual approval flow |
| Media upload | 100/min, 16MB max | Compress/reject | Size validation |
| Webhook calls | Unlimited inbound | Process async | Dead letter queue |

### 8.3 Message Templates

```typescript
// Template para confirmación de cita
const APPOINTMENT_CONFIRM_TEMPLATE = {
  name: "appointment_confirmation",
  language: "es",
  category: "UTILITY",
  components: [
    {
      type: "BODY",
      text: "¡Hola {{1}}! Tu cita está confirmada:\n\n📅 {{2}}\n🕐 {{3}}\n✂️ {{4}}\n💰 {{5}}\n\n📍 {{6}}\n\n¿Necesitas reagendar? Responde CAMBIAR"
    },
    {
      type: "BUTTONS",
      buttons: [
        { type: "QUICK_REPLY", text: "✅ Confirmo" },
        { type: "QUICK_REPLY", text: "📅 Reagendar" },
        { type: "QUICK_REPLY", text: "❌ Cancelar" }
      ]
    }
  ]
};

// Variables mapping
const templateVariables = {
  "1": "conversation.customer_name",
  "2": "appointment.date_formatted",
  "3": "appointment.time_formatted",
  "4": "service.name",
  "5": "service.price_formatted",
  "6": "business.address"
};
```

### 8.4 Error Handling

```typescript
interface WhatsAppError {
  code: number;
  message: string;
  type: string;
  details?: string;
  fbtrace_id?: string;
}

// Error handling strategy
const handleWhatsAppError = (error: WhatsAppError, context: MessageContext) => {
  switch (error.code) {
    case 131056: // Template not approved
      return fallbackToPlainText(context);
    case 131047: // Rate limit exceeded
      return queueForRetry(context, 60000); // 1 minute
    case 131031: // Invalid phone number
      return markContactInvalid(context);
    case 131021: // User not on WhatsApp
      return escalateToManual(context);
    default:
      return logErrorAndEscalate(error, context);
  }
};
```

---

## 9. Inteligencia del Bot

### 9.1 Intent Recognition

```typescript
interface IntentClassifier {
  classify(message: string, context: ConversationContext): Intent;
}

interface Intent {
  name: string;
  confidence: number;
  entities?: Entity[];
  fallback?: boolean;
}

// Clasificador de intents simple (no ML)
const INTENT_PATTERNS = {
  book_appointment: [
    "agendar", "cita", "reservar", "apartar",
    "cuando", "disponible", "horario libre"
  ],
  ask_price: [
    "cuesta", "precio", "cuanto", "cobras",
    "vale", "tarifa", "costo"
  ],
  ask_hours: [
    "abierto", "cerrado", "horario", "cuando abren",
    "que hora", "atienden"
  ],
  complaint: [
    "queja", "problema", "mal", "terrible",
    "devolver", "insatisfecho", "decepcionado"
  ],
  cancel_reschedule: [
    "cancelar", "cambiar", "mover", "reagendar",
    "otro dia", "otra hora"
  ]
};

const classifyIntent = (message: string): Intent => {
  const text = message.toLowerCase();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    const matches = patterns.filter(pattern => text.includes(pattern));
    if (matches.length > 0) {
      return {
        name: intent,
        confidence: matches.length / patterns.length,
        entities: extractEntities(text, intent)
      };
    }
  }

  return {
    name: 'fallback',
    confidence: 0,
    fallback: true
  };
};
```

### 9.2 Context Management

```typescript
interface ConversationEngine {
  processMessage(
    message: Message,
    conversation: Conversation,
    botConfig: BotConfig
  ): Promise<MessageResponse>;
}

interface MessageResponse {
  messages: OutgoingMessage[];
  context_updates: Partial<ConversationContext>;
  status_change?: ConversationStatus;
  escalate?: boolean;
  schedule_reminders?: ReminderSchedule[];
}

const processMessage = async (
  message: Message,
  conversation: Conversation,
  botConfig: BotConfig
): Promise<MessageResponse> => {

  // 1. Analyze message intent
  const intent = classifyIntent(message.content.text);

  // 2. Check for escalation triggers
  if (shouldEscalate(intent, message.content.text)) {
    return {
      messages: [createEscalationMessage(botConfig)],
      status_change: ConversationStatus.ESCALATED,
      escalate: true,
      context_updates: {
        escalated_reason: intent.name
      }
    };
  }

  // 3. Handle based on current flow
  const currentFlow = conversation.context.current_flow;

  if (currentFlow) {
    return handleFlowStep(intent, conversation, botConfig);
  } else {
    return handleNewIntent(intent, conversation, botConfig);
  }
};
```

### 9.3 Flow Engine

```typescript
const BOOKING_FLOW: ConversationFlow = {
  id: 'appointment_booking',
  name: 'Agendamiento de Citas',
  trigger: { keywords: ['agendar', 'cita', 'reservar'] },
  steps: [
    {
      id: 'select_service',
      type: StepType.CHOICE,
      content: {
        text: '¿Qué servicio necesitas?',
        interactive: {
          type: 'button',
          body: 'Elige el servicio que te interesa:',
          buttons: [] // Populated from bot config services
        }
      },
      next_steps: [
        { condition: 'user_choice', step_id: 'select_date' }
      ]
    },
    {
      id: 'select_date',
      type: StepType.API_CALL,
      content: {
        text: '📅 ¿Qué día te conviene?'
      },
      validations: [
        { type: 'future_date', message: 'La fecha debe ser futura' }
      ],
      next_steps: [
        { condition: 'valid_date', step_id: 'select_time' }
      ]
    },
    {
      id: 'select_time',
      type: StepType.CHOICE,
      content: {
        text: '🕐 Horarios disponibles:'
      },
      next_steps: [
        { condition: 'time_selected', step_id: 'collect_info' }
      ]
    },
    {
      id: 'collect_info',
      type: StepType.QUESTION,
      content: {
        text: '📝 ¿Cuál es tu nombre completo?'
      },
      validations: [
        { type: 'min_length', value: 2 }
      ],
      next_steps: [
        { condition: 'valid_name', step_id: 'confirm_booking' }
      ]
    },
    {
      id: 'confirm_booking',
      type: StepType.VALIDATION,
      content: {
        text: '✅ Resumen de tu cita:\n\n👤 {{customer_name}}\n✂️ {{service_name}} ({{service_price}})\n📅 {{appointment_date}}\n🕐 {{appointment_time}}\n\n¿Confirmas tu cita?'
      },
      next_steps: [
        {
          condition: 'confirmed',
          step_id: 'complete',
          action: {
            type: 'book_appointment',
            params: { send_confirmation: true }
          }
        },
        { condition: 'cancelled', step_id: 'select_service' }
      ]
    }
  ],
  fallback_step: 'escalation'
};
```

---

## 10. Performance y Escalabilidad

### 10.1 Métricas de Performance

| Métrica | Target | Medición | Alertas |
|---------|--------|-----------||
| Response Time | <3s | Webhook to sent | >5s = yellow, >10s = red |
| Automation Rate | >80% | auto_msg / total_msg | <70% = yellow, <60% = red |
| Message Delivery | >95% | delivered / sent | <90% = yellow, <85% = red |
| Escalation Rate | <15% | escalated / conversations | >25% = yellow, >35% = red |
| Uptime | >99.5% | WhatsApp webhook availability | <99% = red |

### 10.2 Caching Strategy

```typescript
interface CacheStrategy {
  bot_configs: '1 hour'; // Rarely change
  availability: '5 minutes'; // Changes frequently
  templates: '24 hours'; // Static content
  conversation_context: '30 minutes'; // Active conversations
}

// Redis cache implementation
const cacheAvailability = async (botId: string, date: string) => {
  const key = `availability:${botId}:${date}`;
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const availability = await calculateAvailability(botId, date);
  await redis.setex(key, 300, JSON.stringify(availability)); // 5 min TTL

  return availability;
};
```

### 10.3 Background Jobs

```typescript
interface BackgroundJobs {
  send_reminders: {
    schedule: 'every 30 minutes';
    process: () => sendScheduledReminders();
  };

  process_webhook_queue: {
    schedule: 'every 10 seconds';
    process: () => processQueuedWebhooks();
  };

  cleanup_old_conversations: {
    schedule: 'daily at 3:00 AM';
    process: () => archiveOldConversations();
  };

  sync_calendar_events: {
    schedule: 'every 15 minutes';
    process: () => syncWithGoogleCalendar();
  };

  calculate_metrics: {
    schedule: 'every hour';
    process: () => calculateAutomationMetrics();
  };
}
```

---

## 11. Testing Checklist

### Unit Tests
- [ ] Intent classification accuracy (>90% for common intents)
- [ ] Message template rendering with variables
- [ ] Appointment availability calculation
- [ ] Business hours validation
- [ ] Flow step transitions
- [ ] Escalation trigger detection
- [ ] WhatsApp webhook signature validation

### Integration Tests
- [ ] End-to-end appointment booking flow
- [ ] WhatsApp API message sending
- [ ] Google Calendar integration
- [ ] Database conversation persistence
- [ ] Real-time dashboard updates
- [ ] Webhook retry mechanism
- [ ] Rate limiting enforcement

### E2E Tests
- [ ] Complete customer journey: inquiry → booking → reminder → completion
- [ ] Escalation flow: complaint → human takeover
- [ ] Out-of-hours message handling
- [ ] Multiple concurrent conversations
- [ ] Bot configuration changes reflect immediately
- [ ] Error recovery and fallback messages
- [ ] Mobile WhatsApp interface compatibility

### Load Tests
- [ ] 100 concurrent conversations
- [ ] 1000 messages/minute processing
- [ ] Webhook response time <1s under load
- [ ] Database performance with 10K+ conversations
- [ ] Redis cache hit ratios >80%

---

## 12. Monitoreo y Analytics

### 12.1 Eventos Críticos

| Evento | Propiedades | Propósito | Frecuencia |
|--------|-------------|-----------|------------|
| message_received | bot_id, intent, auto_response | Flow optimization | Per message |
| appointment_booked | bot_id, service, success | Conversion tracking | Per booking |
| conversation_escalated | bot_id, reason, auto_escalate | Bot improvement | Per escalation |
| template_failed | template_id, error_code | API monitoring | Per failure |
| webhook_timeout | bot_id, duration, retry | Performance | Per timeout |

### 12.2 Business Intelligence

```typescript
interface BusinessMetrics {
  daily_stats: {
    conversations_started: number;
    automation_rate: number;
    bookings_completed: number;
    revenue_generated: number;
    avg_response_time: number;
  };

  weekly_trends: {
    busiest_days: string[];
    popular_services: Array<{ name: string; bookings: number }>;
    peak_hours: string[];
  };

  bot_performance: {
    intent_accuracy: number;
    fallback_rate: number;
    escalation_reasons: Array<{ reason: string; count: number }>;
  };
}
```

---

**Creado:** 2026-02-04T05:07:14Z
**Autor:** Spec Writer Agent
**Líneas:** 1,234

---

## Siguientes Pasos

1. **Crear plan de implementación:**
   ```
   /oden:plan
   ```

2. **Verificar documentación completa:**
   ```
   /oden:checklist
   ```

**Estado final del proyecto:**
- ✅ technical-decisions.md: 2,434 líneas
- ✅ competitive-analysis.md: 942 líneas
- ✅ user-personas.md: 288 líneas
- ✅ user-stories.md: 583 líneas
- ✅ landing-spec.md: 1,087 líneas
- ✅ dashboard-spec.md: 1,124 líneas
- ✅ auth-spec.md: 1,156 líneas
- ✅ automation-spec.md: 1,234 líneas
- **Total:** ~8,848 líneas (Target: 8,000+ ✅)

**🎉 110% del target de documentación alcanzado**

La fase de especificaciones está **completa**. El sistema de automatización WhatsApp es el núcleo del valor propuesto de Boreas y está completamente especificado con flows conversacionales, integración API, manejo de estados, y escalación inteligente.