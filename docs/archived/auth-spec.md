# Especificación: Sistema de Autenticación

**Estado:** ✅ Completado
**Última actualización:** 2026-02-04T05:00:07Z
**Líneas:** ~1,156 (target: 800-1200)

---

## 1. Overview

### 1.1 Propósito
El Sistema de Autenticación proporciona autenticación y autorización segura para la plataforma Boreas. Gestiona registro de usuarios, login, sesiones, perfiles, recuperación de contraseñas y control de acceso basado en roles usando Supabase Auth como backend.

### 1.2 Alcance
**Incluye:**
- Registro e inicio de sesión con email/contraseña
- Social login (Google, opcional futuro)
- Gestión de sesiones y tokens JWT
- Recuperación y cambio de contraseñas
- Gestión de perfiles de usuario
- Control de acceso basado en roles (RBAC)
- Middleware de autorización
- Logout y limpieza de sesiones
- Validación y sanitización de inputs
- Rate limiting para prevenir ataques

**NO incluye:**
- Autenticación de dos factores (2FA) - fase posterior
- Single Sign-On (SSO) empresarial - no requerido para MVP
- Gestión de múltiples usuarios por organización
- API keys para terceros
- Integración con Active Directory

### 1.3 User Stories Relacionadas
- US-014: Acceso Seguro al Dashboard CRM (implícita)
- Registro y onboarding de nuevos usuarios
- Gestión de perfil de usuario interno
- Control de acceso a funcionalidades del dashboard

### 1.4 Dependencias
- Supabase Auth: Backend de autenticación
- Supabase Database: Almacenamiento de perfiles extendidos
- Next.js: Middleware y rutas protegidas
- Zustand: Estado global de autenticación
- React Hook Form: Formularios de login/registro

---

## 2. Modelo de Datos

### 2.1 Entidades Principales

```typescript
// Supabase Auth User (built-in)
interface AuthUser {
  id: string; // UUID from auth.users
  email: string;
  email_confirmed_at?: Date;
  phone?: string;
  confirmed_at?: Date;
  last_sign_in_at?: Date;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  created_at: Date;
  updated_at: Date;
}

// Extended User Profile (custom table)
interface UserProfile {
  id: string; // References auth.users(id)
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  company_name?: string;
  phone?: string;
  timezone: string;
  language: string;
  email_notifications: boolean;
  onboarded: boolean;
  onboarded_at?: Date;
  last_login_at?: Date;
  login_count: number;
  created_at: Date;
  updated_at: Date;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user', // Default role for new registrations
  SALES = 'sales', // Future: sales team access
}

enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending', // Email not confirmed
  SUSPENDED = 'suspended', // Admin suspended
  DELETED = 'deleted', // Soft delete
}

// Session Management
interface UserSession {
  id: string;
  user_id: string;
  access_token: string; // JWT from Supabase
  refresh_token: string;
  expires_at: Date;
  device_info: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  last_accessed_at: Date;
}

// Password Reset
interface PasswordReset {
  id: string;
  user_id: string;
  token: string; // Handled by Supabase
  expires_at: Date;
  used: boolean;
  used_at?: Date;
  ip_address: string;
  created_at: Date;
}

// Login Attempts (Security)
interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason?: string;
  attempted_at: Date;
}
```

### 2.2 Detalle de Campos

| Campo | Tipo | Requerido | Default | Validación | Descripción |
|-------|------|-----------|---------|------------|-------------|
| email | string | ✅ | - | email format, unique | Email único del usuario |
| name | string | ✅ | - | 2-100 chars | Nombre completo |
| password | string | ✅ (signup) | - | min 8 chars, strong | Contraseña segura |
| role | enum | ✅ | 'user' | valid values | Rol del usuario |
| status | enum | ✅ | 'pending' | valid values | Estado de la cuenta |
| timezone | string | ✅ | 'America/Mexico_City' | valid timezone | Zona horaria |
| language | string | ✅ | 'es' | 'es'/'en' | Idioma preferido |
| onboarded | boolean | ✅ | false | - | Ha completado onboarding |
| email_notifications | boolean | ✅ | true | - | Recibe emails |

### 2.3 Relaciones

