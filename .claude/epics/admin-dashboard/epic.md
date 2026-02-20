---
name: admin-dashboard
prd: admin-dashboard
status: backlog
progress: 0%
created: 2026-02-19T18:00:22Z
updated: 2026-02-19T18:00:22Z
---

# Epic: Admin Dashboard — Panel Oculto /admin

## Objetivo Técnico

Mover el dashboard actual de `/dashboard` a `/admin`, convertirlo en un panel de solo-admins sin ninguna referencia pública, construir las vistas de leads y analytics, y cubrir todo con tests.

## Análisis del Estado Actual

### Lo que existe y hay que modificar/eliminar
- `src/app/dashboard/page.tsx` → mover y reescribir como admin dashboard
- `src/components/common/dashboard-cta-button.tsx` → eliminar
- `src/components/common/header.tsx` → quitar imports y botones de dashboard
- `middleware.ts` (en `src/lib/supabase/middleware.ts`) → agregar protección `/admin` con check de rol
- `src/app/auth/login/page.tsx` + `/register` → ya no necesitan ser accesibles públicamente (o al menos sin link)

### Lo que existe y es útil
- Tabla `leads` en Supabase con todos los campos necesarios ✅
- Tabla `landing_analytics` en Supabase ✅
- `src/lib/supabase/server.ts` para queries server-side ✅
- `src/types/database.ts` con todos los tipos ✅
- Supabase auth con `role` en tabla `users` ✅

### Lo que hay que crear
- `src/app/admin/` — nueva ruta del panel
- `src/app/admin/layout.tsx` — layout del admin (noindex, sin header público)
- `src/app/admin/page.tsx` — redirect a `/admin/dashboard`
- `src/app/admin/login/page.tsx` — login exclusivo de admin
- `src/app/admin/dashboard/page.tsx` — stats + leads + analytics
- `src/app/admin/dashboard/leads/page.tsx` — tabla de leads
- `src/app/admin/dashboard/leads/[id]/page.tsx` — detalle de lead
- `src/app/admin/dashboard/analytics/page.tsx` — tabla analytics
- `src/app/api/admin/leads/route.ts` — API para obtener leads (admin-protected)
- `src/app/api/admin/analytics/route.ts` — API para obtener analytics (admin-protected)
- Tests para todo lo anterior

## Work Streams

### Stream A: Limpieza del sitio público
Archivos: `src/components/common/header.tsx`, `src/components/common/dashboard-cta-button.tsx`, `src/lib/supabase/middleware.ts`

### Stream B: Infraestructura /admin (auth + layout + middleware)
Archivos: `src/app/admin/`, `src/lib/supabase/middleware.ts`

### Stream C: Vistas del dashboard admin (leads + analytics)
Archivos: `src/app/admin/dashboard/`, `src/app/api/admin/`

### Stream D: Tests
Archivos: `src/app/admin/__tests__/`, `tests/e2e/admin-*.test.ts`

## Dependencias entre Streams

```
Stream A (limpieza)     → independiente, puede ir primero
Stream B (infra admin)  → depende de A (para no romper redirects)
Stream C (vistas)       → depende de B (necesita el layout y auth)
Stream D (tests)        → depende de A + B + C (todo construido)
```

## Definition of Done

- [ ] No existe ningún link a `/dashboard`, `/admin`, `/auth/login`, `/auth/register` desde el sitio público
- [ ] `DashboardCTAButton` y variantes eliminados completamente
- [ ] `/admin` redirige a `/admin/login` si no hay sesión
- [ ] `/admin` redirige a "acceso denegado" si sesión sin rol admin
- [ ] Vista de leads funcional con tabla, filtros y detalle
- [ ] Vista de analytics funcional con stats cards
- [ ] Todas las rutas `/admin/*` tienen `noindex`
- [ ] Tests unitarios, integración y E2E pasando
