# User Stories - Boreas Marketing Site

**Estado:** ✅ Actualizado al scope de marketing site
**Última actualización:** 2026-02-19T00:00:00Z

---

## Contexto

Este documento cubre únicamente el sitio de marketing de Boreas. Las user stories del bot de WhatsApp, dashboard CRM y auth están archivadas en `docs/archived/`.

---

## Épica 1: Visitante → Lead

Historias del visitante que llega al sitio, entiende el servicio y deja sus datos.

---

### US-001: Entender el servicio en 5 segundos
**Como** dueño de un pequeño negocio que llega al sitio por primera vez
**Quiero** entender inmediatamente qué hace Boreas y para quién es
**Para** decidir si vale la pena seguir leyendo

**Criterios de Aceptación:**
- [ ] Hero section con propuesta de valor en 1-2 frases claras
- [ ] Visual que representa el caso de uso (salón, restaurante, clínica)
- [ ] CTA principal visible sin hacer scroll
- [ ] Tiempo de carga < 2 segundos

**Prioridad:** Alta | **Esfuerzo:** S | **Fase:** V1

---

### US-002: Ver casos de uso relevantes para mi negocio
**Como** dueña de un salón de uñas
**Quiero** ver cómo Boreas funciona específicamente para un salón
**Para** imaginar cómo beneficiaría mi negocio en concreto

**Criterios de Aceptación:**
- [ ] Sección con al menos 3 industrias (salón, restaurante, clínica)
- [ ] Cada caso de uso explica el "antes" y "después"
- [ ] Números específicos si es posible (ej. "ahorra 3 horas al día")
- [ ] Visualmente diferenciado por industria

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** V1

---

### US-003: Resolver mis dudas sin hablar con nadie
**Como** visitante interesado pero escéptico
**Quiero** encontrar respuestas a mis preguntas frecuentes
**Para** tomar una decisión de contacto sin necesitar hablar con ventas primero

**Criterios de Aceptación:**
- [ ] FAQ con al menos 5 preguntas respondiendo objeciones clave
- [ ] Preguntas sobre precio, setup, contratos, soporte
- [ ] Lenguaje simple, sin jerga técnica
- [ ] Fácil de navegar (acordeón o similar)

**Prioridad:** Media | **Esfuerzo:** S | **Fase:** V1

---

### US-004: Dejar mis datos para recibir más información
**Como** visitante interesado
**Quiero** dejar mi nombre y email para que me contacten
**Para** saber más del servicio sin compromiso

**Criterios de Aceptación:**
- [ ] Formulario simple: nombre, email, tipo de negocio, ciudad
- [ ] Mensaje de confirmación inmediato en la página
- [ ] Email de confirmación al lead en menos de 1 minuto
- [ ] Email de notificación al equipo con los datos del lead
- [ ] Formulario accesible desde múltiples puntos del sitio (hero, footer, sección dedicada)

**Flujo esperado:**
```
Visitante completa formulario
→ Página de gracias: "¡Listo! Te contactaremos pronto."
→ Lead recibe email: "Gracias por tu interés en Boreas..."
→ Equipo recibe email: "Nuevo lead: [nombre] - [negocio] - [ciudad]"
```

**Prioridad:** Alta | **Esfuerzo:** M | **Fase:** V1

---

### US-005: Unirse a la lista de espera (waitlist)
**Como** visitante interesado en el servicio
**Quiero** unirme a una lista de espera para ser de los primeros en acceder
**Para** asegurar mi lugar y obtener posibles beneficios de early adopter

**Criterios de Aceptación:**
- [ ] CTA diferenciado de "contacto general": "Unirme a la waitlist"
- [ ] Solo requiere email (fricción mínima)
- [ ] Email de confirmación inmediato
- [ ] Contador de personas en waitlist (social proof)

**Prioridad:** Media | **Esfuerzo:** S | **Fase:** V1

---

### US-006: Encontrar el sitio en Google
**Como** dueño de negocio buscando "automatizar WhatsApp restaurante"
**Quiero** encontrar Boreas en los primeros resultados de búsqueda
**Para** llegar al sitio sin necesitar conocerlo de antemano

**Criterios de Aceptación:**
- [ ] Meta title y description optimizados con keywords objetivo
- [ ] Sitemap.xml enviado a Google Search Console
- [ ] Al menos 1 artículo de blog indexado
- [ ] Velocidad de carga > 90 en Pagespeed Insights

**Prioridad:** Media | **Esfuerzo:** M | **Fase:** V1

---

## Épica 2: Operador → Gestiona Leads

Historias del equipo de Boreas que gestiona los leads que llegan por el sitio.

---

### US-007: Recibir notificación inmediata de nuevo lead
**Como** miembro del equipo de ventas de Boreas
**Quiero** recibir un email inmediatamente cuando llega un nuevo lead
**Para** hacer follow-up rápido mientras el interés está fresco

**Criterios de Aceptación:**
- [ ] Email de notificación en menos de 1 minuto del submit
- [ ] Email incluye: nombre, email, tipo de negocio, ciudad, mensaje
- [ ] Email incluye: fecha/hora del contacto
- [ ] Email permite responder directamente al lead

**Prioridad:** Alta | **Esfuerzo:** S | **Fase:** V1

---

### US-008: Ver todos los leads en un lugar
**Como** operador de Boreas
**Quiero** ver una lista simple de todos los leads recibidos
**Para** hacer seguimiento sin perder ningún contacto

**Nota de implementación:** En V1 esto se hace via email. En V2 puede ser una hoja de Google Sheets o CRM externo. No requiere dashboard propio.

**Criterios de Aceptación (V1 - email):**
- [ ] Cada lead genera un email con todos los datos
- [ ] Emails archivables en carpeta dedicada

**Criterios de Aceptación (V2 - futuro):**
- [ ] Integración con Google Sheets o Notion para registrar leads
- [ ] Vista de tabla con filtros básicos

**Prioridad:** Baja (V2) | **Esfuerzo:** M | **Fase:** Post-launch

---

## Notas de Scope

Las siguientes épicas existen como docs archivados y corresponden a productos en otros repositorios:

- **Bot WhatsApp** (automatización de mensajes): `docs/archived/automation-spec.md`
- **Dashboard CRM** (gestión interna de clientes): `docs/archived/dashboard-spec.md`
- **Auth System** (login de usuarios del servicio): `docs/archived/auth-spec.md`
