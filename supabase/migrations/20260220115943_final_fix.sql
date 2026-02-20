-- Arreglo FINAL: Limpiar TODO y configurar correctamente

-- 1. Eliminar TODAS las políticas existentes (buscar todas)
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Get all policy names for users table and drop them
    FOR policy_name IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_name) || ' ON public.users';
    END LOOP;
END $$;

-- 2. Configurar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas con nombres únicos
CREATE POLICY "auth_users_select_own_20260220" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "service_role_select_users_20260220" ON public.users
    FOR SELECT TO service_role USING (true);

CREATE POLICY "auth_users_insert_own_20260220" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "auth_users_update_own_20260220" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Función trigger robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Try to insert new user with required fields
  INSERT INTO public.users (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'New User'),
    'sales'::user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't break user creation in auth.users
    RAISE LOG 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 5. Recrear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar setup
SELECT 'Migration completed successfully' as status, NOW() as timestamp;