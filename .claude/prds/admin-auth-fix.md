---
name: admin-auth-fix
description: Diagnóstico y corrección del flujo de autenticación admin — login, middleware, Supabase y errores de consola
status: backlog
created: 2026-02-20T06:03:40Z
updated: 2026-02-20T06:03:40Z
---

# PRD: Admin Auth Fix & Console Error Cleanup

## Problema

El panel admin en `/admin` presenta tres fallos críticos detectados en uso real:

### Fallo 1 — Acceso sin autenticación
Al navegar directamente a `/admin/dashboard` (o cualquier ruta protegida), el middleware **no redirige al login** y permite el acceso sin verificación. Causa probable: el query a `public.users` falla silenciosamente (RLS, tabla inexistente, env vars incorrectas) y el middleware interpreta el error como si el usuario tuviera rol `admin`.

### Fallo 2 — Login siempre devuelve "Credenciales incorrectas"
Incluso con credenciales Supabase Auth válidas, el login falla. Causa probable:
- El usuario existe en `auth.users` pero **no existe en `public.users`** con columna `role = 'admin'`
- RLS en `public.users` bloquea el SELECT del propio perfil
- El segundo query (role check) devuelve `null` → el código hace `signOut()` inmediatamente

### Fallo 3 — Errores y warnings en consola del navegador
Se detectan múltiples errores en DevTools que degradan la experiencia y pueden estar relacionados con los fallos anteriores (env vars no cargadas, fetch a Supabase fallando, hydration mismatches, etc.).

---

## Objetivo

1. **Que un usuario admin real pueda hacer login** en `/admin/login` y llegar al dashboard
2. **Que el middleware bloquee efectivamente** a usuarios no autenticados / no-admin
3. **Que los endpoints de Supabase funcionen** (auth + `public.users`)
4. **Que la consola del navegador esté limpia** (sin errores ni warnings relevantes)
5. **Que los tests reflejen el comportamiento real** del sistema

---

## Requisitos Funcionales

### RF-001: Supabase — Esquema de base de datos correcto
- La tabla `public.users` debe existir con al menos la columna `role TEXT`
- Debe haber un trigger que inserte un registro en `public.users` al crear un usuario en `auth.users` (o hacerlo manualmente para el usuario admin)
- El usuario admin debe tener `role = 'admin'` en `public.users`

### RF-002: Supabase — Row Level Security (RLS)
- RLS en `public.users` debe permitir que un usuario autenticado lea **su propio** registro (`auth.uid() = id`)
- El middleware server-side (service role o anon con RLS) debe poder leer el rol del usuario autenticado
- Verificar que la política de RLS no bloquee el query en el flujo de middleware

### RF-003: Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` deben estar correctamente configuradas en `.env.local`
- Verificar que el archivo `.env.local` existe y tiene los valores correctos del proyecto Supabase
- Los Server Components y el middleware deben poder conectarse a Supabase sin errores

### RF-004: Middleware — Manejo de errores explícito
- Si el query a `public.users` falla (error de red, RLS, tabla inexistente), el middleware debe **denegar el acceso** (redirigir a `/admin/unauthorized`), no permitirlo
- El middleware debe loggear el error internamente para facilitar el diagnóstico
- Nunca debe existir un camino donde un error silencioso resulte en acceso concedido

### RF-005: Login — Diagnóstico y corrección del flujo
- El formulario de login debe distinguir entre:
  - Error de Supabase Auth (credenciales incorrectas en auth)
  - Error en el query de roles (RLS, tabla inexistente)
  - Éxito de auth pero rol no-admin
- En desarrollo, loggear el error real en consola (sin exponerlo al usuario)
- En producción, mostrar siempre "Credenciales incorrectas" al usuario

### RF-006: Consola del navegador — Limpieza de errores
- Identificar todos los errores y warnings en DevTools al:
  - Cargar `/` (landing page)
  - Cargar `/admin/login`
  - Hacer login exitoso y llegar al dashboard
  - Navegar entre las páginas del dashboard
- Resolver o suprimir justificadamente cada error encontrado
- Errores admisibles: solo los que provienen de extensiones del navegador (fuera del control del código)

