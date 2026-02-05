// Database types based on technical-decisions.md

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      clients: {
        Row: Client
        Insert: ClientInsert
        Update: ClientUpdate
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
      lead_notes: {
        Row: LeadNote
        Insert: LeadNoteInsert
        Update: LeadNoteUpdate
      }
      client_calls: {
        Row: ClientCall
        Insert: ClientCallInsert
        Update: ClientCallUpdate
      }
      client_metrics: {
        Row: ClientMetric
        Insert: ClientMetricInsert
        Update: ClientMetricUpdate
      }
      email_logs: {
        Row: EmailLog
        Insert: EmailLogInsert
        Update: EmailLogUpdate
      }
      landing_analytics: {
        Row: LandingAnalytic
        Insert: LandingAnalyticInsert
        Update: LandingAnalyticUpdate
      }
    }
    Enums: {
      user_role: 'sales' | 'admin' | 'developer'
      business_type: 'salon' | 'restaurant' | 'clinic' | 'dentist' | 'veterinary' | 'spa' | 'gym' | 'retail' | 'other'
      lead_status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_completed' | 'proposal_sent' | 'won' | 'lost' | 'nurturing'
      client_status: 'active' | 'paused' | 'churned' | 'at_risk'
      plan_type: 'basic' | 'pro' | 'enterprise' | 'custom'
      project_type: 'whatsapp_booking' | 'email_sequence' | 'sms_reminders' | 'social_automation' | 'review_automation' | 'custom'
      project_status: 'setup' | 'active' | 'paused' | 'completed' | 'cancelled'
      note_type: 'note' | 'call' | 'email' | 'meeting' | 'demo' | 'followup'
      call_type: 'demo' | 'onboarding' | 'support' | 'check_in' | 'sales'
      call_outcome: 'successful' | 'needs_followup' | 'escalated' | 'no_show'
      metric_type: 'messages_sent' | 'bookings_made' | 'revenue_generated' | 'response_rate' | 'conversion_rate' | 'satisfaction_score'
      period_type: 'daily' | 'weekly' | 'monthly' | 'quarterly'
      email_status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
    }
  }
}

// Entity interfaces
export interface User {
  id: string
  email: string
  name: string
  role: Database['public']['Enums']['user_role']
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  business_type?: Database['public']['Enums']['business_type']
  message?: string
  status: Database['public']['Enums']['lead_status']
  source: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  assigned_to?: string
  lead_score: number
  last_contact?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  lead_id?: string
  name: string
  email: string
  company: string
  phone: string
  business_type: Database['public']['Enums']['business_type']
  status: Database['public']['Enums']['client_status']
  plan_type: Database['public']['Enums']['plan_type']
  mrr: number
  setup_fee?: number
  onboarded_at?: string
  churned_at?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  type: Database['public']['Enums']['project_type']
  status: Database['public']['Enums']['project_status']
  config?: Record<string, any>
  monthly_fee: number
  setup_fee?: number
  started_at?: string
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: string
  lead_id: string
  user_id: string
  content: string
  type: Database['public']['Enums']['note_type']
  created_at: string
}

export interface ClientCall {
  id: string
  client_id: string
  user_id: string
  type: Database['public']['Enums']['call_type']
  duration?: number
  notes?: string
  outcome?: Database['public']['Enums']['call_outcome']
  scheduled_at: string
  completed_at?: string
  created_at: string
}

export interface ClientMetric {
  id: string
  client_id: string
  project_id?: string
  metric_type: Database['public']['Enums']['metric_type']
  value: number
  period: Database['public']['Enums']['period_type']
  recorded_at: string
  created_at: string
}

export interface EmailLog {
  id: string
  lead_id?: string
  client_id?: string
  email: string
  template_name: string
  subject: string
  provider_id?: string
  status: Database['public']['Enums']['email_status']
  sent_at: string
  opened_at?: string
  clicked_at?: string
  created_at: string
}

export interface LandingAnalytic {
  id: string
  session_id: string
  page_path: string
  visitor_ip?: string
  user_agent?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  form_submitted: boolean
  time_on_page?: number
  created_at: string
}

// Insert types (for creating new records)
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>
export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>
export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type LeadNoteInsert = Omit<LeadNote, 'id' | 'created_at'>
export type ClientCallInsert = Omit<ClientCall, 'id' | 'created_at'>
export type ClientMetricInsert = Omit<ClientMetric, 'id' | 'created_at'>
export type EmailLogInsert = Omit<EmailLog, 'id' | 'created_at'>
export type LandingAnalyticInsert = Omit<LandingAnalytic, 'id' | 'created_at'>

// Update types (for updating existing records)
export type UserUpdate = Partial<UserInsert>
export type LeadUpdate = Partial<LeadInsert>
export type ClientUpdate = Partial<ClientInsert>
export type ProjectUpdate = Partial<ProjectInsert>
export type LeadNoteUpdate = Partial<LeadNoteInsert>
export type ClientCallUpdate = Partial<ClientCallInsert>
export type ClientMetricUpdate = Partial<ClientMetricInsert>
export type EmailLogUpdate = Partial<EmailLogInsert>
export type LandingAnalyticUpdate = Partial<LandingAnalyticInsert>

// Extended types with relations
export interface LeadWithNotes extends Lead {
  notes: LeadNote[]
  assigned_user?: User
}

export interface ClientWithProjects extends Client {
  projects: Project[]
  total_mrr: number
  last_call?: ClientCall
}