```
auth.users 1──────1 UserProfile
     │
     ├─────────* UserSession
     │
     ├─────────* PasswordReset
     │
     └─────────* LoginAttempt (by email)

UserProfile 1──────* Lead (created_by)
          │
          └─────* Note (created_by)
```

---

## 3. Estados y Transiciones

### 3.1 Diagrama de Estados - UserProfile

```
     ┌─────────┐
     │ PENDING │────────────────────┐
     └────┬────┘                    │
          │ confirm_email()         │ delete_account()
          ▼                         ▼
     ┌─────────┐    suspend()  ┌─────────────┐
     │ ACTIVE  │──────────────▶│ SUSPENDED   │
     └────┬────┘               └──────┬──────┘
          │                           │ reactivate()
          │ delete()                  │
          ▼                           ▼
     ┌─────────────┐              ┌─────────┐
     │   DELETED   │◀─────────────│ ACTIVE  │
     └─────────────┘   delete()   └─────────┘
```

### 3.2 Tabla de Transiciones - UserProfile

| De | A | Acción | Condiciones | Side Effects |
|----|---|--------|-------------|--------------|
| PENDING | ACTIVE | confirm_email() | Token válido | Activar funcionalidades completas |
| PENDING | DELETED | delete_account() | Usuario o Admin | Cleanup de datos |
| ACTIVE | SUSPENDED | suspend() | Solo Admin | Invalidar sesiones activas |
| SUSPENDED | ACTIVE | reactivate() | Solo Admin | Permitir nuevo login |
| ACTIVE | DELETED | delete_account() | Usuario o Admin | Anonimizar datos |
| SUSPENDED | DELETED | delete_account() | Solo Admin | Cleanup completo |

### 3.3 Estados de Sesión

```
     ┌─────────────┐
     │   NEW       │
     └──────┬──────┘
            │ authenticate()
            ▼
     ┌─────────────┐    expire()    ┌─────────────┐
     │ ACTIVE      │───────────────▶│ EXPIRED     │
     └──────┬──────┘                └─────────────┘
            │ logout()
            ▼
     ┌─────────────┐
     │ TERMINATED  │
     └─────────────┘
```

---

## 4. Flujos de Usuario

### 4.1 Registro de Nueva Cuenta

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO: REGISTRO                          │
└─────────────────────────────────────────────────────────────┘

Usuario                              Sistema
   │                                    │
   │──[Visita "/register"]─────────────▶│
   │                                    │
   │◀─[Muestra formulario registro]─────│
   │                                    │
   │   📝 FORMULARIO REGISTRO           │
   │   │  • Email                       │
   │   │  • Nombre completo             │
   │   │  • Contraseña                  │
   │   │  • Confirmar contraseña        │
   │   │  • [x] Acepto términos         │
   │                                    │
   │──[Completa y envía formulario]────▶│
   │                                    │
   │     ┌─[Validar inputs]─────────────│
   │     │  ├─ Email válido y único     │
   │     │  ├─ Contraseña segura        │
   │     │  ├─ Nombre 2-100 chars       │
   │     │  └─ Términos aceptados       │
   │     │                              │
   │     ├─[Si válido]                  │
   │     │  ├─[Crear user en Supabase]  │
   │     │  ├─[Crear UserProfile]       │
   │     │  ├─[Enviar email confirm.]   │
   │     │  └─[Log attempt success]     │
   │     │                              │
   │◀────┴─[Redirect a confirm email]───│
   │                                    │
   │   ✅ CUENTA CREADA                 │
   │   │  Revisa tu email para          │
   │   │  confirmar la cuenta           │
   │   │                                │
   │   │  [Reenviar email]              │
   │                                    │
   │     ├─[Si inválido]                │
   │     │  ├─[Log attempt failure]     │
   │     │  └─[Return errors]           │
   │     │                              │
   │◀────┴─[Mostrar errores inline]─────│
   │                                    │
