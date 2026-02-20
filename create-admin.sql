-- SQL para crear usuario admin
-- Ejecutar esto en Supabase Dashboard > SQL Editor

-- Primero, verificar si existe algún admin
SELECT au.email, pu.role, pu.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.role = 'admin' OR au.email LIKE '%admin%'
ORDER BY au.created_at DESC;

-- Si no existe admin, necesitas crear uno manualmente en Dashboard:
-- 1. Ve a Authentication > Users > Add user
-- 2. Email: admin@boreas.mx
-- 3. Password: (tu elección)
-- 4. Auto Confirm: ✅

-- Después ejecuta esto para asignar role admin:
-- REEMPLAZA <ADMIN_EMAIL> con el email que usaste
-- INSERT INTO public.users (id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = '<ADMIN_EMAIL>'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verificar que funcionó:
-- SELECT au.email, pu.role, pu.created_at
-- FROM auth.users au
-- JOIN public.users pu ON au.id = pu.id
-- WHERE pu.role = 'admin';