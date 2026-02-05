-- Migration: Seed Data for Development
-- Basic data for testing and development

-- Insert test content for landing page (testimonials, case studies, etc.)

-- Test admin user (will be created when someone signs up with this email)
-- Admin user will be created through the auth.users trigger

-- Sample use cases data (this would normally be in a CMS)
-- For now we'll create some static data that the landing page can reference

-- Sample testimonials data (in a real app, this might be a separate table)
INSERT INTO leads (name, email, company, business_type, status, source, lead_score, created_at) VALUES
('Carmen Rodríguez', 'carmen@saloncarmen.mx', 'Salón Carmen', 'salon', 'won', 'testimonial', 95, NOW() - INTERVAL '3 months'),
('Miguel Hernández', 'miguel@restaurantemiguel.mx', 'Restaurante Miguel', 'restaurant', 'won', 'testimonial', 90, NOW() - INTERVAL '2 months'),
('Dr. Patricia López', 'patricia@clinicalopez.mx', 'Clínica López', 'clinic', 'won', 'testimonial', 85, NOW() - INTERVAL '1 month');

-- Convert them to clients for testimonial purposes
INSERT INTO clients (lead_id, name, email, company, phone, business_type, status, plan_type, mrr, onboarded_at, created_at)
SELECT
    l.id,
    l.name,
    l.email,
    l.company,
    CASE
        WHEN l.company = 'Salón Carmen' THEN '+52 555 123 4567'
        WHEN l.company = 'Restaurante Miguel' THEN '+52 555 234 5678'
        ELSE '+52 555 345 6789'
    END as phone,
    l.business_type,
    'active'::client_status,
    'pro'::plan_type,
    CASE
        WHEN l.company = 'Salón Carmen' THEN 150.00
        WHEN l.company = 'Restaurante Miguel' THEN 200.00
        ELSE 180.00
    END as mrr,
    NOW() - INTERVAL '2 months',
    l.created_at
FROM leads l
WHERE l.status = 'won' AND l.source = 'testimonial';

-- Add some sample projects for the testimonial clients
INSERT INTO projects (client_id, name, type, status, monthly_fee, started_at, created_at)
SELECT
    c.id,
    CASE
        WHEN c.company = 'Salón Carmen' THEN 'Automatización Citas WhatsApp'
        WHEN c.company = 'Restaurante Miguel' THEN 'Reservas Automáticas'
        ELSE 'Agendamiento Médico'
    END as name,
    CASE
        WHEN c.company = 'Salón Carmen' THEN 'whatsapp_booking'::project_type
        WHEN c.company = 'Restaurante Miguel' THEN 'whatsapp_booking'::project_type
        ELSE 'whatsapp_booking'::project_type
    END as type,
    'active'::project_status,
    c.mrr,
    c.onboarded_at,
    c.created_at
FROM clients c
WHERE c.status = 'active';

-- Add some sample metrics for success stories
INSERT INTO client_metrics (client_id, project_id, metric_type, value, period, recorded_at, created_at)
SELECT
    c.id,
    p.id,
    'bookings_made'::metric_type,
    CASE
        WHEN c.company = 'Salón Carmen' THEN 28.00 -- 28 bookings per week (40% increase)
        WHEN c.company = 'Restaurante Miguel' THEN 45.00 -- 45 reservations per week
        ELSE 35.00 -- 35 appointments per week
    END as value,
    'weekly'::period_type,
    CURRENT_DATE - INTERVAL '1 week',
    NOW()
FROM clients c
JOIN projects p ON p.client_id = c.id
WHERE c.status = 'active';

-- Add conversion rate metrics
INSERT INTO client_metrics (client_id, project_id, metric_type, value, period, recorded_at, created_at)
SELECT
    c.id,
    p.id,
    'conversion_rate'::metric_type,
    CASE
        WHEN c.company = 'Salón Carmen' THEN 85.00 -- 85% conversion rate
        WHEN c.company = 'Restaurante Miguel' THEN 78.00 -- 78% conversion rate
        ELSE 82.00 -- 82% conversion rate
    END as value,
    'monthly'::period_type,
    CURRENT_DATE - INTERVAL '1 week',
    NOW()
FROM clients c
JOIN projects p ON p.client_id = c.id
WHERE c.status = 'active';

-- Some sample leads in different stages for dashboard testing
INSERT INTO leads (name, email, company, business_type, status, source, utm_source, utm_medium, utm_campaign, lead_score, created_at) VALUES
('Ana García', 'ana@nailsana.mx', 'Nails Ana', 'salon', 'new', 'website', 'google', 'organic', NULL, 75, NOW() - INTERVAL '2 days'),
('Roberto Silva', 'roberto@pizzaroberto.mx', 'Pizza Roberto', 'restaurant', 'contacted', 'website', 'facebook', 'social', 'opening-promo', 65, NOW() - INTERVAL '1 week'),
('Dra. María Jiménez', 'maria@dentaljimenez.mx', 'Dental Jiménez', 'dentist', 'demo_scheduled', 'website', 'google-ads', 'cpc', 'dental-automation', 85, NOW() - INTERVAL '3 days'),
('Carlos Mendoza', 'carlos@gymmendoza.mx', 'Gym Mendoza', 'gym', 'proposal_sent', 'referral', NULL, NULL, NULL, 70, NOW() - INTERVAL '5 days');

-- Add some notes to the leads
-- We'll need to insert users first when someone actually signs up

-- Landing analytics sample data for the last 30 days
INSERT INTO landing_analytics (session_id, page_path, utm_source, utm_medium, utm_campaign, form_submitted, time_on_page, created_at)
SELECT
    'session_' || generate_random_uuid(),
    '/',
    CASE (random() * 4)::int
        WHEN 0 THEN 'google'
        WHEN 1 THEN 'facebook'
        WHEN 2 THEN 'direct'
        ELSE 'google-ads'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'organic'
        WHEN 1 THEN 'social'
        ELSE 'cpc'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'brand-awareness'
        WHEN 1 THEN 'lead-gen'
        ELSE NULL
    END,
    random() < 0.03, -- 3% form submission rate
    (random() * 300 + 30)::int, -- 30-330 seconds on page
    NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 1000); -- 1000 sample sessions