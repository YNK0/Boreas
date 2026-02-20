-- Script completo para arreglar creación de usuarios
-- Ejecutar TODO esto en Supabase Dashboard > SQL Editor

-- 1. LIMPIAR ESTADO ANTERIOR
-- Remover trigger problemático si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover función problemática si existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remover políticas que puedan estar mal configuradas
DROP POLICY IF EXISTS "users_read_own" ON public.users;
DROP POLICY IF EXISTS "service_role_read_all" ON public.users;

-- 2. RECREAR TABLA LIMPIA
-- Drop and recreate table to ensure clean state
DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONFIGURAR RLS CORRECTAMENTE
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios lean su propio registro
CREATE POLICY "Enable read access for own user" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Política para que service_role (servidor) lea todo
CREATE POLICY "Enable read access for service role" ON public.users
    FOR SELECT TO service_role USING (true);

-- Política para que usuarios puedan insertar su propio registro
CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para que usuarios puedan actualizar su propio registro
CREATE POLICY "Enable update for own user" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 4. CREAR FUNCIÓN TRIGGER SEGURA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Si falla, no romper la creación del usuario
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 5. CREAR TRIGGER ROBUSTO
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. VERIFICACIONES
SELECT 'Table created successfully' as status;

SELECT 'RLS enabled: ' || CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END as rls_status
FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public';

SELECT 'Policies created: ' || count(*)::text as policy_count
FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public';

SELECT 'Trigger created: ' || CASE WHEN count(*) > 0 THEN 'YES' ELSE 'NO' END as trigger_status
FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- 7. PREPARAR PARA CREAR ADMIN
-- Esta query te dirá exactamente qué hacer después de crear el usuario
SELECT 'Ready to create admin user. After creating user in Dashboard, run:' as next_step;
SELECT 'INSERT INTO public.users (id, role) SELECT id, ''admin'' FROM auth.users WHERE email = ''YOUR_ADMIN_EMAIL'';' as admin_query;