---
name: admin-auth-fix
prd: .claude/prds/admin-auth-fix.md
status: backlog
progress: 0%
created: 2026-02-20T06:06:28Z
updated: 2026-02-20T06:06:28Z
---

# Epic: Admin Auth Fix & Console Error Cleanup

## Objetivo

Corregir los tres fallos críticos del panel admin: (1) acceso sin autenticación, (2) login siempre rechaza credenciales válidas, (3) errores en consola del navegador. El resultado es un flujo admin funcional end-to-end con un usuario real de Supabase.

---

## Análisis Técnico

### Causa raíz — Fallo 1: Middleware no bloquea

El código en `src/lib/supabase/middleware.ts` hace:
```typescript
const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
if (profile?.role !== 'admin') { redirect → unauthorized }
```

**Bug**: Si el query lanza un error (RLS, tabla inexistente, timeout), `profile` es `null` y la condición `null?.role !== 'admin'` es `true` → **redirige a unauthorized**. Eso es correcto. Pero si el middleware nunca llega a ejecutarse correctamente (env vars faltantes, Supabase client no inicializado), el `user` también sería `null` desde `getUser()`, y la lógica redirige al login. El problema reportado — "entra directamente sin comprobaciones" — sugiere que el middleware no está procesando la ruta, posiblemente porque:
- El `matcher` en `middleware.ts` excluye la ruta
- El middleware exportado no está correctamente conectado
- Un error no capturado hace que el middleware retorne la respuesta por defecto (pass-through)

### Causa raíz — Fallo 2: Login rechaza credenciales

El flujo del login client-side:
1. `supabase.auth.signInWithPassword()` — posiblemente OK
2. `supabase.from('users').select('role').eq('id', authData.user.id).single()` — falla aquí

Causas más probables (en orden):
- `public.users` no tiene un registro para el admin (solo existe en `auth.users`)
- RLS en `public.users` bloquea el SELECT aunque el usuario esté autenticado
- La tabla `public.users` no existe y el error es silencioso

### Causa raíz — Fallo 3: Errores de consola

Sin acceso a DevTools no se pueden enumerar, pero los más probables son:
- `Failed to fetch` de Supabase (env vars incorrectas o CORS)
- `Error: supabase: No API key found in request`
- React hydration warnings si el estado de auth difiere entre server/client
- `Warning: Each child in a list should have a unique "key" prop`
- Errores de `next/image` si hay imágenes mal configuradas

---

## Work Streams

### Stream A — Diagnóstico y Setup (BLOQUEANTE)
**Archivos:** `.env.local`, Supabase Dashboard, `supabase/migrations/`
**Debe completarse primero** — todo lo demás depende de saber qué está roto

### Stream B — Fixes de Código
**Archivos:** `src/lib/supabase/middleware.ts`, `src/app/admin/login/page.tsx`, `src/lib/admin/verify-admin.ts`
**Depende de:** Stream A (conocer la causa raíz antes de parchear)

### Stream C — Consola y Calidad
**Archivos:** Varios componentes, configuración
**Puede ir en paralelo con:** Stream B (una vez identificados los errores)

### Stream D — Tests
**Archivos:** `tests/integration/api/admin/`, `tests/e2e/admin-access-control.test.ts`, `src/lib/admin/verify-admin.test.ts`
**Depende de:** Streams A + B completos

---

## Tasks

### Task 001 — Diagnóstico: env vars, Supabase schema y middleware
**Stream:** A
**Prioridad:** Crítica — bloqueante
**Archivos:** `.env.local`, `middleware.ts`, `src/lib/supabase/middleware.ts`

Verificar en orden:
1. `.env.local` existe y tiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Añadir logging temporal en middleware para confirmar que se ejecuta y qué retorna cada paso
3. Confirmar que `middleware.ts` exporta `middleware` y `config.matcher` incluye `/admin/:path*`
4. En Supabase Dashboard: verificar que existe `public.users` con columna `role`
5. Verificar que existe un usuario admin en `auth.users` Y en `public.users` con `role='admin'`
6. Verificar políticas RLS de `public.users`
7. Documentar hallazgos en un archivo `diagnóstico.md`

### Task 002 — Supabase: crear migration y setup admin user
**Stream:** A
**Prioridad:** Crítica
**Archivos:** `supabase/migrations/`, documentación

1. Crear migration SQL que garantice:
   - Tabla `public.users` existe con `id UUID`, `role TEXT DEFAULT 'user'`, `created_at`
   - RLS habilitado con política: `auth.uid() = id` para SELECT
   - Trigger `on_auth_user_created` que inserta en `public.users` al crear usuario en auth