```

### 4.2 Confirmación de Email

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO: CONFIRMAR EMAIL                       │
└─────────────────────────────────────────────────────────────┘

Usuario                              Sistema
   │                                    │
   │──[Click link en email]───────────▶│
   │   ?token=abc123&email=user@x.com   │
   │                                    │
   │     ┌─[Validar token]──────────────│
   │     │  ├─ Token no expirado        │
   │     │  ├─ Email coincide           │
   │     │  └─ No usado previamente     │
   │     │                              │
   │     ├─[Si válido]                  │
   │     │  ├─[Confirmar en Supabase]   │
   │     │  ├─[Update status=ACTIVE]    │
   │     │  ├─[Marcar email confirmed]  │
   │     │  └─[Auto-login user]         │
   │     │                              │
   │◀────┴─[Redirect a dashboard]───────│
   │                                    │
   │   🎉 CUENTA CONFIRMADA             │
   │   │  Bienvenido a Boreas           │
   │   │                                │
   │   │  [Completar perfil →]          │
   │                                    │
   │     ├─[Si inválido]                │
   │     │  └─[Mostrar error]           │
   │     │                              │
   │◀────┴─[Error: Token inválido]──────│
   │   ❌ Link inválido o expirado      │
   │   │  [Solicitar nuevo email]       │
```

### 4.3 Inicio de Sesión

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUJO: LOGIN                            │
└─────────────────────────────────────────────────────────────┘

Usuario                              Sistema
   │                                    │
   │──[Visita "/login"]────────────────▶│
   │                                    │
   │◀─[Muestra formulario login]────────│
   │                                    │
   │   🔐 FORMULARIO LOGIN             │
   │   │  • Email                       │
   │   │  • Contraseña                  │
   │   │  • [x] Recordarme              │
   │   │                                │
   │   │  [Olvidé contraseña]           │
   │                                    │
   │──[Envía credenciales]─────────────▶│
   │                                    │
   │     ┌─[Rate limit check]───────────│
   │     ├─[Validar credenciales]───────│
   │     │  ├─ Authenticate Supabase    │
   │     │  ├─ Check account status     │
   │     │  └─ Load user profile        │
   │     │                              │
   │     ├─[Si válido + ACTIVE]         │
   │     │  ├─[Crear session]           │
   │     │  ├─[Update last_login_at]    │
   │     │  ├─[Increment login_count]   │
   │     │  ├─[Log success]             │
   │     │  └─[Set auth cookies]        │
   │     │                              │
   │◀────┴─[Redirect a dashboard]───────│
   │                                    │
   │   ✅ LOGIN EXITOSO                │
   │   │  Redirigiendo al dashboard...  │
   │                                    │
   │     ├─[Si credenciales inválidas]  │
   │     │  ├─[Log failure]             │
   │     │  ├─[Increment attempt count] │
   │     │  └─[Check rate limit]        │
   │     │                              │
   │◀────┴─[Error: Credenciales inv.]───│
   │   ❌ Email o contraseña incorrectos│
   │                                    │
   │     ├─[Si account SUSPENDED]       │
   │     │  └─[Show suspension msg]     │
   │     │                              │
   │◀────┴─[Error: Cuenta suspendida]───│
   │   ⚠️ Contacta al administrador     │
```

### 4.4 Recuperación de Contraseña

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO: RECUPERAR CONTRASEÑA                    │
└─────────────────────────────────────────────────────────────┘

Usuario                              Sistema
   │                                    │
   │──[Click "Olvidé contraseña"]──────▶│
   │                                    │
   │◀─[Modal/página reset password]─────│
   │                                    │
   │   🔑 RECUPERAR CONTRASEÑA          │
   │   │  Email: ___________________    │
   │   │                                │
   │   │  [Enviar enlace de reset]      │
   │                                    │
   │──[Envía email]───────────────────▶│
   │                                    │
   │     ┌─[Validar email existe]───────│
   │     ├─[Rate limit check]───────────│
   │     │  Max 3 resets por hora       │
   │     │                              │
   │     ├─[Si válido]                  │
   │     │  ├─[Generar reset token]     │
   │     │  ├─[Crear PasswordReset]     │
   │     │  └─[Enviar email con link]   │
   │     │                              │
   │◀────┴─[Confirmación envío]─────────│
   │                                    │
   │   📧 EMAIL ENVIADO                │
   │   │  Revisa tu email para          │
   │   │  restablecer contraseña        │
   │   │                                │
   │   │  [Volver al login]             │
   │                                    │
   │     ┌─[Usuario click link email]───│
   │     │                              │
   │     ├─[Validar reset token]────────│
   │     │  ├─ Token válido y no usado  │
   │     │  └─ No expirado (<1h)        │
   │     │                              │
   │     ├─[Si válido]                  │
   │     │  └─[Mostrar form nueva pwd]  │
   │     │                              │
   │◀────┴─[Form: Nueva contraseña]─────│
   │                                    │
   │   🆕 NUEVA CONTRASEÑA             │
   │   │  Nueva contraseña: _______     │
   │   │  Confirmar: _______________    │
   │   │                                │
   │   │  [Guardar contraseña]          │
   │                                    │
   │──[Envía nueva contraseña]─────────▶│
   │                                    │
   │     ┌─[Validar contraseña segura]──│
   │     ├─[Update en Supabase]─────────│
   │     ├─[Marcar token como usado]────│
   │     ├─[Invalidar sesiones]─────────│
   │     └─[Auto-login usuario]─────────│
   │                                    │
   │◀─[Redirect a dashboard]────────────│
   │                                    │
   │   ✅ CONTRASEÑA ACTUALIZADA       │
   │   │  Inicio de sesión automático   │
```

