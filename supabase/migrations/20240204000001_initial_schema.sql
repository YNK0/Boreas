-- Migration: Initial Boreas Database Schema
-- Based on technical-decisions.md

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create custom types (enums)
CREATE TYPE user_role AS ENUM ('sales', 'admin', 'developer');

CREATE TYPE business_type AS ENUM (
  'salon', 'restaurant', 'clinic', 'dentist',
  'veterinary', 'spa', 'gym', 'retail', 'other'
);

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'demo_scheduled', 'demo_completed',
  'proposal_sent', 'won', 'lost', 'nurturing'
);

CREATE TYPE client_status AS ENUM (
  'active', 'paused', 'churned', 'at_risk'
);

CREATE TYPE plan_type AS ENUM (
  'basic', 'pro', 'enterprise', 'custom'
);

CREATE TYPE project_type AS ENUM (
  'whatsapp_booking', 'email_sequence', 'sms_reminders',
  'social_automation', 'review_automation', 'custom'
);

CREATE TYPE project_status AS ENUM (
  'setup', 'active', 'paused', 'completed', 'cancelled'
);

CREATE TYPE note_type AS ENUM (
  'note', 'call', 'email', 'meeting', 'demo', 'followup'
);

CREATE TYPE call_type AS ENUM (
  'demo', 'onboarding', 'support', 'check_in', 'sales'
);

CREATE TYPE call_outcome AS ENUM (
  'successful', 'needs_followup', 'escalated', 'no_show'
);

CREATE TYPE metric_type AS ENUM (
  'messages_sent', 'bookings_made', 'revenue_generated',
  'response_rate', 'conversion_rate', 'satisfaction_score'
);

CREATE TYPE period_type AS ENUM (
  'daily', 'weekly', 'monthly', 'quarterly'
);

CREATE TYPE email_status AS ENUM (
  'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
);

-- Create tables

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'sales',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    business_type business_type,
    message TEXT,
    status lead_status NOT NULL DEFAULT 'new',
    source VARCHAR(50) NOT NULL DEFAULT 'website',
    utm_source VARCHAR(50),
    utm_medium VARCHAR(50),
    utm_campaign VARCHAR(50),
    assigned_to UUID REFERENCES users(id),
    lead_score INTEGER NOT NULL DEFAULT 0,
    last_contact TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead notes table
CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    type note_type NOT NULL DEFAULT 'note',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    business_type business_type NOT NULL,
    status client_status NOT NULL DEFAULT 'active',
    plan_type plan_type NOT NULL DEFAULT 'basic',
    mrr DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    setup_fee DECIMAL(10,2),
    onboarded_at TIMESTAMPTZ,
    churned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type project_type NOT NULL,
    status project_status NOT NULL DEFAULT 'setup',
    config JSONB,
    monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    setup_fee DECIMAL(10,2),
    started_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client calls table
CREATE TABLE client_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    user_id UUID NOT NULL REFERENCES users(id),
    type call_type NOT NULL,
    duration INTEGER,
    notes TEXT,
    outcome call_outcome,
    scheduled_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client metrics table
CREATE TABLE client_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    project_id UUID REFERENCES projects(id),
    metric_type metric_type NOT NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    period period_type NOT NULL DEFAULT 'daily',
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email logs table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    client_id UUID REFERENCES clients(id),
    email VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    provider_id VARCHAR(100),
    status email_status NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Landing analytics table
CREATE TABLE landing_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(200) NOT NULL,
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(50),
    utm_medium VARCHAR(50),
    utm_campaign VARCHAR(50),
    form_submitted BOOLEAN NOT NULL DEFAULT false,
    time_on_page INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_status_created ON leads(status, created_at DESC);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_plan ON clients(plan_type);
CREATE INDEX idx_clients_business ON clients(business_type);

CREATE INDEX idx_lead_notes_lead ON lead_notes(lead_id);
CREATE INDEX idx_lead_notes_user ON lead_notes(user_id);
CREATE INDEX idx_lead_notes_created ON lead_notes(created_at DESC);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_client_calls_client ON client_calls(client_id);
CREATE INDEX idx_client_calls_user ON client_calls(user_id);
CREATE INDEX idx_client_calls_scheduled ON client_calls(scheduled_at);

CREATE INDEX idx_client_metrics_client ON client_metrics(client_id);
CREATE INDEX idx_client_metrics_project ON client_metrics(project_id);
CREATE INDEX idx_client_metrics_type ON client_metrics(metric_type);
CREATE INDEX idx_client_metrics_period ON client_metrics(recorded_at DESC);

CREATE INDEX idx_email_logs_lead ON email_logs(lead_id);
CREATE INDEX idx_email_logs_client ON email_logs(client_id);
CREATE INDEX idx_email_logs_email ON email_logs(email);
CREATE INDEX idx_email_logs_template ON email_logs(template_name);
CREATE INDEX idx_email_logs_sent ON email_logs(sent_at DESC);

CREATE INDEX idx_landing_analytics_session ON landing_analytics(session_id);
CREATE INDEX idx_landing_analytics_page ON landing_analytics(page_path);
CREATE INDEX idx_landing_analytics_utm_source ON landing_analytics(utm_source);
CREATE INDEX idx_landing_analytics_created ON landing_analytics(created_at DESC);

-- Unique constraints
CREATE UNIQUE INDEX idx_client_metrics_unique ON client_metrics(client_id, project_id, metric_type, recorded_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();