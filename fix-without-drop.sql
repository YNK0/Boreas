-- Arreglo SIN hacer drop de la tabla users
-- Mantiene todas las foreign keys intactas

-- 1. Asegurar que la tabla tenga las columnas correctas
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Asegurar que role no sea null
UPDATE public.users SET role = 'user' WHERE role IS NULL;
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'user';

-- 3. Limpiar y recrear políticas RLS (sin tocar la tabla)
DROP POLICY IF EXISTS "users_read_own" ON public.users;
DROP POLICY IF EXISTS "service_role_read_all" ON public.users;
DROP POLICY IF EXISTS "Enable read access for own user" ON public.users;
DROP POLICY IF EXISTS "Enable read access for service role" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;

-- 4. Crear políticas limpias
CREATE POLICY "users_can_read_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "service_role_can_read_all" ON public.users
    FOR SELECT TO service_role USING (true);

CREATE POLICY "users_can_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 5. Habilitar RLS si no está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. Recrear trigger function (más robusto)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, role, created_at)
  VALUES (NEW.id, 'user', NOW())
  ON CONFLICT (id) DO UPDATE SET
    role = COALESCE(public.users.role, 'user'),
    created_at = COALESCE(public.users.created_at, NOW());
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't break user creation
    RAISE LOG 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 7. Recrear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Verificaciones
SELECT 'Fix completed successfully' as status;
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;