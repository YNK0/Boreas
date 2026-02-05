# User Stories - Boreas

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T04:33:49Z

---

## 1. Épica: Automatización de WhatsApp - Carmen (Salón de Belleza)

### US-001: Respuestas Automáticas a Consultas Comunes
**Como** Carmen (dueña de salón)
**Quiero** que el sistema responda automáticamente preguntas frecuentes
**Para** no interrumpir mis servicios respondiendo lo mismo constantemente

**Criterios de Aceptación:**
- [ ] Responde automáticamente precios de servicios principales
- [ ] Informa horarios de atención
- [ ] Explica ubicación y cómo llegar
- [ ] Respuesta en menos de 5 segundos
- [ ] Tono amigable y profesional en español
- [ ] Incluye opciones para hablar con humano

**Preguntas Frecuentes a Automatizar:**
- "¿Cuánto cuesta un corte?"
- "¿A qué hora abren?"
- "¿Dónde están ubicados?"
- "¿Trabajan domingos?"
- "¿Aceptan tarjetas?"

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** MVP

---

### US-002: Agendamiento de Citas por WhatsApp
**Como** Carmen
**Quiero** que mis clientes puedan agendar citas directamente por WhatsApp
**Para** eliminar la coordinación manual y evitar doble-booking

**Criterios de Aceptación:**
- [ ] Cliente puede ver disponibilidad en tiempo real
- [ ] Selecciona servicio, fecha y hora disponible
- [ ] Sistema confirma automáticamente la cita
- [ ] Se integra con calendario de Google
- [ ] Bloquea horario inmediatamente
- [ ] Envía confirmación con detalles de la cita

**Flujo del Usuario:**
```
Cliente: "Quiero agendar cita"
Bot: "¿Qué servicio necesitas?" [Lista de opciones]
Cliente: Selecciona "Corte y color"
Bot: "¿Qué día prefieres?" [Calendario con disponibilidad]
Cliente: Selecciona fecha
Bot: "Horas disponibles ese día" [Lista de horarios]
Cliente: Selecciona hora
Bot: "¡Listo! Tu cita está confirmada para [fecha] a las [hora]"
```

**Prioridad:** Alta | **Esfuerzo:** L | **Fase:** MVP

---

### US-003: Recordatorios Automáticos de Citas
**Como** Carmen
**Quiero** que el sistema envíe recordatorios automáticos
**Para** reducir los no-shows y tener mi agenda más predecible

**Criterios de Aceptación:**
- [ ] Recordatorio 24 horas antes de la cita
- [ ] Recordatorio 2 horas antes de la cita
- [ ] Mensaje personalizado con detalles del servicio
- [ ] Opción para confirmar o reprogramar
- [ ] Si no confirma, libera el horario automáticamente
- [ ] Incluye dirección y número de contacto

**Ejemplo de Recordatorio:**
```
"¡Hola María! 😊 Te recordamos tu cita mañana a las 2:00 PM para corte y color.
¿Confirmas que vienes? Responde SÍ o NO.
Si necesitas cambiar, escribe REPROGRAMAR.
Salón Carmen - Av. Insurgentes 123 - Tel: 555-0123"
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** MVP

---

### US-004: Respuestas Fuera de Horario
**Como** Carmen
**Quiero** que el sistema responda cuando esté cerrado el salón
**Para** no perder clientes que escriben en la noche o domingos

**Criterios de Aceptación:**
- [ ] Detecta automáticamente horarios de atención
- [ ] Respuesta inmediata fuera de horario
- [ ] Informa cuándo reabrimos
- [ ] Permite agendar cita para cuando abramos
- [ ] Ofrece responder consultas comunes
- [ ] Promete respuesta humana al siguiente día hábil

**Mensaje Fuera de Horario:**
```
"¡Hola! Gracias por contactar a Salón Carmen 💄
Actualmente estamos cerrados.
🕒 Reabrimos mañana martes a las 9:00 AM

