# Authentication Testing Checklist

## After Updating Supabase Credentials

### 1. Test User Registration
- [ ] Go to `/register`
- [ ] Fill valid email and password
- [ ] Submit form
- [ ] Should redirect to dashboard or show success message

### 2. Test Login
- [ ] Go to `/login`
- [ ] Use registered credentials
- [ ] Submit form
- [ ] Should redirect to dashboard

### 3. Test Protected Routes
- [ ] Try accessing `/dashboard` without login
- [ ] Should redirect to login page
- [ ] Login and access dashboard
- [ ] Should show dashboard content

### 4. Test Logout
- [ ] Click logout button
- [ ] Should redirect to home page
- [ ] Try accessing dashboard again
- [ ] Should redirect to login

## Expected Behavior
✅ Registration creates user in Supabase Auth
✅ Login sets authentication state
✅ Dashboard shows user content
✅ Logout clears authentication

## If Still Not Working
Check browser console for specific error messages and compare with Supabase project settings.