2. Instrucciones para crear el usuario admin:
   ```sql
   -- En Supabase SQL Editor
   INSERT INTO public.users (id, role)
   VALUES ('<user_uuid_from_auth>', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```
3. Crear `docs/guides/admin-user-setup.md` con instrucciones paso a paso

### Task 003 — Fix: middleware fail-safe + logging
**Stream:** B
**Prioridad:** Alta
**Archivos:** `src/lib/supabase/middleware.ts`
**Depende de:** Task 001

Cambios:
- Destructurar tanto `data` como `error` del query de rol
- Si `error` es no-null → redirigir a `/admin/unauthorized` (no pasar)
- Añadir `console.error` en dev con el error real para diagnóstico
- Asegurar que el único camino hacia `supabaseResponse` es `role === 'admin'`

```typescript
// Patrón correcto:
const { data: profile, error: profileError } = await supabase
  .from('users').select('role').eq('id', user.id).single()

if (profileError || !profile || profile.role !== 'admin') {
  if (profileError && process.env.NODE_ENV === 'development') {
    console.error('[Admin Middleware] Role check failed:', profileError.message)
  }
  url.pathname = '/admin/unauthorized'
  return NextResponse.redirect(url)
}
```

### Task 004 — Fix: login con logging de diagnóstico
**Stream:** B
**Prioridad:** Alta
**Archivos:** `src/app/admin/login/page.tsx`
**Depende de:** Task 001

Cambios:
- Destructurar `error` del query de roles en el login
- En `NODE_ENV === 'development'`: loggear el error real en consola
- Mantener mensaje genérico "Credenciales incorrectas" al usuario en todos los casos
- Añadir logging también del error de `signInWithPassword` en dev

### Task 005 — Fix: verifyAdmin maneja errores de DB
**Stream:** B
**Prioridad:** Alta
**Archivos:** `src/lib/admin/verify-admin.ts`
**Depende de:** Task 001

Cambios:
- Destructurar `error` del query de roles
- Si `error` es no-null → retornar `{ error: 'Service Unavailable', status: 503 }`
- Actualizar el tipo `VerifyError` para incluir `status: 503`
- Las API routes que usan `verifyAdmin` deben propagar el 503 automáticamente (ya lo hacen por el `result.error` check)

### Task 006 — Consola: identificar y resolver errores
**Stream:** C
**Prioridad:** Media
**Archivos:** Varios (identificar durante la tarea)
**Depende de:** Tasks 001-005 (ejecutar con app funcionando)

1. Levantar `npm run dev`
2. Abrir DevTools → Console tab
3. Navegar por: `/`, `/admin/login`, login exitoso, `/admin/dashboard`, leads, analytics
4. Capturar cada error/warning con su stack trace
5. Categorizar: crítico / warning / informativo / extensión de browser
6. Resolver cada uno en el código fuente
7. Re-verificar consola limpia

### Task 007 — Tests: actualizar post-fix
**Stream:** D
**Prioridad:** Media
**Archivos:** `src/lib/admin/verify-admin.test.ts`, `tests/integration/api/admin/*.test.ts`, `tests/e2e/admin-access-control.test.ts`
**Depende de:** Tasks 003-005

1. `verify-admin.test.ts`: añadir casos para error de DB (retorna 503)
2. `tests/integration/api/admin/leads.test.ts`: caso DB error en verifyAdmin
3. `tests/integration/api/admin/stats.test.ts`: mismos casos
4. `tests/e2e/admin-access-control.test.ts`: documentar cómo configurar `ADMIN_TEST_EMAIL`/`ADMIN_TEST_PASSWORD` para habilitar la suite autenticada
5. Correr todos los tests y confirmar 88+ passing

---

## Dependencias entre Tasks

```
Task 001 (Diagnóstico)
    ↓
Task 002 (Migration + Admin user)
    ↓
Tasks 003, 004, 005 (Fixes — pueden ir en paralelo)
    ↓
Task 006 (Consola — con app funcionando)
    ↓
Task 007 (Tests — con fixes en place)
```

---

## Definition of Done

- [ ] `.env.local` verificado y correcto
- [ ] Migration SQL aplicada en Supabase
- [ ] Usuario admin existe en `auth.users` Y `public.users` con `role='admin'`
- [ ] Login en `/admin/login` funciona end-to-end con usuario real
- [ ] `/admin/dashboard` sin sesión redirige a `/admin/login`
- [ ] Middleware loggea errores de DB en dev y nunca hace pass-through en caso de error
- [ ] `verifyAdmin` retorna 503 si el query de DB falla
- [ ] Consola del navegador limpia en todas las páginas del admin
- [ ] Todos los tests pasan (88+)
- [ ] `docs/guides/admin-user-setup.md` creado
