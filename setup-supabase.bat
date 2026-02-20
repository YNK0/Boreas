@echo off
echo ========================================
echo BOREAS - Supabase CLI Setup & Migration
echo ========================================

echo.
echo 1. Installing Supabase CLI...
echo.

REM Install Supabase CLI using scoop (if available) or npm
where scoop >nul 2>&1
if %errorlevel% == 0 (
    echo Using Scoop to install Supabase CLI...
    scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    scoop install supabase
) else (
    echo Scoop not found. Using npm to install Supabase CLI...
    npm install -g @supabase/cli
)

echo.
echo 2. Verifying installation...
supabase --version

echo.
echo 3. Login to Supabase...
echo Please provide your Supabase access token when prompted.
supabase login

echo.
echo 4. Initialize project (if needed)...
if not exist "supabase\config.toml" (
    echo Initializing Supabase project...
    supabase init
) else (
    echo Supabase project already initialized.
)

echo.
echo 5. Link to your Supabase project...
echo Please provide your project reference ID when prompted.
supabase link

echo.
echo 6. Apply migration...
echo Applying migration file: supabase/migrations/20260220_users_role.sql
supabase db push

echo.
echo ========================================
echo Supabase CLI setup and migration complete!
echo ========================================
echo.
echo Next: Run create-admin-user.bat to create your admin user.
pause