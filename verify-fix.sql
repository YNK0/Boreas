-- Verificación después del arreglo
-- Ejecutar DESPUÉS de aplicar fix-user-creation.sql

-- 1. Estado de la tabla
SELECT
    'public.users table' as component,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'users' AND table_schema = 'public'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 2. Estado RLS
SELECT
    'RLS policies' as component,
    count(*)::text || ' policies created' as status
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. Estado trigger
SELECT
    'Trigger function' as component,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.triggers
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 4. Estructura de tabla
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Test básico de inserción (simulación)
SELECT
    'Insert simulation' as test,
    'Ready to test user creation' as status;

-- Ahora puedes intentar crear usuario en Dashboard otra vez