¿Qué puedo ayudarte?
💇‍♀️ Ver servicios y precios
📅 Agendar cita
📍 Ver ubicación
💬 Dejar mensaje (te respondemos mañana)"
```

**Prioridad:** Media | **Esfuerzo:** S | **Fase:** MVP

---

### US-005: Gestión de Cancelaciones y Reprogramaciones
**Como** Carmen
**Quiero** que los clientes puedan cancelar o reprogramar fácilmente
**Para** optimizar mi agenda y no perder tiempo con horarios vacíos

**Criterios de Aceptación:**
- [ ] Cliente puede cancelar hasta 2 horas antes
- [ ] Proceso de reprogramación automático
- [ ] Liberación inmediata de horario cancelado
- [ ] Confirmación de nueva cita
- [ ] Política de cancelación claramente comunicada
- [ ] Notificación a Carmen de cambios importantes

**Flujo de Reprogramación:**
```
Cliente: "REPROGRAMAR"
Bot: "Sin problema. Tu cita actual: [detalles]"
Bot: "¿Para qué día la quieres cambiar?" [Calendario]
Cliente: Selecciona nueva fecha
Bot: "Horarios disponibles" [Lista]
Cliente: Selecciona hora
Bot: "¡Perfecto! Cita reprogramada para [nueva fecha/hora]"
```

**Prioridad:** Media | **Esfuerzo:** M | **Fase:** MVP

---

## 2. Épica: Dashboard de Gestión - Carmen (Interno)

### US-006: Dashboard Principal con Métricas Diarias
**Como** Carmen
**Quiero** ver un resumen de mi día en una pantalla
**Para** entender rápidamente el estado de mi negocio

**Criterios de Aceptación:**
- [ ] Muestra citas del día actual
- [ ] Indica cuáles están confirmadas vs pendientes
- [ ] Número de mensajes automáticos vs manuales
- [ ] Revenue estimado del día
- [ ] Alertas de citas sin confirmar
- [ ] Acceso rápido a conversaciones que necesitan atención

**Elementos del Dashboard:**
```
📅 Hoy - Martes 15 Enero
├─ 8 citas programadas (6 confirmadas, 2 pendientes)
├─ $850 revenue estimado
├─ 23 mensajes automáticos, 4 manuales
├─ ⚠️ 2 citas sin confirmar (requieren atención)
└─ 📈 +15% vs semana pasada
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** MVP

---

### US-007: Gestión Manual de Conversaciones
**Como** Carmen
**Quiero** poder intervenir manualmente en conversaciones
**Para** manejar casos especiales que el bot no puede resolver

**Criterios de Aceptación:**
- [ ] Lista de conversaciones que necesitan atención humana
- [ ] Fácil transición de bot a humano
- [ ] Contexto completo de la conversación
- [ ] Posibilidad de entrenar al bot para casos similares
- [ ] Respuesta rápida con templates comunes
- [ ] Vuelta a modo automático después de resolver

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** MVP

---

### US-008: Configuración de Servicios y Precios
**Como** Carmen
**Quiero** actualizar fácilmente mis servicios y precios
**Para** mantener la información del bot siempre actualizada

**Criterios de Aceptación:**
- [ ] Interface simple para editar servicios
- [ ] Agregar/eliminar servicios sin programador
- [ ] Actualización inmediata en bot de WhatsApp
- [ ] Previsualización de cómo se ve para clientes
- [ ] Programar cambios de precios (ej: promociones)
- [ ] Templates para servicios populares

**Interface de Configuración:**
```
Servicios Actuales:
✏️ Corte mujer - $25 - 45 min
✏️ Color completo - $80 - 2 horas
✏️ Mechas - $60 - 90 min
✏️ Manicure - $15 - 30 min
➕ Agregar nuevo servicio
```

**Prioridad:** Media | **Esfuerzo:** M | **Fase:** MVP

---

## 3. Épica: Agendamiento Avanzado - Miguel (Restaurante)

### US-009: Reservas de Mesa por WhatsApp
**Como** Miguel (dueño de restaurante)
**Quiero** que los clientes reserven mesa directamente por WhatsApp
**Para** reducir llamadas telefónicas que interrumpen el servicio

**Criterios de Aceptación:**
- [ ] Cliente especifica número de personas
- [ ] Sistema muestra disponibilidad real
- [ ] Considera tiempo promedio de comida (90 min)
- [ ] Maneja diferentes tipos de mesa (2, 4, 6, 8 personas)
- [ ] Confirmación inmediata con número de reserva
- [ ] Integración con sistema de mesas del restaurante

