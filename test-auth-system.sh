#!/bin/bash

echo "========================================"
echo "BOREAS - Authentication System Testing"
echo "========================================"

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@boreas.mx}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test 1: Check if server is running
test_server_running() {
    log_info "Test 1: Checking if Next.js server is running..."

    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")

    if [ "$response" = "200" ]; then
        log_success "Server is running on $BASE_URL"
        return 0
    else
        log_error "Server is not running. Please start with: npm run dev"
        return 1
    fi
}

# Test 2: Test unauthenticated access to admin dashboard
test_unauthenticated_access() {
    log_info "Test 2: Testing unauthenticated access to admin dashboard..."

    response=$(curl -s -o /dev/null -w "%{http_code}" -L "$BASE_URL/admin/dashboard")

    if [ "$response" = "200" ]; then
        # Check if we were redirected to login
        final_url=$(curl -s -L -w "%{url_effective}" -o /dev/null "$BASE_URL/admin/dashboard")
        if [[ "$final_url" == *"/admin/login"* ]]; then
            log_success "Unauthenticated users are properly redirected to login"
        else
            log_error "Security issue: Unauthenticated access allowed to dashboard"
        fi
    else
        log_warning "Unexpected response code: $response"
    fi
}

# Test 3: Test admin login (requires user input for password)
test_admin_login() {
    log_info "Test 3: Testing admin login..."

    if [ -z "$ADMIN_PASSWORD" ]; then
        echo -n "Enter admin password for $ADMIN_EMAIL: "
        read -s ADMIN_PASSWORD
        echo
    fi

    # Get login page to extract any CSRF tokens or session cookies
    cookie_jar=$(mktemp)

    log_info "Getting login page..."
    curl -s -c "$cookie_jar" "$BASE_URL/admin/login" > /dev/null

    log_info "Attempting login with email: $ADMIN_EMAIL"

    # Attempt login (Note: This is simplified - actual login might use different fields)
    login_response=$(curl -s -w "%{http_code}" -b "$cookie_jar" -c "$cookie_jar" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
        "$BASE_URL/api/auth/login" 2>/dev/null)

    # Extract status code
    status_code=${login_response: -3}

    if [ "$status_code" = "200" ]; then
        log_success "Login request accepted"

        # Test authenticated access to dashboard
        dashboard_response=$(curl -s -w "%{http_code}" -b "$cookie_jar" "$BASE_URL/admin/dashboard")
        dashboard_status=${dashboard_response: -3}

        if [ "$dashboard_status" = "200" ]; then
            log_success "Authenticated access to admin dashboard successful"
        else
            log_warning "Dashboard access failed with status: $dashboard_status"
        fi
    else
        log_error "Login failed with status: $status_code"
        log_info "This might be expected if admin user hasn't been created yet"
    fi

    # Cleanup
    rm -f "$cookie_jar"
}

# Test 4: Test API endpoints
test_api_endpoints() {
    log_info "Test 4: Testing admin API endpoints..."

    endpoints=(
        "/api/admin/leads"
        "/api/admin/stats"
    )

    for endpoint in "${endpoints[@]}"; do
        log_info "Testing endpoint: $endpoint"

        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")

        if [ "$response" = "401" ]; then
            log_success "Endpoint properly requires authentication (401)"
        elif [ "$response" = "403" ]; then
            log_success "Endpoint properly requires admin role (403)"
        elif [ "$response" = "503" ]; then
            log_warning "Service unavailable - database might be down (503)"
        else
            log_warning "Unexpected response: $response for $endpoint"
        fi
    done
}

# Test 5: Test console for errors (requires manual verification)
test_console_errors() {
    log_info "Test 5: Console Error Check (Manual Verification Required)"

    echo "Please perform these manual checks:"
    echo "1. Open browser to $BASE_URL"
    echo "2. Open Developer Tools (F12)"
    echo "3. Navigate to Console tab"
    echo "4. Visit these pages and check for errors:"
    echo "   - $BASE_URL (landing page)"
    echo "   - $BASE_URL/admin/login"
    echo "   - $BASE_URL/admin/dashboard (after login)"
    echo "5. Report any red errors in console"
    echo
    echo "Expected: Zero errors, clean console output"
}

# Test 6: Database verification
test_database_verification() {
    log_info "Test 6: Database Verification (Manual)"

    echo "Run these SQL queries in Supabase Dashboard > SQL Editor:"
    echo
    echo "-- Check if public.users table exists"
    echo "SELECT table_name FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public';"
    echo
    echo "-- Check admin user"
    echo "SELECT au.email, pu.role FROM auth.users au JOIN public.users pu ON au.id = pu.id WHERE pu.role = 'admin';"
    echo
    echo "-- Check RLS policies"
    echo "SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public';"
    echo
}

# Main test execution
main() {
    echo
    log_info "Starting authentication system tests..."
    echo

    # Run tests
    test_server_running || exit 1
    echo

    test_unauthenticated_access
    echo

    test_admin_login
    echo

    test_api_endpoints
    echo

    test_console_errors
    echo

    test_database_verification
    echo

    log_info "Test suite completed!"
    echo
    echo "========================================"
    echo "Summary:"
    echo "- Middleware security: Tested"
    echo "- API authentication: Tested"
    echo "- Database structure: Manual verification needed"
    echo "- Console errors: Manual verification needed"
    echo "========================================"
}

# Run main function
main "$@"