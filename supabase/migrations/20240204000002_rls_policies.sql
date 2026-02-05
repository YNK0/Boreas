-- Migration: Row Level Security Policies
-- Based on auth-spec.md and technical-decisions.md

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_analytics ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role from JWT
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS user_role AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() ->> 'user_role')::user_role,
    'sales'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "users_select_own_or_admin" ON users
  FOR SELECT USING (
    auth.uid() = id
    OR public.user_role() = 'admin'
  );

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Only admins can change roles and status through separate policy
CREATE POLICY "admin_manage_users" ON users
  FOR UPDATE USING (
    public.user_role() = 'admin'
  );

-- Leads policies
CREATE POLICY "leads_read_access" ON leads
  FOR SELECT USING (
    public.user_role() = 'admin'
    OR public.user_role() = 'sales'
    OR assigned_to = auth.uid()
  );

CREATE POLICY "leads_create_access" ON leads
  FOR INSERT WITH CHECK (
    public.user_role() IN ('admin', 'sales')
  );

CREATE POLICY "leads_update_assigned" ON leads
  FOR UPDATE USING (
    assigned_to = auth.uid()
    OR public.user_role() = 'admin'
  );

CREATE POLICY "leads_delete_admin" ON leads
  FOR DELETE USING (
    public.user_role() = 'admin'
  );

-- Lead notes policies
CREATE POLICY "lead_notes_read_access" ON lead_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND (
        leads.assigned_to = auth.uid()
        OR public.user_role() IN ('admin', 'sales')
      )
    )
  );

CREATE POLICY "lead_notes_create_access" ON lead_notes
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND (
        leads.assigned_to = auth.uid()
        OR public.user_role() IN ('admin', 'sales')
      )
    )
  );

CREATE POLICY "lead_notes_update_own" ON lead_notes
  FOR UPDATE USING (
    user_id = auth.uid()
    OR public.user_role() = 'admin'
  );

-- Clients policies
CREATE POLICY "clients_read_access" ON clients
  FOR SELECT USING (
    public.user_role() IN ('admin', 'sales', 'developer')
  );

CREATE POLICY "clients_write_access" ON clients
  FOR ALL USING (
    public.user_role() IN ('admin', 'sales')
  );

-- Projects policies
CREATE POLICY "projects_read_access" ON projects
  FOR SELECT USING (
    public.user_role() IN ('admin', 'sales', 'developer')
  );

CREATE POLICY "projects_write_access" ON projects
  FOR ALL USING (
    public.user_role() IN ('admin', 'sales')
  );

-- Client calls policies
CREATE POLICY "client_calls_read_access" ON client_calls
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.user_role() = 'admin'
  );

CREATE POLICY "client_calls_create_access" ON client_calls
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND public.user_role() IN ('admin', 'sales')
  );

CREATE POLICY "client_calls_update_own" ON client_calls
  FOR UPDATE USING (
    user_id = auth.uid()
    OR public.user_role() = 'admin'
  );

-- Client metrics policies
CREATE POLICY "client_metrics_read_access" ON client_metrics
  FOR SELECT USING (
    public.user_role() IN ('admin', 'sales', 'developer')
  );

CREATE POLICY "client_metrics_write_access" ON client_metrics
  FOR ALL USING (
    public.user_role() IN ('admin', 'developer')
  );

-- Email logs policies
CREATE POLICY "email_logs_read_access" ON email_logs
  FOR SELECT USING (
    public.user_role() = 'admin'
    OR (
      public.user_role() IN ('sales', 'developer')
      AND (
        lead_id IN (
          SELECT id FROM leads WHERE assigned_to = auth.uid()
        )
        OR client_id IN (
          SELECT id FROM clients  -- All team can see client emails
        )
      )
    )
  );

CREATE POLICY "email_logs_create_access" ON email_logs
  FOR INSERT WITH CHECK (
    public.user_role() IN ('admin', 'sales')
  );

-- Landing analytics policies (admin only for privacy)
CREATE POLICY "landing_analytics_admin_only" ON landing_analytics
  FOR ALL USING (
    public.user_role() = 'admin'
  );

-- Public access policy for landing analytics insertion (for anonymous users)
CREATE POLICY "landing_analytics_public_insert" ON landing_analytics
  FOR INSERT WITH CHECK (true);

-- Create admin user setup function
CREATE OR REPLACE FUNCTION public.setup_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.setup_user_profile();

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anonymous users (for landing page)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON landing_analytics TO anon;
GRANT INSERT ON leads TO anon;

-- Grant permissions for service role
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;