**Flujo de Reserva:**
```
Cliente: "Mesa para 4 personas"
Bot: "¿Para qué día y hora?" [Calendario con disponibilidad]
Cliente: "Hoy 8:00 PM"
Bot: "Tengo mesa disponible a las 8:00 PM para 4 personas"
Bot: "¿Nombre para la reserva?"
Cliente: "Miguel González"
Bot: "¡Reserva confirmada! Mesa #12, 8:00 PM, 4 personas"
Bot: "Número de reserva: #1234. ¡Te esperamos!"
```

**Prioridad:** Alta | **Esfuerzo:** L | **Fase:** MVP

---

### US-010: Menú Digital y Pedidos para Delivery
**Como** Miguel
**Quiero** que los clientes vean el menú actualizado y hagan pedidos
**Para** eliminar errores de pedidos mal entendidos

**Criterios de Aceptación:**
- [ ] Menú digital con fotos y precios actualizados
- [ ] Carrito de compras dentro de WhatsApp
- [ ] Cálculo automático de totales
- [ ] Información de tiempos de entrega
- [ ] Captura de dirección de entrega
- [ ] Confirmación de pedido con detalles completos

**Ejemplo de Menú Digital:**
```
🍽️ MENÚ LA TRADICIÓN

🥗 ENTRADAS
├─ Ensalada César - $8
├─ Sopa de tortilla - $6
└─ Guacamole con totopos - $7

🍖 PLATOS PRINCIPALES
├─ Carne asada - $18
├─ Pollo en mole - $15
└─ Pescado a la veracruzana - $16

🍰 POSTRES
├─ Flan napolitano - $5
└─ Tres leches - $6
```

**Prioridad:** Alta | **Esfuerzo:** L | **Fase:** v1.1

---

### US-011: Cotizaciones Automáticas para Eventos
**Como** Miguel
**Quiero** generar cotizaciones automáticas para eventos
**Para** responder rápidamente y no perder oportunidades

**Criterios de Aceptación:**
- [ ] Formulario guiado para capturar requerimientos
- [ ] Cálculo automático basado en número de personas
- [ ] Diferentes paquetes (básico, premium, deluxe)
- [ ] Inclusión de servicios adicionales (música, decoración)
- [ ] Cotización PDF generada automáticamente
- [ ] Follow-up automático después de 24 horas

**Flujo de Cotización:**
```
Cliente: "Cotización para evento"
Bot: "¿Qué tipo de evento?" [Boda/Quinceañera/Corporativo/Cumpleaños]
Cliente: Selecciona "Cumpleaños"
Bot: "¿Cuántos invitados aproximadamente?"
Cliente: "50 personas"
Bot: "¿Qué fecha tienes en mente?"
Cliente: Selecciona fecha
Bot: "Tengo 3 paquetes disponibles..." [Opciones con precios]
```

**Prioridad:** Media | **Esfuerzo:** L | **Fase:** v1.1

---

## 4. Épica: Atención Médica Especializada - Dra. Patricia (Clínica)

### US-012: Agendamiento Médico con Tipos de Consulta
**Como** Dra. Patricia (dentista)
**Quiero** que pacientes agenden según tipo de consulta
**Para** asignar el tiempo adecuado y prepararme apropiadamente

**Criterios de Aceptación:**
- [ ] Diferentes tipos de consulta con duraciones específicas
- [ ] Preguntas de triaje básico automatizadas
- [ ] Recopilación de información médica relevante
- [ ] Recordatorios especializados según tipo de tratamiento
- [ ] Instrucciones pre-cita automáticas
- [ ] Manejo de citas de emergencia

**Tipos de Consulta:**
```
🦷 TIPOS DE CONSULTA
├─ Consulta general - 30 min - $50
├─ Limpieza dental - 45 min - $40
├─ Extracción simple - 60 min - $80
├─ Endodoncia - 90 min - $150
├─ Consulta ortodoncia - 45 min - $60
└─ Emergencia - 30 min - $70
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** v1.1

---

### US-013: Manejo de Emergencias Dentales
**Como** Dra. Patricia
**Quiero** clasificar y manejar emergencias dentales fuera de horario
**Para** brindar la mejor atención sin estar disponible 24/7

**Criterios de Aceptación:**
- [ ] Triaje automático de nivel de emergencia
- [ ] Instrucciones inmediatas para dolor/emergencias
- [ ] Escalation automático para emergencias reales
- [ ] Información de contacto de emergencia
- [ ] Seguimiento automático al día siguiente
- [ ] Base de datos de síntomas y respuestas

**Flujo de Emergencia:**
```
Paciente: "EMERGENCIA - dolor fuerte"
Bot: "Entiendo que tienes dolor. Te ayudo inmediatamente."
Bot: "¿Del 1 al 10, qué tan fuerte es tu dolor?"
Paciente: "8"
Bot: "Dolor nivel 8 - Te doy instrucciones inmediatas:"
Bot: "1. Toma ibuprofeno 400mg cada 6 horas"
Bot: "2. Aplica hielo 15 min cada hora"
Bot: "3. Te contacto mañana temprano para cita urgente"
Bot: "¿Hay hinchazón en tu cara?" [Continúa triaje...]
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** v1.1