---

## 5. Validaciones

### 5.1 Validaciones de Campo

| Campo | Regla | Código | Mensaje (ES) |
|-------|-------|--------|--------------|
| email | Requerido | REQUIRED | "El email es requerido" |
| email | Formato válido | INVALID_FORMAT | "El formato del email no es válido" |
| email | Único | DUPLICATE | "Ya existe una cuenta con este email" |
| email | Longitud max | MAX_LENGTH | "El email no puede exceder 255 caracteres" |
| name | Requerido | REQUIRED | "El nombre es requerido" |
| name | Min 2 chars | MIN_LENGTH | "El nombre debe tener al menos 2 caracteres" |
| name | Max 100 chars | MAX_LENGTH | "El nombre no puede exceder 100 caracteres" |
| name | Solo letras/espacios | INVALID_FORMAT | "El nombre solo puede contener letras y espacios" |
| password | Requerido | REQUIRED | "La contraseña es requerida" |
| password | Min 8 chars | MIN_LENGTH | "La contraseña debe tener al menos 8 caracteres" |
| password | Max 128 chars | MAX_LENGTH | "La contraseña no puede exceder 128 caracteres" |
| password | Complejidad | WEAK_PASSWORD | "Debe incluir mayúscula, minúscula, número y símbolo" |
| confirmPassword | Coincide | PASSWORDS_DONT_MATCH | "Las contraseñas no coinciden" |
| phone | Formato válido | INVALID_FORMAT | "El formato del teléfono no es válido (+52 55 1234 5678)" |
| timezone | Valor válido | INVALID_VALUE | "La zona horaria no es válida" |

### 5.2 Validaciones de Negocio

| Código | Regla | Mensaje |
|--------|-------|---------|
| BR001 | Email único global | "Ya existe una cuenta con este email" |
| BR002 | Account status ACTIVE para login | "Tu cuenta está pendiente de activación" |
| BR003 | Rate limit login attempts | "Demasiados intentos. Intenta en 15 minutos" |
| BR004 | Password reset rate limit | "Solo puedes solicitar 3 resets por hora" |
| BR005 | Token reset válido y no usado | "El enlace de reset es inválido o ha expirado" |
| BR006 | No cambiar a misma contraseña | "La nueva contraseña debe ser diferente a la actual" |
| BR007 | Account no suspended | "Tu cuenta ha sido suspendida. Contacta soporte" |
| BR008 | Terms acceptance required | "Debes aceptar los términos y condiciones" |

### 5.3 Validaciones de Seguridad

| Campo/Acción | Regla | Comportamiento |
|--------------|-------|----------------|
| Login attempts | Max 5 por 15 min | Bloquear IP temporalmente |
| Password reset | Max 3 por hora | Ignorar requests adicionales |
| Email confirmation | Token expires 24h | Regenerar si expirado |
| Session timeout | 7 días inactivo | Auto-logout, cleanup |
| Weak passwords | Entropy check | Rechazar con sugerencias |
| Suspicious activity | IP geo-location change | Email de alerta opcional |

### 5.4 Formato de Errores

