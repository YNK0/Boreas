# 🛠️ Guía Completa de Integración Supabase

## 📋 **Resumen de Archivos Creados**

He creado varios scripts para facilitar la integración:

- ✅ `setup-supabase.bat` - Instalación CLI y aplicación de migración
- ✅ `create-admin-user.bat` - Creación del usuario admin
- ✅ `test-auth-system.sh` - Tests completos (Linux/Mac)
- ✅ `test-auth-simple.bat` - Tests básicos (Windows)
- ✅ `INTEGRATION-GUIDE.md` - Esta guía

## 🚀 **Ejecución Paso a Paso**

### **PASO 1: Preparación**

1. **Asegurar que el servidor esté parado:**
   ```bash
   # Si npm run dev está corriendo, detenerlo con Ctrl+C
   ```

2. **Verificar archivos necesarios:**
   ```bash
   # Verificar que la migración existe
   ls -la supabase/migrations/20260220_users_role.sql

   # Verificar variables de entorno
   cat .env.local | grep SUPABASE
   ```

### **PASO 2: Instalar y Configurar Supabase CLI**

**Opción A - Usando NPM (Recomendado):**
```bash
npm install -g @supabase/cli
```

**Opción B - Usando el script automatizado:**
```bash
./setup-supabase.bat
```

### **PASO 3: Configurar Supabase CLI**

1. **Login a Supabase:**
   ```bash
   supabase login
   ```
   - Te pedirá un access token
   - Ve a: https://supabase.com/dashboard/account/tokens
   - Crea un token y pégalo

2. **Inicializar proyecto (si es necesario):**
   ```bash
   supabase init
   ```

3. **Vincular con tu proyecto:**
   ```bash
   supabase link --project-ref ktqgoxxwlqlbctkvqepl
   ```
   - Usar el project ref de tu .env.local

### **PASO 4: Aplicar Migración**

```bash
# Aplicar la migración automáticamente
supabase db push
```

**Verificar que se aplicó correctamente:**
```bash
# Verificar mediante SQL
supabase db reset --linked
```

### **PASO 5: Crear Usuario Admin**

**Opción A - Dashboard Manual:**
1. Ve a https://supabase.com/dashboard
2. Authentication > Users > Add user
3. Email: `admin@boreas.mx`
4. Password: (tu elección)
5. Auto Confirm: ✅

**Opción B - Usar script:**
```bash
./create-admin-user.bat
```

### **PASO 6: Asignar Role Admin**

En Supabase Dashboard > SQL Editor:
```sql
-- Obtener UUID del admin
SELECT id FROM auth.users WHERE email = 'admin@boreas.mx';

-- Asignar role admin (reemplazar <UUID>)
INSERT INTO public.users (id, role)
VALUES ('<UUID>', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verificar
SELECT au.email, pu.role
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE pu.role = 'admin';
```

### **PASO 7: Iniciar Servidor y Probar**

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Ejecutar tests básicos:**
   ```bash
   # Windows
   test-auth-simple.bat

   # Linux/Mac
   chmod +x test-auth-system.sh
   ./test-auth-system.sh
   ```

## 🧪 **Tests de Verificación Manual**

### **Test 1: Middleware Security**
```bash
# Sin autenticación - debería redirigir
curl -v http://localhost:3000/admin/dashboard

# Resultado esperado: 302/307 redirect a /admin/login
```

### **Test 2: API Endpoints**
```bash
# Test admin endpoints sin auth
curl -v http://localhost:3000/api/admin/leads
curl -v http://localhost:3000/api/admin/stats

# Resultado esperado: 401 Unauthorized o 403 Forbidden
```

### **Test 3: Login Page**
```bash
# Login page accesible
curl -v http://localhost:3000/admin/login

# Resultado esperado: 200 OK
```

### **Test 4: Console Errors**
1. Abrir browser a http://localhost:3000
2. F12 > Console
3. Navegar por:
   - `/` (landing)
   - `/admin/login`
   - Login con admin
   - `/admin/dashboard`
4. **Resultado esperado: 0 errores en consola**

### **Test 5: Authentication Flow**
1. Ve a http://localhost:3000/admin/login
2. Login con `admin@boreas.mx` y tu password
3. **Resultado esperado: Redirect a dashboard**
4. Intenta acceder a http://localhost:3000/admin/dashboard sin sesión
5. **Resultado esperado: Redirect a login**

## 📊 **Estados de Respuesta Esperados**

| Endpoint | Sin Auth | Con Auth User | Con Auth Admin |
|----------|----------|---------------|----------------|
| `/` | 200 | 200 | 200 |
| `/admin/login` | 200 | 302→dashboard | 302→dashboard |
| `/admin/dashboard` | 302→login | 403 | 200 |
| `/api/admin/leads` | 401 | 403 | 200 |
| `/api/admin/stats` | 401 | 403 | 200 |

## 🐛 **Troubleshooting**

### **Error: Command not found: supabase**
```bash
npm install -g @supabase/cli
# O reiniciar terminal después de instalación
```

### **Error: Failed to connect to project**
- Verificar project ref en comando link
- Verificar access token
- Verificar internet connection

### **Error: 503 Service Unavailable**
- Verificar que la migración se aplicó
- Verificar variables de entorno
- Verificar que Supabase project esté activo

### **Error: 500 Internal Server Error**
- Revisar logs del servidor Next.js
- Verificar variables de entorno
- Verificar que no hay errores de sintaxis

### **Error: Login fails with correct credentials**
- Verificar que el user fue creado en auth.users
- Verificar que tiene role='admin' en public.users
- Revisar console logs del navegador

## ✅ **Checklist de Validación Final**

- [ ] Supabase CLI instalado y configurado
- [ ] Migración aplicada correctamente
- [ ] Usuario admin creado en auth.users
- [ ] Role admin asignado en public.users
- [ ] Servidor Next.js corriendo sin errores
- [ ] Tests de curl pasan correctamente
- [ ] Login funciona end-to-end
- [ ] Dashboard accesible con admin
- [ ] API endpoints responden correctamente
- [ ] Console del navegador limpia (0 errores)

## 🎯 **Resultado Final Esperado**

Al completar estos pasos tendrás:

✅ **Sistema de autenticación completamente funcional**
✅ **Admin user operativo**
✅ **Middleware de seguridad activo**
✅ **APIs protegidas correctamente**
✅ **Zero errores en consola**
✅ **Tests automatizados disponibles**

¡Tu sistema está listo para producción! 🚀