---

### US-014: Follow-up Post-Tratamiento Automático
**Como** Dra. Patricia
**Quiero** hacer seguimiento automático después de tratamientos
**Para** asegurar recuperación exitosa y detectar complicaciones temprano

**Criterios de Aceptación:**
- [ ] Mensajes programados según tipo de tratamiento
- [ ] Preguntas específicas sobre recuperación
- [ ] Instrucciones de cuidado post-operatorio
- [ ] Escalation si paciente reporta problemas
- [ ] Programación automática de citas de control
- [ ] Recordatorios de medicación

**Ejemplo Follow-up Post-Extracción:**
```
Día 0 (inmediatamente): "Instrucciones post-extracción enviadas"
Día 1: "¿Cómo te sientes? ¿Hay dolor fuerte o sangrado?"
Día 3: "¿La inflamación está bajando? ¿Sigues las instrucciones?"
Día 7: "Tiempo para quitar puntos. ¿Agendamos cita de control?"
```

**Prioridad:** Media | **Esfuerzo:** M | **Fase:** v1.1

---

## 5. Épica: Landing Page de Conversión

### US-015: Formulario de Contacto Optimizado
**Como** visitante de la landing page
**Quiero** solicitar información sobre Boreas fácilmente
**Para** entender si el servicio puede ayudar mi negocio

**Criterios de Aceptación:**
- [ ] Formulario simple con campos mínimos necesarios
- [ ] Validación en tiempo real
- [ ] Respuesta automática inmediata
- [ ] Routing según tipo de negocio
- [ ] Integración con CRM interno
- [ ] Seguimiento automático por email

**Campos del Formulario:**
```
📝 SOLICITAR DEMO GRATUITA
├─ Nombre completo *
├─ WhatsApp *
├─ Tipo de negocio * [Dropdown]
├─ Ciudad *
└─ ¿Cuántos mensajes recibes por día? [Opcional]

[BOTÓN: "Quiero mi demo gratuita"]
```

**Prioridad:** Alta | **Esfuerzo:** S | **Fase:** MVP

---

### US-016: Casos de Uso Específicos por Industria
**Como** dueño de un salón de belleza
**Quiero** ver ejemplos específicos de mi industria
**Para** entender exactamente cómo Boreas me ayudaría

**Criterios de Aceptación:**
- [ ] Sección específica para salones de belleza
- [ ] Casos de éxito reales con números específicos
- [ ] Screenshots de conversaciones reales
- [ ] ROI calculations específicas por industria
- [ ] Testimoniales de negocios similares
- [ ] Demo interactiva personalizada

