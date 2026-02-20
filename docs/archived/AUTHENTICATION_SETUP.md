# Authentication Setup Guide

## Issue Identified

The authentication system is failing because the `.env` file contains placeholder Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs... (demo token)
```

These are not real Supabase project credentials.

## Solution Options

### Option 1: Create Real Supabase Project (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Sign in or create account

2. **Create New Project**
   - Click "New Project"
   - Choose organization
   - Enter project name: `boreas-mvp`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Get Project Credentials**
   - Go to Settings → API
   - Copy:
     - Project URL
     - anon/public key
     - service_role key

4. **Update .env File**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

### Option 2: Local Development with Docker

1. **Install Docker Desktop**
   - Download from docker.com
   - Install and start

2. **Start Local Supabase**
   ```bash
   npx supabase start
   ```

3. **Use Local Credentials**
   - Supabase will provide local URLs and keys

## Current Authentication Code Status

✅ **Working Components:**
- Auth store with Zustand (`src/store/auth.ts`)
- Supabase client configuration (`src/lib/supabase/client.ts`)
- Login/Register forms with validation
- Auth middleware for protected routes

❌ **Blocking Issue:**
- Invalid Supabase project credentials preventing any auth operations

## Next Steps

1. Choose Option 1 (recommended for development)
2. Create Supabase project and get real credentials
3. Update `.env` file with actual values
4. Restart development server
5. Test registration and login

## Testing Plan

Once credentials are updated:
1. Try user registration
2. Check email confirmation (if enabled)
3. Test login functionality
4. Verify dashboard access
5. Test logout

---

**Priority:** Critical - Blocking all user authentication
**Estimated Time:** 15 minutes to set up Supabase project