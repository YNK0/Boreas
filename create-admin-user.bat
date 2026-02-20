@echo off
echo ========================================
echo BOREAS - Create Admin User
echo ========================================

set /p ADMIN_EMAIL="Enter admin email (default: admin@boreas.mx): "
if "%ADMIN_EMAIL%"=="" set ADMIN_EMAIL=admin@boreas.mx

set /p ADMIN_PASSWORD="Enter admin password: "
if "%ADMIN_PASSWORD%"=="" (
    echo Error: Password cannot be empty.
    pause
    exit /b 1
)

echo.
echo Creating admin user with email: %ADMIN_EMAIL%
echo.

REM Create SQL commands for admin user creation
echo -- Step 1: Create user in auth.users via Supabase API > temp_admin.sql
echo -- Step 2: Insert into public.users with admin role >> temp_admin.sql
echo. >> temp_admin.sql

echo -- First, let's check if user already exists >> temp_admin.sql
echo SELECT id, email FROM auth.users WHERE email = '%ADMIN_EMAIL%'; >> temp_admin.sql
echo. >> temp_admin.sql

echo -- If user exists, get their ID and update role: >> temp_admin.sql
echo INSERT INTO public.users ^(id, role^) >> temp_admin.sql
echo SELECT id, 'admin' >> temp_admin.sql
echo FROM auth.users >> temp_admin.sql
echo WHERE email = '%ADMIN_EMAIL%' >> temp_admin.sql
echo ON CONFLICT ^(id^) DO UPDATE SET role = 'admin'; >> temp_admin.sql
echo. >> temp_admin.sql

echo -- Verify admin user creation: >> temp_admin.sql
echo SELECT au.email, pu.role, pu.created_at >> temp_admin.sql
echo FROM auth.users au >> temp_admin.sql
echo JOIN public.users pu ON au.id = pu.id >> temp_admin.sql
echo WHERE pu.role = 'admin'; >> temp_admin.sql

echo.
echo ========================================
echo MANUAL STEPS REQUIRED:
echo ========================================
echo.
echo 1. Go to your Supabase Dashboard
echo 2. Navigate to Authentication ^> Users
echo 3. Click "Add user"
echo 4. Email: %ADMIN_EMAIL%
echo 5. Password: %ADMIN_PASSWORD%
echo 6. Check "Auto Confirm User"
echo 7. Click "Create user"
echo.
echo 8. Then go to SQL Editor and run the commands in temp_admin.sql
echo    (The file has been created with the SQL commands you need)
echo.
echo OR use CLI method:
echo.
echo supabase db reset --linked
echo npm run dev
echo ^(Then test the authentication flow^)
echo.

echo Opening temp_admin.sql for your reference...
start temp_admin.sql

pause