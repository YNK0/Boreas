@echo off
echo ========================================
echo BOREAS - Simple Authentication Tests
echo ========================================

set BASE_URL=http://localhost:3000
set /p ADMIN_EMAIL="Enter admin email (default: admin@boreas.mx): "
if "%ADMIN_EMAIL%"=="" set ADMIN_EMAIL=admin@boreas.mx

echo.
echo Testing with base URL: %BASE_URL%
echo Admin email: %ADMIN_EMAIL%
echo.

REM Test 1: Check if server is running
echo 1. Testing if server is running...
curl -s -o nul -w "Status: %%{http_code}" %BASE_URL%
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server is not running. Please start with: npm run dev
    pause
    exit /b 1
)
echo  - Server OK

REM Test 2: Test unauthenticated access to admin dashboard
echo.
echo 2. Testing unauthenticated access to /admin/dashboard...
curl -s -o nul -w "Status: %%{http_code}" %BASE_URL%/admin/dashboard
echo  - Should redirect to login

REM Test 3: Test admin API endpoints (should return 401/403)
echo.
echo 3. Testing admin API endpoints (should require auth)...
echo    /api/admin/leads:
curl -s -o nul -w "   Status: %%{http_code}" %BASE_URL%/api/admin/leads
echo.
echo    /api/admin/stats:
curl -s -o nul -w "   Status: %%{http_code}" %BASE_URL%/api/admin/stats
echo.

REM Test 4: Check login page accessibility
echo.
echo 4. Testing login page accessibility...
curl -s -o nul -w "Status: %%{http_code}" %BASE_URL%/admin/login
echo  - Login page should be accessible

REM Test 5: Test main landing page
echo.
echo 5. Testing landing page...
curl -s -o nul -w "Status: %%{http_code}" %BASE_URL%/
echo  - Landing page OK

echo.
echo ========================================
echo Test Results Summary:
echo ========================================
echo Expected Results:
echo - Server: 200 OK
echo - /admin/dashboard: 302/307 (redirect) or 200 (if redirected to login)
echo - /api/admin/leads: 401 Unauthorized or 403 Forbidden
echo - /api/admin/stats: 401 Unauthorized or 403 Forbidden
echo - /admin/login: 200 OK
echo - /: 200 OK
echo.
echo If you see 503 errors, it means database connection issues.
echo If you see 500 errors, check the server console for details.
echo.

REM Manual tests reminder
echo ========================================
echo MANUAL TESTS TO PERFORM:
echo ========================================
echo.
echo 1. BROWSER TEST:
echo    - Open: %BASE_URL%
echo    - Open Developer Tools (F12) ^> Console
echo    - Navigate through pages and check for errors
echo.
echo 2. LOGIN TEST:
echo    - Go to: %BASE_URL%/admin/login
echo    - Try login with: %ADMIN_EMAIL%
echo    - Should either login successfully or show proper error
echo.
echo 3. ADMIN DASHBOARD TEST:
echo    - If login works: %BASE_URL%/admin/dashboard
echo    - Should show admin interface
echo    - Try: %BASE_URL%/admin/dashboard/leads
echo    - Try: %BASE_URL%/admin/dashboard/analytics
echo.

pause