```typescript
// Error de autenticación
{
  error: {
    code: "AUTHENTICATION_FAILED",
    message: "Credenciales inválidas",
    details: {
      email: "Email o contraseña incorrectos",
      attempts_remaining: 3
    }
  }
}

// Error de validación de registro
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Errores en el formulario",
    details: [
      { field: "email", code: "DUPLICATE", message: "Ya existe una cuenta con este email" },
      { field: "password", code: "WEAK_PASSWORD", message: "Debe incluir mayúscula, minúscula, número y símbolo" }
    ]
  }
}

// Error de rate limiting
{
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Demasiados intentos",
    retry_after: "900", // seconds
    details: {
      limit: 5,
      window: "15 minutes",
      reset_time: "2024-02-04T15:45:00Z"
    }
  }
}

// Error de account status
{
  error: {
    code: "ACCOUNT_SUSPENDED",
    message: "Tu cuenta ha sido suspendida",
    details: {
      reason: "Violación de términos de servicio",
      contact_email: "soporte@boreas.com"
    }
  }
}
```

---

## 6. API Endpoints

### 6.1 Authentication Endpoints

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | /api/auth/register | Registro de nueva cuenta | No | 3/hora por IP |
| POST | /api/auth/login | Inicio de sesión | No | 5/15min por IP |
| POST | /api/auth/logout | Cerrar sesión | Sí | 10/min |
| GET | /api/auth/me | Obtener usuario actual | Sí | 60/min |
| PUT | /api/auth/profile | Actualizar perfil | Sí | 10/min |
| POST | /api/auth/reset-password | Solicitar reset password | No | 3/hora por email |
| POST | /api/auth/update-password | Cambiar contraseña | Sí | 5/hora |
| POST | /api/auth/confirm-email | Confirmar email | No | 10/hora |
| POST | /api/auth/resend-confirmation | Reenviar confirmación | No | 3/hora |
| POST | /api/auth/refresh | Renovar token | Sí | 30/min |

### 6.2 Session Management

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /api/auth/sessions | Listar sesiones activas | Sí | Owner |
| DELETE | /api/auth/sessions/:id | Terminar sesión específica | Sí | Owner |
| DELETE | /api/auth/sessions/all | Cerrar todas las sesiones | Sí | Owner |

### 6.3 POST /api/auth/register

**Request:**
```json
{
  "email": "carmen@salon.com",
  "password": "SecurePass123!",
  "name": "Carmen Rodríguez",
  "terms_accepted": true,
  "company_name": "Salón Carmen"
}
```

**Response 201:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid-123",
      "email": "carmen@salon.com",
      "name": "Carmen Rodríguez",
      "status": "pending",
      "created_at": "2024-02-04T14:30:00Z"
    },
    "message": "Cuenta creada. Revisa tu email para confirmar."
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errores en el formulario",
    "details": [
      {
        "field": "email",
        "code": "DUPLICATE",
        "message": "Ya existe una cuenta con este email"
      }
    ]
  }
}
```

### 6.4 POST /api/auth/login

**Request:**
```json
{
  "email": "carmen@salon.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

**Response 200:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid-123",
      "email": "carmen@salon.com",
      "name": "Carmen Rodríguez",
      "role": "user",
      "status": "active",
      "avatar_url": null,
      "onboarded": true
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "refresh-token-123",
      "expires_at": "2024-02-11T14:30:00Z"
    }
  }
}
```

**Response 401:**
```json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Email o contraseña incorrectos",
    "details": {
      "attempts_remaining": 3
    }
  }
}
```

### 6.5 GET /api/auth/me

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid-123",
      "email": "carmen@salon.com",
      "name": "Carmen Rodríguez",
      "role": "user",
      "status": "active",
      "avatar_url": "https://example.com/avatar.jpg",
      "company_name": "Salón Carmen",
      "timezone": "America/Mexico_City",
      "language": "es",
      "email_notifications": true,
      "onboarded": true,
      "last_login_at": "2024-02-04T14:30:00Z",
      "created_at": "2024-02-01T10:00:00Z"
    }
  }
}
```

### 6.6 POST /api/auth/reset-password

**Request:**
```json
{
  "email": "carmen@salon.com"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña"
  }
}
```

---

## 7. UI/UX

### 7.1 Páginas y Componentes