**Ejemplo Caso de Uso - Salón:**
```
💄 SALÓN DE BELLEZA: CASO REAL

"Carmen duplicó sus citas en 2 meses"

ANTES:
• 4 horas/día en WhatsApp
• 20% no-shows
• Doble-booking frecuente
• Estrés constante

DESPUÉS:
• 1 hora/día en WhatsApp
• 8% no-shows
• Zero doble-booking
• +40% ingresos

ROI: $99/mes → +$800/mes = 8x retorno
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** MVP

---

## 6. Matriz de Priorización Completa

### 6.1 Criterios de Evaluación

- **Valor:** Impacto en usuario/negocio (1-5)
- **Esfuerzo:** Complejidad técnica (S/M/L/XL)
- **Riesgo:** Incertidumbre de implementación (1-5)
- **Score:** (Valor × 5) - (Esfuerzo points) - Riesgo

### 6.2 Scoring de Esfuerzo
- S (Small): 1 punto
- M (Medium): 3 puntos
- L (Large): 5 puntos
- XL (Extra Large): 8 puntos

### 6.3 Matriz de Priorización

| User Story | Valor | Esfuerzo | Riesgo | Score | Fase |
|------------|-------|----------|--------|-------|------|
| US-001: Respuestas automáticas | 5 | M (3) | 1 | 21 | MVP |
| US-002: Agendamiento WhatsApp | 5 | L (5) | 2 | 18 | MVP |
| US-003: Recordatorios automáticos | 5 | M (3) | 1 | 21 | MVP |
| US-015: Formulario de contacto | 4 | S (1) | 1 | 18 | MVP |
| US-016: Casos de uso específicos | 4 | M (3) | 1 | 16 | MVP |
| US-006: Dashboard principal | 4 | M (3) | 2 | 15 | MVP |
| US-004: Respuestas fuera horario | 3 | S (1) | 1 | 14 | MVP |
| US-007: Gestión manual | 4 | M (3) | 2 | 15 | MVP |
| US-005: Cancelaciones | 3 | M (3) | 2 | 10 | MVP |
| US-008: Config servicios | 3 | M (3) | 1 | 12 | MVP |
| US-009: Reservas restaurante | 4 | L (5) | 2 | 13 | v1.1 |
| US-010: Menú digital | 4 | L (5) | 2 | 13 | v1.1 |
| US-012: Agendamiento médico | 4 | M (3) | 2 | 15 | v1.1 |
| US-013: Emergencias médicas | 5 | M (3) | 3 | 19 | v1.1 |
| US-011: Cotizaciones eventos | 3 | L (5) | 3 | 7 | v1.2 |
| US-014: Follow-up médico | 3 | M (3) | 2 | 10 | v1.2 |

### 6.4 Decisiones de Scope

#### MVP (Weeks 1-8)
**Core Features - Salón de Belleza Focus:**
- [x] US-001: Respuestas automáticas (Score: 21)
- [x] US-003: Recordatorios automáticos (Score: 21)
- [x] US-002: Agendamiento WhatsApp (Score: 18)
- [x] US-015: Formulario de contacto (Score: 18)
- [x] US-016: Casos de uso específicos (Score: 16)
- [x] US-006: Dashboard principal (Score: 15)
- [x] US-007: Gestión manual (Score: 15)
- [x] US-004: Respuestas fuera horario (Score: 14)
- [x] US-008: Config servicios (Score: 12)
- [x] US-005: Cancelaciones (Score: 10)

#### v1.1 (Weeks 9-16)
**Multi-Industry Expansion:**
- [ ] US-013: Emergencias médicas (Score: 19)
- [ ] US-012: Agendamiento médico (Score: 15)
- [ ] US-009: Reservas restaurante (Score: 13)
- [ ] US-010: Menú digital (Score: 13)

#### v1.2 (Weeks 17-24)
**Advanced Features:**
- [ ] US-014: Follow-up médico (Score: 10)
- [ ] US-011: Cotizaciones eventos (Score: 7)

#### Future (Year 2+)
**Platform Expansion:**
- [ ] Multi-channel support (Instagram, SMS)
- [ ] Advanced AI features
- [ ] White-label solutions
- [ ] Enterprise features

---

## 7. Acceptance Criteria Templates

### 7.1 Template para Features de WhatsApp
```
DADO que soy [tipo de usuario]
CUANDO [acción específica]
ENTONCES el sistema debe [comportamiento esperado]
Y [validación adicional]

Casos Edge:
- ¿Qué pasa si el usuario escribre algo inesperado?
- ¿Cómo maneja errores de conectividad?
- ¿Qué pasa si WhatsApp está caído?

Performance:
- Respuesta en <5 segundos
- 99.9% uptime
- Maneja 100+ mensajes simultáneos
```

### 7.2 Template para Features de Dashboard
```
Interface Requirements:
- [ ] Responsive design (móvil first)
- [ ] Carga en <3 segundos
- [ ] Navegación intuitiva para usuarios no técnicos
- [ ] Tooltips para explicar funciones complejas

Data Requirements:
- [ ] Datos actualizados en tiempo real
- [ ] Backup automático
- [ ] Export de datos (CSV/PDF)
- [ ] Histórico de al menos 6 meses
```

---

**Estado:** ✅ User Stories Completadas
**Total User Stories:** 16 stories principales
**MVP Stories:** 10 stories (Score promedio: 16.3)
**Próximo paso:** `/oden:spec landing` para especificación de landing page

**Completado:** 2026-02-04T04:33:49Z
**Generado por:** Oden Forge Domain Expert