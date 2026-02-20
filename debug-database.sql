-- Diagnóstico completo de la base de datos
-- Ejecutar en Supabase Dashboard > SQL Editor

-- 1. Verificar que existe la tabla public.users
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. Verificar políticas RLS
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';

-- 4. Verificar trigger exists
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 5. Verificar función exists
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

-- 6. Verificar constraint foreign key
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'users'
    AND tc.table_schema = 'public';

-- 7. Verificar usuarios existentes en auth.users
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;