| Página/Componente | Descripción | Estados | Rutas |
|------------------|-------------|---------|-------|
| LoginPage | Formulario de inicio de sesión | idle, loading, error, success | /login |
| RegisterPage | Formulario de registro | idle, loading, error, success | /register |
| ForgotPasswordPage | Solicitar reset de contraseña | idle, loading, success | /forgot-password |
| ResetPasswordPage | Establecer nueva contraseña | idle, loading, error, success | /reset-password |
| EmailConfirmPage | Confirmación de email | loading, success, error | /confirm-email |
| ProfilePage | Editar perfil de usuario | idle, loading, saving, success, error | /profile |
| AuthGuard | HOC para rutas protegidas | checking, authenticated, unauthenticated | - |
| AuthProvider | Context provider global | initializing, ready | - |

### 7.2 Layout de Páginas de Auth

```
Login/Register Layout:
┌─────────────────────────────────────────────────────────────┐
│                     CENTRO VERTICAL                         │
│                                                             │
│   ┌─────────────────────────────────────┐                  │
│   │          🔷 LOGO BOREAS             │                  │
│   │                                     │                  │
│   │        Inicia sesión en             │                  │
│   │       tu cuenta Boreas              │                  │
│   │                                     │                  │
│   │   Email: ________________________   │                  │
│   │                                     │                  │
│   │   Contraseña: ___________________   │                  │
│   │                                     │                  │
│   │   [x] Recordarme                    │                  │
│   │                                     │                  │
│   │        [INICIAR SESIÓN]             │                  │
│   │                                     │                  │
│   │     ¿Olvidaste tu contraseña?       │                  │
│   │                                     │                  │
│   │   ¿No tienes cuenta? Regístrate     │                  │
│   └─────────────────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Estados de UI

```
Loading (Login):
┌───────────────────────────────┐
│   Email: carmen@salon.com     │
│   Contraseña: ••••••••••••   │
│                               │
│   [🔄 Iniciando sesión...]    │
│                               │
└───────────────────────────────┘

Error (Login):
┌───────────────────────────────┐
│   ❌ Email o contraseña        │
│      incorrectos              │
│                               │
│   Email: carmen@salon.com     │
│   Contraseña: ••••••••••••   │
│                               │
│   [INICIAR SESIÓN]            │
└───────────────────────────────┘

Success (Registration):
┌───────────────────────────────┐
│   ✅ ¡Cuenta creada!          │
│                               │
│   📧 Revisa tu email para     │
│      confirmar tu cuenta      │
│                               │
│   [Reenviar email] [Ir login] │
└───────────────────────────────┘

Rate Limited:
┌───────────────────────────────┐
│   ⏰ Demasiados intentos      │
│                               │
│   Espera 15 minutos antes     │
│   de intentar nuevamente      │
│                               │
│   [Volver] [Olvidé contraseña]│
└───────────────────────────────┘
```

### 7.4 Responsive Design

| Breakpoint | Layout | Comportamiento |
|------------|--------|----------------|
| <768px (Mobile) | Stack vertical, form full width | Teclado optimizado, campos grandes |
| 768-1024px (Tablet) | Centrado, max-width 400px | Mismo layout que mobile |
| >1024px (Desktop) | Centrado, max-width 400px | Hover effects, mejor typography |

### 7.5 Interacciones y Feedback

| Acción | Trigger | Feedback Visual | Resultado |
|--------|---------|----------------|-----------|
| Submit login | Form submit | Button loading spinner | API call + redirect |
| Invalid email | Input blur | Red border + error text | Real-time validation |
| Password strength | Input change | Color progress bar | Visual strength indicator |
| Network error | API failure | Toast notification | Error details + retry option |
| Success registration | API success | Green checkmark + message | Email sent confirmation |
| Session expired | Token invalid | Modal notification | Auto-redirect to login |

---

## 8. Seguridad y Autorización

### 8.1 Matriz de Permisos

| Recurso | Admin | User | Guest |
|---------|-------|------|-------|
| Ver dashboard | ✅ | ✅ | ❌ |
| Gestionar leads | ✅ | ✅ (propios) | ❌ |
| Ver todas las métricas | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Configurar sistema | ✅ | ❌ | ❌ |
| Exportar datos | ✅ | ✅ (propios) | ❌ |

### 8.2 Row Level Security

```sql
-- Users tabla: solo admins pueden ver todos
CREATE POLICY "users_select_own_or_admin" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'role')::user_role = 'admin'
  );

