# Convenciones de Código - Boreas

Guía de convenciones para mantener el código consistente y prevenir errores.

## 🎯 Convenciones de Imports

### Alias de Paths
```typescript
// ✅ Correcto - Usar alias @/
import { useAuth } from '@/store/auth-store'
import Button from '@/components/ui/button'

// ❌ Incorrecto - Paths relativos largos
import { useAuth } from '../../../store/auth-store'
import Button from '../../components/ui/button'
```

### Stores
```typescript
// ✅ Correcto - Terminar en '-store'
import { useAuthStore } from '@/store/auth-store'
import { useCartStore } from '@/store/cart-store'

// ❌ Incorrecto - Sin '-store'
import { useAuth } from '@/store/auth'
import { useCart } from '@/store/cart'
```

### Componentes
```typescript
// ✅ Correcto - PascalCase para componentes
import WelcomeBanner from '@/components/onboarding/welcome-banner'
import DashboardTour from '@/components/onboarding/dashboard-tour'

// ❌ Incorrecto - camelCase
import welcomeBanner from '@/components/onboarding/welcomeBanner'
```

### Componentes UI
```typescript
// ✅ Correcto - kebab-case para archivos UI
import ComingSoon from '@/components/ui/coming-soon'
import DashboardCta from '@/components/ui/dashboard-cta'

// ❌ Incorrecto - camelCase o PascalCase en archivos
import ComingSoon from '@/components/ui/ComingSoon'
import DashboardCta from '@/components/ui/dashboardCta'
```

## 📁 Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Componentes reutilizables (kebab-case)
│   ├── common/            # Componentes comunes (header, footer)
│   ├── auth/              # Componentes específicos de auth
│   └── [feature]/         # Componentes específicos por feature
├── store/                 # Zustand stores (terminar en -store.ts)
├── lib/                   # Utilidades y configuración
├── hooks/                 # Custom hooks (usar use-nombre.ts)
├── types/                 # TypeScript type definitions
└── utils/                 # Funciones utilitarias
```

## 🔧 Naming Conventions

### Archivos
- **Componentes**: `PascalCase.tsx` → `WelcomeBanner.tsx`
- **Stores**: `kebab-case-store.ts` → `auth-store.ts`
- **Hooks**: `use-kebab-case.ts` → `use-analytics.ts`
- **Utils**: `kebab-case.ts` → `format-date.ts`
- **Types**: `kebab-case.ts` → `database-types.ts`

### Variables y Funciones
```typescript
// ✅ Correcto - camelCase
const userEmail = 'user@example.com'
const handleSubmit = () => {}
const isAuthenticated = true

// ❌ Incorrecto - snake_case o PascalCase
const user_email = 'user@example.com'
const HandleSubmit = () => {}
const IsAuthenticated = true
```

### Constantes
```typescript
// ✅ Correcto - SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.boreas.mx'
const MAX_RETRY_ATTEMPTS = 3

// ❌ Incorrecto - camelCase
const apiBaseUrl = 'https://api.boreas.mx'
const maxRetryAttempts = 3
```

## 🛡️ Validaciones Automáticas

### Scripts Disponibles
```bash
# Verificar todos los imports
npm run check-imports

# Verificar TypeScript
npm run type-check

# Lint del código
npm run lint

# Ejecutar todas las validaciones
npm run check-all

# Pre-commit check (automático)
npm run pre-commit
```

### Qué valida el sistema:

1. **Imports válidos**: Todos los paths existen
2. **Convenciones de nombres**: Stores, componentes, etc.
3. **TypeScript**: Sin errores de tipado
4. **Build**: Next.js puede compilar
5. **Código limpio**: No console.log en producción

## 🚫 Errores Comunes a Evitar

### Import Path Incorrecto
```typescript
// ❌ Error común
import { useAuthStore } from '@/store/auth'  // archivo: auth-store.ts

// ✅ Solución
import { useAuthStore } from '@/store/auth-store'
```

### Extensiones de Archivos
```typescript
// ❌ No incluir extensiones en imports
import Button from '@/components/ui/button.tsx'

// ✅ Omitir extensiones
import Button from '@/components/ui/button'
```

### Imports Circulares
```typescript
// ❌ Evitar imports circulares
// auth-store.ts imports user-utils.ts
// user-utils.ts imports auth-store.ts

// ✅ Crear archivo compartido o reestructurar
```

## 🔍 Pre-commit Hooks

El sistema automáticamente valida antes de cada commit:

1. ✅ **TypeScript compila sin errores**
2. ✅ **Todos los imports son válidos**
3. ⚠️ **No hay console.log (warning)**
4. ✅ **Next.js puede hacer build**
5. ⚠️ **No hay archivos muy grandes (warning)**

### Si el commit es bloqueado:
1. Revisa los errores mostrados
2. Corrige imports incorrectos
3. Soluciona errores de TypeScript
4. Ejecuta `npm run check-all`
5. Intenta el commit nuevamente

## 📝 Ejemplos Prácticos

### Crear un nuevo Store
```bash
# 1. Crear archivo
touch src/store/settings-store.ts

# 2. Usar convención correcta
import { useSettingsStore } from '@/store/settings-store'
```

### Crear un componente UI
```bash
# 1. Crear archivo
touch src/components/ui/loading-spinner.tsx

# 2. Import correcto
import LoadingSpinner from '@/components/ui/loading-spinner'
```

### Crear un hook personalizado
```bash
# 1. Crear archivo
touch src/hooks/use-local-storage.ts

# 2. Import correcto
import { useLocalStorage } from '@/hooks/use-local-storage'
```

## 🚀 Flujo de Desarrollo Recomendado

1. **Antes de empezar**: `npm run check-all`
2. **Durante desarrollo**: Usar imports con alias `@/`
3. **Antes de commit**: Se ejecuta validación automática
4. **Si hay errores**: Corregir y repetir

## 🆘 Solución de Problemas

### Import no encontrado
```bash
# Verificar que el archivo existe
ls src/store/auth-store.ts

# Si no existe, crearlo o corregir el path
```

### Error de TypeScript
```bash
# Ver errores detallados
npm run type-check

# Corregir tipos y volver a verificar
```

### Build falla
```bash
# Ver errores de build
npm run build

# Corregir y verificar de nuevo
```

---

**Recuerda**: Estas convenciones existen para prevenir errores como el que corregimos anteriormente. Siguiendo estas reglas, el código será más mantenible y menos propenso a errores.