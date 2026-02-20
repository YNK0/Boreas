# Admin User Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the admin user in Supabase for the Boreas project. The admin user is required to access the admin dashboard and manage application settings.

### Why Admin User Setup is Needed

- **Authentication Flow:** The middleware requires a proper user record in `public.users` with `role='admin'`
- **Dashboard Access:** Admin dashboard checks for admin role before allowing access
- **Security:** Proper RLS (Row Level Security) policies need to be in place
- **Data Integrity:** Auto-creation of user profiles when new users register

## Prerequisites

Before starting, ensure you have:

- [ ] Access to Supabase Dashboard (https://supabase.com/dashboard)
- [ ] Project admin permissions in Supabase
- [ ] SQL Editor access in your Supabase project
- [ ] Admin email credentials ready (e.g., `admin@boreas.mx`)

## Step 1: Apply Database Migration

The first step is to ensure the proper database schema is in place.

### Method 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed locally:

```bash
# Navigate to project root
cd /path/to/boreas

# Push migration to Supabase
supabase db push
```

This will apply the migration file: `supabase/migrations/20260220_users_role.sql`

### Method 2: Using Supabase Dashboard SQL Editor

If you don't have CLI access or prefer using the dashboard:

1. **Open Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your Boreas project

2. **Access SQL Editor**
   - Go to **SQL Editor** in the left sidebar
   - Click **New query**

3. **Execute Migration SQL**
   - Copy the contents of `supabase/migrations/20260220_users_role.sql`
   - Paste into the SQL editor
   - Click **Run** to execute

4. **Verify Execution**
   - Check for success messages
   - No error messages should appear

### What the Migration Creates

The migration sets up:

- **`public.users` table** with proper structure and relationships
- **RLS policies** for secure data access
- **Service role policies** for middleware access
- **Trigger function** for automatic user profile creation
- **Database trigger** that runs when new users register

## Step 2: Create Admin User in Supabase Auth

### Using Supabase Dashboard

1. **Navigate to Authentication**
   - In Supabase Dashboard, go to **Authentication** → **Users**

2. **Add New User**
   - Click **Add user** button
   - Fill in the form:
     - **Email:** `admin@boreas.mx` (or your preferred admin email)
     - **Password:** Use a strong, secure password
     - **Auto Confirm User:** ✅ Check this box
   - Click **Create user**

3. **Note the User ID**
   - After creation, you'll see the new user in the list
   - **Copy the UUID** from the `id` column - you'll need this for Step 3

## Step 3: Get Admin User UUID

You need the user's UUID to update their role to admin.

### Query Method (Recommended)

1. **Open SQL Editor** in Supabase Dashboard

2. **Run this query:**
   ```sql
   SELECT id, email, created_at
   FROM auth.users
   WHERE email = 'admin@boreas.mx';
   ```

3. **Copy the UUID** from the result

### Dashboard Method

1. Go to **Authentication** → **Users**
2. Find your admin user in the list
3. Copy the **id** value (UUID format)

## Step 4: Set Admin Role

Now assign the admin role to your user.

### Execute Role Update Query

1. **Open SQL Editor** in Supabase Dashboard

2. **Run this query** (replace `<uuid-from-step-3>` with the actual UUID):
   ```sql
   INSERT INTO public.users (id, role)
   VALUES ('<uuid-from-step-3>', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

3. **Verify success** - should show "1 row(s) affected"

### Example with Real UUID
```sql
INSERT INTO public.users (id, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Step 5: Verification

Confirm everything is set up correctly.

### Verify Admin User Query

Run this verification query in SQL Editor:

```sql
SELECT au.email, pu.role, pu.created_at
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE pu.role = 'admin';
```

**Expected Result:**
```
email            | role  | created_at
admin@boreas.mx  | admin | 2026-02-20 17:30:00+00
```

### Verify RLS Policies

Check that RLS policies are active:

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';
```

**Expected Result:**
```
schemaname | tablename | rowsecurity
public     | users     | t
```

### Verify Trigger Function

Check that the trigger is set up:

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Result:**
```
trigger_name        | event_manipulation | event_object_table
on_auth_user_created| INSERT            | users
```

## Step 6: Test Admin Login

### Test the Login Flow

1. **Navigate to your Boreas application**
   - Go to `/admin/login` (or your admin login route)

2. **Login with Admin Credentials**
   - Email: `admin@boreas.mx`
   - Password: (the password you set in Step 2)

3. **Verify Dashboard Access**
   - Should redirect to admin dashboard
   - Should not see any authentication errors
   - User should have admin privileges

### Expected Middleware Behavior

The middleware should now:
- ✅ Find the user in `auth.users`
- ✅ Find matching record in `public.users`
- ✅ Verify `role = 'admin'`
- ✅ Allow access to admin routes

## Troubleshooting

### Common Issues and Solutions

#### Issue: "User not found in public.users table"

**Cause:** The trigger didn't create the user profile, or the user was created before the trigger was set up.

**Solution:**
```sql
-- Check if user exists in auth but not in public
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- If found, manually create the profile
INSERT INTO public.users (id, role)
VALUES ('<user-uuid>', 'admin');
```

#### Issue: "Permission denied for table users"

**Cause:** RLS policies are not set up correctly.

**Solution:**
Re-run the migration SQL, specifically the policy creation sections:

```sql
-- Re-create policies
DROP POLICY IF EXISTS "users_read_own" ON public.users;
DROP POLICY IF EXISTS "service_role_read_all" ON public.users;

CREATE POLICY "users_read_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "service_role_read_all"
  ON public.users
  FOR SELECT
  TO service_role
  USING (true);
```

#### Issue: "Role is still 'user' instead of 'admin'"

**Cause:** The role update query didn't work or was applied to the wrong user.

**Solution:**
```sql
-- Check current role
SELECT au.email, pu.role
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@boreas.mx';

-- Force update the role
UPDATE public.users
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@boreas.mx');
```

#### Issue: "New users not getting profiles created"

**Cause:** The trigger function is not working properly.

**Solution:**
```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Re-create trigger if missing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Issue: "Cannot access admin dashboard"

**Cause:** Either middleware is not finding the admin user, or frontend routing issues.

**Solution:**
1. Verify middleware logs for authentication errors
2. Test the verification query from Step 5
3. Check that admin routes are properly protected
4. Verify JWT tokens include the correct user ID

### Debug Queries

Use these queries to debug issues:

```sql
-- List all users with roles
SELECT au.email, au.id, pu.role, pu.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';

-- Check if service role can access users table
SET ROLE service_role;
SELECT COUNT(*) FROM public.users;
RESET ROLE;
```

## Security Notes

### Best Practices

1. **Use Strong Passwords:** Admin accounts should use strong, unique passwords
2. **Limit Admin Users:** Only create admin users as needed
3. **Regular Audits:** Periodically review admin user list
4. **Environment Separation:** Use different admin emails for dev/staging/prod

### Security Checklist

- [ ] Admin password is strong and secure
- [ ] Admin email is controlled by authorized personnel
- [ ] RLS policies are active and tested
- [ ] Service role policies are restrictive
- [ ] Trigger function works for new user creation
- [ ] No unnecessary admin users exist

## Maintenance

### Regular Tasks

1. **Monthly:** Review admin user list for unauthorized accounts
2. **Quarterly:** Test the full admin setup process in staging
3. **As Needed:** Update admin passwords following security policies

### When to Re-run This Setup

- After database migrations that affect auth/users tables
- When setting up new environments (staging, production)
- If admin authentication suddenly stops working
- After major Supabase updates

## Support

If you encounter issues not covered in this guide:

1. Check Supabase Dashboard logs for detailed error messages
2. Review the middleware logs for authentication failures
3. Verify all verification queries return expected results
4. Contact the development team with specific error messages

---

**Created:** February 20, 2026
**Last Updated:** February 20, 2026
**Version:** 1.0