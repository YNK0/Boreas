-- Database Schema Verification Script
-- Run this in Supabase SQL Editor or via psql to verify deployment

-- 1. Check all tables exist
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'users', 'leads', 'lead_notes', 'clients', 'projects',
        'client_calls', 'client_metrics', 'email_logs', 'landing_analytics'
    )
ORDER BY table_name;

-- 2. Check custom types (enums) exist
SELECT
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type
JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid
WHERE typname IN (
    'user_role', 'business_type', 'lead_status', 'client_status',
    'plan_type', 'project_type', 'project_status', 'note_type',
    'call_type', 'call_outcome', 'metric_type', 'period_type', 'email_status'
)
GROUP BY typname
ORDER BY typname;

-- 3. Check indexes exist
SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 4. Check RLS is enabled on all tables
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    forcerowsecurity as rls_forced
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'users', 'leads', 'lead_notes', 'clients', 'projects',
        'client_calls', 'client_metrics', 'email_logs', 'landing_analytics'
    )
ORDER BY tablename;

-- 5. Check RLS policies exist
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Check triggers exist
SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
    AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- 7. Check foreign key constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 8. Check if seed data was loaded (for development)
SELECT
    'leads' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN source = 'testimonial' THEN 1 END) as testimonial_leads
FROM leads
UNION ALL
SELECT
    'clients' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients
FROM clients
UNION ALL
SELECT
    'projects' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects
FROM projects
UNION ALL
SELECT
    'landing_analytics' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN form_submitted = true THEN 1 END) as form_submissions
FROM landing_analytics;

-- 9. Test basic queries for performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM leads
WHERE status = 'new'
ORDER BY created_at DESC
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    c.name,
    c.company,
    COUNT(p.id) as project_count,
    SUM(p.monthly_fee) as total_mrr
FROM clients c
LEFT JOIN projects p ON p.client_id = c.id
WHERE c.status = 'active'
GROUP BY c.id, c.name, c.company;

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    DATE(created_at) as date,
    COUNT(*) as sessions,
    COUNT(CASE WHEN form_submitted = true THEN 1 END) as conversions
FROM landing_analytics
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 10. Check user profile trigger function
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('setup_user_profile', 'user_role', 'update_updated_at_column')
ORDER BY routine_name;