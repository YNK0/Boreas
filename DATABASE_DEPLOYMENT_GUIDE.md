# Boreas Database Deployment Guide

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Docker Desktop** (for local development) or **Remote Supabase Project**
3. **Supabase CLI**: Already available via `npx supabase`

## Option 1: Remote Supabase Project (Recommended for Production)

### 1. Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: `boreas-production` (or `boreas-development`)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 2. Get Project Credentials

Once your project is created:
1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret)

### 3. Update Environment Variables

Update your `.env` file with the actual credentials:

```bash
# Supabase - Replace with your actual project values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### 4. Link Your Local Project

```bash
# Get your Supabase access token from: https://supabase.com/dashboard/account/tokens
npx supabase login --token your_access_token_here

# Link to your remote project
npx supabase link --project-ref your-project-id
```

### 5. Deploy Database Schema

```bash
# Deploy all migrations to remote database
npx supabase db push

# Or deploy manually via SQL Editor in Supabase Dashboard
```

## Option 2: Local Development (Requires Docker Desktop)

### 1. Install Docker Desktop

Download and install from [docker.com/products/docker-desktop](https://docs.docker.com/desktop/)

### 2. Start Local Supabase

```bash
# Start local Supabase (automatically runs migrations)
npx supabase start

# This will output local credentials like:
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
```

### 3. Update Environment for Local Development

```bash
# Local Supabase credentials (output from supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema Verification

### 1. Check Tables Created

Access Supabase Studio and verify these tables exist:
- `users` - User profiles linked to auth.users
- `leads` - Sales leads from landing page
- `lead_notes` - Notes on leads
- `clients` - Converted leads (paying customers)
- `projects` - Client automation projects
- `client_calls` - Call logs
- `client_metrics` - Performance metrics
- `email_logs` - Email tracking
- `landing_analytics` - Website analytics

### 2. Verify Row Level Security (RLS)

In Supabase Studio > Authentication > Policies:
- ✅ All tables should have RLS enabled
- ✅ Policies should exist for different user roles
- ✅ `landing_analytics` allows anonymous inserts
- ✅ `leads` allows anonymous inserts (for contact form)

### 3. Test Database Connection

```bash
# Test connection from your Next.js app
npm run dev

# Check if the following work:
# - Contact form submission (creates lead)
# - User registration (creates user profile)
# - Landing analytics tracking
```

### 4. Verify Seed Data (Development Only)

Query the database to check seed data was inserted:
- 3 testimonial clients (Carmen, Miguel, Patricia)
- Sample leads in different stages
- Sample projects and metrics
- Landing analytics data (1000 sample sessions)

## Database Performance Optimization

### Indexes Created

The schema includes optimized indexes for:
- Lead queries by status, assigned user, source
- Client queries by status, plan type, business type
- Metrics queries by client, project, date ranges
- Email logs by recipient and template
- Analytics by session and UTM parameters

### Query Performance Tests

Run these queries to verify performance:

```sql
-- Test lead lookup (should use idx_leads_status_created)
EXPLAIN SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC LIMIT 20;

-- Test client metrics (should use idx_client_metrics_period)
EXPLAIN SELECT * FROM client_metrics WHERE recorded_at > CURRENT_DATE - INTERVAL '30 days';

-- Test analytics aggregation (should use idx_landing_analytics_created)
EXPLAIN SELECT COUNT(*) FROM landing_analytics WHERE created_at > CURRENT_DATE - INTERVAL '7 days';
```

## Security Configuration

### 1. RLS Policies Active

Verify in Supabase Studio that:
- Users can only see their own data or data they're assigned to
- Admins can see all data
- Anonymous users can only insert to `leads` and `landing_analytics`

### 2. User Role Management

Test user role functionality:
- Sales users can manage their assigned leads
- Admins can manage all data
- Developers can read client metrics

### 3. API Rate Limiting

Consider enabling rate limiting for:
- Contact form submissions
- User registration
- Analytics tracking

## Production Deployment Checklist

- [ ] Supabase project created in production region
- [ ] Environment variables updated with production credentials
- [ ] All migrations deployed successfully
- [ ] RLS policies active and tested
- [ ] Database backup policies configured
- [ ] Monitoring and alerts set up
- [ ] Performance indexes verified
- [ ] Seed data excluded from production (or appropriate data loaded)

## Troubleshooting

### Common Issues

1. **Migration Errors**: Check SQL syntax and dependencies
2. **RLS Permission Denied**: Verify user roles and policies
3. **Connection Errors**: Check environment variables and network
4. **Performance Issues**: Check indexes and query plans

### Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Database Schema**: See `supabase/migrations/` files
- **Local Studio**: Access via browser when local Supabase is running

## Next Steps

After successful deployment:

1. **Test the Application**: Run the Next.js app and test all features
2. **Load Testing**: Test with realistic data volumes
3. **Monitor Performance**: Set up logging and monitoring
4. **Backup Strategy**: Configure automated backups
5. **Security Audit**: Review RLS policies and access patterns