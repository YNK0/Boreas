-- Ejecutar DESPUÉS de crear usuario en Dashboard
-- Reemplazar 'admin@boreas.mx' con el email que usaste

-- 1. Verificar que el usuario fue creado
SELECT id, email, created_at
FROM auth.users
WHERE email = 'admin@boreas.mx';

-- 2. Asignar role admin (el trigger ya debería haber creado el registro)
UPDATE public.users
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'admin@boreas.mx'
);

-- 3. Verificar que funcionó
SELECT au.email, pu.role, pu.name, pu.created_at
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE pu.role = 'admin';