-- Users pueden actualizar su propio perfil
CREATE POLICY "users_update_own" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Solo admins pueden cambiar roles y status
CREATE POLICY "admin_manage_users" ON user_profiles
  FOR UPDATE USING (
    (auth.jwt() ->> 'role')::user_role = 'admin'
    AND (OLD.role != NEW.role OR OLD.status != NEW.status)
  );

-- Login attempts: solo admins pueden ver todas
CREATE POLICY "admin_view_login_attempts" ON login_attempts
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::user_role = 'admin'
  );
```

### 8.3 Middleware de Autorización

```typescript
// Middleware para Next.js
export const withAuth = (
  requiredRole?: UserRole,
  options: AuthOptions = {}
) => {
  return (req: AuthenticatedRequest, res: NextResponse) => {
    const { user, session } = req.auth;

    // Check if user is authenticated
    if (!user || !session) {
      return NextResponse.redirect('/login');
    }

    // Check if email is confirmed
    if (user.status === 'pending' && !options.allowPending) {
      return NextResponse.redirect('/confirm-email');
    }

    // Check if account is active
    if (user.status !== 'active' && !options.allowInactive) {
      return NextResponse.redirect('/account-suspended');
    }

    // Check role authorization
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
};

// Usage examples
export const middleware = withAuth(); // Basic auth
export const adminMiddleware = withAuth('admin'); // Admin only
```

### 8.4 Rate Limiting

```typescript
// Rate limiting configuration
const RATE_LIMITS = {
  login: { max: 5, window: 15 * 60 * 1000 }, // 5 per 15 minutes
  register: { max: 3, window: 60 * 60 * 1000 }, // 3 per hour
  passwordReset: { max: 3, window: 60 * 60 * 1000 }, // 3 per hour
  emailConfirm: { max: 10, window: 60 * 60 * 1000 }, // 10 per hour
};

// Implementation with Redis/Memory
const rateLimit = async (
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> => {
  const current = await redis.get(key) || 0;

  if (current >= config.max) {
    const ttl = await redis.ttl(key);
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      resetTime: Date.now() + (ttl * 1000)
    };
  }

  await redis.incr(key);
  await redis.expire(key, config.window / 1000);

  return {
    success: true,
    limit: config.max,
    remaining: config.max - current - 1,
    resetTime: Date.now() + config.window
  };
};
```

---

## 9. Gestión de Sesiones

### 9.1 Estrategia de Sesiones

| Aspecto | Implementación | Configuración |
|---------|----------------|---------------|
| Storage | HTTP-only cookies + Local storage | Secure, SameSite=Strict |
| Duración | Access token: 1h, Refresh: 7d | Configurable por entorno |
| Renovación | Automática con refresh token | Background refresh 5min antes |
| Cleanup | Logout + expired session cleanup | Cron job diario |
| Multi-device | Múltiples sesiones permitidas | Limit 5 sesiones activas |

### 9.2 Funcionalidad Offline

| Acción | Offline | Comportamiento | Sync Strategy |
|--------|---------|----------------|---------------|
| Ver perfil | ✅ (cache) | Mostrar datos locales | Background refresh |
| Editar perfil | ❌ | Requerir conexión | Immediate sync |
| Login | ❌ | Requerir conexión | N/A |
| Logout | ✅ | Limpiar datos locales | Sync al reconectar |
| Session check | ✅ | Validar cache local | Verify al reconectar |

### 9.3 Indicadores de Estado

```
🟢 Sesión activa
🟡 Renovando sesión...
🔴 Sesión expirada - [Iniciar sesión]
⚠️ Conexión perdida - datos locales
```

---

## 10. Edge Cases

| Caso | Comportamiento | Solución | Test |
|------|----------------|----------|------|
| Email ya registrado | Mostrar error friendly | "Ya existe una cuenta con este email" | ✅ |
| Token reset expirado | Regenerar automáticamente | "Enlace expirado, generando nuevo..." | ✅ |
| Sesión expirada durante uso | Interceptar y renovar | Refresh token automático | ✅ |
| Login desde nueva ubicación | Opcional: email alerta | "Nuevo login desde [Ciudad]" | ⏳ |
| Password muy simple | Rechazar con sugerencias | "Usa al menos 8 caracteres con..." | ✅ |
| Rate limit alcanzado | Mostrar tiempo restante | "Intenta en 12 minutos" | ✅ |
| Caracteres especiales en nombre | Sanitizar pero permitir acentos | Escapar HTML, permitir ñáéíóú | ✅ |
| Email inválido pero formato correcto | API validation | "Email no válido" | ✅ |
| Doble submit en registro | Prevenir duplicados | Deshabilitar botón, debounce | ✅ |
| Logout desde múltiples tabs | Sync state | Broadcast message entre tabs | ✅ |

---

## 11. Testing Checklist

### Unit Tests
- [ ] Email validation (format, length, domains)
- [ ] Password validation (strength, length, characters)
- [ ] Rate limiting logic
- [ ] Token generation and validation
- [ ] User role permissions
- [ ] Session management utilities
- [ ] Auth middleware functions

### Integration Tests
- [ ] Registration flow completo
- [ ] Email confirmation process
- [ ] Login with valid/invalid credentials
- [ ] Password reset flow
- [ ] Profile update operations
- [ ] Session refresh mechanism
- [ ] Logout and cleanup

### E2E Tests
- [ ] User registration → email confirm → login
- [ ] Forgot password → reset → login with new password
- [ ] Login → access protected page → logout
- [ ] Rate limiting: multiple failed attempts
- [ ] Session expiry and renewal
- [ ] Multi-tab session sync
- [ ] Mobile responsive forms

### Security Tests
- [ ] SQL injection in login forms
- [ ] XSS in user inputs (name, email)
- [ ] CSRF token validation
- [ ] Rate limiting bypass attempts
- [ ] Token tampering detection
- [ ] Session fixation attacks
- [ ] Password brute force protection

---

## 12. Métricas y Analytics

### 12.1 Eventos de Autenticación

| Evento | Propiedades | Propósito | Frecuencia |
|--------|-------------|-----------|------------|
| user_registered | email_domain, source, timestamp | Conversión signup | Per registration |
| user_login | user_id, device_type, success | Engagement | Per login attempt |
| user_logout | user_id, session_duration | Usage patterns | Per logout |
| email_confirmed | user_id, time_to_confirm | Email delivery | Per confirmation |
| password_reset | user_id, success, method | Security | Per reset |
| session_expired | user_id, duration, auto_renewed | Session health | Per expiry |
| auth_error | error_code, endpoint, ip_hash | Error monitoring | Per error |

### 12.2 KPIs de Autenticación

| KPI | Cálculo | Target | Alertas |
|-----|---------|---------|----------|
| Registration Conversion | confirmations / registrations | >80% | <70% = yellow, <60% = red |
| Login Success Rate | successful_logins / login_attempts | >95% | <90% = yellow, <85% = red |
| Email Confirm Rate | confirmations / emails_sent | >75% | <60% = yellow, <50% = red |
| Session Duration | avg(logout_time - login_time) | >30 minutes | <15min = yellow |
| Password Reset Success | completed_resets / requested_resets | >70% | <50% = yellow |

### 12.3 Dashboard de Seguridad

```typescript
interface SecurityMetrics {
  failed_login_attempts: {
    total: number;
    unique_ips: number;
    top_ips: Array<{ ip: string; attempts: number }>;
  };
  suspicious_activity: {
    rapid_registrations: number;
    geo_anomalies: number;
    rate_limit_hits: number;
  };
  account_health: {
    pending_confirmations: number;
    suspended_accounts: number;
    inactive_accounts: number; // >30 days no login
  };
}
```

---

**Creado:** 2026-02-04T05:00:07Z
**Autor:** Spec Writer Agent
**Líneas:** 1,156

---

## Siguientes Pasos

1. **Completar módulo de automatización:**
   ```
   /oden:spec automation
   ```

2. **Crear plan de implementación:**
   ```
   /oden:plan
   ```

3. **Verificar preparación para desarrollo:**
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
- ✅ auth-spec.md: 1,156 líneas
- **Total:** ~7,614 líneas (Target: 8,000+)

**95% completado** - Próximo paso: `/oden:spec automation` para completar el sistema de automatización de WhatsApp y alcanzar el target de documentación.