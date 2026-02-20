---
name: admin-dashboard
description: Hidden admin dashboard at /admin for internal team to view leads and landing page interactions
status: backlog
created: 2026-02-19T18:00:22Z
updated: 2026-02-19T18:00:22Z
---

# PRD: Admin Dashboard — Panel Oculto para el Equipo

## Problema

El sitio de marketing de Boreas captura leads via el formulario de contacto y registra interacciones en `landing_analytics`. Sin embargo:

- El equipo no tiene forma visual de ver estos datos sin acceder directamente a Supabase
- El dashboard actual en `/dashboard` está expuesto públicamente con botones en el header y hero
- No existe distinción entre usuarios comunes y admins del equipo
- Los visitantes de la landing no deben saber que existe un panel de administración

## Solución

Crear un panel de administración **oculto** en `/admin`:
- Sin ningún link, botón o referencia en el sitio público
- Accesible solo para usuarios con `role = 'admin'` en Supabase
- URL directa: `tudominio.com/admin`
- Login propio en `/admin/login` (no usa las páginas de auth públicas)
- Muestra leads capturados y analytics de la landing

## Usuarios Objetivo

**Solo:** Equipo interno de Boreas (Francisco + team)
**NO:** Visitantes del sitio, leads, clientes del servicio

## Requerimientos Funcionales

### RF-001: Acceso solo por URL directa
- No existe ningún enlace público a `/admin`
- Middleware protege toda la ruta `/admin/*`
- Solo usuarios con `role = 'admin'` en Supabase pueden acceder
- Usuarios no autenticados → redirect a `/admin/login`
- Usuarios autenticados sin rol admin → página de acceso denegado

### RF-002: Login de Admin
- Formulario simple en `/admin/login`: email + password
- Al autenticarse, verifica `role = 'admin'` en tabla `users`
- Si no es admin: muestra error "Acceso no autorizado" (no revela que la página existe)
- No usa las páginas de `/auth/login` ni `/auth/register` públicas

### RF-003: Limpieza del sitio público
- Eliminar `DashboardCTAButton` del header
- Eliminar `HeaderDashboardCTA` del header
- Eliminar cualquier link a `/dashboard`, `/login`, `/register` del sitio público
- El header queda solo con navegación de landing (casos de uso, precios, FAQ, CTA de contacto)

### RF-004: Dashboard — Vista de Leads
- Tabla con todos los leads de la tabla `leads`
- Columnas: nombre, email, negocio, tipo, score, status, fecha
- Ordenado por fecha (más reciente primero)
- Filtros: por status, por tipo de negocio
- Badge de color por status (new, contacted, demo_scheduled, etc.)
- Click en lead → ver detalle (todos los campos del lead)

### RF-005: Dashboard — Vista de Analytics
- Tabla/lista de eventos de `landing_analytics`
- Muestra: path, referrer, utm_source, form_submitted, fecha
- Contador de: total visitas, forms enviados, tasa de conversión
- Filtro por rango de fechas

### RF-006: Dashboard — Stats Cards
- Total leads (todos)
- Leads nuevos (status = 'new', sin contactar)
- Leads esta semana
- Tasa de conversión (leads / visitas únicas)

## Requerimientos No Funcionales

### RNF-001: Seguridad
- El middleware debe verificar el rol ANTES de renderizar cualquier contenido
- No exponer datos de leads en rutas públicas
- Sesión de admin independiente del flujo de auth de usuarios comunes

### RNF-002: Simplicidad
- No necesita ser bonito ni tener muchas features
- Funcional > Diseño
- Sin animaciones innecesarias

### RNF-003: No indexable
- Meta tag `noindex` en todas las páginas de `/admin`
- Excluir `/admin` del sitemap

## Criterios de Éxito

- [ ] `/admin` no tiene ningún link desde el sitio público
- [ ] Solo usuarios con role=admin pueden ver el dashboard
- [ ] Visitante que va directo a `/admin` → redirect a `/admin/login`
- [ ] Admin puede ver todos los leads capturados por el formulario
- [ ] Admin puede ver analytics de interacciones de la landing
- [ ] Header del sitio no tiene botones de dashboard/login
- [ ] Tests pasan al 100%

## Scope Excluido (no en esta versión)

- Editar leads desde el dashboard (solo lectura)
- Enviar emails desde el dashboard
- Gestión de usuarios admin
- Exportar CSV
- Múltiples admins con roles diferentes