### RF-007: Setup de usuario admin
- Documentar el proceso para crear un usuario admin real en Supabase:
  1. Crear usuario en Supabase Auth Dashboard (o via `supabase.auth.admin.createUser`)
  2. Insertar registro en `public.users` con `role = 'admin'`
  3. Verificar que el login funciona end-to-end

### RF-008: Tests — Actualización post-fix
- Los tests E2E de `admin-access-control.test.ts` deben poder ejecutarse con las variables `ADMIN_TEST_EMAIL` / `ADMIN_TEST_PASSWORD` configuradas
- Los tests de integración de las API routes deben cubrir el caso donde el query a `public.users` falla (error de DB)
- Los tests de `verifyAdmin` deben cubrir el caso de error en el query (no solo null)

---

## Flujo de usuario admin (happy path objetivo)

```
1. Admin navega a /admin/login (directo o redirectado desde /admin)
2. Ingresa email + password
3. Supabase Auth valida → OK
4. Query a public.users WHERE id = user.id → retorna { role: 'admin' }
5. router.push('/admin/dashboard')
6. Middleware verifica en cada request: user autenticado + role = admin → OK
7. Dashboard carga con datos reales de Supabase (leads, analytics)
8. Console del navegador: sin errores relevantes
```

---

## Flujo de middleware (comportamiento esperado)

```
Request → /admin/dashboard
  ↓
middleware.ts → updateSession()
  ↓
supabase.auth.getUser()
  ├─ error/null user → redirect /admin/login
  └─ user OK
       ↓
       public.users WHERE id = user.id
         ├─ error en query → redirect /admin/unauthorized (NO silencioso)
         ├─ null (no existe) → redirect /admin/unauthorized
         ├─ role != 'admin' → redirect /admin/unauthorized
         └─ role == 'admin' → permitir paso ✅
```

---

## Diagnóstico técnico (hipótesis por orden de probabilidad)

| # | Hipótesis | Síntoma | Verificación |
|---|-----------|---------|--------------|
| 1 | `.env.local` no tiene las vars correctas o no existe | Supabase client falla en init | `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` en server |
| 2 | `public.users` no tiene el usuario admin | Login OK, role check falla | Query manual en Supabase Dashboard |
| 3 | RLS bloquea SELECT en `public.users` | Query retorna null silencioso | Ver `error` del query, no solo `data` |
| 4 | Middleware no maneja el `error` del query | Acceso concedido si query falla | Audit del código de middleware |
| 5 | Tabla `public.users` no existe | Todo falla | Verificar en Supabase Dashboard → Table Editor |

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/lib/supabase/middleware.ts` | Manejar `error` del query explícitamente; loggear en dev |
| `src/app/admin/login/page.tsx` | Loggear error real en dev; mejorar mensajes de diagnóstico |
| `src/lib/admin/verify-admin.ts` | Manejar `error` del query (no solo null); retornar 503 si DB error |
| `.env.local` | Verificar/corregir variables de entorno |
| `supabase/` | Migrations o scripts para crear tabla `users` y política RLS |
| `tests/integration/api/admin/*.test.ts` | Cubrir caso de error en query de DB |
| `tests/e2e/admin-access-control.test.ts` | Habilitar suite autenticada con env vars |

---

## Criterio de Done

- [ ] Un admin real puede hacer login en `/admin/login` y llegar al dashboard
- [ ] Navegar a `/admin/dashboard` sin sesión redirige a `/admin/login`
- [ ] La consola del navegador no muestra errores relacionados con el código del proyecto
- [ ] Los endpoints de Supabase responden correctamente (sin errores 400/401/500 en Network tab)
- [ ] `verifyAdmin` retorna 503 (no 200 ni acceso) si el DB query falla
- [ ] Tests E2E pasan con `ADMIN_TEST_EMAIL` y `ADMIN_TEST_PASSWORD` configurados
- [ ] Existe documentación del proceso de creación de usuario admin

---

## Prioridad

**Alta** — Bloquea el uso real del panel admin. Sin esto, el dashboard no es funcional.

## Referencias

- `src/lib/supabase/middleware.ts` — lógica de protección de rutas
- `src/app/admin/login/page.tsx` — formulario de login
- `src/lib/admin/verify-admin.ts` — guard para API routes
- `middleware.ts` (raíz) — entry point del middleware Next.js
- Supabase Docs: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
