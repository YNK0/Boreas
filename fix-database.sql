-- Fix for Supabase database setup
-- Compatible with PostgreSQL without IF NOT EXISTS for policies

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "users_read_own" ON public.users;
DROP POLICY IF EXISTS "service_role_read_all" ON public.users;

-- Create policies (without IF NOT EXISTS)
CREATE POLICY "users_read_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "service_role_read_all"
  ON public.users
  FOR SELECT
  TO service_role
  USING (true);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify setup
SELECT 'Table created' as status, table_name
FROM information_schema.tables
WHERE table_name = 'users' AND table_schema = 'public';

SELECT 'Policies created' as status, count(*) as policy_count
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';