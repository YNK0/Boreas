# Supabase Database Deployment Checklist

Use this checklist to verify that your Supabase database is properly deployed and ready for production use.

## Prerequisites ✅

- [ ] Supabase account created
- [ ] New Supabase project created
- [ ] Project credentials copied (URL, Anon Key, Service Role Key)
- [ ] `.env` file updated with actual credentials
- [ ] Supabase CLI available (`npx supabase --version` works)

## Database Schema Deployment ✅

### Core Tables
- [ ] `users` table created (extends auth.users)
- [ ] `leads` table created (sales prospects)
- [ ] `lead_notes` table created (notes on leads)
- [ ] `clients` table created (paying customers)
- [ ] `projects` table created (client automation projects)
- [ ] `client_calls` table created (call tracking)
- [ ] `client_metrics` table created (performance data)
- [ ] `email_logs` table created (email tracking)
- [ ] `landing_analytics` table created (website analytics)

### Custom Types (Enums)
- [ ] `user_role` enum (sales, admin, developer)
- [ ] `business_type` enum (salon, restaurant, clinic, etc.)
- [ ] `lead_status` enum (new, contacted, won, lost, etc.)
- [ ] `client_status` enum (active, paused, churned, at_risk)
- [ ] `plan_type` enum (basic, pro, enterprise, custom)
- [ ] `project_type` enum (whatsapp_booking, email_sequence, etc.)
- [ ] `project_status` enum (setup, active, paused, completed, cancelled)
- [ ] Additional enums for notes, calls, metrics, emails

### Database Indexes
- [ ] Lead indexes (email, status, assigned_to, source, created_at)
- [ ] Client indexes (email, status, plan_type, business_type)
- [ ] Performance indexes for notes, projects, calls, metrics
- [ ] Analytics indexes for session tracking

### Triggers and Functions
- [ ] `update_updated_at_column()` function created
- [ ] Updated_at triggers on users, leads, clients, projects
- [ ] `setup_user_profile()` function for user creation
- [ ] `user_role()` helper function for RLS

## Row Level Security (RLS) ✅

### RLS Enabled
- [ ] RLS enabled on all tables
- [ ] No table accessible without proper policies

### User Management Policies
- [ ] Users can read their own profile or admin can read all
- [ ] Users can update their own profile
- [ ] Only admins can manage user roles

### Lead Management Policies
- [ ] Sales and admin can read all leads
- [ ] Users can read leads assigned to them
- [ ] Sales and admin can create leads
- [ ] Users can update assigned leads, admins can update all
- [ ] Only admins can delete leads

### Client Data Policies
- [ ] All team members can read client data
- [ ] Sales and admin can modify client data
- [ ] Proper access control for client calls and metrics

### Public Access Policies
- [ ] Anonymous users can insert to `leads` (contact form)
- [ ] Anonymous users can insert to `landing_analytics` (tracking)
- [ ] No unauthorized access to sensitive data

## Database Connection Testing ✅

### From Next.js Application
- [ ] App can connect to Supabase
- [ ] Contact form creates leads successfully
- [ ] User registration creates user profiles
- [ ] Analytics tracking works
- [ ] Authentication flow works

### Manual Testing
- [ ] Can query leads table
- [ ] Can create/update/delete records with proper permissions
- [ ] RLS blocks unauthorized access
- [ ] Foreign key constraints work properly

## Performance Verification ✅

### Query Performance
- [ ] Lead queries use proper indexes
- [ ] Client metrics queries are optimized
- [ ] Analytics aggregation queries perform well
- [ ] No full table scans on large tables

### Load Testing (Optional)
- [ ] Test with 1000+ leads
- [ ] Test concurrent form submissions
- [ ] Test analytics data insertion volume
- [ ] Monitor query execution times

## Seed Data (Development Only) ✅

### Testimonial Data
- [ ] 3 testimonial clients created (Carmen, Miguel, Patricia)
- [ ] Clients have associated projects
- [ ] Projects have sample metrics
- [ ] Realistic conversion and booking data

### Sample Leads
- [ ] Leads in various stages (new, contacted, demo_scheduled, etc.)
- [ ] Different business types represented
- [ ] UTM tracking data included

### Analytics Data
- [ ] 1000 sample landing page sessions
- [ ] Realistic traffic sources (Google, Facebook, direct)
- [ ] Form submission conversion data
- [ ] Time on page variations

## Security Configuration ✅

### Access Controls
- [ ] Service role key secured (server-side only)
- [ ] Anon key properly limited (client-side safe)
- [ ] No sensitive data in public policies

### Role-Based Access
- [ ] Sales users: Can manage assigned leads
- [ ] Admin users: Full access to all data
- [ ] Developer users: Read access to client metrics
- [ ] Anonymous users: Limited to contact form and analytics

### Data Privacy
- [ ] User data isolated by assignments
- [ ] Client data accessible only to team members
- [ ] Analytics data anonymized appropriately

## Backup and Monitoring ✅

### Backup Configuration
- [ ] Automatic backups enabled in Supabase
- [ ] Backup retention policy configured
- [ ] Point-in-time recovery available

### Monitoring Setup
- [ ] Database usage monitoring enabled
- [ ] Query performance monitoring active
- [ ] Alert thresholds configured for:
  - [ ] Connection limits
  - [ ] Query timeouts
  - [ ] Storage usage
  - [ ] API rate limits

## Production Readiness ✅

### Environment Configuration
- [ ] Production environment variables set
- [ ] All placeholder values replaced
- [ ] Secrets properly secured
- [ ] Rate limiting configured

### Deployment Verification
- [ ] All migrations applied successfully
- [ ] No development-only data in production
- [ ] Schema matches expected structure
- [ ] Application connects successfully

### Documentation
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

## Post-Deployment Testing ✅

### Critical User Flows
- [ ] Contact form submission → Lead creation → Email notification
- [ ] User registration → Profile creation → Dashboard access
- [ ] Lead management → Status updates → Notes tracking
- [ ] Client onboarding → Project setup → Metrics tracking

### Error Handling
- [ ] Invalid data handled gracefully
- [ ] Permission errors return proper messages
- [ ] Connection issues handled appropriately
- [ ] Rate limiting works correctly

### Performance Monitoring
- [ ] Monitor query performance in production
- [ ] Track API response times
- [ ] Monitor database connection pool
- [ ] Set up alerting for issues

## Troubleshooting Checklist ❓

If something isn't working:

1. **Connection Issues**
   - [ ] Check environment variables are correct
   - [ ] Verify Supabase project is active
   - [ ] Test with Supabase Studio SQL Editor

2. **Permission Errors**
   - [ ] Verify RLS policies are correct
   - [ ] Check user roles are assigned properly
   - [ ] Test with service role key for debugging

3. **Performance Issues**
   - [ ] Check query execution plans
   - [ ] Verify indexes are being used
   - [ ] Monitor slow query log

4. **Data Issues**
   - [ ] Check foreign key constraints
   - [ ] Verify enum values are valid
   - [ ] Test data validation logic

## Deployment Commands Summary

```bash
# Verify prerequisites
node scripts/deploy-schema.js

# Manual deployment (if automatic fails)
# 1. Copy migration files to Supabase SQL Editor
# 2. Execute in order:
#    - 20240204000001_initial_schema.sql
#    - 20240204000002_rls_policies.sql
#    - 20240204000003_seed_data.sql

# Verify deployment
# Run scripts/verify-database.sql in Supabase SQL Editor

# Test application
npm run dev
```

---

**Status**: Ready for production when all items are checked ✅